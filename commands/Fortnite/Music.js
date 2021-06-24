const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'music',
    expectedArgs: '[ Name of the music pack ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request the emote video
        FNBRMENA.SearchByType(lang, text, 'music')
        .then(async res => {

            //check if the user entered a valid emote name
            if(res.data.items.length > 0){
                
                if(res.data.items[0].type.id === 'music'){

                    //check if the emote has a video
                    if(res.data.items[0].audio !== null){

                        //send attatchment
                        const att = new Discord.MessageAttachment(res.data.items[0].audio)

                        //send the emote video
                        message.channel.send(att)
                    }else{

                        //create embed
                        const err = new Discord.MessageEmbed()

                        //add the color
                        err.setColor('#BB00EE')

                        //set the title
                        if(lang === "en"){
                            err.setTitle(`There is no mp3 file for this music pack yet ${errorEmoji}`)
                        }else if(lang === "ar"){
                            err.setTitle(`لا يوجد ملف صوت ${errorEmoji}`)
                        }

                        //send the error message
                        message.channel.send(err)
                    }
                }else{
                    if(lang === "en"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`The type of the item is not a music pack ${errorEmoji}`)
                        message.reply(Err)
                    }else if(lang === "ar"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`يجب عليك البحث عن ميوزك باك ${errorEmoji}`)
                        message.reply(Err)
                    }
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