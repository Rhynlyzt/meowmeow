import axios from 'axios';

const config = {
    name: "ai",
    aliases: ["chatgpt"],
    description: "Gpt architecture",
    usage: "[query]",
    cooldown: 3,
    permissions: [0],
    isAbsolute: false,
    isHidden: false,
    credits: "ai, api by jerome",
};

const previousResponses = new Map();

async function onCall({ api, event, args }) {
    const { messageID, messageReply, threadID, senderID } = event;
    let prompt = args.join(" ");

    if (messageReply) {
        const repliedMessage = messageReply.body;
        prompt = `${repliedMessage} ${prompt}`;
    }

    if (!prompt) {
        return api.sendMessage('𝗣𝗹𝗲𝗮𝘀𝗲 𝗽𝗿𝗼𝘃𝗶𝗱𝗲 𝗮 𝗽𝗿𝗼𝗺𝗽𝘁 𝘁𝗼 𝗴𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗮 𝘁𝗲𝘅𝘁 𝗿𝗲𝘀𝗽𝗼𝗻𝘀𝗲.\n𝗘𝘅𝗮𝗺𝗽𝗹𝗲: 𝗮𝗶 𝘄𝗵𝗮𝘁 𝗶𝘀 𝘄𝗮𝘃𝗲?', threadID, messageID);
    }

    api.sendMessage('🕧|𝗦𝗲𝗮𝗿𝗰𝗵𝗶𝗻𝗴 𝗳𝗼𝗿 𝗮𝗻 𝗮𝗻𝘀𝘄𝗲𝗿 𝘆𝗼𝘂𝗿 𝗾𝘂𝗲𝘀𝘁𝗶𝗼𝗻 𝗽𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁...', threadID);

    // Delay
    await new Promise(resolve => setTimeout(resolve, 2000)); // Adjust the delay time as needed

    try {
        const gpt4_api = `https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(prompt)}&model=gpt-4-32k`;
        const response = await axios.get(gpt4_api);

        if (response.data && response.data.response) {
            const generatedText = response.data.response;
            api.sendMessage(`𝗚𝗣𝗧4 𝗔𝗦𝗦𝗜𝗦𝗧𝗔𝗡𝗧\n━━━━━━━━━━━━━━━━━━\n${generatedText}\n━━━━━━━━━━━━━━━━━━`, threadID, messageID);
        } else {
            console.error('API response did not contain expected data:', response.data);
            api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Response data: ${JSON.stringify(response.data)}`, threadID, messageID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(`❌ An error occurred while generating the text response. Please try again later. Error details: ${error.message}`, threadID, messageID);
    }
}

export default {
    config,
    onCall
};
