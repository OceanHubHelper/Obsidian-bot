const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

const app = express();
app.use(bodyParser.json());

const OWNER_ID = '1280339014033080442';

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

app.post('/purchase-complete', (req, res) => {
  const { name, username, proof } = req.body || {};
  console.log('📩 Purchase received from shop:', req.body);

  const user = client.users.cache.get(OWNER_ID);
  if (user) {
    user.send(`**🛒 New Purchase Attempt**\n\n` +
              `**Brainrot:** ${name || 'Unknown'}\n` +
              `**Username:** ${username || 'Unknown'}\n` +
              `**Proof:** ${proof || 'No proof provided'}\n\n` +
              `Please check and confirm in the shop.`).catch(e => console.error("DM failed:", e));
  } else {
    console.log("⚠️ Owner user not found in cache");
  }

  res.json({ success: true });
});

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN is missing!");
  process.exit(1);
}

client.login(TOKEN).catch(e => console.error("❌ Login failed:", e));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Bot webhook running on port ${PORT}`);
});
