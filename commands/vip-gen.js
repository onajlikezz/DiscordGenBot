const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vgen')
    .setDescription('Generate an Account.')
    .addStringOption(option => 
      option.setName('option')
        .setDescription('Choose the service.')
        .setRequired(true)
        .addChoice('STEAM', 'STEAM') // Add options here
    ),
  async execute(interaction) {
    const allowedChannelId = process.env.VGEN_CHANNEL_ID;
    
    // Check if the command is executed in the allowed channel
    if (interaction.channelId !== allowedChannelId) {
      return interaction.reply('**You can only use this command in <#1184643439141343242> channel!**');
    }

    const option = interaction.options.getString('option');
    const vipAccsFolder = path.join(__dirname, '../vipAccs');

    // Check if the vipAccs folder exists
    if (!fs.existsSync(vipAccsFolder)) {
      return interaction.reply('Folder "vipAccs" does not exist.');
    }

    // Load all .txt files from the vipAccs folder
    const txtFiles = fs.readdirSync(vipAccsFolder).filter(file => file.endsWith('.txt'));

    // Check if the option is valid
    if (!txtFiles.includes(`${option}.txt`)) {
      return interaction.reply('Invalid option. Please choose a valid option.');
    }

    // Load the content of the chosen option
    const filePath = path.join(vipAccsFolder, `${option}.txt`);
    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').filter(Boolean);

    // Check if the file is empty
    if (lines.length === 0) {
      return interaction.reply(`The ${option} service has no available accounts!`);
    }

    // Choose a random line
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    // Create an embed
    const guildId = interaction.guildId;
    const guild = interaction.client.guilds.cache.get(guildId);
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('𝒱IP G3N€RATØR')
      .setDescription(`**Your ${option} Account**\n**Account:** ${randomLine}`)
      .setThumbnail(guild.iconURL({ dynamic: true }) || '')
      .setTimestamp();

    // Create an embed for the server
    const embed_server = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('𝒱IP G3N€RATOR')
      .setDescription(`${interaction.user.tag} **generated a** ${option} **Account!**`)
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    // Send a message to the user's DM
    try {
      await interaction.user.send({ embeds: [embed] });
      // Send the embed on the server
      interaction.reply({ embeds: [embed_server] });
    } catch (error) {
      console.error(`Error sending DM: ${error.message}`);
      interaction.reply('An error occurred while sending the Account to DM, please check if DMs are enabled.');
    }
  },
};
