require('dotenv').config({ path: __dirname + '/.env' });

const { OpenAI } = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

var vectorStoreID = "vs_685834f2788481918c5f2f9b14003368";
var fileID = "file-YaMx9VYswdk7oSA7T36vr3";

(async () => {
    try {
        await openai.vectorStores.files.create( vectorStoreID, { file_id: fileID, });
        console.log("SUCCESS");
        process.exit(0);
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    };
})();