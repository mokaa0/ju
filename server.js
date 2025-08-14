const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('cookie-session');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { Client, GatewayIntentBits, Partials, EmbedBuilder } = require('discord.js');

// =====================
// المتغيرات مباشرة
const DISCORD_TOKEN = "ضع_توكن_البوت_هنا";
const DISCORD_CLIENT_ID = "ضع_كلينت_آيدي_هنا";
const DISCORD_CLIENT_SECRET = "ضع_كلينت_سكرت_هنا";
const OAUTH_REDIRECT_URI = "http://localhost:3000/auth/callback";
const GEMINI_API_KEY = "ضع_مفتاح_Gemini_2_0_Flash_هنا";
const PORT = 3000;

// =====================
// إعدادات السيرفرات
const SETTINGS_FILE = path.join(__dirname,'settings.json');
let SETTINGS = {};
try { SETTINGS = JSON.parse(fs.readFileSync(SETTINGS_FILE,'utf8')); } catch { SETTINGS={}; }
function saveSettings(){ fs.writeFileSync(SETTINGS_FILE, JSON.stringify(SETTINGS,null,2)); }
function defaultGuildSettings(gid){
  if(!SETTINGS[gid]) SETTINGS[gid] = { embedColor:'#000000', aiChannelId:null };
  return SETTINGS[gid];
}

// =====================
// بوت ديسكورد
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
  partials:[Partials.Channel]
});

async function askGemini(prompt){
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      contents:[{role:'user', parts:[{text:prompt}]}],
      generationConfig:{temperature:0.7, topK:40, topP:0.9, maxOutputTokens:800}
    })
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map(p=>p.text).join('\n')||'تعذر توليد رد';
}

function buildAIEmbed(gid, author, prompt, answer){
  const { embedColor } = defaultGuildSettings(gid);
  return new EmbedBuilder()
    .setColor(parseInt(embedColor.replace('#',''),16))
    .setAuthor({ name: author })
    .setDescription(answer.slice(0,4096))
    .setFooter({ text:'Front AI • Gemini 2.0 Flash' })
    .setTimestamp();
}

// الرد على روم AI فقط
client.on('messageCreate', async msg=>{
  if(msg.author.bot || !msg.guild) return;
  const gset = defaultGuildSettings(msg.guild.id);
  if(!gset.aiChannelId || msg.channel.id!==gset.aiChannelId) return;
  try{
    await msg.channel.sendTyping();
    const reply = await askGemini(msg.content);
    await msg.reply({ embeds:[buildAIEmbed(msg.guild.id, msg.author.username, msg.content, reply)] });
  }catch(e){ console.error(e); }
});

client.once('ready', ()=>console.log(`🤖 البوت جاهز: ${client.user.tag}`));
client.login(DISCORD_TOKEN);

// =====================
// خادم ويب
const app = express();
app.use(session({ name:'frontai_sess', keys:['frontai_secret'], maxAge:1000*60*60*24*7 }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'web')));

// OAuth2 callback
app.get('/auth/callback', async (req,res)=>{
  const code = req.query.code;
  if(!code) return res.redirect('/');
  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    client_secret: DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: OAUTH_REDIRECT_URI,
    scope: 'identify email guilds'
  });
  const tokenRes = await fetch('https://discord.com/api/oauth2/token',{
    method:'POST',
    body: params,
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
  });
  const data = await tokenRes.json();
  req.session.token = data.access_token;
  res.redirect('/dashboard.html');
});

// API لجلب السيرفرات التي لديك فيها Admin
app.get('/api/guilds', async (req,res)=>{
  if(!req.session.token) return res.status(401).json({error:'Unauthorized'});
  const guildsRes = await fetch('https://discord.com/api/users/@me/guilds',{
    headers:{Authorization:`Bearer ${req.session.token}`}
  });
  const guilds = await guildsRes.json();
  const filtered = guilds.filter(g=> (g.permissions & 0x8) !==0 );
  res.json(filtered);
});

// API لجلب رومات السيرفر
app.get('/api/channels/:guildId', async (req,res)=>{
  const gid = req.params.guildId;
  if(!client.guilds.cache.has(gid)) return res.json([]);
  const guild = client.guilds.cache.get(gid);
  const channels = guild.channels.cache.filter(c=>c.type===0); // 0 = Text
  res.json(channels.map(c=>({id:c.id,name:c.name})));
});

// API لحفظ الإعدادات
app.post('/api/save', async (req,res)=>{
  const { guildId, aiChannelId, embedColor } = req.body;
  if(!guildId) return res.status(400).json({error:'Missing guildId'});
  SETTINGS[guildId] = { aiChannelId, embedColor };
  saveSettings();
  res.json({success:true});
});

app.listen(PORT, ()=>console.log(`🌐 موقع Front AI يعمل على http://localhost:${PORT}`));