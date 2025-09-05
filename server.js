
          `\`<:admins1:1413619767646097428>  ${prefix}box\` - Claim a giveaway box`,
          `\`<:admins1:1413619767646097428>  ${prefix}gstart\` - Start a giveaway`,
          `\`<:admins1:1413619767646097428>  ${prefix}ban\` - ban a Member`,
          `\`<:admins1:1413619767646097428>  ${prefix}kick\` - kick a Member`,
          `\`<:admins1:1413619767646097428>  ${prefix}atlias\` - set shourt command`,
          `\`<:admins1:1413619767646097428>  ${prefix}greet\` - enable greet room`,
          `\`<:admins1:1413619767646097428>  ${prefix}unban\` - unban a Member`,
          `\`<:admins1:1413619767646097428>  ${prefix}credit\` - transfer credit` "public") {
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
