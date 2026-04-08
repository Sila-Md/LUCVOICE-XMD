const { cmd } = require('../command');

cmd({
    pattern: "boom",
    desc: "Send multiple messages quickly (spam)",
    category: "main",
    react: "💥",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Check if user replied to a message
        if (!mek.quoted) return reply("❌ Please reply to a message to boom!");

        // Number of times to send (default 5)
        let count = parseInt(args[0]) || 5;
        if (count > 20) count = 20; // safety limit

        // Delay between messages in ms (default 500ms)
        let delay = parseInt(args[1]) || 500;
        if (delay < 100) delay = 100;

        reply(`💥 Boom started! Sending ${count} messages with ${delay}ms delay...`);

        const msgContent = mek.quoted.message;

        for (let i = 0; i < count; i++) {
            await conn.sendMessage(from, msgContent, { quoted: mek.quoted });
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        reply("✅ Boom finished!");

    } catch (error) {
        console.error(error);
        reply("❌ Error in boom!");
    }
});
