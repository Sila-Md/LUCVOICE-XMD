const { cmd } = require('../command');
const { writeFileSync, unlinkSync } = require('fs');
const { fromBuffer } = require('file-type');
const fetch = require('node-fetch');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

cmd({
    pattern: "sticker",
    desc: "Create a sticker from image or video",
    category: "fun",
    react: "🎨",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Check if user replied to an image or video
        if (!m.quoted || !m.quoted.message) return reply("❌ Please reply to an image or video to create sticker!");

        const messageType = Object.keys(m.quoted.message)[0];
        if (!["imageMessage", "videoMessage"].includes(messageType)) {
            return reply("❌ Reply to an image or short video (less than 10s) to create a sticker!");
        }

        // Download media
        const stream = await conn.downloadMediaMessage(m.quoted);
        const buffer = Buffer.from(await stream.arrayBuffer());

        // Determine media type
        const type = await fromBuffer(buffer);
        if (!type) return reply("❌ Could not determine media type!");

        // Create sticker
        const sticker = new Sticker(buffer, {
            pack: "LUCVOICE-XMD",
            author: "Bot",
            type: type.mime.startsWith("image") ? StickerTypes.FULL : StickerTypes.VIDEO,
        });

        const stickerBuffer = await sticker.toBuffer();

        // Send sticker
        await conn.sendMessage(from, { sticker: stickerBuffer }, { quoted: m });

    } catch (error) {
        console.error(error);
        reply("❌ Error creating sticker!");
    }
});
