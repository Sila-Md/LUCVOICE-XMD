const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "weeb",
    desc: "Get a random anime image",
    category: "fun",
    react: "🌸",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // Default category
        let category = args[0] || "waifu"; // waifu, neko, shinobu, megumin etc.

        // Validate category
        const validCategories = ["waifu", "neko", "shinobu", "megumin", "bully", "cuddle", "cry", "hug"];
        if (!validCategories.includes(category.toLowerCase())) category = "waifu";

        // Fetch image from waifu.pics API
        const url = `https://api.waifu.pics/sfw/${category.toLowerCase()}`;
        const response = await axios.get(url);
        const imageUrl = response.data.url;

        // Send image
        await conn.sendMessage(from, { image: { url: imageUrl }, caption: `🌸 Random ${category} for you!` }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching weeb image!");
    }
});
