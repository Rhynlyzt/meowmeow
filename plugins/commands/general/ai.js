import axios from 'axios';

const config = {
    name: "ai",
    aliases: ["gpt"],
    description: "AI to answer any question",
    usage: "[query]",
    cooldown: 3,
    permissions: [0, 1, 2],
    isAbsolute: false,
    isHidden: false,
    credits: "cttro",
};

const previousResponses = new Map();

async function onCall({ message, args }) {
    const id = message.senderID;
    if (!args.length) {
        return message.reply("Please provide a question to get an answer.");
    }

    const question = args.join(" ").trim();
    const previousResponse = previousResponses.get(id);

    if (previousResponse) {
        question = `Follow-up on: "${previousResponse}"\nUser reply: "${question}"`;
    }

    try {
        const typ = global.api.sendTypingIndicator(message.threadID);
        const response = await getAIResponse(question);
        typ();

        await message.send(`[ 𝗖𝗢𝗡𝗧𝗜𝗡𝗨𝗘𝗦 𝗔𝗜 ]\n━━━━━━━━━━━━━━━━━━\n${response}\n━━━━━━━━━━━━━━━━━━`);
        previousResponses.set(id, response);
    } catch (error) {
        console.error("Error in onCall:", error.message);
        await message.send("An error occurred while processing your request.");
    }
}

async function getAIResponse(question) {
    const services = [
        { url: 'https://markdevs-last-api.onrender.com/gpt4', params: { prompt: question, uid: 'your-uid-here' } },
        { url: 'http://markdevs-last-api.onrender.com/api/v2/gpt4', params: { query: question } },
        { url: 'https://markdevs-last-api.onrender.com/api/v3/gpt4', params: { ask: question } }
    ];

    for (const service of services) {
        const data = await fetchFromAI(service.url, service.params);
        if (data) return data;
    }

    throw new Error("No valid response from any AI service");
}

async function fetchFromAI(url, params) {
    try {
        const { data } = await axios.get(url, { params });
        if (data && (data.gpt4 || data.reply || data.response || data.answer || data.message)) {
            return data.gpt4 || data.reply || data.response || data.answer || data.message;
        } else {
            throw new Error("No valid response from AI");
        }
    } catch (error) {
        console.error("Network Error:", error.message);
        return null;
    }
}

export default {
    config,
    onCall
};
