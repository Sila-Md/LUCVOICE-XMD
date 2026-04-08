const { cmd } = require('../command');
const os = require('os');

// BOT OWNER NUMBER
const OWNER_NUMBER = "1234567890@s.whatsapp.net";

// Ping command
cmd({
    pattern: "ping",
    desc: "Check bot speed",
    category: "general",
    react: "⚡",
    filename: __filename
}, async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const start = new Date().getTime();
        const msg = await conn.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: mek });
        const end = new Date().getTime();
        const speed = end - start;

        const uptime = process.uptime();
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);

        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        let pingText = `
╭━━━〔 ⚡ LUCVOICE-XMD PING 〕━━━╮
┃ 👤 User   : ${pushname || 'User'}
┃ ⚡ Speed  : ${speed} ms
┃ ⏱ Uptime : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM    : ${ram} MB / ${totalRam} MB
┃ 🤖 Status : ONLINE ✅
╰━━━━━━━━━━━━━━━━━━━━━╯

🏓 Pong!`;

        await conn.sendMessage(from, { text: pingText, edit: msg.key });

    } catch (error) {
        console.error(error);
        reply("❌ Error checking ping!");
    }
});

// Info command
cmd({
    pattern: "info",
    desc: "Get bot info",
    category: "general",
    react: "ℹ️",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const infoText = `
🤖 *Bot Info*
📌 Name     : LUCVOICE-XMD
👑 Owner    : @${OWNER_NUMBER.split("@")[0]}
💻 Platform : Node.js
🕒 Uptime   : ${Math.floor(process.uptime() / 3600)}h
🛠 Version  : 1.0.0
📌 Status   : ONLINE ✅
        `;
        await conn.sendMessage(from, { text: infoText, mentions: [OWNER_NUMBER] }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ Error fetching bot info!");
    }
});

// Help command
cmd({
    pattern: "help",
    desc: "Show list of commands",
    category: "general",
    react: "🆘",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const helpText = `
📜 *LUCVOICE-XMD Commands*

⚡ Main: .ping, .info, .owner
🎮 Fun : .game, .rps, .guess
🛠 Utils: .create, .download, .fancy, .contact
🐞 Support: .bug, .conversation

Use .<command> to execute a command.
        `;
        await conn.sendMessage(from, { text: helpText }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ Error showing help!");
    }
});

// Owner command
cmd({
    pattern: "owner",
    desc: "Show bot owner",
    category: "general",
    react: "👑",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        await conn.sendMessage(from, { text: `👑 Bot Owner: @${OWNER_NUMBER.split("@")[0]}`, mentions: [OWNER_NUMBER] }, { quoted: mek });
    } catch (error) {
        console.error(error);
        reply("❌ Error fetching owner info!");
    }
});
