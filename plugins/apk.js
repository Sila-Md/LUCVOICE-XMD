const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "apk",
    desc: "Search and download APKs",
    category: "download",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, prefix }) => {
    try {
        if (!args[0]) return reply(`❌ Usage: ${prefix}apk <app name>\nExample: ${prefix}apk facebook`);

        const query = args.join(" ");
        await reply(`🔍 Searching APK for: *${query}* ...`);

        // Example API (replace with real free APK API if available)
        const apiURL = `https://api.apkcombo.com/v1/search?q=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiURL).catch(() => ({ data: null }));

        if (!data || data.results.length === 0) {
            return reply(`❌ No APK found for: ${query}`);
        }

        const apk = data.results[0]; // take first result
        const apkName = apk.name || query;
        const apkLink = apk.downloadLink || "https://example.com/download";

        const apkText = `
╭━━━〔 📥 APK DOWNLOAD 〕━━━╮
┃ 📱 App Name : ${apkName}
┃ ⚡ Version  : ${apk.version || 'Unknown'}
┃ 🌐 Size     : ${apk.size || 'Unknown'}
┃ 🔗 Link     : ${apkLink}
╰━━━━━━━━━━━━━━━━━━━━━╯

💡 Download safely and enjoy!
`;

        await conn.sendMessage(from, {
            text: apkText,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.log("APK Error:", e);
        reply("❌ Error fetching APK!");
    }
});
