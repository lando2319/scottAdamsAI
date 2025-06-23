const openAIUtil = require("../web-app/functions/util/openAIUtil.js");

// var question = "Do you support Gay Marriage"; // for it
var question = "what are your politics like"; // left of bernie

(async () => {
    try {
        await openAIUtil.ask(question, {env:"backend"});
        process.exit(0);
    } catch (err) {
        console.log("ERROR", err);
        process.exit(1);
    };
})();