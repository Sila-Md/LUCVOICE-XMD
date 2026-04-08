const { cmd } = require('../command');

cmd({
    pattern: "tagadmn",
    desc: "Tag all group admins",
    category: "group",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const admins = groupMetadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin');
        
        if (admins.length === 0) return reply("❌ No admins found in this group.");

        const mentions = admins.map(a => a.id);
        const adminNames = admins.map(a => a.id.split("@")[0]).join(", ");

        await conn.sendMessage(from, {
            text: `📢 *Attention Group Admins:* ${adminNames}\n\nThis is a message for all admins!`,
            mentions: mentions
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("❌ Error tagging admins!");
    }
});
