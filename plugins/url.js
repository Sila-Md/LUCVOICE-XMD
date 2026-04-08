const { cmd } = require('../command');
const fetch = require('node-fetch');

cmd({
    pattern: "url",
    desc: "Process or preview a URL",
    category: "main",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Usage: .url <link>");

        const link = args[0];
        // Simple URL validation
        if (!/^https?:\/\/\S+$/.test(link)) return reply("❌ Invalid URL!");

        reply(`🔗 Processing URL: ${link}`);

        // Optional: fetch title or metadata
        try {
            const res = await fetch(link);
            const html = await res.text();
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : "No title found";

            reply(`📌 URL Info:\nLink: ${link}\nTitle: ${title}`);
        } catch (err) {
            console.error(err);
            reply(`⚠️ Could not fetch URL info. Sending raw link:\n${link}`);
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error processing URL!");
    }
});
