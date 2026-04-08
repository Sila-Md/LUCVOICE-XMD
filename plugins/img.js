const { cmd } = require('../command');
const OpenAI = require('openai');

// Replace with your OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

cmd({
    pattern: "img",
    desc: "Generate an AI image from a prompt",
    category: "media",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide a prompt. Example: .img sunset over mountains");

        const prompt = args.join(" ");
        reply(`🎨 Generating image for: "${prompt}"...`);

        const response = await openai.images.generate({
            model: "gpt-image-1",
            prompt: prompt,
            size: "1024x1024"
        });

        const imageUrl = response.data[0].url;

        await conn.sendMessage(from, {
            image: { url: imageUrl },
            caption: `🖼 Prompt: ${prompt}`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error generating image!");
    }
});
