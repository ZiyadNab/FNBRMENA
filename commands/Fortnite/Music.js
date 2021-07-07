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

        //inisilizing data
        var SearchType = "name"

        //if input is an id
        if(text.includes("_")) SearchType = "id"

        //request the emote video
        FNBRMENA.SearchByType(lang, text, 'music', SearchType)
        .then(async res => {

            //check if the user entered a valid emote name
            if(res.data.items.length > 0){
                
                if(res.data.items[0].type.id === 'music'){

                    //check if the emote has a video
                    if(res.data.items[0].audio !== null){

                        //send the generating message
                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#BB00EE')
                        const emoji = client.emojis.cache.get("805690920157970442")
                        if(lang === "en") generating.setTitle(`Loading the music information ${emoji}`)
                        else if(lang === "ar") generating.setTitle(`جاري تحميل بيانات اغنية اللوبي ${emoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            //send attatchment
                            const att = await new Discord.MessageAttachment(res.data.items[0].video)

                            //send the emote video
                            await message.channel.send(att)
                            msg.delete()
                        })
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
                    .setTitle(`No music packs has been found check your speling and try again ${errorEmoji}`)
                    message.reply(Err)
                }else if(lang === "ar"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لا يمكنني العثور على الميوزك الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                    message.reply(Err)
                }
            }

        }).catch(err => {

        })
    }
}