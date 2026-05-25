import crypto from 'node:crypto';

const STUDIO_COOKIE_NAME = 'bfl_studio_session';
const STUDIO_SESSION_MAX_AGE = 60 * 60 * 12;

function getRequiredEnv(name) {
    const value = process.env[name];
    return typeof value === 'string' ? value : '';
}

function getSessionSecret() {
    return getRequiredEnv('STUDIO_SESSION_SECRET');
}

function getStudioPassword() {
    return getRequiredEnv('STUDIO_PORTAL_PASSWORD');
}

function base64Url(input) {
    return Buffer.from(input).toString('base64url');
}

function signValue(value, secret) {
    return crypto.createHmac('sha256', secret).update(value).digest('base64url');
}

function safeEqual(a, b) {
    const left = Buffer.from(String(a));
    const right = Buffer.from(String(b));
    if (left.length !== right.length) return false;
    return crypto.timingSafeEqual(left, right);
}

function parseCookies(header) {
    return String(header || '')
        .split(';')
        .map(part => part.trim())
        .filter(Boolean)
        .reduce((acc, pair) => {
            const index = pair.indexOf('=');
            if (index === -1) return acc;
            const key = pair.slice(0, index).trim();
            const value = pair.slice(index + 1).trim();
            acc[key] = decodeURIComponent(value);
            return acc;
        }, {});
}

export function isStudioAuthConfigured() {
    return !!(getStudioPassword() && getSessionSecret());
}

export function verifyStudioPassword(password) {
    const expected = getStudioPassword();
    if (!expected) return false;
    return safeEqual(password, expected);
}

export function createStudioSessionCookie() {
    const secret = getSessionSecret();
    if (!secret) throw new Error('Studio session secret is missing.');

    const payload = JSON.stringify({
        iat: Math.floor(Date.now() / 1000),
        nonce: crypto.randomBytes(16).toString('hex')
    });
    const encodedPayload = base64Url(payload);
    const signature = signValue(encodedPayload, secret);
    const token = `${encodedPayload}.${signature}`;

    return `${STUDIO_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${STUDIO_SESSION_MAX_AGE}`;
}

export function clearStudioSessionCookie() {
    return `${STUDIO_COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function getStudioSession(req) {
    const secret = getSessionSecret();
    if (!secret) return { authenticated: false, reason: 'Studio auth is not configured.' };

    const cookies = parseCookies(req.headers.cookie || '');
    const rawToken = cookies[STUDIO_COOKIE_NAME];
    if (!rawToken) return { authenticated: false, reason: 'Studio login required.' };

    const [payload, signature] = String(rawToken).split('.');
    if (!payload || !signature) return { authenticated: false, reason: 'Invalid studio session.' };

    const expectedSignature = signValue(payload, secret);
    if (!safeEqual(signature, expectedSignature)) {
        return { authenticated: false, reason: 'Invalid studio session.' };
    }

    try {
        const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        const issuedAt = Number(parsed.iat || 0);
        const age = Math.floor(Date.now() / 1000) - issuedAt;
        if (!issuedAt || age < 0 || age > STUDIO_SESSION_MAX_AGE) {
            return { authenticated: false, reason: 'Studio session expired.' };
        }
    } catch (error) {
        return { authenticated: false, reason: 'Invalid studio session.' };
    }

    return { authenticated: true };
}

export function requireStudioSession(req, res) {
    if (!isStudioAuthConfigured()) {
        res.status(500).json({
            error: 'Studio auth is not configured. Set STUDIO_PORTAL_PASSWORD and STUDIO_SESSION_SECRET.'
        });
        return false;
    }

    const session = getStudioSession(req);
    if (!session.authenticated) {
        res.status(401).json({ error: session.reason || 'Studio login required.' });
        return false;
    }

    return true;
}
