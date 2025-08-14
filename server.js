// index.js
const express = require("express");
const fetch = require("node-fetch");
const { Client, GatewayIntentBits, Partials, EmbedBuilder, PermissionsBitField, Routes, REST } = require("discord.js");
const fs = require("fs");
const path = require("path");

// ======== CONFIG ========
const PORT = 3000;

// Discord Bot Token
const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";

// OAuth2 Config for Website
const OAUTH = {
  CLIENT_ID: "YOUR_CLIENT_ID_HERE",
  CLIENT_SECRET: "YOUR_CLIENT_SECRET_HERE",
  REDIRECT_URI: `http://localhost:${PORT}/oauth/callback`,
  SCOPES: ["identify","email","guilds","guilds.members.read"]
};

// JSON Data File
const DATA_FILE = path.join(__dirname, "data.json");
if(!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({servers:{}, autoReplies:{}, prefixes:{}}));

// ======== DISCORD BOT SETUP ========
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once("ready", async () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  
  // Create giveaway emoji in all guilds if not exist
  client.guilds.cache.forEach(async guild => {
    if(!guild.emojis.cache.find(e => e.name === "giveaway0011")) {
      try {
        await guild.emojis.create({ attachment: "./giveaway.png", name: "giveaway0011" });
        console.log(`Created emoji in ${guild.name}`);
      } catch(e){ console.log(e); }
    }
  });
});

// ======== GIVEAWAY COMMAND ========
client.on("messageCreate", async message => {
  if(message.author.bot) return;

  // Load prefix
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  const prefix = data.prefixes[message.guild?.id] || "#";

  if(!message.content.startsWith(prefix)) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === "gstart") {
    if(args.length < 3) return message.reply("Usage: #gstart <duration> <winners> <prize>");
    const [duration, winnersCount, ...prizeArr] = args;
    const prize = prizeArr.join(" ");
    const emoji = client.emojis.cache.find(e => e.name === "giveaway0011");
    if(!emoji) return message.reply("Giveaway emoji missing!");

    const embed = new EmbedBuilder()
      .setTitle("🎉 GIVEAWAY 🎉")
      .addFields(
        { name: "Prize", value: `**${prize}**` },
        { name: "Ends at", value: `in ${duration}` },
        { name: "Hosted By", value: `<@${message.author.id}>` },
        { name: "Winners", value: `**${winnersCount}**` }
      )
      .setColor("Random");

    const giveawayMsg = await message.channel.send({ content: `${emoji}`, embeds: [embed] });
    await giveawayMsg.react(emoji);

    setTimeout(async () => {
      const fetched = await giveawayMsg.reactions.cache.get(emoji.id).users.fetch();
      const users = fetched.filter(u => !u.bot).map(u => u.id);
      const winners = [];
      for(let i=0;i<Math.min(winnersCount,users.length);i++){
        const choice = users[Math.floor(Math.random()*users.length)];
        winners.push(choice);
        users.splice(users.indexOf(choice),1);
      }
      message.channel.send(`The winners of this gif are: ${winners.map(id=>`<@${id}>`).join(" ")}`);
    }, parseDuration(duration));
  }
});

// ======== HELPER: parse duration like 1h, 2d ========
function parseDuration(str) {
  const num = parseInt(str);
  if(str.endsWith("s")) return num*1000;
  if(str.endsWith("m")) return num*60*1000;
  if(str.endsWith("h")) return num*60*60*1000;
  if(str.endsWith("d")) return num*24*60*60*1000;
  return num;
}

// ======== EXPRESS SITE ========
const app = express();
app.use(express.json());
app.use(express.static("public"));

// OAuth login redirect
app.get("/login", (req,res)=>{
  const url = `https://discord.com/api/oauth2/authorize?client_id=${OAUTH.CLIENT_ID}&redirect_uri=${encodeURIComponent(OAUTH.REDIRECT_URI)}&response_type=code&scope=${OAUTH.SCOPES.join("%20")}`;
  res.redirect(url);
});

// OAuth callback
app.get("/oauth/callback", async (req,res)=>{
  const code = req.query.code;
  if(!code) return res.send("No code provided");

  const params = new URLSearchParams({
    client_id: OAUTH.CLIENT_ID,
    client_secret: OAUTH.CLIENT_SECRET,
    grant_type: "authorization_code",
    code: code,
    redirect_uri: OAUTH.REDIRECT_URI,
    scope: OAUTH.SCOPES.join(" ")
  });

  const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
    method:"POST",
    body: params,
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  });
  const tokenData = await tokenRes.json();

  const userRes = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` }
  });
  const userData = await userRes.json();

  res.send(`<h1>Hello ${userData.username}</h1><img src="https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.png" width="100">`);
});

// ======== LOGIN BOT ========
client.login(BOT_TOKEN);

// ======== START EXPRESS ========
app.listen(PORT, ()=>console.log(`Website running at http://localhost:${PORT}`));