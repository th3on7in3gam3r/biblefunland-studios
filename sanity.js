// =============================================
// BibleFunLand Studios — Sanity CMS Client
// READ-ONLY via public CDN (no token required)
// Project: lrxq2sck | Dataset: production
// =============================================

const SANITY_PROJECT_ID = 'lrxq2sck';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_CDN = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

// ---- PUBLIC READ (no token needed) ----

async function sanityFetch(groq) {
    const url = `${SANITY_CDN}?query=${encodeURIComponent(groq)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Sanity fetch failed: ${res.status}`);
    const data = await res.json();
    return data.result;
}

// Fetch all published posts ordered by date
async function getAllPosts() {
    const groq = `*[_type == "blogPost" && published == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        category,
        excerpt,
        imageUrl,
        publishedAt,
        readTime
    }`;
    return sanityFetch(groq);
}

// Fetch a single post by its slug
async function getPostBySlug(slug) {
    const groq = `*[_type == "blogPost" && slug == "${slug}"][0] {
        _id,
        title,
        slug,
        category,
        excerpt,
        content,
        imageUrl,
        publishedAt,
        readTime
    }`;
    return sanityFetch(groq);
}

// Fetch a single post by its Sanity _id
async function getPostById(id) {
    const groq = `*[_type == "blogPost" && _id == "${id}"][0] {
        _id,
        title,
        slug,
        category,
        excerpt,
        content,
        imageUrl,
        publishedAt,
        readTime
    }`;
    return sanityFetch(groq);
}
