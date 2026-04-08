const { cmd } = require('../command');

cmd({
    pattern: "style",
    desc: "Convert text to fancy styles",
    category: "fun",
    react: "✨",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Usage: .style <text>");

        const text = args.join(" ");

        // Simple fancy styles examples
        const styles = {
            "Bold": text.split("").map(c => c + "\u0301").join(""),
            "Italic": text.split("").map(c => c + "\u0323").join(""),
            "Underline": text.split("").map(c => c + "\u0332").join(""),
            "Reverse": text.split("").reverse().join(""),
            "Squared": text.split("").map(c => c + "◻️").join("")
        };

        let styledMessage = "✨ *LUCVOICE-XMD Text Styles* ✨\n\n";
        for (const [key, value] of Object.entries(styles)) {
            styledMessage += `*${key}*: ${value}\n`;
        }

        reply(styledMessage);

    } catch (error) {
        console.error(error);
        reply("❌ Error applying styles!");
    }
});
