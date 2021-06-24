const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'emote',
    expectedArgs: '[ Name of the emote ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request the emote video
        fortniteAPI.listItemsByName(itemName = text, options = {lang: lang})
        .then(async res => {

            //check if the user entered a valid emote name
            if(res.items.length > 0){
                
                //check if the emote has a video
                if(res.items[0].video !== null){

                    //send attatchment
                    const att = new Discord.MessageAttachment(res.items[0].video)

                    //send the emote video
                    message.channel.send(att)
                }else{

                    //create embed
                    const err = new Discord.MessageEmbed()

                    //add the color
                    err.setColor('#BB00EE')

                    //set the title
                    if(lang === "en"){
                        err.setTitle(`There is no video for this emote yet ${errorEmoji}`)
                    }else if(lang === "ar"){
                        err.setTitle(`لا يوجد فيديو للرقصة حاليا ${errorEmoji}`)
                    }

                    //send the error message
                    message.channel.send(err)
                }
            }else{
                if(lang === "en"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`No cosmetic has been found check your speling and try again ${errorEmoji}`)
                    message.reply(Err)
                }else if(lang === "ar"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                    message.reply(Err)
                }
            }

        }).catch(err => {

        })
    }
}