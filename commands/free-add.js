const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addfgen')
    .setDescription('Add an Account to the Generator.')
    .addStringOption(option =>
      option.setName('choose')
        .setDescription('Choose a service.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('add')
        .setDescription('Enter information in the format "account:password".')
        .setRequired(true)
    ),
  async execute(interaction) {
    // Check if the user has ADMINISTRATOR permission
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply('You do not have permission to use this command!');
    }

    const choose = interaction.options.getString('choose');
    const add = interaction.options.getString('add');

    // Check the format of the entered text
    const regex = /^[^:]+:[^:]+$/;
    if (!regex.test(add)) {
      return interaction.reply('Please enter text in the format "Account:Password".');
    }

    // Check if the .txt file exists
    const freeAccsFolder = path.join(__dirname, '../freeAccs');
    const txtFilePath = path.join(freeAccsFolder, `${choose}.txt`);

    if (!fs.existsSync(txtFilePath)) {
      return interaction.reply('This category does not exist. Create it using /createbgen');
    }

    // Load the content of the .txt file
    let existingText = fs.readFileSync(txtFilePath, 'utf-8');

    // Check if the text is already in the file
    if (existingText.includes(add)) {
      return interaction.reply('This Account is already in stock!');
    }

    // Add new text
    existingText += '\n' + add;

    // Write the modified text to the .txt file
    fs.writeFileSync(txtFilePath, existingText);

    // Create an embed
    const NotifyEmoji = process.env.NOTIFY_EMOJI_ID
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('FR€E G3N€RATØR')
      .setDescription(`**${NotifyEmoji} A new ${choose} Account has been added to the stock! \n Account Name: __${add.split(':')[0]}__. \n To check the stock, type "/stock"**`)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true }) || '')
      .setTimestamp();

    // Send the embed message on the server
    interaction.reply({ embeds: [embed] });
  },
};
