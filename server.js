const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');

// Read tokens from file
const tokens = fs.readFileSync('tokens.txt', 'utf-8')
    .split('\n')
    .map(token => token.trim())
    .filter(token => token);

// Trigger words to look for
const triggerWords = ['@everyone', '@here', 'share', 'post'];

const clients = [];

// Function to create and run each client
function createClient(token) {
    const client = new Client();

    client.on('ready', () => {
        console.log(`${client.user.tag} is now online`);
    });

    client.on('messageCreate', async (message) => {
        // Ignore messages sent by the bot itself
        if (message.author.id === client.user.id) return;

        // Check if message contains any trigger words
        const containsTrigger = triggerWords.some(word => message.content.includes(word));

        if (containsTrigger) {
            // Check if message already has reactions
            if (message.reactions.cache.size > 0) {
                try {
                    // Get the first existing reaction
                    const existingReaction = message.reactions.cache.first();
                    
                    // Add our reaction to the existing one
                    await existingReaction.users.fetch();
                    if (!existingReaction.users.cache.has(client.user.id)) {
                        await existingReaction.react();
                        console.log(`${client.user.tag} added to existing reaction in #${message.channel.name}`);
                    }
                } catch (error) {
                    console.error(`Error adding to reaction with ${client.user.tag}:`, error.message);
                }
            }
        }
    });

    // Login with token
    client.login(token).catch(error => {
        console.error('Login failed for token:', error.message);
    });

    clients.push(client);
}

// Start all accounts
console.log('Starting Discord accounts...');
tokens.forEach(token => {
    createClient(token);
});

// Handle app shutdown
process.on('SIGINT', () => {
    console.log('Shutting down clients...');
    clients.forEach(client => client.destroy());
    process.exit();
});