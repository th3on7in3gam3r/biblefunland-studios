const BLOCKED_TAGS = [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'textarea',
    'select',
    'link',
    'meta',
    'svg',
    'math'
];

export function sanitizeStudioHtml(value) {
    let html = String(value || '');

    for (const tag of BLOCKED_TAGS) {
        const paired = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
        const selfClosing = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
        html = html.replace(paired, '').replace(selfClosing, '');
    }

    html = html
        .replace(/\s+on[a-z-]+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
        .replace(/\s+style\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '')
        .replace(/\s+(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*'|javascript:[^\s>]+)/gi, '')
        .replace(/\s+(href|src)\s*=\s*("data:[^"]*"|'data:[^']*'|data:[^\s>]+)/gi, '')
        .replace(/<\/?(html|body|head)[^>]*>/gi, '');

    return html.trim();
}
