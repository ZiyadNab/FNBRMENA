const axios = require('axios')

module.exports = {
    commands: 'load',
    type: 'Fun',
    minArgs: null,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        axios.get(`https://fnbrmena.com/api/v1/dl?url=${text}`)

        // Send the generating message
        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Loading the... ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات... ${emojisObject.loadingEmoji}`)
        const msg = await message.reply({embeds: [generating], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })


    }
}
