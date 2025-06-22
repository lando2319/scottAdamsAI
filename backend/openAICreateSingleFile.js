require('dotenv').config({ path: __dirname + '/.env' });

const { OpenAI } = require("openai");
const fs = require("fs");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function createFile(filePath) {
    let result;
    const fileContent = fs.createReadStream(filePath);
    result = await openai.files.create({
        file: fileContent,
        purpose: "assistants",
    });

    return result.id;
};

var fileName = "_oldBlogPosts.txt";

(async () => {
    try {
        const fileId = await createFile(__dirname + "/../blogPosts/" + fileName);
        console.log(fileName, fileId);
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    };
})();