
const localSecrets = require("../secrets/secrets.json");

const { OpenAI } = require("openai");

const fs = require('fs');
const path = require("path");

const openai = new OpenAI({
    apiKey: localSecrets.OPENAI_API_KEY
});

// const { inspect } = require('util')

async function ask(question, metadata) {
    var loggit = "ask";

    console.log(loggit, "Starting Process with", question);

    var answer = "Hmmmm, not sure about that"

    var input = [
        {
            role: "user",
            content: question
        }
    ];

    var tools = [
        {
            type: "file_search",
            vector_store_ids: ["vs_685834f2788481918c5f2f9b14003368"],
        }
    ];

    const systemInstructionsPath = path.join(__dirname, ".", "openAISystemInstructions.txt");
    const systemInstructions = fs.readFileSync(systemInstructionsPath, 'utf-8');

    var systemInstructionsPreview = JSON.stringify(systemInstructions.slice(0, 36));

    console.log(loggit, "loading System Instructions as (first 36 characters shown)", systemInstructionsPreview, "...");

    console.log(loggit, "Asking OpenAI");

    const response = await openai.responses.create({
        model: "gpt-4.1-2025-04-14",
        input: input,
        instructions: systemInstructions,
        tools,
        store: true,
        metadata: metadata
    });

    console.log(loggit, "Successfully Asked OpenAI");

    answer = response.output_text

    console.log("Final Answer", answer);
    return { text: answer }
};

module.exports.ask = ask;