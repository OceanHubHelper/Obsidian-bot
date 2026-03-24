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

const OWNER_ID = '1280339014033080442';   // your user ID

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

// Webhook from your website
app.post('/purchase-complete', (req, res) => {
  const { name, username, proof } = req.body || {};
  console.log('📩 Purchase received from shop:', req.body);

  const user = client.users.cache.get(OWNER_ID);
  if (user) {
    user.send(`**Someone has looked into buying ${name || 'Unknown Item'}**\nI'll update you when they have purchased.`).catch(e => console.error("DM failed:", e));
  } else {
    console.log("⚠️ Could not find owner user");
  }

  res.json({ success: true });
});

const TOKEN = "MTQ4NTg0NzUxOTczMTkxMjg0NA.G6-q9A.hoTVxVo9TOpcXcwrnJsIfTxlvOQc********"; // ← your full token here
client.login(TOKEN).catch(e => console.error("❌ Login failed:", e));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Bot webhook listening on port ${PORT}`);
});
