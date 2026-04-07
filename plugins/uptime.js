const { cmd } = require('../command');
const os = require('os');

cmd({
    pattern: "uptime",
    alias: ["up", "runtime", "status"],
    desc: "Check bot uptime and system status",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply, pushname }) => {
    try {
        // Calculate uptime
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        const uptimeString = days > 0 
            ? `${days}d ${hours}h ${minutes}m ${seconds}s`
            : `${hours}h ${minutes}m ${seconds}s`;
        
        // Get system info
        const usedMemory = (os.totalmem() - os.freemem()) / 1024 / 1024;
        const totalMemory = os.totalmem() / 1024 / 1024;
        const cpuCount = os.cpus().length;
        const platform = os.platform();
        const arch = os.arch();
        
        // Current time
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        const dateString = now.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        
        // Stylish uptime message
        const text = 
`╔══════════════════════════════════╗
║     ⏱️ 𝐔𝐏𝐓𝐈𝐌𝐄 ⏱️                 ║
╠══════════════════════════════════╣
║  🤖 𝐁𝐨𝐭: 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃           ║
║  📊 𝐒𝐭𝐚𝐭𝐮𝐬: 🟢 𝐎𝐍𝐋𝐈𝐍𝐄            ║
║  ⏰ 𝐔𝐩𝐭𝐢𝐦𝐞: ${uptimeString.padEnd(18)}║
╠══════════════════════════════════╣
║  💻 𝐒𝐲𝐬𝐭𝐞𝐦 𝐈𝐧𝐟𝐨:                  ║
║  • 𝐏𝐥𝐚𝐭𝐟𝐨𝐫𝐦: ${platform} (${arch})       ║
║  • 𝐂𝐏𝐔 𝐂𝐨𝐫𝐞𝐬: ${cpuCount}                      ║
║  • 𝐑𝐀𝐌: ${Math.round(usedMemory)}MB / ${Math.round(totalMemory)}MB        ║
╠══════════════════════════════════╣
║  🕐 𝐓𝐢𝐦𝐞: ${timeString}                  ║
║  📅 𝐃𝐚𝐭𝐞: ${dateString}            ║
╚══════════════════════════════════╝

♱♱♱♱♱ 𝐏𝐨𝐰𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡 ♱♱♱♱`;

        // Send with contextInfo containing newsletter JID
        await conn.sendMessage(from, {
            text: text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃 𝐔𝐩𝐝𝐚𝐭𝐞𝐬',
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
                    body: '⏱️ System Uptime Monitor',
                    thumbnailUrl: 'https://files.catbox.moe/8a9abd.png',
                    sourceUrl: 'https://github.com/Sila-Md/SILA-MD',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } catch (e) {
        console.log("Uptime Error:", e);
        reply("❌ Error fetching uptime!");
    }
});
