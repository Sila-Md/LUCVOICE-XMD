const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "status",
    desc: "Show LUCVOICE-XMD bot system status",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, reply, pushname }) => {
    try {
        const start = new Date().getTime();

        // Send temporary message
        const msg = await conn.sendMessage(from, { text: "📊 Fetching bot status..." }, { quoted: mek });

        const end = new Date().getTime();
        const ping = end - start;

        // System info
        const uptime = process.uptime();
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);
        const cpuModel = os.cpus()[0].model;
        const platform = os.platform();
        const cores = os.cpus().length;

        // Format uptime
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Status message with LUCVOICE-XMD branding
        const statusMessage = `
╭━━━〔 ⚡ LUCVOICE-XMD STATUS 〕━━━╮
┃ 👤 User       : ${pushname || "User"}
┃ ⚡ Ping       : ${ping} ms
┃ ⏱ Uptime     : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM       : ${ramUsed} MB / ${totalRam} MB
┃ 🖥 CPU       : ${cpuModel} (${cores} cores)
┃ 🖧 Platform   : ${platform}
┃ 🤖 Bot Status : ONLINE ✅
╰━━━━━━━━━━━━━━━━━━━━╯
        `;

        await conn.sendMessage(from, { 
            text: statusMessage,
            edit: msg.key
        });

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching bot status!");
    }
});
