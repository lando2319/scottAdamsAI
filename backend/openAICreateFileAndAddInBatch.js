require('dotenv').config({ path: __dirname + '/.env' });
const { OpenAI } = require('openai');
const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BLOG_DIR = path.resolve(__dirname, '../cwsa_transcripts');
const VECTOR_STOREID = 'vs_685834f2788481918c5f2f9b14003368';
const BATCH_LIMIT   = 500;          // API hard-limit

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

async function uploadFile(filePath) {
    const stream = fs.createReadStream(filePath);
    const res = await openai.files.create({ file: stream, purpose: 'assistants' });
    return res.id;            // ← returns the newly-created file ID
};

(async () => {
    try {
        const entries = await fsp.readdir(BLOG_DIR, { withFileTypes: true });
        const fileIds = [];

        for (const entry of entries) {
            if (!entry.isFile()) continue;
            const full = path.join(BLOG_DIR, entry.name);
            const id = await uploadFile(full);
            console.log(`${entry.name} → ${id}`);
            fileIds.push(id);
        }

        if (!fileIds.length) throw new Error('No files uploaded.');

        const batches = chunk(fileIds, BATCH_LIMIT);
        console.log(`Adding ${fileIds.length} files in ${batches.length} batch(es)…`);

        let batchNo = 1;
        for (const ids of batches) {
            await openai.vectorStores.fileBatches.create(
                VECTOR_STOREID,
                { file_ids: ids }
            );
            console.log(`✓ Batch ${batchNo++} (${ids.length} files) completed`);
        }

        console.log('Vector store update complete.');
        process.exit(0);

    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
})();
