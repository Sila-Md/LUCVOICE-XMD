const { cmd } = require('../command');

cmd({
    pattern: "restart",
    desc: "Restart the bot (Owner only)",
    category: "main",
    react: "🔄",
    filename: __filename
},
async (conn, mek, m, { from, reply, isOwner }) => {
    try {
        // Only allow bot owner to restart
        if (!isOwner) return reply("❌ Only the bot owner can restart the bot!");

        reply("🔄 Restarting LUCVOICE-XMD bot...");

        console.log("⚡ Restart command triggered by owner. Restarting bot...");
        
        // Graceful exit, PM2 or other process manager will restart
        process.exit(0);

    } catch (error) {
        console.error(error);
        reply("❌ Error restarting the bot!");
    }
});
