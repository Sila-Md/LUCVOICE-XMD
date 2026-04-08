const { cmd } = require('../command');

cmd({
    pattern: "fancy",
    desc: "Convert your text into fancy styles",
    category: "main",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide text to style. Example: .fancy Hello");

        const text = args.join(" ");

        // Simple fancy styles
        const styles = {
            bold: text.split("").map(c => c + "\u0332").join(""),
            italic: text.split("").map(c => c + "\u0333").join(""),
            bubble: text.split("").map(c => String.fromCodePoint(0x24B6 + (c.toUpperCase().charCodeAt(0)-65) || c)).join(""),
            cursive: text.split("").map(c => String.fromCharCode(c.charCodeAt(0) + 0x1D49C - 97) || c).join("")
        };

        let replyText = `✨ Fancy Text Styles ✨\n\n`;
        replyText += `🅑 Bold     : ${styles.bold}\n`;
        replyText += `🅘 Italic   : ${styles.italic}\n`;
        replyText += `🅑 Bubble   : ${styles.bubble}\n`;
        replyText += `🅒 Cursive  : ${styles.cursive}\n`;

        await conn.sendMessage(from, { text: replyText }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error creating fancy text!");
    }
});
