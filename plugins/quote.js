const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "quote",
    desc: "Get a random quote or quote your message",
    category: "fun",
    react: "💬",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // If user replies to a message, create a quote from it
        if (m.quoted && m.quoted.message) {
            const userMessage = m.quoted.message.conversation || m.quoted.message.extendedTextMessage?.text;
            const senderName = m.quoted.sender?.split("@")[0] || "User";

            if (!userMessage) return reply("❌ Could not quote this message!");

            return reply(`💬 Quote from @${senderName}:\n\n"${userMessage}"`, { mentions: [m.quoted.sender] });
        }

        // Otherwise, fetch a random quote from API
        const response = await axios.get("https://api.quotable.io/random");
        const data = response.data;

        const quoteText = `💬 "${data.content}"\n— *${data.author}*`;
        await reply(quoteText);

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching or quoting message!");
    }
});
