const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

// Function to get all commands from plugins folder
function getAllCommands() {
    const commands = [];
    const pluginsDir = path.join(__dirname, '..', 'plugins');
    
    if (!fs.existsSync(pluginsDir)) {
        return commands;
    }
    
    const files = fs.readdirSync(pluginsDir).filter(file => file.endsWith('.js'));
    
    files.forEach(file => {
        try {
            delete require.cache[require.resolve(path.join(pluginsDir, file))];
            const plugin = require(path.join(pluginsDir, file));
            
            if (plugin.commands && Array.isArray(plugin.commands)) {
                plugin.commands.forEach(cmd => {
                    if (cmd.pattern && cmd.category) {
                        commands.push({
                            name: cmd.pattern,
                            alias: cmd.alias || [],
                            desc: cmd.desc || 'No description',
                            category: cmd.category.toLowerCase(),
                            react: cmd.react || '📌'
                        });
                    }
                });
            }
        } catch (e) {
            console.log(`Error loading ${file}:`, e.message);
        }
    });
    
    return commands;
}

// Function to organize commands by category
function organizeByCategory(commands) {
    const categories = {};
    
    commands.forEach(cmd => {
        const cat = cmd.category || 'misc';
        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push(cmd);
    });
    
    return categories;
}

// Category emojis mapping
const categoryEmojis = {
    'main': '🏠',
    'owner': '👑',
    'group': '👥',
    'admin': '🛡️',
    'fun': '🎭',
    'search': '🔍',
    'download': '📥',
    'media': '🎬',
    'sticker': '🎨',
    'tools': '🛠️',
    'ai': '🤖',
    'info': 'ℹ️',
    'economy': '💰',
    'game': '🎮',
    'convert': '🔄',
    'misc': '📦',
    'religion': '🕌',
    'nsfw': '🔞'
};

cmd({
    pattern: "menu",
    alias: ["help", "list", "commands", "cmd"],
    desc: "Display all available commands",
    category: "main",
    react: "📜",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply, prefix }) => {
    try {
        // Get bot info
        const config = require('../config');
        const botName = config.BOT_NAME || "𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃";
        const ownerName = config.OWNER_NAME || "BIN ADNAN";
        
        // Get all commands
        const allCommands = getAllCommands();
        const categories = organizeByCategory(allCommands);
        const totalCmds = allCommands.length;
        
        // Sort categories
        const sortedCategories = Object.keys(categories).sort();
        
        // Build menu text
        let menuText = 
`╔══════════════════════════════════╗
║     📜 𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔 📜              ║
╠══════════════════════════════════╣
║  🤖 ${botName.padEnd(28)}║
║  👤 User: ${pushname || 'User'}${''.padEnd(20 - (pushname || 'User').length)}║
║  🔢 Total Commands: ${totalCmds.toString().padEnd(14)}║
╠══════════════════════════════════╣`;

        // Loop through categories
        sortedCategories.forEach((cat, index) => {
            const emoji = categoryEmojis[cat] || '📂';
            const cmds = categories[cat];
            
            menuText += `\n║  ${emoji} ${cat.toUpperCase()} (${cmds.length})${''.padEnd(24 - cat.length - cmds.length.toString().length)}║`;
            menuText += `\n║  ${'─'.repeat(32)}║`;
            
            cmds.forEach((cmd, i) => {
                const cmdName = cmd.name;
                const aliases = cmd.alias.length > 0 ? `| ${cmd.alias.join(', ')}` : '';
                const line = `  ${prefix}${cmdName} ${aliases}`;
                const truncated = line.length > 30 ? line.substring(0, 27) + '...' : line;
                menuText += `\n║${truncated.padEnd(34)}║`;
            });
            
            // Add separator between categories
            if (index < sortedCategories.length - 1) {
                menuText += `\n╠══════════════════════════════════╣`;
            }
        });
        
        menuText += 
`\n╚══════════════════════════════════╝

╔══════════════════════════════════╗
║  💡 𝐇𝐨𝐰 𝐭𝐨 𝐮𝐬𝐞:                  ║
║  ${prefix}command <args>             ║
║  Example: ${prefix}ping               ║
╚══════════════════════════════════╝

♱♱♱♱♱ 𝐏𝐨𝐰𝐞𝐝 𝐛𝐲 ${ownerName} ♱♱♱♱`;

        // Send menu with image and context
        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/8a9abd.png' },
            caption: menuText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: botName,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: botName,
                    body: `📜 ${totalCmds} Commands Available`,
                    thumbnailUrl: config.MENU_IMAGE_URL || 'https://files.catbox.moe/8a9abd.png',
                    sourceUrl: 'https://github.com/Sila-Md/SILA-MD',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        }, { quoted: mek });
        
    } catch (e) {
        console.log("Menu Error:", e);
        reply("❌ Error generating menu!");
    }
});

// Category-specific menu command
cmd({
    pattern: "list",
    desc: "List commands by category",
    category: "main",
    react: "📂",
    filename: __filename
},
async (conn, mek, m, { from, sender, args, prefix, reply }) => {
    try {
        const allCommands = getAllCommands();
        const categories = organizeByCategory(allCommands);
        
        // If no category specified, show categories
        if (!args[0]) {
            let catText = 
`╔══════════════════════════════════╗
║     📂 𝐂𝐀𝐓𝐄𝐆𝐎𝐑𝐈𝐄𝐒 📂              ║
╠══════════════════════════════════╣`;

            Object.keys(categories).sort().forEach(cat => {
                const emoji = categoryEmojis[cat] || '📂';
                const count = categories[cat].length;
                catText += `\n║  ${emoji} ${prefix}list ${cat.padEnd(20)}(${count})  ║`;
            });
            
            catText += 
`\n╚══════════════════════════════════╝
💡 Use: ${prefix}list <category>

♱♱♱♱♱ 𝐏𝐨𝐰𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡 ♱♱♱♱`;

            return await conn.sendMessage(from, { text: catText }, { quoted: mek });
        }
        
        // Show specific category
        const requestedCat = args[0].toLowerCase();
        const cmds = categories[requestedCat];
        
        if (!cmds) {
            return reply(`❌ Category "${args[0]}" not found!\nUse ${prefix}list to see available categories.`);
        }
        
        const emoji = categoryEmojis[requestedCat] || '📂';
        let catMenu = 
`╔══════════════════════════════════╗
║  ${emoji} ${requestedCat.toUpperCase()} (${cmds.length})${''.padEnd(24 - requestedCat.length)}║
╠══════════════════════════════════╣`;

        cmds.forEach((cmd, i) => {
            const aliases = cmd.alias.length > 0 ? `\n║      ↳ Aliases: ${cmd.alias.join(', ')}` : '';
            catMenu += `\n║  ${i + 1}. ${prefix}${cmd.name}${aliases}`;
            catMenu += `\n║      ↳ ${cmd.desc}`;
            catMenu += `\n║`;
        });
        
        catMenu += 
`\n╚══════════════════════════════════╝

♱♱♱♱♱ 𝐏𝐨𝐰𝐞𝐝 𝐛𝐲 𝐒𝐢𝐥𝐚 𝐓𝐞𝐜𝐡 ♱♱♱♱`;

        await conn.sendMessage(from, { 
            text: catMenu,
            contextInfo: {
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402325089913@newsletter',
                    newsletterName: '𝐋𝐔𝐂𝐕𝐎𝐈𝐂𝐄-𝐗𝐌𝐃',
                    serverMessageId: -1
                }
            }
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply("❌ Error!");
    }
});
