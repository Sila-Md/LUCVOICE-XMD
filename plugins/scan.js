const { cmd } = require('../command');

// ===== SCAN COMMAND =====
cmd({
    pattern: "scan",
    desc: "Scan a text or URL",
    category: "tools",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, pushname, prefix, sender }) => {
    try {
        const config = require('../config');
        const botName = config.BOT_NAME || "LUCVOICE-XMD";

        // Get text to scan
        const text = m.text || m.message?.conversation || m.message?.extendedTextMessage?.text;
        if (!text) return await conn.sendMessage(from, { text: `⚠️ Please provide text or link to scan.\n\nUsage: ${prefix}scan <text>` }, { quoted: mek });

        // Dummy scan result (replace with real logic if you have API)
        const result = `🔹 Scan Result for: ${text}\n\n✅ Status: Safe\nℹ️ Info: This is a demo scan result.`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/8a9abd.png" },
            caption: result,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: botName,
                    body: "🔍 Scan System",
                    thumbnailUrl: config.MENU_IMAGE_URL || "https://files.catbox.moe/8a9abd.png",
                    sourceUrl: "https://github.com/lucvoice/LUCVOICE-XMD",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { text: "❌ Error scanning text." }, { quoted: mek });
    }
});
