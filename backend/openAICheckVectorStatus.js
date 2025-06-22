require('dotenv').config({ path: __dirname + '/.env' });

const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

var vectorStoreID = "vs_685834f2788481918c5f2f9b14003368";

(async () => {
    try {
        const result = await openai.vectorStores.files.list(vectorStoreID);
        console.log(result);
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    };
})();