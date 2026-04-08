const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// File to store settings
const settingsFile = path.join(__dirname, 'settings.json');
let settings = {};

// Load existing settings
if (fs.existsSync(settingsFile)) {
    settings = JSON.parse(fs.readFileSync(settingsFile));
}

// Save function
function saveSettings() {
    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));
}

cmd({
    pattern: "setti",
    desc: "Change LUCVOICE-XMD bot settings",
    category: "main",
    react: "⚙️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, isOwner }) => {
    try {
        if (!args || args.length === 0) {
            // Show current settings
            return reply(`
⚙️ *Current LUCVOICE-XMD Settings*

Auto-Reply  : ${settings.autoReply || "off"}
Auto-React  : ${settings.autoReact || "off"}
Prefix      : ${settings.prefix || "."}
React Emoji : ${settings.reactEmoji || "⚡"}

Use: .setti <option> <value>
Options: autoReply, autoReact, prefix, reactEmoji
            `);
        }

        if (!isOwner) return reply("❌ Only the bot owner can change settings!");

        const option = args[0].toLowerCase();
        const value = args[1];

        if (!value) return reply("❌ Please provide a value!");

        switch (option) {
            case "autoreply":
                settings.autoReply = value.toLowerCase() === "on" ? "on" : "off";
                reply(`✅ Auto-Reply is now: ${settings.autoReply}`);
                break;

            case "autoreact":
                settings.autoReact = value.toLowerCase() === "on" ? "on" : "off";
                reply(`✅ Auto-React is now: ${settings.autoReact}`);
                break;

            case "prefix":
                settings.prefix = value;
                reply(`✅ Command prefix is now: ${settings.prefix}`);
                break;

            case "reactemoji":
                settings.reactEmoji = value;
                reply(`✅ React emoji is now: ${settings.reactEmoji}`);
                break;

            default:
                reply("❌ Unknown option! Use: autoReply, autoReact, prefix, reactEmoji");
        }

        saveSettings();

    } catch (error) {
        console.error(error);
        reply("❌ Error updating settings!");
    }
});
