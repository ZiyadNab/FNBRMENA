const error = require('../Errors')

module.exports = {
    commands: 'social',
    expectedArgs: '<Social>',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        const exampleEmbed = new Discord.MessageEmbed()
        .setColor('#BB00EE')
        .setTitle('Social Media')
        .addFields(
            {name: 'Twitter', value: 'https://twitter.com/FNBRMENA'},
            {name: 'TikTok', value: 'https://www.tiktok.com/@fnbrmena'}
        )
        .setDescription('Thank You For Following Me (=')
        .setFooter('Generated By FNBRMENA Bot')
        .setAuthor('FNBRMENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBRMENA')
        message.reply(exampleEmbed);
    },
}