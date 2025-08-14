// ----- الإعدادات الأساسية -----
const TOKEN = "توكن_البوت_هنا";
const CLIENT_ID = "ايدي_البوت_هنا";
const CLIENT_SECRET = "سيكرت_التطبيق";
const REDIRECT_URI = "http://localhost:3000/api/callback";

// ----- المكتبات -----
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField } = require("discord.js");
const express = require("express");
const session = require("express-session");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

// ----- البيانات -----
const dataPath = path.join(__dirname, "data.json");
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, "{}");
let guildData = JSON.parse(fs.readFileSync(dataPath));
function saveData() { fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2)); }

// ----- البوت -----
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.on("ready", () => console.log(`✅ Logged in as ${client.user.tag}`));

// رفع الإيموجي عند دخول سيرفر
client.on("guildCreate", async (guild) => {
  try {
    await guild.emojis.create({
      attachment: path.join(__dirname, "giveaway.png"),
      name: "giveaway0011"
    });
  } catch { }
});

// أمر #gstart
client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  let prefix = guildData[msg.guildId]?.prefix || "#";
  if (!msg.content.startsWith(prefix)) return;

  let args = msg.content.slice(prefix.length).trim().split(/ +/);
  let cmd = args.shift().toLowerCase();

  if (cmd === "gstart") {
    let [duration, winnersCount, ...prizeArr] = args;
    if (!duration || !winnersCount || !prizeArr.length) return msg.reply(`❌ Usage: ${prefix}gstart <duration> <winners> <prize>`);

    let timeMs = parseDuration(duration);
    if (!timeMs || timeMs > 24 * 24 * 60 * 60 * 1000) return msg.reply("❌ Max duration 24d");

    let prize = prizeArr.join(" ");
    let embed = new EmbedBuilder()
      .setTitle("🎉 GIVEAWAY 🎉")
      .setDescription(`:giveaway0011: Prize: **${prize}**\n:giveaway0011: Ends at: in ${duration}\n:giveaway0011: Hosted By: ${msg.author}\n:giveaway0011: Winners: **${winnersCount}**`)
      .setColor("Yellow");

    let giveawayMsg = await msg.channel.send({ embeds: [embed] });
    let emoji = msg.guild.emojis.cache.find(e => e.name === "giveaway0011");
    if (emoji) await giveawayMsg.react(emoji);

    setTimeout(async () => {
      let reaction = giveawayMsg.reactions.cache.first();
      if (!reaction) return msg.channel.send("No participants 😢");
      let users = (await reaction.users.fetch()).filter(u => !u.bot).map(u => u);
      if (!users.length) return msg.channel.send("No participants 😢");

      let winners = [];
      for (let i = 0; i < winnersCount && users.length; i++) {
        winners.push(users.splice(Math.floor(Math.random() * users.length), 1)[0]);
      }
      msg.channel.send(`The winners of this gif are: ${winners.map(w => w).join(" ")}`);
    }, timeMs);
  }
});

function parseDuration(str) {
  let m = str.match(/(\d+)([smhd])/);
  if (!m) return null;
  let mult = { s: 1e3, m: 6e4, h: 36e5, d: 864e5 };
  return parseInt(m[1]) * mult[m[2]];
}

// ----- API للموقع -----
const app = express();
app.use(session({ secret: "secret", resave: false, saveUninitialized: false }));

// OAuth2 login
app.get("/api/login", (req, res) => {
  res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20email%20guilds%20guilds.members.read`);
});

app.get("/api/callback", async (req, res) => {
  let code = req.query.code;
  let body = new URLSearchParams({
    client_id: CLIENT_ID, client_secret: CLIENT_SECRET,
    grant_type: "authorization_code", code, redirect_uri: REDIRECT_URI
  });
  let tokenRes = await fetch("https://discord.com/api/oauth2/token", { method: "POST", body, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
  let tokens = await tokenRes.json();
  req.session.tokens = tokens;
  res.redirect("http://localhost:5173/dashboard"); // واجهة الريأكت
});

// API للإعدادات
app.use(express.json());
app.get("/api/guild/:id/settings", (req, res) => {
  res.json(guildData[req.params.id] || { prefix: "#", accessRole: null, autoReplies: { enabled: false, list: [] } });
});
app.post("/api/guild/:id/settings", (req, res) => {
  guildData[req.params.id] = req.body;
  saveData();
  res.json({ ok: true });
});

app.listen(3000, () => console.log("🌐 API running on 3000"));

// تسجيل دخول البوت
client.login(TOKEN);