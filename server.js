const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require("discord.js");
const { getGuildSettings } = require("../utils/settings");

module.exports = {
  name: "help",
  description: "Show help",
  async execute(message, args) {
    const { embedColor, prefix } = getGuildSettings(message.guild.id, { prefix: "#", embedColor: "#000000" });
    const color = embedColor ? parseInt(embedColor.replace("#", ""), 16) : 0x000000;

    // Initial Embed
    const embed = new EmbedBuilder()
      .setColor(color)
      .setDescription(
        "**Choose from below the directory whose commands you want to know so that the aimpad does not make mistakes in advance and know all the commands in this section. Please do not press a lot. I wish you a happy time with the bot. <:public1:1413619815351849050>**"
      );

    // Select menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("help_select_menu")
      .setPlaceholder("Select a command category")
      .addOptions([
        {
          label: "Admins Command",
          value: "admins",
          description: "Show all admin commands",
          emoji: "<:admins1:1413619767646097428>"
        },
        {
          label: "Public Commands",
          value: "public",
          description: "Show all public commands",
          emoji: "<:public1:1413619815351849050>"
        }
      ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    const helpMessage = await message.channel.send({ embeds: [embed], components: [row] });

    // Collector to handle selection
    const collector = helpMessage.createMessageComponentCollector({ componentType: 'STRING_SELECT', time: 120000 });

    collector.on('collect', i => {
      if (i.user.id !== message.author.id) return i.reply({ content: "❌ This is not for you.", ephemeral: true });

      let desc = "";
      if (i.values[0] === "admins") {
        desc = [
          `\`<:admins1:1413619767646097428>  ${prefix}box\` - Claim a giveaway box`,
          `\`<:admins1:1413619767646097428>  ${prefix}gstart\` - Start a giveaway`,
          `\`<:admins1:1413619767646097428>  ${prefix}ban\` - ban a Member`,
          `\`<:admins1:1413619767646097428>  ${prefix}kick\` - kick a Member`,
          `\`<:admins1:1413619767646097428>  ${prefix}atlias\` - set shourt command`,
          `\`<:admins1:1413619767646097428>  ${prefix}greet\` - enable greet room`,
          `\`<:admins1:1413619767646097428>  ${prefix}unban\` - unban a Member`,
          `\`<:admins1:1413619767646097428>  ${prefix}credit\` - transfer credit`,
          `\`<:admins1:1413619767646097428>  ${prefix}lock\` - lock a channel`,
          `\`<:admins1:1413619767646097428>  ${prefix}unlock\` - unlock a channel`,
          `\`<:admins1:1413619767646097428>  ${prefix}show\` - show a channel`,
          `\`<:admins1:1413619767646097428>  ${prefix}hide\` - hide a channel`,
          `\`<:admins1:1413619767646097428>  ${prefix}warn\` - warn a member`,
          `\`<:admins1:1413619767646097428>  ${prefix}warns\` - show warns member`,
          `\`<:admins1:1413619767646097428>  ${prefix}premissions\` - select premissions command`
        ].join('\n');
      } else if (i.values[0] === "public") {
        desc = [
          `\`<:public1:1413619815351849050>  ${prefix}help\` - Show this help message`,
          `\`<:public1:1413619815351849050>  ${prefix}banner\` - Show a banner`,
          `\`<:public1:1413619815351849050>  ${prefix}avatar\` - Show a avatar`,
          `\`<:public1:1413619815351849050>  ${prefix}daily\` - claim a daily`,
          `\`<:public1:1413619815351849050>  ${prefix}credit\` - transfer credit`
        ].join('\n');
      }

      const newEmbed = new EmbedBuilder()
        .setColor(color)
        .setDescription(desc);

      i.update({ embeds: [newEmbed], components: [row] });
    });

    collector.on('end', () => {
      // Disable the select menu after timeout
      const disabledRow = new ActionRowBuilder().addComponents(selectMenu.setDisabled(true));
      helpMessage.edit({ components: [disabledRow] }).catch(()=>{});
    });
  }
};