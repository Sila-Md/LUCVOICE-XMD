const { cmd } = require('../command');
const qrcode = require('qrcode-terminal');

cmd({
    pattern: "pair",
    desc: "Generate pairing QR code with optional link",
    category: "main",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Optional link from args
        const userLink = args.join(" ") || null;

        reply("🔄 Generating pairing QR code...");

        // Assume conn.generateQR() returns QR string
        if (!conn.generateQR) return reply("❌ QR generation not supported in this bot version.");
        const qr = await conn.generateQR(); 
        qrcode.generate(qr, { small: true }); // print QR in terminal

        // Prepare message
        let messageText = "✅ QR code generated! Scan it in WhatsApp to pair the bot.";
        if (userLink) {
            messageText += `\n🔗 Link: ${userLink}`;
        }

        await conn.sendMessage(from, { text: messageText }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error generating pairing QR code!");
    }
});
