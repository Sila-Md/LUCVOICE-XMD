const { cmd } = require('../command');

cmd({
    pattern: "delete-link",
    desc: "Delete messages containing links in group",
    category: "group",
    react: "🗑️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isAdmin }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmin) return reply("❌ Only admins can enable delete-link protection!");

        // Enable anti-link delete mode per group (in-memory, can save to JSON)
        conn.deleteLinkGroups = conn.deleteLinkGroups || {};
        conn.deleteLinkGroups[from] = true;

        reply("✅ Delete-link protection is now ENABLED in this group!");

    } catch (error) {
        console.error(error);
        reply("❌ Error enabling delete-link feature!");
    }
});

// Event listener to monitor messages with links
cmd({
    pattern: "onMessage",
    desc: "Internal: delete messages containing links",
    category: "internal",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const from = m.key.remoteJid;

        if (!conn.deleteLinkGroups?.[from]) return; // feature not enabled

        const text = m.message?.conversation || m.message?.extendedTextMessage?.text;
        if (!text) return;

        // Simple link detection
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        if (urlRegex.test(text)) {
            const sender = m.key.participant || m.key.remoteJid;

            // Delete message if bot is admin
            if (conn.user?.isAdmin) {
                await conn.sendMessage(from, { delete: { remoteJid: from, id: m.key.id, participant: sender } });
                await conn.sendMessage(from, { text: `⚠️ @${sender.split("@")[0]}, links are not allowed in this group!`, mentions: [sender] });
            }
        }

    } catch (error) {
        console.error("Delete-link event error:", error);
    }
});
