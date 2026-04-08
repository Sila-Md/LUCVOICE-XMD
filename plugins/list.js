const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// ===== GET ALL COMMANDS =====
function getAllCommands() {
    const commands = [];
    const pluginsDir = path.join(__dirname, '..', 'plugins');

    if (!fs.existsSync(pluginsDir)) return commands;

    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.js'));

    for (let file of files) {
        try {
            delete require.cache[require.resolve(path.join(pluginsDir, file))];
            const plugin = require(path.join(pluginsDir, file));

            if (plugin.commands) {
                plugin.commands.forEach(cmd => {
                    commands.push({
                        name: cmd.pattern,
                        alias: cmd.alias || [],
                        desc: cmd.desc || "No description",
                        category: (cmd.category || "misc").toLowerCase()
                    });
                });
            }
        } catch (e) {}
    }

    return commands;
}

// ===== GROUP BY CATEGORY =====
function groupByCategory(cmds) {
    const data = {};
    cmds.forEach(c => {
        if (!data[c.category]) data[c.category] = [];
        data[c.category].push(c);
    });
    return data;
}

// ===== LIST COMMAND WITH IMAGE =====
cmd({
    pattern: "list",
    desc: "Show all commands as list with image",
    category: "main",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, pushname, prefix, sender }) => {
    try {
        const config = require('../config');
        const botName = config.BOT_NAME || "LUCVOICE-XMD";

        const cmds = getAllCommands();
        const grouped = groupByCategory(cmds);

        let text = `📋 *Command List - ${botName}*\n\n`;

        Object.keys(grouped).sort().forEach(cat => {
            text += `📂 *${cat.toUpperCase()}*\n`;
            grouped[cat].forEach(c => {
                text += `  • ${prefix}${c.name} - ${c.desc}\n`;
            });
            text += `\n`;
        });

        text += `💡 Example: ${prefix}ping`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/8a9abd.png" },
            caption: text,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: botName,
                    body: "🔥 Ultra Command List",
                    thumbnailUrl: config.MENU_IMAGE_URL || "https://files.catbox.moe/8a9abd.png",
                    sourceUrl: "https://github.com/lucvoice/LUCVOICE-XMD",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
    }
});
