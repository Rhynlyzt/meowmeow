const axios = require('axios');

const config = {
    name: "ai",
    aliases: [],
    description: "GPT architecture",
    usage: '[prompt]',
    credits: "IShowSpeed",
};

const langData = {
    "en_US": {
        "ai.error.noPrompt": "Please provide a prompt to generate a text response.\nExample: ai what is wave?"
    },
    "vi_VN": {
        "ai.error.noPrompt": "Vui lòng cung cấp một yêu cầu để tạo phản hồi văn bản."
    }
};

async function onCall({ api, event, args, getLang }) {
    const { messageID, messageReply } = event;
    let prompt = args.join(' ');

    if (messageReply) {
        const repliedMessage = messageReply.body;
        prompt = `${repliedMessage} ${prompt}`;
    }

    if (!prompt) {
        return api.sendMessage(getLang("ai.error.noPrompt"), event.threadID, messageID);
    }

    api.sendMessage('🕧| Searching for an answer, please wait...', event.threadID);

    // Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const gpt4_api = `https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(prompt)}&model=gpt-4-32k`;

    try {
        const response = await axios.get(gpt4_api);

        if (response.data && response.data.response) {
            const generatedText = response.data.response;
            api.sendMessage(`GPT-4 ASSISTANT\n━━━━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━━━━`, event.threadID, messageID);
        } else {
            console.error('API response did not contain expected data:', response.data);
            api.sendMessage(`❌ An error occurred while generating the text response. Please try again later.`, event.threadID, messageID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`, event.threadID, messageID);
    }
}

export default {
    config,
    langData,
    onCall
};
