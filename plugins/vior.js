const { cmd } = require('../command');
const fs = require('fs');
const { exec } = require('child_process');

cmd({
    pattern: "vior",
    desc: "Play or convert audio/video files",
    category: "media",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!m.quoted || !m.quoted.message) return reply("❌ Please reply to an audio or video message!");

        const messageType = Object.keys(m.quoted.message)[0];
        if (!["audioMessage", "videoMessage", "documentMessage"].includes(messageType)) {
            return reply("❌ Reply to an audio or video file to use vior!");
        }

        // Download media
        const stream = await conn.downloadMediaMessage(m.quoted);
        const buffer = Buffer.from(await stream.arrayBuffer());

        const tempFile = `./temp_${Date.now()}.${messageType.includes("video") ? "mp4" : "mp3"}`;
        fs.writeFileSync(tempFile, buffer);

        reply("🎵 Media downloaded! Converting/playing...");

        // Example: convert to mp3 if video
        if (messageType.includes("video")) {
            const outputFile = tempFile.replace(".mp4", ".mp3");
            exec(`ffmpeg -i ${tempFile} -vn -ar 44100 -ac 2 -b:a 192k ${outputFile}`, (err) => {
                if (err) {
                    console.error(err);
                    reply("❌ Error converting video to audio!");
                } else {
                    const audioBuffer = fs.readFileSync(outputFile);
                    conn.sendMessage(from, { audio: audioBuffer, mimetype: "audio/mp3" }, { quoted: m });
                    fs.unlinkSync(tempFile);
                    fs.unlinkSync(outputFile);
                }
            });
        } else {
            // Directly send audio
            conn.sendMessage(from, { audio: buffer, mimetype: "audio/mp3" }, { quoted: m });
            fs.unlinkSync(tempFile);
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error processing media!");
    }
});
