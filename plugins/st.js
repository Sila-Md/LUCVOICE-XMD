const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "st",
    desc: "Show LUCVOICE-XMD bot system status",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const start = new Date().getTime();

        // Send temporary message
        const msg = await conn.sendMessage(from, { text: "📊 Checking bot status..." }, { quoted: mek });

        const end = new Date().getTime();
        const speed = end - start;

        // System info
        const uptime = process.uptime();
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);
        const cpuModel = os.cpus()[0].model;
        const platform = os.platform();

        // Format uptime
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Status message
        let statusText = `
╭━━━〔 ⚡ LUCVOICE-XMD STATUS 〕━━━╮
┃ 👤 User     : ${pushname || "User"}
┃ ⚡ Ping     : ${speed} ms
┃ ⏱ Uptime   : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM     : ${ramUsed} MB / ${totalRam} MB
┃ 🖥 CPU     : ${cpuModel}
┃ 🖧 Platform : ${platform}
┃ 🤖 Status  : ONLINE ✅
╰━━━━━━━━━━━━━━━━━━━━╯
        `;

        await conn.sendMessage(from, { 
            text: statusText,
            edit: msg.key
        });

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching bot status!");
    }
});
