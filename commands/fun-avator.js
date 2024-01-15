const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, User } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('av')
    .setDescription('Display the user\'s avatar.')
    .addUserOption(option => option
      .setName('user')
      .setDescription('User whose avatar you want to display.')),

  async execute(interaction) {
    let user;

    // Check if the user is specified as an option
    const userOption = interaction.options.getUser('user');
    if (userOption) {
      user = userOption;
    } else {
      // If the user is not specified, use the command author
      user = interaction.user;
    }

    const avatarURL = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(`${user.tag}'s Avatar`)
      .setImage(avatarURL)
      .setTimestamp()
      .setFooter('');

    await interaction.reply({ embeds: [embed] });
  },
};
