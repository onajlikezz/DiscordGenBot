const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('createvgen')
    .setDescription('Converts text into a .txt file and places it in the vipAccs folder.')
    .addStringOption(option => 
      option.setName('add')
        .setDescription('Enter the text you want to convert.')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has ADMINISTRATOR permission
    if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return interaction.reply('You do not have permission to use this command.');
    }

    const textInput = interaction.options.getString('add');
    const vipAccsFolder = path.join(__dirname, '../vipAccs');

    // Check if the "vipAccs" folder exists
    if (!fs.existsSync(vipAccsFolder)) {
      fs.mkdirSync(vipAccsFolder);
    }

    // Convert text to uppercase if not in CAPSLOCK
    const processedText = textInput === textInput.toUpperCase() ? textInput : textInput.toUpperCase();
    const TestEmbeda = textInput.toUpperCase();

    // Remove spaces and special characters from the text for the file name
    const fileName = processedText.replace(/[^a-zA-Z0-9]/g, '') + '.txt';
    const filePath = path.join(vipAccsFolder, fileName);
    fs.writeFileSync(filePath, '');

    // Create an embed
    const NotifyEmoji = process.env.NOTIFY_EMOJI_ID
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('𝒱IP G3N€RATØR')
      .setDescription(`**${NotifyEmoji} ${TestEmbeda} category added successfully**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    // Send the embed message to the server
    interaction.reply({ embeds: [embed] });
  },
};
