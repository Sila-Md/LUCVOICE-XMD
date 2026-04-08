const { cmd } = require('../command');

// Badilisha hii na number ya bot owner
const OWNER_NUMBER = "1234567890@s.whatsapp.net"; 

cmd({
    pattern: "bug",
    desc: "Report a bug to the bot owner",
    category: "main",
    react: "🐞",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, pushname }) => {
    try {
        // Check if user provided bug description
        if (!args || args.length === 0) {
            return reply("❌ Please provide a description of the bug. Example: .bug bot is not responding");
        }

        const bugText = args.join(" ");
        const userName = pushname || "User";

        // Build report message
        const reportMessage = `
🐞 *Bug Report Received* 🐞

👤 From: ${userName}
📱 Chat: ${from}
💬 Message: ${bugText}
        `;

        // Send bug report to owner
        await conn.sendMessage(OWNER_NUMBER, { text: reportMessage });

        // Reply to user
        reply("✅ Your bug report has been sent to the owner. Thank you!");

    } catch (error) {
        console.error(error);
        reply("❌ Error sending bug report!");
    }
});
