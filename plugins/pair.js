const { cmd } = require('../command');

cmd({
    pattern: 'pair',
    desc: 'Send bot pairing link with image',
    category: 'main',
    react: '🔗',
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Message content
        const text = `
📡 *LUCVOICE-XMD Pairing*
Scan the QR code or visit the link below to pair the bot:

🔗 Link: https://lucvoice-xmd-1.onrender.com
`;

        const imageUrl = 'https://files.catbox.moe/8a9abd.png'; // replace with your preferred image

        // Send message with image and link
        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: text,
            contextInfo: {
                externalAdReply: {
                    title: "LUCVOICE-XMD Bot Pairing",
                    body: "Click the link to pair your bot",
                    thumbnailUrl: imageUrl,
                    sourceUrl: "https://lucvoice-xmd-1.onrender.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (err) {
        console.log(err);
        reply("❌ Error sending pairing link!");
    }
});
