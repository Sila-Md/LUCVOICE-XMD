const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp'); // for image creation

cmd({
    pattern: "create",
    desc: "Create text or image content",
    category: "main",
    react: "🛠️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide text to create. Example: .create Hello World!");

        const text = args.join(" ");

        // Create image with text using Jimp
        const image = new Jimp(800, 400, '#1a1a1a'); // black background
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_WHITE);
        image.print(font, 0, 150, {
            text: text,
            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
        }, 800, 400);

        const outputFile = path.join(__dirname, `created_${Date.now()}.png`);
        await image.writeAsync(outputFile);

        // Send image
        await conn.sendMessage(from, { image: fs.readFileSync(outputFile) }, { quoted: mek });

        // Cleanup
        fs.unlinkSync(outputFile);

    } catch (error) {
        console.error(error);
        reply("❌ Error creating content!");
    }
});
