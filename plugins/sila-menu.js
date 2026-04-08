const { cmd } = require('../command');
const os = require('os');
const fs = require('fs');
const path = require('path');

// ===== GET COMMANDS =====
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
                        desc: cmd.desc || "No desc",
                        category: (cmd.category || "misc").toLowerCase()
                    });
                });
            }
        } catch (e) {}
    }

    return commands;
}

// ===== ORGANIZE =====
function groupByCategory(cmds) {
    let data = {};
    cmds.forEach(c => {
        if (!data[c.category]) data[c.category] = [];
        data[c.category].push(c);
    });
    return data;
}

// ===== EMOJIS =====
const emojis = {
    main: "🏠",
    ai: "🤖",
    download: "📥",
    group: "👥",
    owner: "👑",
    fun: "🎭",
    tools: "🛠️",
    search: "🔍",
    misc: "📦"
};

// ===== MENU =====
cmd({
    pattern: "menu",
    desc: "Show menu",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, pushname, prefix, sender }) => {

    try {
        const config = require('../config');

        const botName = config.BOT_NAME || "LUCVOICE-XMD";
        const owner = config.OWNER_NAME || "LUKA iT";

        const cmds = getAllCommands();
        const grouped = groupByCategory(cmds);

        const total = cmds.length;
        const uptime = process.uptime().toFixed(0);
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        let text = `
╭━━━〔 🤖 ${botName} 〕━━━╮
┃ 👤 User: ${pushname}
┃ ⚡ Prefix: ${prefix}
┃ 📊 Commands: ${total}
┃ ⏱️ Uptime: ${uptime}s
┃ 💾 RAM: ${ram} MB
╰━━━━━━━━━━━━━━━━━━━╯
`;

        Object.keys(grouped).sort().forEach(cat => {
            const icon = emojis[cat] || "📂";

            text += `\n╭─〔 ${icon} ${cat.toUpperCase()} 〕─╮\n`;

            grouped[cat].forEach(c => {
                text += `│ ${prefix}${c.name}\n`;
            });

            text += `╰───────────────╯\n`;
        });

        text += `
╭━━━━━━━━━━━━━━━━━━━╮
┃ 💡 Example:
┃ ${prefix}ping
┃ ${prefix}ai hello
╰━━━━━━━━━━━━━━━━━━━╯

> ⚡ Powered by ${owner}
`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/8a9abd.png" },
            caption: text,
            contextInfo: {
                mentionedJid: [sender],
                externalAdReply: {
                    title: botName,
                    body: "🔥 Ultra Menu System",
                    thumbnailUrl: config.MENU_IMAGE_URL || "https://files.catbox.moe/8a9abd.png",
                    sourceUrl: "https://github.com",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
    }
});
