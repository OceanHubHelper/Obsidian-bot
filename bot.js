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

// Your Discord User ID
const OWNER_ID = '1280339014033080442';

client.once('ready', () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

// Receive purchase from website
app.post('/purchase-complete', (req, res) => {
  const { name, username, proof } = req.body || {};
  console.log('📩 Purchase received:', req.body);

  const user = client.users.cache.get(OWNER_ID);
  if (user) {
    user.send(`**Someone has looked into buying ${name || 'Unknown'}**\nI'll update you when they have purchased.`).catch(console.error);
  }

  res.json({ success: true });
});

const TOKEN = "MTQ4NTg0NzUxOTczMTkxMjg0NA.G6-q9A.hoTVxVo9TOpcXcwrnJsIfTxlvOQc********"; // your token
client.login(TOKEN);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Bot webhook running on port ${PORT}`);
});
