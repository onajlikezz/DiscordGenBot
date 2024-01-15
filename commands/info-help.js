// help.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands.'),
  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('⠀⠀⠀⠀⠀⠀⠀⠀⠀HELP & COMMANDS INFO')
      .setDescription('**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀FUN COMMANDS**\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀/av**\n⠀Displays the avatar of the user or another user if tagged.\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀GENERATOR COMMANDS**\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀/fgen**\n⠀⠀⠀⠀⠀Command for using the Free Generator.\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀/vgen**\n⠀⠀⠀⠀⠀⠀⠀Command for using the VIP Generator.\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀/bgen**\n⠀⠀⠀⠀⠀Command for using the BOOSTER Generator.\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀MODERATION COMMANDS**\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀/clear**\nThis command is used to delete a specific part of the channel.\n\n**⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀ ⠀⠀⠀/ban**\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀Bans a user from the server.')
      .setFooter('');

    await interaction.reply({ embeds: [embed] });
  },
};
