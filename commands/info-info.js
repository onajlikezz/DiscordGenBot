const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const os = require('os');
const { formatDistanceStrict } = require('date-fns');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays information about the bot.'),

  async execute(interaction) {
    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Bot and Server Information')
      .addField('Total RAM', `${Math.round(os.totalmem() / 1024 / 1024)} MB`, true)
      .addField('RAM in Use', `${Math.round((os.totalmem() - os.freemem()) / 1024 / 1024)} MB`, true)
      .addField('CPU Usage Percentage', `${(await cpuUsage()).toFixed(2)}%`, true)
      .addField('Bot Online', `Uptime: ${formatUptime()}`, true);

    await interaction.reply({ embeds: [embed] });
  },
};

// Function to format bot uptime
function formatUptime() {
  const uptime = process.uptime();
  return formatDistanceStrict(0, uptime * 1000, { addSuffix: true });
}

// Function to get CPU usage information
async function cpuUsage() {
  return new Promise((resolve) => {
    const startUsage = process.cpuUsage();
    setTimeout(() => {
      const endUsage = process.cpuUsage(startUsage);
      const totalUsage = (endUsage.user + endUsage.system) / 1000000;
      resolve(totalUsage);
    }, 100);
  });
}
