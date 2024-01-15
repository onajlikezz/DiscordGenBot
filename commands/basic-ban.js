const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .addUserOption(option =>
      option.setName('user') // DONT STEAL MY CODE NIGGA!!
        .setDescription('User you want to ban.') // 8============D
        .setRequired(true)
    ),

  execute: async (interaction) => {
    try {
      // Check if the user has permission to ban
      if (!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS) && !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        return interaction.reply('You do not have permission to use this command.');
      }

      const userToBan = interaction.options.getMember('user');

      // Check if the user is valid
      if (!userToBan) {
        return interaction.reply('Please specify a valid user to ban.');
      }

      // Check if the user's role is lower than the role of the user you want to ban
      if (interaction.member.roles.highest.comparePositionTo(userToBan.roles.highest) <= 0) {
        return interaction.reply('You do not have permission to ban users with equal or higher roles than yours.');
      }

      // Ban the user
      await interaction.guild.members.ban(userToBan);

      // Get the total number of banned users
      const banList = await interaction.guild.bans.fetch();
      const totalBans = banList.size;
      const BanEmoji = process.env.BAN_EMOJI_ID;
      const WarningEmoji = process.env.WARNING_EMOJI_ID;
      const BotName = process.env.BOT_NAME;

      // Create and send an embed message
      const embed = new MessageEmbed()
        .setColor('#0099ff')
        .setTitle('BAN')
        .setDescription(`**${BanEmoji} ${userToBan.user.tag} has been banned from the server. \n ${WarningEmoji} Total banned people: ${totalBans}.**`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || '');

      return interaction.reply({ embeds: [embed] });

    } catch (error) {
      console.error(error);
      return interaction.reply('An error occurred while processing your request.');
    }
  },
};
