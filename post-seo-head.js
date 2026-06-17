var PostSeoHead = (function () {
    var SITE = 'https://www.biblefunlandstudios.com';
    var BRAND = ' | BibleFunLand Studios';

    var postsBySlug = {
        'designing-for-kids-lessons-from-bfl-junior': {
            title: 'Designing for Kids: Lessons from BFL Junior',
            description: 'UX lessons from building BFL Junior — how BibleFunLand Studios designs faith-based platforms that engage young believers effectively.'
        },
        'creating-with-purpose-colossians-3-23': {
            title: 'Creating with Purpose: A Colossians 3:23 Reflection',
            description: 'A Colossians 3:23 devotional on creating with excellence — how faith-driven creative work becomes an act of worship.'
        },
        'from-one-idea-to-six-brands': {
            title: 'From One Idea to Six Brands: The BFL Story',
            description: 'How BibleFunLand Studios grew from one idea into a family of faith-based brands serving kids, families, and ministry audiences.'
        },
        '5-branding-mistakes-churches-make': {
            title: '5 Branding Mistakes Churches Make (And How to Fix Them)',
            description: 'Avoid common church branding mistakes — practical tips on visual identity, consistency, and messaging from BibleFunLand Studios.'
        },
        'vision-bigger-than-your-skill': {
            title: 'When God Gives You a Vision Bigger Than Your Skill',
            description: 'A devotional on trusting God when your calling feels bigger than your skills — encouragement for creators and ministry leaders.'
        },
        'building-awc-connect': {
            title: 'Building AWC Connect: A Ministry App Case Study',
            description: 'Case study: designing AWC Connect for Anointed Worship Center — a ministry community app from wireframes to launch day.'
        }
    };

    var postsById = {
        '1': 'designing-for-kids-lessons-from-bfl-junior',
        '2': 'creating-with-purpose-colossians-3-23',
        '3': 'from-one-idea-to-six-brands',
        '4': '5-branding-mistakes-churches-make',
        '5': 'vision-bigger-than-your-skill',
        '6': 'building-awc-connect'
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/"/g, '&quot;');
    }

    function humanizeSlug(slug) {
        return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, function (char) { return char.toUpperCase(); });
    }

    function getContext() {
        var path = location.pathname.replace(/\/+$/, '');
        var slug = path.indexOf('/blog/') === 0
            ? decodeURIComponent(path.slice('/blog/'.length).split('/')[0])
            : '';
        var params = new URLSearchParams(location.search);
        var id = params.get('id');

        if (!slug && params.get('slug')) slug = params.get('slug');

        var meta = slug ? postsBySlug[slug] : null;

        if (!meta && id && postsById[id]) {
            slug = postsById[id];
            meta = postsBySlug[slug];
        }

        if (!meta && slug) {
            meta = {
                title: humanizeSlug(slug),
                description: 'Read this article on the BibleFunLand Studios blog — faith-inspired devotionals, creative insights, and ministry stories.'
            };
        }

        var articleUrl = slug
            ? SITE + '/blog/' + encodeURIComponent(slug)
            : (id ? SITE + '/post.html?id=' + encodeURIComponent(id) : SITE + '/blog.html');

        return { slug: slug, id: id, meta: meta, articleUrl: articleUrl };
    }

    function buildPageTitle(ctx) {
        if (ctx.meta && ctx.meta.title) return ctx.meta.title + BRAND;
        if (ctx.slug) return humanizeSlug(ctx.slug) + BRAND;
        if (ctx.id) return 'Blog Article ' + ctx.id + BRAND;
        return 'Blog Article | BibleFunLand Studios';
    }

    function setMetaName(name, content) {
        var el = document.querySelector('meta[name="' + name + '"]');
        if (el && content) el.setAttribute('content', content);
    }

    function setMetaId(id, content) {
        var el = document.getElementById(id);
        if (el && content) el.setAttribute('content', content);
    }

    function writeTitle() {
        var ctx = getContext();
        var pageTitle = buildPageTitle(ctx);

        document.write('<title>' + escapeHtml(pageTitle) + '</title>');

        window.__POST_SEO__ = {
            pageTitle: pageTitle,
            ctx: ctx
        };
    }

    function applyMeta() {
        var bundle = window.__POST_SEO__;
        if (!bundle) return;

        var ctx = bundle.ctx;
        var pageTitle = bundle.pageTitle;

        document.title = pageTitle;

        if (ctx.meta) {
            setMetaName('description', ctx.meta.description);
            setMetaId('ogTitle', pageTitle);
            setMetaId('ogDescription', ctx.meta.description);
            setMetaId('twitterTitle', pageTitle);
            setMetaId('twitterDescription', ctx.meta.description);
        } else {
            setMetaId('ogTitle', pageTitle);
            setMetaId('twitterTitle', pageTitle);
        }

        setMetaId('ogUrl', ctx.articleUrl);

        var canonical = document.getElementById('canonicalLink');
        if (canonical) canonical.setAttribute('href', ctx.articleUrl);

        if (ctx.meta) {
            var schemaEl = document.getElementById('articleSchema');
            if (schemaEl) {
                try {
                    var schema = JSON.parse(schemaEl.textContent);
                    schema.headline = ctx.meta.title;
                    schema.description = ctx.meta.description;
                    schema.mainEntityOfPage = ctx.articleUrl;
                    schema.url = ctx.articleUrl;
                    schemaEl.textContent = JSON.stringify(schema, null, 2);
                } catch (e) { /* keep default schema */ }
            }
        }
    }

    return {
        getContext: getContext,
        writeTitle: writeTitle,
        applyMeta: applyMeta
    };
})();

PostSeoHead.writeTitle();
