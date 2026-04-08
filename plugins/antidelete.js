const { cmd } = require('../command');

// Object to store deleted messages temporarily
let deletedMessages = {};

cmd({
    pattern: "antidelete",
    desc: "Enable or disable anti-delete feature",
    category: "group",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup, isAdmin, args }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");
        if (!isAdmin) return reply("❌ Only group admins can toggle this feature!");

        const action = args[0]?.toLowerCase();
        if (!["on", "off"].includes(action)) return reply("❌ Usage: .antidelete <on/off>");

        // Store group setting in memory (can later be persisted to file/db)
        deletedMessages[from] = deletedMessages[from] || { enabled: false, msgs: [] };
        deletedMessages[from].enabled = action === "on";

        reply(`✅ Anti-delete is now *${action.toUpperCase()}* in this group!`);

    } catch (error) {
        console.error(error);
        reply("❌ Error toggling anti-delete!");
    }
});

// Event listener for message delete
cmd({
    pattern: "onDeleteEvent",
    desc: "Internal: track deleted messages",
    category: "internal",
    filename: __filename
},
async (conn, mek, m) => {
    try {
        const from = m.key.remoteJid;
        if (!deletedMessages[from]?.enabled) return; // feature off

        // Store deleted message
        const deletedMsg = {
            from: m.key.participant || m.key.remoteJid,
            message: m.message,
            timestamp: new Date().toLocaleString()
        };

        deletedMessages[from].msgs.push(deletedMsg);

        // Optional: notify group immediately
        const senderName = deletedMsg.from.split("@")[0];
        await conn.sendMessage(from, { text: `⚠️ @${senderName} tried to delete a message!\nContent: ${JSON.stringify(deletedMsg.message)}` , mentions: [deletedMsg.from] });

    } catch (error) {
        console.error("Anti-delete event error:", error);
    }
});
