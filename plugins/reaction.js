const { cmd } = require('../command');

cmd({
    pattern: "react",
    desc: "React to a message with an emoji",
    category: "fun",
    react: "😊",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Check if user replied to a message
        if (!m.quoted) return reply("❌ Please reply to a message to react to it.");

        // Get emoji from args or default
        const emoji = args[0] || "❤️";

        // Send reaction
        await conn.sendMessage(from, {
            react: {
                text: emoji,
                key: m.quoted.key
            }
        });

        reply(`✅ Reacted with ${emoji} to the message!`);

    } catch (error) {
        console.error(error);
        reply("❌ Error reacting to the message!");
    }
});

// Optional: Auto-reaction feature (for all incoming messages)
cmd({
    pattern: "autoreact",
    desc: "Toggle auto-reaction for all messages",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Enable or disable auto-react
        if (!args[0]) return reply("❌ Usage: .autoreact on/off <emoji>");
        const toggle = args[0].toLowerCase();
        const emoji = args[1] || "❤️";

        if (toggle === "on") {
            global.AUTO_REACT_STATUS = true;
            global.AUTO_REACT_EMOJI = emoji;
            reply(`✅ Auto-reaction enabled with emoji: ${emoji}`);
        } else if (toggle === "off") {
            global.AUTO_REACT_STATUS = false;
            reply("❌ Auto-reaction disabled!");
        } else {
            reply("❌ Invalid option! Use: on/off");
        }
    } catch (err) {
        console.error(err);
        reply("❌ Error setting auto-reaction!");
    }
});
