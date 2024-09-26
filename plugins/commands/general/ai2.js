import axios from 'axios';

const config = {
    name: "ai2",
    aliases: ["chatgpt"],
    description: "Ask a question to the GPT",
    usage: "[query]",
    cooldown: 3,
    permissions: [0, 1, 2],
    isAbsolute: false,
    isHidden: false,
    credits: "RN, Coffee ☕️ (also credits to deku's API)",
};

const previousResponses = new Map();

async function onCall({ message, args }) {
    const id = message.senderID;
    if (!args.length) {
        message.reply("🗨️✨ | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃\n━━━━━━━━━━━━━━━━\nHello! How can I assist you today?\n━━━━━━━━━━━━━━━━");
        return;
    }

    let query = args.join(" ");
    const previousResponse = previousResponses.get(id);

    if (previousResponse) {
        query = `Follow-up on: "${previousResponse}"\nUser reply: "${query}"`;
    }

    try {
        const typ = global.api.sendTypingIndicator(message.threadID);
        const response = await axios.get(`https://deku-rest-api.gleeze.com/new/gpt-3_5-turbo?prompt=${encodeURIComponent(query)}`);
        typ();

        if (response.data && response.data.result && response.data.result.reply) {
            const gptResponse = response.data.result.reply;
            await message.send(`🗨️✨ | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃\n━━━━━━━━━━━━━━━━\n${gptResponse}\n━━━━━━━━━━━━━━━━`);
            previousResponses.set(id, gptResponse);
        } else {
            await message.send("🗨️✨ | 𝙲𝚑𝚊𝚝𝙶𝙿𝚃\n━━━━━━━━━━━━━━━━\nError: Unexpected response format from API.\n━━━━━━━━━━━━━━━━");
        }
    } catch (error) {
        console.error("API call failed: ", error);
        message.react(`❎`);
    }
}

export default {
    config,
    onCall
};