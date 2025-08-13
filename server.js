const express = require('express');
const axios = require('axios');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// إعدادات البوت
const BOT_IP = 'http://YOUR_BOT_IP'; // ضع هنا IP البوت
const BOT_PORT = 1818;

// Routes
app.get('/', (req, res) => {
    res.render('dashboard', { guilds: req.session.guilds || [] });
});

app.get('/guild/:guildId', (req, res) => {
    const guildId = req.params.guildId;
    const guildData = req.session.guildSettings ? req.session.guildSettings[guildId] : null;
    res.render('guild', { guildId, guildData });
});

app.post('/guild/:guildId/save', async (req, res) => {
    const guildId = req.params.guildId;
    const { prefix, giveawayEmoji, ownerRole } = req.body;

    try {
        const response = await axios.post(`${BOT_IP}:${BOT_PORT}/update-settings`, {
            guildId,
            prefix,
            giveawayEmoji,
            ownerRole
        });

        if (!req.session.guildSettings) req.session.guildSettings = {};
        req.session.guildSettings[guildId] = response.data.data;

        res.redirect(`/guild/${guildId}`);
    } catch (err) {
        console.error(err);
        res.send('Error connecting to the bot API');
    }
});

// Start server
app.listen(PORT, () => console.log(`Dashboard running on port ${PORT}`));