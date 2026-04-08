const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "repo",
    desc: "Show LUCVOICE-XMD GitHub repo or search GitHub",
    category: "main",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args || args.length === 0) {
            // Show the default LUCVOICE-XMD repo
            return reply(`
💻 *LUCVOICE-XMD Bot Repository*
🔗 GitHub: https://github.com/lucvoice/LUCVOICEXMD
🌐 Description: Multi-functional WhatsApp bot
📌 Features: Auto-reply, Play music, Rank system, Logo generator, and more!
            `);
        }

        const query = args.join(" ");
        reply(`🔎 Searching GitHub for repositories matching: "${query}"...`);

        // Search GitHub API
        const res = await axios.get(`https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&per_page=5`);
        const repos = res.data.items;

        if (!repos || repos.length === 0) return reply("❌ No repositories found!");

        let repoMessage = `💻 *GitHub Search Results for:* ${query}\n\n`;
        repos.forEach((repo, i) => {
            repoMessage += `${i + 1}. 🔗 ${repo.full_name}\n`;
            repoMessage += `⭐ Stars: ${repo.stargazers_count} | 🍴 Forks: ${repo.forks_count}\n`;
            repoMessage += `📝 Description: ${repo.description || "No description"}\n`;
            repoMessage += `🔗 Link: ${repo.html_url}\n\n`;
        });

        reply(repoMessage);

    } catch (error) {
        console.error(error);
        reply("❌ Error fetching repository information!");
    }
});
