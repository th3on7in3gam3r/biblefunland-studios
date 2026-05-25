const PROVIDERS = {
    gemini: {
        label: 'Gemini',
        envKey: 'GEMINI_API_KEY'
    },
    openai: {
        label: 'OpenAI',
        envKey: 'OPENAI_API_KEY'
    },
    claude: {
        label: 'Claude',
        envKey: 'ANTHROPIC_API_KEY'
    }
};

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';

function sanitizeSecret(value) {
    return String(value || '')
        .normalize('NFKC')
        .replace(/^Bearer\s+/i, '')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/[\u00A0\u1680\u180E\u2000-\u200D\u2028-\u202F\u205F\u2060\u3000\uFEFF]/g, '')
        .replace(/[^\x21-\x7E]/g, '')
        .trim();
}

function getApiErrorMessage(data, fallback) {
    if (!data) return fallback;
    if (typeof data.error === 'string') return data.error;
    if (data.error && typeof data.error.message === 'string') return data.error.message;
    if (data.error && typeof data.error.description === 'string') return data.error.description;
    if (data.promptFeedback && data.promptFeedback.blockReason) {
        return `Request blocked: ${data.promptFeedback.blockReason}`;
    }
    return fallback;
}

async function readBody(req) {
    if (req.body && typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') return JSON.parse(req.body || '{}');

    let raw = '';
    for await (const chunk of req) raw += chunk;
    return raw ? JSON.parse(raw) : {};
}

async function parseJsonResponse(res) {
    const text = await res.text();
    if (!text) return {};

    try {
        return JSON.parse(text);
    } catch (error) {
        return { raw: text };
    }
}

async function generateWithGemini(apiKey, prompt) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(getApiErrorMessage(data, 'Gemini request failed.'));

    const text = data?.candidates?.[0]?.content?.parts
        ?.map(part => part?.text || '')
        .join('')
        .trim();

    if (!text) throw new Error(getApiErrorMessage(data, 'Gemini returned no draft content.'));
    return text;
}

async function generateWithOpenAI(apiKey, prompt) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(getApiErrorMessage(data, 'OpenAI request failed.'));

    const content = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(content)
        ? content.map(item => item?.text || '').join('').trim()
        : String(content || '').trim();

    if (!text) throw new Error(getApiErrorMessage(data, 'OpenAI returned no draft content.'));
    return text;
}

async function generateWithClaude(apiKey, prompt) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: ANTHROPIC_MODEL,
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(getApiErrorMessage(data, 'Claude request failed.'));

    const text = data?.content
        ?.map(item => item?.text || '')
        .join('')
        .trim();

    if (!text) throw new Error(getApiErrorMessage(data, 'Claude returned no draft content.'));
    return text;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const body = await readBody(req);
        const provider = String(body.provider || 'gemini').toLowerCase();
        const providerConfig = PROVIDERS[provider];

        if (!providerConfig) {
            return res.status(400).json({ error: 'Unsupported AI provider.' });
        }

        const prompt = String(body.prompt || '').trim();
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const envApiKey = provider === 'gemini'
            ? (process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '')
            : (process.env[providerConfig.envKey] || '');
        const apiKey = sanitizeSecret(body.apiKey || envApiKey);
        if (!apiKey) {
            return res.status(400).json({
                error: `${providerConfig.label} API key is not configured. Save one in Studio Settings or set ${providerConfig.envKey}.`
            });
        }

        let text = '';
        if (provider === 'gemini') text = await generateWithGemini(apiKey, prompt);
        if (provider === 'openai') text = await generateWithOpenAI(apiKey, prompt);
        if (provider === 'claude') text = await generateWithClaude(apiKey, prompt);

        return res.status(200).json({ text });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Generation failed.' });
    }
}
