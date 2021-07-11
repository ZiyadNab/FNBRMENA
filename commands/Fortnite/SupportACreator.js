const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortnite-api-com");
const config = {
  apikey: FNBRMENA.APIKeys("FortniteAPI.com"),
  language: "en",
  debug: true
};
var f;

var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'sac',
    expectedArgs: '[ Name of the SAC ]',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data
        Fortnite.CreatorCodeSearch(text)
        .then( async res => {

            //create embed
            const info = new Discord.MessageEmbed()

            //set color
            info.setColor(FNBRMENA.Colors("embed"))

            //inisilize str
            var str = ""

            //is the user language is english
            if(lang === "en"){
                info.setTitle(`Info about ${text} SAC`)
                str = `• Name: ${res.data.account.name}\n• ID: ${res.data.account.id}\n• Code: ${res.data.code}\n• Status: ${res.data.status}`
            }else

            //is the user language is arabic
            if(lang === "ar"){
                info.setTitle(`معلومات عن كود ${text}`)
                str = `• الآسم: ${res.data.account.name}\n• الآيدي: ${res.data.account.id}\n• الكود: ${res.data.code}\n• حالة الكود: ${res.data.status}`
            }

            //set description
            info.setDescription(str)

            //send the message
            message.channel.send(info)

            }).catch(err => {

                //no emote has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`There is no creator code with this name ${text} ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يوجد كود بالأسم ${text} ${errorEmoji}`)
                message.channel.send(Err)

        })
    }
}