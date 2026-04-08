const { cmd } = require('../command');

cmd({
    pattern: "only",
    desc: "Check and restrict commands to certain user types",
    category: "main",
    react: "🔒",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, isOwner, isAdmin, mType }) => {
    try {
        if (!args || args.length === 0) return reply(`❌ Usage: .only <owner|admin|group>`);

        const type = args[0].toLowerCase();

        switch (type) {
            case "owner":
                if (!isOwner) return reply("❌ This command is for the bot owner only!");
                reply("✅ You are the owner! Access granted.");
                break;

            case "admin":
                if (!isAdmin) return reply("❌ This command is for group admins only!");
                reply("✅ You are an admin! Access granted.");
                break;

            case "group":
                if (!m.isGroup) return reply("❌ This command can only be used in groups!");
                reply("✅ This is a group. Access granted.");
                break;

            default:
                reply("❌ Unknown type. Use: owner, admin, group");
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error checking user type!");
    }
});
