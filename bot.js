// DEBUG BOT - Run this to test token and DM
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

  // Send DM to you
  const user = client.users.cache.get(OWNER_ID);
  if (user) {
    user.send(`**✅ Bot is online and working!**\n\nDebug test successful.\n\nToken length: ${process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN.length : 'MISSING'}`).catch(e => console.error("DM failed:", e));
  } else {
    console.log("⚠️ Could not find owner in cache");
  }
});

// Login with token from environment variable
const TOKEN = process.env.DISCORD_TOKEN;

if (!TOKEN) {
  console.error("❌ ERROR: DISCORD_TOKEN environment variable is missing!");
  console.log("Please add DISCORD_TOKEN in Railway Variables");
  process.exit(1);
}

console.log(`🔑 Token loaded (length: ${TOKEN.length})`);
console.log(`🔑 First 10 chars: ${TOKEN.substring(0,10)}...`);

client.login(TOKEN).catch(err => {
  console.error("❌ LOGIN FAILED:", err.message);
  if (err.message.includes("invalid token")) {
    console.error("Token is invalid. Please reset it in Discord Developer Portal.");
  }
});
