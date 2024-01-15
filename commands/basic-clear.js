const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Clear messages from the channel.')
    .addIntegerOption(option => option.setName('amount').setDescription('Number of messages to clear')),
  async execute(interaction) {
    // Check user permissions
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
        !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
      return interaction.reply('You do not have permission to use this command.'); // TF YOU DOING HERE !?!?!?!?!
    }

    // Get the number of messages to delete
    const amount = interaction.options.getInteger('amount') || 100;

    // Check if the number of messages is within limits (1-100)
    if (amount < 1 || amount > 100) {
      return interaction.reply('Please choose a number of messages between 1 and 100.');
    }

    // Delete messages
    const messages = await interaction.channel.bulkDelete(amount, true);
    const NotifyEmoji = process.env.NOTIFY_EMOJI_ID;
    const BotName = process.env.BOT_NAME;

    // Wait for 1 second
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Send an Embed message with information about the number of deleted messages
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('CHAT CLEAR')
      .setDescription(`${NotifyEmoji} ${interaction.user.tag} cleared ${messages.size} messages.`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || '');

    interaction.reply({ embeds: [embed] });
  },
};
