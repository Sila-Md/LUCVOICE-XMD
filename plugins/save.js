const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// File to store saved data
const saveFile = path.join(__dirname, 'savedData.json');
let savedData = {};

// Load existing saved data
if (fs.existsSync(saveFile)) {
    savedData = JSON.parse(fs.readFileSync(saveFile));
}

// Save function
function saveToFile() {
    fs.writeFileSync(saveFile, JSON.stringify(savedData, null, 2));
}

cmd({
    pattern: "save",
    desc: "Save text or links to the bot",
    category: "main",
    react: "💾",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) {
            return reply("❌ Usage: .save <key> <text>");
        }

        const key = args[0].toLowerCase();
        const text = args.slice(1).join(" ");
        if (!text) return reply("❌ Please provide the text to save.");

        // Save data
        savedData[key] = {
            text: text,
            user: m.pushName || "User",
            date: new Date().toLocaleString()
        };

        saveToFile();

        reply(`✅ Data saved under key: "${key}"`);

    } catch (error) {
        console.error(error);
        reply("❌ Error saving data!");
    }
});

// Command to retrieve saved data
cmd({
    pattern: "get",
    desc: "Retrieve saved data by key",
    category: "main",
    react: "📂",
    filename: __filename
},
async (conn, mek, m, { reply, args }) => {
    try {
        if (!args || args.length === 0) {
            return reply("❌ Usage: .get <key>");
        }

        const key = args[0].toLowerCase();
        if (!savedData[key]) return reply(`❌ No data found for key: "${key}"`);

        const data = savedData[key];
        reply(`📌 *Saved Data*\n\nKey: ${key}\nSaved By: ${data.user}\nDate: ${data.date}\nText: ${data.text}`);

    } catch (error) {
        console.error(error);
        reply("❌ Error retrieving saved data!");
    }
});
