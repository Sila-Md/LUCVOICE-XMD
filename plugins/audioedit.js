const { cmd } = require('../command');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

cmd({
    pattern: "audioedit",
    desc: "Advanced audio editing (speed, volume, bass, echo, pitch)",
    category: "main",
    react: "🎧",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Check if user replied to audio
        if (!mek.quoted || !mek.quoted.audioMessage) 
            return reply("❌ Please reply to an audio file to edit.");

        const buffer = await conn.downloadMediaMessage(mek.quoted);
        const inputFile = path.join(__dirname, `temp_${Date.now()}.mp3`);
        const outputFile = path.join(__dirname, `edited_${Date.now()}.mp3`);
        fs.writeFileSync(inputFile, buffer);

        // Determine effect from args
        let effect = args[0]?.toLowerCase() || "normal";
        let ffmpegCmd;

        switch(effect) {
            case "fast":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -filter:a "atempo=1.5" "${outputFile}"`;
                break;
            case "slow":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -filter:a "atempo=0.7" "${outputFile}"`;
                break;
            case "loud":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -filter:a "volume=2.0" "${outputFile}"`;
                break;
            case "soft":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -filter:a "volume=0.5" "${outputFile}"`;
                break;
            case "bass":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -af "bass=g=10" "${outputFile}"`;
                break;
            case "echo":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -af "aecho=0.8:0.88:60:0.4" "${outputFile}"`;
                break;
            case "pitchup":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -af "asetrate=44100*1.2,aresample=44100" "${outputFile}"`;
                break;
            case "pitchdown":
                ffmpegCmd = `ffmpeg -i "${inputFile}" -af "asetrate=44100*0.8,aresample=44100" "${outputFile}"`;
                break;
            default:
                ffmpegCmd = `ffmpeg -i "${inputFile}" "${outputFile}"`;
        }

        // Execute ffmpeg
        await new Promise((resolve, reject) => {
            exec(ffmpegCmd, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        // Send edited audio
        await conn.sendMessage(from, { audio: fs.readFileSync(outputFile), mimetype: "audio/mp4" }, { quoted: mek });

        // Cleanup temp files
        fs.unlinkSync(inputFile);
        fs.unlinkSync(outputFile);

        reply(`✅ Audio edited with effect: ${effect}`);

    } catch (error) {
        console.error(error);
        reply("❌ Error editing audio!");
    }
});
