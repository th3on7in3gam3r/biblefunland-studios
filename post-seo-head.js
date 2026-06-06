(function () {
    var SITE = 'https://biblefunlandstudios.com';
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

    function setMetaName(name, content) {
        var el = document.querySelector('meta[name="' + name + '"]');
        if (el && content) el.setAttribute('content', content);
    }

    function setMetaId(id, content) {
        var el = document.getElementById(id);
        if (el && content) el.setAttribute('content', content);
    }

    function applyPostSeo(slug, meta, articleUrl) {
        var pageTitle = meta.title + BRAND;
        document.title = pageTitle;
        setMetaName('description', meta.description);
        setMetaId('ogTitle', pageTitle);
        setMetaId('ogDescription', meta.description);
        setMetaId('ogUrl', articleUrl);
        setMetaId('twitterTitle', pageTitle);
        setMetaId('twitterDescription', meta.description);

        var canonical = document.getElementById('canonicalLink');
        if (canonical) canonical.setAttribute('href', articleUrl);

        var schemaEl = document.getElementById('articleSchema');
        if (schemaEl) {
            try {
                var schema = JSON.parse(schemaEl.textContent);
                schema.headline = meta.title;
                schema.description = meta.description;
                schema.mainEntityOfPage = articleUrl;
                schema.url = articleUrl;
                schemaEl.textContent = JSON.stringify(schema, null, 2);
            } catch (e) { /* keep default schema */ }
        }
    }

    var path = location.pathname.replace(/\/+$/, '');
    var slug = path.indexOf('/blog/') === 0 ? decodeURIComponent(path.slice('/blog/'.length)) : '';
    var params = new URLSearchParams(location.search);

    if (!slug && params.get('slug')) slug = params.get('slug');

    var meta = slug ? postsBySlug[slug] : null;
    var id = params.get('id');

    if (!meta && id && postsById[id]) {
        slug = postsById[id];
        meta = postsBySlug[slug];
    }

    if (meta && slug) {
        applyPostSeo(slug, meta, SITE + '/blog/' + encodeURIComponent(slug));
    } else if (meta && id) {
        applyPostSeo(slug || postsById[id], meta, SITE + '/post.html?id=' + encodeURIComponent(id));
    }
})();
