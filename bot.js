const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const OWNER_ID = '1280339014033080442';   // Your user ID

client.once('ready', () => {
  console.log(`✅ DEBUG BOT IS ONLINE as ${client.user.tag}`);

  // Force DM after a short delay
  setTimeout(() => {
    const user = client.users.cache.get(OWNER_ID);
    if (user) {
      user.send(`**✅ Bot is online and working!**\n\nDebug test successful.\nToken length: ${process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 'MISSING'}`).catch(e => console.error("DM failed:", e));
    } else {
      console.log("⚠️ Owner not in cache - trying to fetch...");
      client.users.fetch(OWNER_ID).then(user => {
        user.send(`**✅ Bot is online and working!**\n\nDebug test successful.`).catch(e => console.error("DM failed:", e));
      }).catch(e => console.error("Fetch failed:", e));
    }
  }, 3000); // wait 3 seconds
});

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN is missing!");
  process.exit(1);
}

console.log(`🔑 Token loaded (length: ${TOKEN.length})`);
console.log(`🔑 First 10 chars: ${TOKEN.substring(0,10)}...`);

client.login(TOKEN).catch(err => {
  console.error("❌ LOGIN FAILED:", err.message);
});
