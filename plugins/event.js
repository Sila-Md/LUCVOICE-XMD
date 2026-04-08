const { cmd } = require('../command');

cmd({
    pattern: "event",
    desc: "Handle group events (welcome/leave/anti-delete)",
    category: "main",
    react: "🎉",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Check if message is group event
        if (!m.isGroup) return;

        // New participant
        if (m.action === 'add') {
            const addedUser = m.users[0];
            const welcomeMsg = `👋 Welcome @${addedUser.split("@")[0]} to the group! Enjoy your stay 🎉`;
            await conn.sendMessage(from, { text: welcomeMsg, mentions: [addedUser] });
        }

        // Participant leaves
        else if (m.action === 'remove') {
            const leftUser = m.users[0];
            const byeMsg = `😢 Goodbye @${leftUser.split("@")[0]}, we will miss you!`;
            await conn.sendMessage(from, { text: byeMsg, mentions: [leftUser] });
        }

        // Anti-delete (optional)
        else if (m.type === 'delete') {
            const deletedMessage = m.deletedMessage;
            if (deletedMessage) {
                await conn.sendMessage(from, { text: `⚠️ A message was deleted!\nContent: ${JSON.stringify(deletedMessage)}` });
            }
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error handling event!");
    }
});
