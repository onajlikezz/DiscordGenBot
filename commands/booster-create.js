const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createbgen')
    .setDescription('Adds a new stock to BØO$TER$ G3N€RATØR.')
    .addStringOption(option => 
      option.setName('add')
        .setDescription('Enter name of Stock.')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has ADMINISTRATOR permission
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const textInput = interaction.options.getString('add');
    const boosterAccsFolder = path.join(__dirname, '../boosterAccs');

    // Check if the "boosterAccs" folder exists
    if (!fs.existsSync(boosterAccsFolder)) {
      fs.mkdirSync(boosterAccsFolder);
    }

    // Convert text to uppercase if it is not already in CAPSLOCK
    const processedText = textInput === textInput.toUpperCase() ? textInput : textInput.toUpperCase();
    const TestEmbed = textInput.toUpperCase();

    // Remove spaces and special characters from the text for the file name
    const fileName = processedText.replace(/[^a-zA-Z0-9]/g, '') + '.txt';
    const filePath = path.join(boosterAccsFolder, fileName);
    fs.writeFileSync(filePath, '');

    // Create an embed
    const NotifyEmoji = process.env.NOTIFY_EMOJI_ID
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('BØO$TER$ G3N€RATØR')
      .setDescription(`**${NotifyEmoji} ${TestEmbed} category has been successfully added**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    // Send the embed message on the server
    interaction.reply({ embeds: [embed] });
  },
};
