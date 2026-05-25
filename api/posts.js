import { requireStudioSession } from '../lib/studio-auth.js';
import { sanitizeStudioHtml } from '../lib/studio-html.js';

const SANITY_PROJECT_ID = 'lrxq2sck';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_QUERY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;
const SANITY_WRITE_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`;

function sanitizeSecret(value) {
    return String(value || '')
        .normalize('NFKC')
        .replace(/^Bearer\s+/i, '')
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/[\u00A0\u1680\u180E\u2000-\u200D\u2028-\u202F\u205F\u2060\u3000\uFEFF]/g, '')
        .replace(/[^\x21-\x7E]/g, '')
        .trim();
}

function escapeGroqString(value) {
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"');
}

function slugify(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
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

async function sanityQuery(groq) {
    const res = await fetch(`${SANITY_QUERY_URL}?query=${encodeURIComponent(groq)}`);
    const data = await parseJsonResponse(res);

    if (!res.ok) {
        throw new Error(data.error?.description || data.error || 'Sanity query failed');
    }

    return data.result;
}

async function sanityMutate(mutations, token) {
    if (!token) {
        throw new Error('Sanity token is missing. Save one in Studio Settings or set SANITY_API_TOKEN.');
    }

    const res = await fetch(SANITY_WRITE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ mutations })
    });

    const data = await parseJsonResponse(res);
    if (!res.ok) {
        throw new Error(data.error?.description || data.error || 'Sanity mutation failed');
    }

    return data;
}

function normalizeDoc(doc) {
    const title = String(doc.title || '').replace(/<[^>]+>/g, '').trim();
    const content = sanitizeStudioHtml(doc.content || '');
    const excerpt = String(doc.excerpt || '').replace(/<[^>]+>/g, '').trim();
    const imageUrl = String(doc.imageUrl || '').trim();

    if (!title) throw new Error('Title is required.');
    if (!content) throw new Error('Content is required.');

    return {
        ...(doc._id ? { _id: String(doc._id).trim() } : {}),
        _type: 'blogPost',
        title,
        slug: slugify(doc.slug || title),
        category: String(doc.category || 'insight').trim().toLowerCase() || 'insight',
        excerpt,
        content,
        imageUrl,
        publishedAt: String(doc.publishedAt || new Date().toISOString()),
        readTime: String(doc.readTime || '').trim(),
        published: doc.published !== false,
        isFeatured: !!doc.isFeatured
    };
}

export default async function handler(req, res) {
    try {
        if (!requireStudioSession(req, res)) {
            return;
        }

        if (req.method === 'GET') {
            const id = String(req.query.id || '').trim();

            if (id) {
                const post = await sanityQuery(`*[_type == "blogPost" && _id == "${escapeGroqString(id)}"][0]`);
                return res.status(200).json({ post: post || null });
            }

            const posts = await sanityQuery(`*[_type == "blogPost"] | order(publishedAt desc) { _id, title, publishedAt, category, published, slug, isFeatured }`);
            return res.status(200).json({ posts: posts || [] });
        }

        if (req.method === 'POST') {
            const body = await readBody(req);
            const token = sanitizeSecret(process.env.SANITY_API_TOKEN);
            if (!token) {
                return res.status(500).json({ error: 'Sanity token is missing on the server. Set SANITY_API_TOKEN.' });
            }
            const doc = normalizeDoc(body.doc || {});
            const mutation = doc._id ? { createOrReplace: doc } : { create: doc };
            const result = await sanityMutate([mutation], token);
            return res.status(200).json({ success: true, result });
        }

        if (req.method === 'DELETE') {
            const body = await readBody(req);
            const id = String(req.query.id || body.id || '').trim();
            const token = sanitizeSecret(process.env.SANITY_API_TOKEN);

            if (!id) {
                return res.status(400).json({ error: 'Post ID is required.' });
            }
            if (!token) {
                return res.status(500).json({ error: 'Sanity token is missing on the server. Set SANITY_API_TOKEN.' });
            }

            const result = await sanityMutate([{ delete: { id } }], token);
            return res.status(200).json({ success: true, result });
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        return res.status(500).json({ error: error.message || 'Studio request failed.' });
    }
}
