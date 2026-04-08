const { cmd } = require('../command');
const OpenAI = require('openai');

// Replace with your OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

cmd({
    pattern: "logo",
    desc: "Generate a custom logo from text",
    category: "media",
    react: "🖌️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide text for the logo. Example: .logo MyBrand");

        const text = args.join(" ");
        reply(`🎨 Generating logo for: "${text}"...`);

        // Use OpenAI Image Generation
        const response = await openai.images.generate({
            model: "gpt-image-1",
            prompt: `Professional logo design with the text: "${text}", colorful, modern, high-quality, transparent background`,
            size: "1024x1024"
        });

        const logoUrl = response.data[0].url;

        await conn.sendMessage(from, {
            image: { url: logoUrl },
            caption: `🖌 Logo generated for: "${text}"`
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error generating logo!");
    }
});
