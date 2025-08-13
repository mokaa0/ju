// server.js — Website (OAuth2 + Dashboard APIs). Same path. No dotenv.
const express = require("express");
const session = require("express-session");
const axios = require("axios");
const path = require("path");

// ======= CONFIG (edit these) =======
const CLIENT_ID = "YOUR_CLIENT_ID";
const CLIENT_SECRET = "YOUR_CLIENT_SECRET";
const CALLBACK_URL = "http://localhost:3000/callback"; // must match Developer Portal Redirect
const SESSION_SECRET = "S3ss!0n$ecr3t_7xq9Lr8z";
const API_KEY = "api_6f4b2c9a_rynTQp";        // must match bot's API key
const BOT_API_URL = "http://localhost:3000";  // if bot serves API on same port/process later
const PORT = 3000;
// ===================================

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Serve static files (index.html, dashboard.html) from same folder
app.use(express.static(path.join(__dirname)));

// ===== OAuth2 Login =====
app.get("/login", (req, res) => {
  const url =
    `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(CALLBACK_URL)}` +
    `&scope=identify%20email%20guilds%20guilds.members.read`;
  res.redirect(url);
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("No code provided");

  try {
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
        redirect_uri: CALLBACK_URL
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    req.session.access_token = tokenRes.data.access_token;
    res.redirect("/dashboard.html");
  } catch (err) {
    console.error("OAuth error:", err?.response?.data || err.message);
    res.status(500).send("OAuth failed");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => res.redirect("/"));
});

// ===== Session-based APIs =====
app.get("/api/me", async (req, res) => {
  try {
    if (!req.session.access_token) return res.json({ user: null });
    const me = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${req.session.access_token}` }
    });
    res.json({ user: me.data });
  } catch {
    res.json({ user: null });
  }
});

app.get("/api/servers", async (req, res) => {
  if (!req.session.access_token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const guildsRes = await axios.get("https://discord.com/api/users/@me/guilds", {
      headers: { Authorization: `Bearer ${req.session.access_token}` }
    });
    // admin only (bit 0x8)
    const adminGuilds = guildsRes.data.filter(g => (g.permissions & 0x8) === 0x8);
    res.json({ guilds: adminGuilds });
  } catch (e) {
    console.error("servers error:", e?.response?.data || e.message);
    res.status(500).json({ error: "Failed to fetch servers" });
  }
});

// Proxy settings to bot API
app.post("/api/update-settings", async (req, res) => {
  if (!req.session.access_token) return res.status(401).json({ error: "Unauthorized" });
  const { guildId, prefix, roleId, giveawayEmoji } = req.body || {};
  if (!guildId) return res.status(400).json({ error: "guildId is required" });

  try {
    await axios.post(`${BOT_API_URL}/update-settings`, { guildId, prefix, roleId, giveawayEmoji }, {
      headers: { "x-api-key": API_KEY }
    });
    res.json({ ok: true });
  } catch (e) {
    console.error("update-settings error:", e?.response?.data || e.message);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

app.listen(PORT, () => {
  console.log(`🌐 Website running at http://localhost:${PORT}`);
  console.log(`➡️  OAuth Redirect URL must be set to: ${CALLBACK_URL}`);
});