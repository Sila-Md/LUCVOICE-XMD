const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "link",
    desc: "Extract or get info from a link",
    category: "main",
    react: "🔗",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Usage: .link <URL>");

        const url = args[0];
        // Simple URL validation
        if (!/^https?:\/\/\S+$/.test(url)) return reply("❌ Invalid URL!");

        reply(`🔗 Processing the URL: ${url}`);

        // Optional: fetch page title
        try {
            const res = await axios.get(url);
            const html = res.data;
            const titleMatch = html.match(/<title>(.*?)<\/title>/i);
            const title = titleMatch ? titleMatch[1] : "No title found";

            reply(`📌 URL Info:\nLink: ${url}\nTitle: ${title}`);
        } catch (err) {
            console.error(err);
            reply(`⚠️ Could not fetch URL info. Sending raw link:\n${url}`);
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error processing the URL!");
    }
});
