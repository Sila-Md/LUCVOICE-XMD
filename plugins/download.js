const { cmd } = require('../command');
const ytdl = require('ytdl-core');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "download",
    desc: "Download media from YouTube",
    category: "main",
    react: "📥",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide a YouTube link. Example: .download https://youtu.be/...");

        const url = args[0];
        if (!ytdl.validateURL(url)) return reply("❌ Invalid YouTube link!");

        reply("⬇️ Downloading, please wait...");

        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^a-zA-Z0-9 ]/g, "");
        const outputFile = path.join(__dirname, `${title}_${Date.now()}.mp4`);

        // Download video
        const stream = ytdl(url, { quality: "highest" });
        stream.pipe(fs.createWriteStream(outputFile));

        stream.on('end', async () => {
            // Send video
            await conn.sendMessage(from, { video: fs.readFileSync(outputFile), caption: `🎬 ${info.videoDetails.title}` }, { quoted: mek });
            fs.unlinkSync(outputFile); // cleanup
        });

        stream.on('error', (err) => {
            console.error(err);
            reply("❌ Error downloading video!");
        });

    } catch (error) {
        console.error(error);
        reply("❌ Error in download command!");
    }
});
