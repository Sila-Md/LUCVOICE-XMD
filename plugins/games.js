const { cmd } = require('../command');

const activeGames = {}; // Store active games per user

cmd({
    pattern: "game",
    desc: "Play mini games with the bot",
    category: "fun",
    react: "🎮",
    filename: __filename
},
async (conn, mek, m, { from, reply, args, pushname }) => {
    try {
        if (!args || args.length === 0) {
            return reply("❌ Please choose a game: number / rps\nExample: .game number");
        }

        const gameType = args[0].toLowerCase();

        switch(gameType) {
            case "number":
                // Guess the number game
                const number = Math.floor(Math.random() * 100) + 1;
                activeGames[from] = { type: "number", answer: number };
                reply("🎲 Guess a number between 1 and 100! Reply with your guess using `.guess <number>`.");
                break;

            case "rps":
                // Rock-paper-scissors game
                activeGames[from] = { type: "rps" };
                reply("✊🖐✌ Rock-Paper-Scissors! Reply with `.rps rock/paper/scissors`.");
                break;

            default:
                reply("❌ Invalid game. Choose: number / rps");
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error starting game!");
    }
});

// Guess command for number game
cmd({
    pattern: "guess",
    desc: "Guess the number in number game",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!activeGames[from] || activeGames[from].type !== "number") {
            return reply("❌ No active number game. Start with `.game number`");
        }
        const guess = parseInt(args[0]);
        if (!guess) return reply("❌ Please provide a valid number.");

        const answer = activeGames[from].answer;
        if (guess === answer) {
            reply(`🎉 Congrats! You guessed it right: ${answer}`);
            delete activeGames[from];
        } else if (guess < answer) {
            reply("🔼 Higher! Try again.");
        } else {
            reply("🔽 Lower! Try again.");
        }

    } catch (error) {
        console.error(error);
        reply("❌ Error in guessing game!");
    }
});

// RPS command
cmd({
    pattern: "rps",
    desc: "Play rock-paper-scissors",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!activeGames[from] || activeGames[from].type !== "rps") {
            return reply("❌ No active RPS game. Start with `.game rps`");
        }

        const userChoice = args[0]?.toLowerCase();
        const choices = ["rock", "paper", "scissors"];
        if (!choices.includes(userChoice)) return reply("❌ Choose: rock / paper / scissors");

        const botChoice = choices[Math.floor(Math.random() * 3)];
        let result = "";

        if (userChoice === botChoice) result = "It's a tie! 🤝";
        else if (
            (userChoice === "rock" && botChoice === "scissors") ||
            (userChoice === "paper" && botChoice === "rock") ||
            (userChoice === "scissors" && botChoice === "paper")
        ) result = "You win! 🎉";
        else result = "You lose! 😢";

        reply(`You chose: ${userChoice}\nBot chose: ${botChoice}\n${result}`);
        delete activeGames[from];

    } catch (error) {
        console.error(error);
        reply("❌ Error in RPS game!");
    }
});
