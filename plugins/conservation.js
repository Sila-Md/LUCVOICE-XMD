const { cmd } = require('../command');

cmd({
    pattern: "chat",
    desc: "Have a conversation with the bot",
    category: "main",
    react: "💬",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname, args }) => {
    try {
        // Check if user provided message
        if (!args || args.length === 0) return reply("❌ Please type a message to chat. Example: .chat hello");

        const userMessage = args.join(" ").toLowerCase();

        // Simple keyword-based responses
        let botReply;
        if (userMessage.includes("hi") || userMessage.includes("hello")) {
            botReply = `Hello ${pushname || "there"}! 👋 How are you today?`;
        } else if (userMessage.includes("how are you")) {
            botReply = "I'm a bot 🤖, always operating at ⚡ full speed!";
        } else if (userMessage.includes("bye")) {
            botReply = "Goodbye! Have a nice day 😄";
        } else {
            botReply = "I see! 🤔 Tell me more...";
        }

        // Send reply
        await conn.sendMessage(from, { text: botReply }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error in conversation!");
    }
});
