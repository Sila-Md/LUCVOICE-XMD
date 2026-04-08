const { cmd } = require('../command');

cmd({
    pattern: "tags",
    desc: "Tag all group members",
    category: "group",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { from, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const members = groupMetadata.participants;

        if (!members || members.length === 0) return reply("❌ No members found in this group.");

        const mentions = members.map(member => member.id);
        const memberNames = members.map(member => member.id.split("@")[0]).join(", ");

        await conn.sendMessage(from, {
            text: `📢 *Attention All Members:* ${memberNames}\n\nThis is a message for everyone in the group!`,
            mentions: mentions
        }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("❌ Error tagging members!");
    }
});
