module.exports = {
    commands: 'social',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        const exampleEmbed = new Discord.EmbedBuilder()
        .setColor(FNBRMENA.Colors("embed"))
        .setTitle('Social Media')
        .addFields(
            {name: 'Twitter', value: 'https://twitter.com/FNBRMENA'},
            {name: 'TikTok', value: 'https://www.tiktok.com/@fnbrmena'}
        )
        .setDescription('Thank You For Following Me (=')
        .setFooter({text: 'Generated By FNBRMENA Bot'})
        .setAuthor({name: 'FNBRMENA Bot', iconURL: 'https://i.ibb.co/xXVZYQZ/LfotEkZ.jpg', url: 'https://twitter.com/FNBRMENA'})
        message.reply({embeds: [exampleEmbed], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    },
}