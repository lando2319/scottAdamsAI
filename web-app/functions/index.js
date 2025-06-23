const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions/v2");

const openAIUtil = require("./util/openAIUtil.js");

exports.ask = onCall({ encorceAppCheck: true },
    async (request, response) => {
        try {
            var questionPkg = request.data;
            var env = request.data.env;

            var answer = await openAIUtil.ask(questionPkg.question, {env});
            return answer;
        } catch (err) {
            console.log("ERROR", err.message);
            throw new HttpsError('unknown', err.message || "UNKNOWN ERROR RRRR");
        }
    }
);