const { cmd } = require('../command');

cmd({
    pattern: "test",
    desc: "Test bot response and functionality",
    category: "main",
    react: "🧪",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        // Test reply
        await reply(`✅ Hello ${pushname || "User"}! This is a test message from LUCVOICE-XMD.`);

        // Optional: test ping
        const start = new Date().getTime();
        const msg = await conn.sendMessage(from, { text: "🏓 Testing ping..." }, { quoted: m });
        const end = new Date().getTime();
        const ping = end - start;

        await conn.sendMessage(from, {
            text: `⚡ Bot ping: ${ping} ms`,
            edit: msg.key
        });

        // Additional test: send emoji
        await conn.sendMessage(from, { text: "✅ All systems functional! 🎉" }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("❌ Test failed! There was an error with the bot.");
    }
});
