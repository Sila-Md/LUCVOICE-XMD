const { cmd } = require('../command');

cmd({
    pattern: "contact",
    desc: "Get contact info of a user",
    category: "main",
    react: "📇",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        let contactJid;

        // If replied to a message
        if (mek.quoted) {
            contactJid = mek.quoted.sender;
        }
        // If mentioned someone
        else if (mek.mentionedJid && mek.mentionedJid.length > 0) {
            contactJid = mek.mentionedJid[0];
        }
        // Default: sender of the command
        else {
            contactJid = m.sender;
        }

        const contactName = conn.contacts[contactJid]?.name || "Unknown";
        const isBusiness = conn.contacts[contactJid]?.isBusiness || false;

        const contactInfo = `
📇 Contact Info
👤 Name      : ${contactName}
🆔 JID       : ${contactJid}
🏢 Business  : ${isBusiness ? "Yes" : "No"}
        `;

        await conn.sendMessage(from, { text: contactInfo }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ Error fetching contact info!");
    }
});
