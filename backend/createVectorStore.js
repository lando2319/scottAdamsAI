require('dotenv').config({ path: __dirname + '/.env' });

const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

(async () => {
    try {
        const vectorStore = await openai.vectorStores.create({
            name: "knowledge_base",
        });
        console.log(vectorStore.id);
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    };
})();