const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loademoji')
    .setDescription('Add emojis from a specific folder.'),
  async execute(interaction) {
    const emojiFolder = './emojies'; // Change the path to your emoji folder

    const emojiFiles = fs.readdirSync(emojiFolder).filter(file => /\.(png|jpe?g|gif)$/i.test(file));

    const addedEmoji = [];
    const existingEmoji = [];

    for (const emojiFile of emojiFiles) {
      const emojiName = emojiFile.split('.')[0];

      // Check if an emoji with the same name already exists
      const existingEmojiInGuild = interaction.guild.emojis.cache.find(emoji => emoji.name === emojiName);

      if (existingEmojiInGuild) {
        existingEmoji.push({
          name: emojiName,
          id: existingEmojiInGuild.id
        });
      } else {
        // Add the emoji to the guild
        try {
          const emojiData = await interaction.guild.emojis.create(`./emojies/${emojiFile}`, emojiName);
          addedEmoji.push({
            name: emojiName,
            id: emojiData.id
          });
        } catch (error) {
          console.error(`Error creating emoji: ${emojiName}`, error);
        }
      }
    }

    let responseMessage = 'Emojis were successfully added:\n';

    if (addedEmoji.length > 0) {
      responseMessage += `Added emojis:\n${addedEmoji.map(emoji => `<a:${emoji.name}:${emoji.id}> ➪ \`${'<a:' + emoji.name + ':' + emoji.id + '>`'}`).join('\n')}\n`;
    }

    if (existingEmoji.length > 0) {
      responseMessage += `Existing emojis:\n${existingEmoji.map(emoji => `<a:${emoji.name}:${emoji.id}> ➪ \`${'<a:' + emoji.name + ':' + emoji.id + '>`'}`).join('\n')}\n`;
    }

    const embed = new MessageEmbed()
      .setTitle('Load Emoji')
      .setDescription(responseMessage)
      .setColor('#0099ff');

    await interaction.reply({ embeds: [embed] });
  },
};
