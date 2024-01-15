const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('fgen')
    .setDescription('Generate an Account.')
    .addStringOption(option => 
      option.setName('option')
        .setDescription('Choose a service.')
        .setRequired(true)
        .addChoice('STEAM', 'STEAM') // Add options here
    ),
  async execute(interaction) {
    const allowedChannelId = process.env.FGEN_CHANNEL_ID;
    
    // Check if the command is executed in the allowed channel
    if (interaction.channelId !== allowedChannelId) {
      return interaction.reply(`**You can only use this command in <#1184643668230025280> channel!**`);
    }

    const chosenOption = interaction.options.getString('option');
    const freeAccsFolder = path.join(__dirname, '../freeAccs');

    // Check if the folder freeAccs exists
    if (!fs.existsSync(freeAccsFolder)) {
      return interaction.reply('Folder "freeAccs" does not exist.');
    }

    // Load all .txt files from the folder freeAccs
    const txtFiles = fs.readdirSync(freeAccsFolder).filter(file => file.endsWith('.txt'));

    // Check if the option is valid
    if (!txtFiles.includes(`${chosenOption}.txt`)) {
      return interaction.reply('Invalid option. Please choose a valid option.');
    }

    // Load the content of the chosen option
    const filePath = path.join(freeAccsFolder, `${chosenOption}.txt`);
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

    // Check if the file is empty
    if (lines.length === 0) {
      return interaction.reply(`Service ${chosenOption} has no available accounts in stock!`);
    }

    // Choose a random line
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    // Create an embed
    const guildId = interaction.guildId;
    const guild = interaction.client.guilds.cache.get(guildId);
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('FR€E G3N€RATØR')
      .setDescription(`**Your ${chosenOption} Account**\n**Account:** ${randomLine}`)
      .setThumbnail(guild.iconURL({ dynamic: true }) || '')
      .setTimestamp();

    // Create an embed for the server
    const embed_server = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('FR€E G3N€RATOR')
      .setDescription(`${interaction.user.tag} **generated a** ${chosenOption} **Account!**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    // Send a message to the user's DM
    try {
      await interaction.user.send({ embeds: [embed] });
      // Send the embed on the server
      interaction.reply({ embeds: [embed_server] });
    } catch (error) {
      console.error(`Error sending DM: ${error.message}`);
      interaction.reply('An error occurred while sending the Account to DM. Please check if DMs are enabled!');
    }
  },
};
