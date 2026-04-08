const { cmd } = require('../command');

cmd({
    pattern: "antilk",
    desc: "Enable/Disable Anti-Link in the group",
    category: "admin",
    react: "🛡️",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, isGroup, reply, prefix }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        const config = require('../config');
        // This can be a database / json file in production
        global.antiLinkGroups = global.antiLinkGroups || {};

        if (!args[0]) {
            return reply(`Usage: ${prefix}antilk <on/off>\nExample: ${prefix}antilk on`);
        }

        const option = args[0].toLowerCase();
        if (option === "on") {
            global.antiLinkGroups[from] = true;
            return reply("✅ Anti-Link is now *ON* for this group!");
        } else if (option === "off") {
            global.antiLinkGroups[from] = false;
            return reply("❌ Anti-Link is now *OFF* for this group!");
        } else {
            return reply("❌ Invalid option! Use 'on' or 'off'.");
        }

    } catch (e) {
        console.log("Anti-Link Error:", e);
        reply("❌ Error executing antilk command!");
    }
});

// Listening for messages to detect links
cmd({
    pattern: ".*",
    fromMe: false,
    onlyGroup: true,
    filename: __filename
},
async (conn, mek, m, { from, sender, body }) => {
    try {
        if (!global.antiLinkGroups || !global.antiLinkGroups[from]) return;

        const linkRegex = /(https?:\/\/)?(www\.)?(chat\.whatsapp\.com|wa\.me)\/[A-Za-z0-9]+/i;
        if (body && linkRegex.test(body)) {
            // Warn user
            await conn.sendMessage(from, { text: `⚠️ @${sender.split("@")[0]}, posting group links is not allowed!` }, { quoted: m, mentions: [sender] });

            // Optional: Kick user (uncomment below if bot is admin)
            // await conn.groupParticipantsUpdate(from, [sender], 'remove');
        }

    } catch (e) {
        console.log("Anti-Link Detect Error:", e);
    }
});
