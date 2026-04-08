const { cmd } = require('../command');

cmd({
    pattern: "areact",
    desc: "Auto react to messages",
    category: "main",
    react: "💖", // default reaction emoji
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname, args }) => {
    try {
        // Chagua emoji kutoka kwa command, au tumia default
        let emoji = args[0] || "❤️"; // default ❤️

        // Send temporary message
        const tempMsg = await conn.sendMessage(from, { text: `🤖 Auto-reacting with ${emoji}...` }, { quoted: mek });

        // React to the quoted message
        if (mek.quoted) {
            await conn.sendMessage(from, { 
                react: { key: mek.quoted.key, text: emoji } 
            });
            await conn.sendMessage(from, { text: `✅ Reacted with ${emoji}`, quoted: tempMsg });
        } else {
            reply("❌ Please reply to a message to auto-react.");
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error in auto-reacting!");
    }
});
