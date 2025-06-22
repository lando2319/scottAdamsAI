require('dotenv').config({ path: __dirname + '/.env' });
const { OpenAI } = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const VECTOR_STORE = 'vs_685834f2788481918c5f2f9b14003368';
const BATCH_LIMIT = 500;

function chunk(arr, size) {
    const out = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
}

async function getExistingVectorStoreIds(id) {
    const existing = new Set();
    for await (const vf of openai.vectorStores.files.list(id)) {
        existing.add(vf.file_id);         // ← property is `file_id`
    }
    return existing;
}

async function getAllAssistantFileIds() {
    const ids = [];
    for await (const file of openai.files.list()) {
        if (file.purpose === 'assistants' && file.status === 'processed') {
            ids.push(file.id);
        }
    }
    return ids;
};

(async () => {
    try {
        const [existingIds, allIds] = await Promise.all([
            getExistingVectorStoreIds(VECTOR_STORE),
            getAllAssistantFileIds(),
        ]);

        const newIds = allIds.filter(id => !existingIds.has(id));

        if (!newIds.length) {
            console.log('Nothing new to add – vector store is up to date.');
            return;
        }

        const batches = chunk(newIds, BATCH_LIMIT);
        console.log(`Adding ${newIds.length} files in ${batches.length} batch(es)…`);

        let batchNo = 1;
        for (const ids of batches) {
            await openai.vectorStores.fileBatches.create(
                VECTOR_STORE,
                { file_ids: ids }
            );
            console.log(`✓ Batch ${batchNo++} (${ids.length} files) queued`);
        }

        console.log('Finished – all batches sent.');
    } catch (err) {
        console.error('ERROR:', err);
        process.exit(1);
    }
})();