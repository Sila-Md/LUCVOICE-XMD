const { cmd } = require('../command');
const ytdl = require('ytdl-core');
const yts = require('yt-search');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "play",
    desc: "Search and play music from YouTube",
    category: "media",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide a song name. Example: .play Despacito");

        const query = args.join(" ");
        reply(`🔎 Searching for "${query}" on YouTube...`);

        const searchResult = await yts(query);
        if (!searchResult || !searchResult.videos || searchResult.videos.length === 0) 
            return reply("❌ No results found!");

        const video = searchResult.videos[0]; // get the top result
        const url = video.url;

        reply(`🎵 Downloading: ${video.title}\n⏱ Duration: ${video.timestamp}\n🔗 Link: ${url}`);

        // Download audio
        const filePath = path.join(__dirname, `${video.videoId}.mp3`);
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' });
        stream.pipe(fs.createWriteStream(filePath));

        stream.on('end', async () => {
            await conn.sendMessage(from, {
                audio: fs.readFileSync(filePath),
                mimetype: 'audio/mpeg',
                fileName: `${video.title}.mp3`,
                caption: `🎶 ${video.title}`
            }, { quoted: mek });

            // Delete file after sending
            fs.unlinkSync(filePath);
        });

        stream.on('error', (err) => {
            console.error(err);
            reply("❌ Error downloading audio!");
        });

    } catch (error) {
        console.error(error);
        reply("❌ Error executing play command!");
    }
});
