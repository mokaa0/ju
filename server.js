const express = require('express');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const OAuth2 = require('discord-oauth2');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

// MongoDB
const MONGO_URI = 'mongodb+srv://fahddhom44:eKY6tbkr0lq78Ueu@astro.pplzxcy.mongodb.net/?retryWrites=true&w=majority&appName=astro';
let db, guildSettings;
MongoClient.connect(MONGO_URI).then(client => {
    db = client.db('discord_bot');
    guildSettings = db.collection('guild_settings');
    console.log('✅ MongoDB Connected');
});

// Discord OAuth2
const oauth = new OAuth2();
const CLIENT_ID = 'ضع هنا Client ID';
const CLIENT_SECRET = 'ضع هنا Client Secret';
const REDIRECT_URI = 'https://astrog.xo.je/callback'; // رابط موقعك النهائي

// صفحات
app.get('/', (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    res.render('views', { user: req.session.user, guilds: req.session.guilds });
});

app.get('/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    res.redirect(url);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenData = await oauth.tokenRequest({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        code,
        scope: 'identify guilds',
        grantType: 'authorization_code',
        redirectUri: REDIRECT_URI
    });
    const user = await oauth.getUser(tokenData.access_token);
    const guildsRaw = await oauth.getUserGuilds(tokenData.access_token);

    // اختيارات: عرض فقط السيرفرات التي لديه فيها ادمن
    const guilds = guildsRaw.filter(g => (g.permissions & 0x8) === 0x8); 

    req.session.user = user;
    req.session.guilds = guilds;
    res.redirect('/');
});

// تحديث البريفكس والإيموجي
app.post('/update', async (req, res) => {
    const { guildId, prefix, giveawayEmoji } = req.body;
    await guildSettings.updateOne(
        { guildId },
        { $set: { prefix, giveawayEmoji } },
        { upsert: true }
    );
    res.redirect('/');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));