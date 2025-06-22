require('dotenv').config({ path: __dirname + '/.env' });

const fs = require("fs/promises");
const path = require("path");
const { htmlToText } = require("html-to-text");

const OUT_DIR = path.resolve('./blogPosts');

const API_KEY = process.env.TUMBLR_API_KEY;
const BLOG = "scottadamsblog";
// const BLOG    = "scottadamssays";

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
        selectors: [
            { selector: 'a', options: { linkBrackets: false } }
        ]
    });
}

(async () => {
    try {
        let offset = 0;
        while (true) {
            const { posts, total_posts } = await getBatch(offset);
            if (!posts.length) break;

            for (const p of posts) {
                if (p.type !== 'text') continue;
                const ymd = p.date.split(' ')[0];
                const titlePart = slugify(p.title) || `post_${p.id}`;
                const name = `${ymd}_${titlePart}.txt`;
                const file = path.join(OUT_DIR, name);

                const existing = new Set(await fs.readdir(OUT_DIR));

                if (existing.has(name)) {
                    console.log('skip', name);
                    continue;
                }

                await fs.writeFile(file, stripHtml(p.body), 'utf8');
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
