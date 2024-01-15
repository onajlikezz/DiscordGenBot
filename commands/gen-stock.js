const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stock')
    .setDescription('Displays all files from the boosterAccs directory and the number of lines of code in each of them.'),
  async execute(interaction) {
    const boosterAccsFolder = path.join(__dirname, '../boosterAccs');
    const freeAccsFolder = path.join(__dirname, '../freeAccs');
    const vipAccsFolder = path.join(__dirname, '../vipAccs');

    // Check if the boosterAccs folder exists
    if (!fs.existsSync(boosterAccsFolder)) {
      return interaction.reply('Booster Account Directory not found!');
    }

    // Check if the freeAccs folder exists
    if (!fs.existsSync(freeAccsFolder)) {
      return interaction.reply('Free Account Directory not found!');
    }

    // Check if the vipAccs folder exists
    if (!fs.existsSync(vipAccsFolder)) {
      return interaction.reply('VIP Account Directory not found!');
    }

    // Load all .txt files from the boosterAccs, freeAccs, and vipAccs folders
    const boosttxtFiles = fs.readdirSync(boosterAccsFolder).filter(file => file.endsWith('.txt'));
    const freetxtFiles = fs.readdirSync(freeAccsFolder).filter(file => file.endsWith('.txt'));
    const viptxtFiles = fs.readdirSync(vipAccsFolder).filter(file => file.endsWith('.txt'));

    // Check if there are .txt files in Booster Gen
    if (boosttxtFiles.length === 0) {
      return interaction.reply('Currently no Booster Accounts!');
    }

    // Check if there are .txt files in Free Gen
    if (freetxtFiles.length === 0) {
      return interaction.reply('Currently no Free Accounts!');
    }

    // Check if there are .txt files in VIP Gen
    if (viptxtFiles.length === 0) {
      return interaction.reply('Currently no VIP Accounts!');
    }

    // Format files and number of lines of code in Booster Gen
    const formattedFiles = boosttxtFiles.map(txtFile => {
      const filePath = path.join(boosterAccsFolder, txtFile);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const lines = fileContent.split('\n').filter(Boolean);
      return `**${txtFile.replace('.txt', '')} ---> __${lines.length}__ Account's**`;
    });

    // Format files and number of lines of code in Free Gen
    const fformattedFiles = freetxtFiles.map(txtFile => {
      const ffilePath = path.join(freeAccsFolder, txtFile);
      const ffileContent = fs.readFileSync(ffilePath, 'utf-8');
      const flines = ffileContent.split('\n').filter(Boolean);
      return `**${txtFile.replace('.txt', '')} ---> __${flines.length}__ Account's**`;
    });

    // Format files and number of lines of code in VIP Gen
    const vformattedFiles = viptxtFiles.map(txtFile => {
      const vfilePath = path.join(vipAccsFolder, txtFile);
      const vfileContent = fs.readFileSync(vfilePath, 'utf-8');
      const vlines = vfileContent.split('\n').filter(Boolean);
      return `**${txtFile.replace('.txt', '')} ---> __${vlines.length}__ Account's**`;
    });

    // Create an embed
    const BoosterEmoji = process.env.BOOSTER_EMOJI_ID;
    const VipEmoji = process.env.VIP_EMOJI_ID;
    const FreeEmoji = process.env.FREE_EMOJI_ID;
    const guildId = interaction.guildId;
    const guild = interaction.client.guilds.cache.get(guildId);
    
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('GENERATOR STOCK')
      .setDescription('')
      .addField(`⠀**${FreeEmoji} IN FREE STOCK:**`, fformattedFiles.join('\n'))
      .addField(`⠀**${VipEmoji} IN VIP STOCK:**`, vformattedFiles.join('\n'))
      .addField(`⠀**${BoosterEmoji} IN BOOSTER STOCK:**`, formattedFiles.join('\n'))
      .setThumbnail(guild.iconURL({ dynamic: true }) || '')
      .setTimestamp();
    

    // Send the embed to the server
    interaction.reply({ embeds: [embed] });
  },
};
