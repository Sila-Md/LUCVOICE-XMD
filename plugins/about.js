const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "about",
    alias: ["info", "botinfo", "version"],
    desc: "Display information about the bot",
    category: "main",
    react: "ℹ️",
    filename: __filename
},
async (conn, mek, m, { from, pushname, reply, prefix }) => {
    try {
        const config = require('../config');
        const botName = config.BOT_NAME || "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
        const ownerName = config.OWNER_NAME || "LUKA iT";
        const mode = "PUBLIC"; // dynamic if needed
        const version = "v2.0.0";

        // System info
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);

        // Features list
        const features = [
            "🤖 AI Commands",
            "🎨 Sticker & Media Tools",
            "📥 Download Commands",
            "🛡️ Admin & Group Tools",
            "💰 Economy & Game",
            "⚡ Fast & Lightweight"
        ];

        let aboutText = `
╭━━━〔 ℹ️ ABOUT ${botName} 〕━━━╮
┃ 👤 User       : ${pushname || 'User'}
┃ 🤖 Bot        : ${botName}
┃ 👑 Owner      : ${ownerName}
┃ 🌍 Mode       : ${mode}
┃ 🆚 Version    : ${version}
┃ ⏱ Uptime     : ${hours}h ${minutes}m ${seconds}s
┃ 💾 RAM Usage  : ${ramUsed} MB / ${totalRam} MB
╰━━━━━━━━━━━━━━━━━━━━━╯

🌟 Features:
${features.map((f, i) => `┃ ${i+1}. ${f}`).join('\n')}

⚡ Powered by ʟᴜᴋᴀ ɪᴛ ⚡
`;

        await conn.sendMessage(from, {
            text: aboutText,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.log("About Error:", e);
        reply("❌ Error showing bot info!");
    }
});
