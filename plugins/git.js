const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "git",
    desc: "Fetch file from GitHub and load/update bot script",
    category: "main",
    react: "🌀",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) return reply("❌ Please provide a GitHub file URL. Example: .git https://raw.githubusercontent.com/user/repo/main/file.js");

        const fileUrl = args[0];
        const fileName = path.basename(fileUrl);

        reply(`⬇️ Fetching ${fileName} from GitHub...`);

        const response = await axios.get(fileUrl);
        const fileContent = response.data;

        const savePath = path.join(__dirname, fileName);
        fs.writeFileSync(savePath, fileContent);

        reply(`✅ File ${fileName} downloaded and saved!`);

        // Optional: Auto-load the script
        try {
            delete require.cache[require.resolve(`./${fileName}`)];
            require(`./${fileName}`);
            reply(`🔄 Script ${fileName} loaded successfully!`);
        } catch (err) {
            console.error(err);
            reply(`⚠️ Script ${fileName} downloaded but failed to load automatically.`);
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching file from GitHub!");
    }
});
