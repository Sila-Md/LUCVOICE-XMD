const { cmd } = require('../command');

cmd({
    pattern: "atag",
    desc: "Tag someone or list members",
    category: "main",
    react: "👥",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        // Check if the command is used in a group
        if (!m.isGroup) return reply("❌ This command can only be used in groups!");

        // Get all group participants
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;

        // Build message with mentions
        let tagText = `👥 *Group Members (${participants.length})*\n\n`;
        const mentions = [];

        participants.forEach((p, i) => {
            const userName = p.name || p.pushname || p.id.split("@")[0];
            tagText += `${i + 1}. @${p.id.split("@")[0]}\n`;
            mentions.push(p.id);
        });

        // Send message with mentions
        await conn.sendMessage(from, { 
            text: tagText,
            mentions: mentions 
        });

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching group members!");
    }
});
