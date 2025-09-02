const express = require("express");
const fs = require("fs");
const path = require("path");
const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField } = require("discord.js");

// ==== CONFIG ====
const BOT_TOKEN = "YOUR_DISCORD_BOT_TOKEN";
const GUILD_ID = "YOUR_GUILD_ID";
const ALLOWED_ROLE = "1402718537432170526"; // allowed role for /set-price
const RECEIVER_ID = "1327694394371084339"; // the wallet receiver ID
const EXTERNAL_BOT_ID = "282859044593598464"; // external bot to confirm transfer

// ==== EXPRESS APP ====
const app = express();
app.use(express.json());
app.use(express.static("public"));

const dataDir = path.join(__dirname, "data");
const walletsFile = path.join(dataDir, "wallets.json");
const itemsFile = path.join(dataDir, "items.json");
const priceFile = path.join(dataDir, "price.json");

// Ensure data files exist
function loadJSON(file, def = {}) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify(def, null, 2));
  return JSON.parse(fs.readFileSync(file));
}
function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ==== WALLET API ====
app.post("/api/wallets/create", (req, res) => {
  const wallets = loadJSON(walletsFile);
  const walletId = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  const transferNumber = Math.random().toString().slice(2, 14);
  const newWallet = { id: walletId, password: genPassword(), transferNumber, balance: 0 };
  wallets[walletId] = newWallet;
  saveJSON(walletsFile, wallets);
  res.json({ ok: true, walletId });
});

app.get("/api/wallets/:id", (req, res) => {
  const wallets = loadJSON(walletsFile);
  const wallet = wallets[req.params.id];
  if (!wallet) return res.json({ ok: false, error: "Wallet not found" });
  res.json({ ok: true, wallet });
});

// ==== ITEMS API ====
app.get("/api/items", (req, res) => {
  const items = loadJSON(itemsFile, {});
  res.json({ ok: true, items });
});

app.post("/api/buy", (req, res) => {
  const { walletId, productName, quantity } = req.body;
  const wallets = loadJSON(walletsFile);
  const items = loadJSON(itemsFile);

  const wallet = wallets[walletId];
  if (!wallet) return res.json({ ok: false, error: "Wallet not found" });

  const product = items[productName];
  if (!product) return res.json({ ok: false, error: "Product not found" });

  if (quantity > product.quantity) return res.json({ ok: false, error: "Not enough stock" });

  const totalPrice = product.price * quantity;
  if (wallet.balance < totalPrice) return res.json({ ok: false, error: "Insufficient balance" });

  // Deduct
  wallet.balance -= totalPrice;
  product.quantity -= quantity;

  // If product has codes, deliver first N
  let delivered = [];
  if (product.codes && Array.isArray(product.codes)) {
    delivered = product.codes.splice(0, quantity);
  }

  saveJSON(walletsFile, wallets);
  saveJSON(itemsFile, items);

  res.json({ ok: true, delivered });
});

// ==== HELPER ====
function genPassword(len = 16) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

// ==== DISCORD BOT ====
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`);
});

// Slash commands (manual registration needed or use @discordjs/rest)
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "set-price") {
    if (!interaction.member.roles.cache.has(ALLOWED_ROLE)) {
      return interaction.reply({ content: "You are not allowed to use this command.", ephemeral: true });
    }
    const price = interaction.options.getNumber("price");
    saveJSON(priceFile, { price });
    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("Price Updated")
      .setDescription(`New price set: **${price}$ per 1 unit**`);
    await interaction.reply({ embeds: [embed] });
  }

  if (interaction.commandName === "buy") {
    const qty = interaction.options.getInteger("amount");
    const transfer = interaction.options.getString("transfer");

    const priceData = loadJSON(priceFile, { price: 1 });
    const totalCost = qty * priceData.price;

    const embed = new EmbedBuilder()
      .setColor(0x000000)
      .setTitle("Purchase Request")
      .setDescription(
        `User <@!${interaction.user.id}> wants to buy **${qty}$**\n` +
        `Total cost: **${totalCost}**\n` +
        `Transfer to ID: \`${transfer}\``
      );
    await interaction.reply({ embeds: [embed] });

    // Simulate confirmation from external bot
    const confirmEmbed = new EmbedBuilder()
      .setColor(0x000000)
      .setDescription(
        `:moneybag: | <@!${interaction.user.id}> has transferred \`${totalCost}$\` to <@!${RECEIVER_ID}>`
      );
    const guild = client.guilds.cache.get(GUILD_ID);
    const channel = guild.systemChannel || guild.channels.cache.find(c => c.isTextBased());
    if (channel) channel.send({ embeds: [confirmEmbed] });

    // Add funds to wallet
    const wallets = loadJSON(walletsFile);
    const wallet = Object.values(wallets).find(w => w.transferNumber === transfer);
    if (wallet) {
      wallet.balance += qty;
      saveJSON(walletsFile, wallets);
    }
  }
});

// ==== START ====
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
client.login(BOT_TOKEN);