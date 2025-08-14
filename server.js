import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import fs from "fs";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("."));

const PORT = 3000;
const TOKEN = "YOUR_BOT_TOKEN_HERE"; // ضع توكن البوت هنا
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

let data = JSON.parse(fs.readFileSync("./data.json", "utf8"));

// ---- Discord Bot ----
client.on("ready", async () => {
  console.log(`${client.user.tag} is online`);
});

client.on("messageCreate", async msg => {
  if(msg.author.bot) return;
  const serverData = data.servers[msg.guildId];
  const prefix = data.prefixes[msg.guildId] || "#";

  // Auto replies
  if(data.autoReplies[msg.guildId]){
    for(const ar of data.autoReplies[msg.guildId]){
      if(msg.content.toLowerCase() === ar.short.toLowerCase()){
        msg.reply(ar.reply);
      }
    }
  }

  if(!msg.content.startsWith(prefix)) return;
  const args = msg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if(command === "gstart"){
    let duration = args[0] || "1h";
    let winnerCount = parseInt(args[1]) || 1;
    let prize = args.slice(2).join(" ") || "Prize";

    const embed = new EmbedBuilder()
      .setTitle("🎉 GIVEAWAY 🎉")
      .addFields(
        { name: "Prize", value: `**${prize}**` },
        { name: "Ends at", value: `in ${duration}` },
        { name: "Hosted By", value: `<@${msg.author.id}>` },
        { name: "Winners", value: `**${winnerCount}**` }
      )
      .setColor("Random");

    const gMessage = await msg.channel.send({ embeds:[embed] });
    await gMessage.react("🎉");

    setTimeout(async () => {
      const users = await gMessage.reactions.cache.get("🎉").users.fetch();
      const winners = Array.from(users.values())
        .filter(u => !u.bot)
        .sort(()=>0.5-Math.random())
        .slice(0,winnerCount);
      msg.channel.send(`The winners of this gif are: ${winners.map(u=>`<@${u.id}>`).join(" ")}`);
    }, parseDuration(duration));
  }
});

function parseDuration(duration){
  const match = duration.match(/(\d+)([smhd])/);
  if(!match) return 60000;
  const n = parseInt(match[1]);
  const unit = match[2];
  switch(unit){
    case "s": return n*1000;
    case "m": return n*60*1000;
    case "h": return n*60*60*1000;
    case "d": return n*24*60*60*1000;
    default: return 60000;
  }
}

// ---- Express API ----
app.get("/api/servers", (req,res)=>{
  const guilds = client.guilds.cache.map(g=>({id:g.id,name:g.name}));
  res.json(guilds);
});

app.post("/api/saveSettings", (req,res)=>{
  const { serverId, prefix, accessRole, autoReplies } = req.body;
  data.prefixes[serverId] = prefix;
  data.servers[serverId] = { accessRole };
  data.autoReplies[serverId] = autoReplies;
  fs.writeFileSync("./data.json", JSON.stringify(data, null,2));
  res.json({ success:true });
});

client.login(TOKEN);
app.listen(PORT, ()=>console.log(`Server running on http://localhost:${PORT}`));