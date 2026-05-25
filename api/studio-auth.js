import {
    clearStudioSessionCookie,
    createStudioSessionCookie,
    getStudioSession,
    isStudioAuthConfigured,
    verifyStudioPassword
} from '../lib/studio-auth.js';

async function readBody(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

    let raw = '';
    for await (const chunk of req) raw += chunk;
    return raw ? JSON.parse(raw) : {};
}

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const session = getStudioSession(req);
            return res.status(200).json({
                authenticated: !!session.authenticated,
                configured: isStudioAuthConfigured()
            });
        }

        if (req.method === 'POST') {
            if (!isStudioAuthConfigured()) {
                return res.status(500).json({
                    error: 'Studio auth is not configured. Set STUDIO_PORTAL_PASSWORD and STUDIO_SESSION_SECRET.'
                });
            }

            const body = await readBody(req);
            const password = String(body.password || '');
            if (!verifyStudioPassword(password)) {
                return res.status(401).json({ error: 'Invalid studio password.' });
            }

            res.setHeader('Set-Cookie', createStudioSessionCookie());
            return res.status(200).json({ authenticated: true });
        }

        if (req.method === 'DELETE') {
            res.setHeader('Set-Cookie', clearStudioSessionCookie());
            return res.status(200).json({ authenticated: false });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Studio auth failed.' });
    }
}
