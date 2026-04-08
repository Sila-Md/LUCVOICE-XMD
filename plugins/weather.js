const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "weather",
    desc: "Get current weather for a city",
    category: "main",
    react: "🌤️",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        // If no city provided
        if (!args || args.length === 0) {
            return reply("❌ Please provide a city name. Example: .weather Dar es Salaam");
        }

        const city = args.join(" ");
        const apiKey = process.env.WEATHER_API_KEY; // Set API key in environment

        if (!apiKey) {
            return reply("❌ Weather API key is not set. Please set WEATHER_API_KEY in environment.");
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

        // Request weather data
        const response = await axios.get(url);
        const data = response.data;

        // Extract useful weather info
        const location = `${data.name}, ${data.sys.country}`;
        const temp = data.main.temp;
        const feelsLike = data.main.feels_like;
        const weatherDesc = data.weather[0].description;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;

        // Format reply
        const weatherReport = `
🌍 *Weather in ${location}*
🌡️ Temperature : ${temp}°C
🤗 Feels Like  : ${feelsLike}°C
☁️ Condition    : ${weatherDesc}
💧 Humidity    : ${humidity}%
💨 Wind Speed  : ${windSpeed} m/s
        `;

        await conn.sendMessage(from, { text: weatherReport }, { quoted: mek });

    } catch (error) {
        console.error(error);

        // If city not found or API error
        if (error.response && error.response.data && error.response.data.message) {
            return reply(`❌ Could not find weather for "${args.join(" ")}". Try a valid city name.`);
        }

        reply("❌ Error fetching weather information!");
    }
});
