const { cmd } = require('../command');

// Define combined fakevCard 
const fakevCard = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "© 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃",
      vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃 𝐁𝐎𝐓\nORG:𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃;\nTEL;type=CELL;type=VOICE;waid=255770100487:+255770100487\nEND:VCARD`
    }
  }
};

cmd({
    pattern: "ping",
    alias: ["p", "speed", "latency"],
    desc: "Check bot response speed",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();
        
        // Send initial message with loading effect
        const initialMsg = await conn.sendMessage(from, 
            { text: "⏳ 𝐂𝐚𝐥𝐜𝐮𝐥𝐚𝐭𝐢𝐧𝐠 𝐬𝐩𝐞𝐞𝐝..." },
            { quoted: fakevCard }
        );
        
        const end = Date.now();
        const latency = end - start;
        
        // Determine speed status
        let speedStatus = "🐢 Slow";
        let speedEmoji = "🔴";
        if (latency < 100) {
            speedStatus = "🚀 Ultra Fast";
            speedEmoji = "🟢";
        } else if (latency < 300) {
            speedStatus = "⚡ Fast";
            speedEmoji = "🟡";
        } else if (latency < 600) {
            speedStatus = "🐇 Good";
            speedEmoji = "🟠";
        }
        
        // Stylish ping response
        const text = 
`╔══════════════════════════════════╗
║     ⚡ 𝐏𝐎𝐍𝐆 ⚡                  ║
╠══════════════════════════════════╣
║  📊 𝐋𝐚𝐭𝐞𝐧𝐜𝐲: ${latency} ms          ║
║  ${speedEmoji} 𝐒𝐭𝐚𝐭𝐮𝐬: ${speedStatus}        ║
║  🤖 𝐁𝐨𝐭: 𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃           ║
║  ⏰ 𝐓𝐢𝐦𝐞: ${new Date().toLocaleTimeString()}    ║
╚══════════════════════════════════╝

♱♱♱♱♱ 𝐏𝐨𝐰𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡 ♱♱♱♱`;
        
        // Edit the message with style
        await conn.sendMessage(from, {
            text: text,
            edit: initialMsg.key,
            contextInfo: {
                externalAdReply: {
                    title: '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
                    body: '⚡ Speed Test Complete',
                    thumbnailUrl: 'https://files.catbox.moe/8a9abd.png',
                    sourceUrl: 'https://github.com/Sila-Md/SILA-MD',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
        
    } catch (e) {
        console.log("Ping Error:", e);
        reply("❌ Error checking ping!");
    }
});
