require('dotenv').config({ path: __dirname + '/.env' });

const fs = require("fs/promises");
const path = require("path");
const { htmlToText } = require("html-to-text");

const OUT_DIR = path.resolve('./blogPosts');

const API_KEY = process.env.TUMBLR_API_KEY;

// const BLOG = "scottadamsblog";
const BLOG    = "scottadamssays";

const LIMIT = 20;

async function getBatch(offset = 0) {
    const url =
        `https://api.tumblr.com/v2/blog/${BLOG}/posts` +
        `?api_key=${API_KEY}&offset=${offset}&limit=${LIMIT}`;
    const res = await fetch(url);
    const json = await res.json();
    if (json.meta.status !== 200) throw new Error(json.meta.msg);
    return json.response; 
}

function slugify(raw) {
    const str = (raw ?? '').toString();
    return (
        str.trim()
            .replace(/\s+/g, '_')
            .replace(/[^A-Za-z0-9_-]/g, '')
        || 'untitled'
    );
}

function stripHtml(html = '') {
    return htmlToText(html, {
        wordwrap: false,
        formatters: {
            imgToUrl: (elem, walk, builder) => {
                const src = elem.attribs?.src;
                if (src) builder.addInline(`[${src}]`);
            }
        },

        selectors: [
            { selector: 'a', options: { linkBrackets: false } },
            { selector: 'img', format: 'imgToUrl' }
        ]
    });
}

function getPostHtml(post) {
    switch (post.type) {
        case 'text':
            return post.body || '';

        case 'link':
            return `<a href="${post.url}">${post.title || post.url}</a>` +
                (post.description ? `<p>${post.description}</p>` : '');

        case 'quote':
            return `<blockquote>${post.text}</blockquote>` +
                (post.source ? `<p>— ${post.source}</p>` : '');

        case 'photo': {
            const imgLinks = (post.photos || [])
                .map(p => p.original_size?.url)
                .filter(Boolean)
                .map(u => `<p><img src="${u}"></p>`)   // becomes [url] via the formatter
                .join('');
            return `${imgLinks}\n${post.caption || ''}`;
        }

        case 'video':
        case 'audio':
            return post.caption || '';

        default:
            return '';
    }
}

(async () => {
    try {
        let offset = 0;
        while (true) {
            const { posts, total_posts } = await getBatch(offset);
            const existing = new Set(await fs.readdir(OUT_DIR));

            for (const p of posts) {
                const html = getPostHtml(p);
                if (!html.trim()) continue;

                const ymd       = p.date.split(' ')[0];  // YYYY-MM-DD
                const rawTitle  = p.title || p.slug || '';
                const titlePart = slugify(rawTitle) || `post_${p.id}`;

                const name = `${ymd}_${BLOG}_${titlePart}_${p.id}.txt`;

                // if (existing.has(name)) { console.log('skip', name); continue; }

                await fs.writeFile(path.join(OUT_DIR, name), stripHtml(html), 'utf8');
                existing.add(name);
                console.log('saved', name);
            }

            offset += posts.length;
            if (offset >= total_posts) break;
            await new Promise(r => setTimeout(r, 500));
        }
        console.log('✔ done');
        process.exit(0);
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    }
})();
