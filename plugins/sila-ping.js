const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "ping",
    desc: "Check bot speed",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {

    try {
        const start = new Date().getTime();

        // Send temporary message
        let msg = await conn.sendMessage(from, { text: "🏓 Pinging..." }, { quoted: mek });

        const end = new Date().getTime();
        const speed = end - start;

        const uptime = process.uptime();
        const ram = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        // Format uptime
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const uptimeText = `${hours}h ${minutes}m ${seconds}s`;

        const final = `
╭━━━〔 ⚡ BOT SPEED 〕━━━╮
┃ 🏓 Pong!
┃ 🚀 Speed: ${speed} ms
┃ ⏱️ Uptime: ${uptimeText}
┃ 💾 RAM: ${ram} MB
╰━━━━━━━━━━━━━━━━━━━╯

> 🔥 Bot is running perfectly!
`;

        await conn.sendMessage(from, { text: final }, { quoted: msg });

    } catch (e) {
        console.log(e);
        reply("❌ Failed to check ping.");
    }
});
