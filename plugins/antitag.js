const { cmd } = require('../command');

// Object to store anti-tag settings per group
let antiTagGroups = {};

cmd({
    pattern: "antitag",
    desc: "Enable or disable anti-tag feature in group",
    category: "group",
    react: "🚫",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isAdmin, args }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmin) return reply("❌ Only admins can toggle anti-tag!");

        const action = args[0]?.toLowerCase();
        if (!["on", "off"].includes(action)) return reply("❌ Usage: .antitag <on/off>");

        antiTagGroups[from] = antiTagGroups[from] || { enabled: false };
        antiTagGroups[from].enabled = action === "on";

        reply(`✅ Anti-tag is now *${action.toUpperCase()}* in this group!`);

    } catch (error) {
        console.error(error);
        reply("❌ Error toggling anti-tag!");
    }
});

// Event listener for mentions
cmd({
    pattern: "onMentionEvent",
    desc: "Internal: track mentions for anti-tag",
    category: "internal",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const from = m.key.remoteJid;
        if (!antiTagGroups[from]?.enabled) return;

        // Check if message mentions bot
        const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const botId = conn.user?.id;

        if (mentionedJid.includes(botId)) {
            const sender = m.key.participant || m.key.remoteJid;
            const senderName = sender.split("@")[0];

            // Reply warning or delete message
            await conn.sendMessage(from, {
                text: `⚠️ @${senderName}, you are not allowed to tag the bot in this group!`,
                mentions: [sender]
            });

            // Optionally delete message
            if (conn.user?.isAdmin) {
                await conn.sendMessage(from, { delete: { remoteJid: from, id: m.key.id, participant: sender } });
            }
        }

    } catch (error) {
        console.error("Anti-tag event error:", error);
    }
});
