const express = require('express')
const { DiscussServiceClient, TextServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");
const { DESCRIPTION_CONTEXT, DESCRIPTION_EXAMPLES, DESCRIPTION_MODEL, NAME_PROMPT, NAME_MODEL, NAME_MODEL_SAFETY_SETTINGS } = require('../utils/promptsConstant')
const { GOOGLE_GEN_AI_API_KEY } = process.env;
const router = express.Router();

const client = new DiscussServiceClient({
    authClient: new GoogleAuth().fromAPIKey(GOOGLE_GEN_AI_API_KEY),
});

const clientTextService = new TextServiceClient({
    authClient: new GoogleAuth().fromAPIKey(GOOGLE_GEN_AI_API_KEY),
});

router.post('/generate-description', async (req, res) => {
    const { name, keywords, maximum_words } = req.body;
    const response = {}
    if (!name || !keywords || !maximum_words) {
        response.status = "error"
        response.error = "Fields cannot be blank"
        res.json({ response });
        return
    }
    const messages = [{
        "content": "{\"name\": \"" + name + "\",\n        \"ingredients_keywords\": \"" + keywords + "\", \"maximum_words\":" + maximum_words + "}"
    }]
    try {
        const aiResponse = await client.generateMessage({
            model: DESCRIPTION_MODEL,
            temperature: 0.25,
            candidateCount: 1,
            top_k: 40,
            top_p: 0.95,
            prompt: {
                context: DESCRIPTION_CONTEXT,
                examples: DESCRIPTION_EXAMPLES,
                messages: messages,
            },
        })
        console.log("aiResponse", JSON.stringify(aiResponse))
        response.status = "ok"
        response.description = aiResponse[0].candidates
    } catch (e) {
        response.status = "error"
        response.error = e.message
    }
    res.json({ response });
});

router.post('/generate-name', async (req, res) => {
    const { name } = req.body;
    const response = {}
    if (!name) {
        response.status = "error"
        response.error = "Dish name cannot be blank"
        res.json({ response });
        return
    }
    const input = name;
    const promptString = NAME_PROMPT + `${input}
    output:`;
    const stopSequences = [];
    try {
        const aiResponse = await clientTextService.generateText({
            model: NAME_MODEL,
            temperature: 0.7,
            candidateCount: 1,
            top_k: 40,
            top_p: 0.95,
            max_output_tokens: 1024,
            stop_sequences: stopSequences,
            safety_settings: NAME_MODEL_SAFETY_SETTINGS,
            prompt: {
                text: promptString,
            },
        })
        response.status = "ok"
        response.names = aiResponse[0].candidates[0].output
    } catch (e) {
        response.status = "error"
        response.error = e.message
    }
    res.json({ response });
});

module.exports = router;