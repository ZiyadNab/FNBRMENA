const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'music',
    descriptionEN: 'Use this command to get any music pack in a video form.',
    descriptionAR: 'أستعمل الأمر لأستخراج فيديو لأي ميوزك لوبي بأختيارك.',
    expectedArgsEN: 'Use this command then type the music name or the music id',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم او اي دي الميوزك',
    argsExample: ['The End\'', 'MusicPack_034_SXRocketEvent'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inisilizing data
        var SearchType = "name"
        var musicType = "video"

        //if input is an id
        if(text.includes("_")) SearchType = "id"

        //if there is + in the message
        if(text.includes("+")){

           //extract the music pack from the text string
           var musicPackNameOrID = text.substring(0, text.indexOf("+"))
           musicType = text.substring(text.indexOf("+") + 1, text.length).trim()

       }else var musicPackNameOrID = text

        //request the emote video
        FNBRMENA.SearchByType(lang, musicPackNameOrID, 'music', SearchType)
        .then(async res => {

            //check if the user entered a valid emote name
            if(res.data.items.length > 0){
                
                if(res.data.items[0].type.id === 'music'){

                    //check if the emote has a video
                    if(res.data.items[0].audio !== null){

                        //send the generating message
                        const generating = new Discord.MessageEmbed()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") generating.setTitle(`Loading the ${res.data.items[0].name}... ${loadingEmoji}`)
                        else if(lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${loadingEmoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            try{

                                //send attatchment
                                if(musicType.toLocaleLowerCase() === "video") var att = await new Discord.MessageAttachment(res.data.items[0].video)
                                else if(musicType.toLocaleLowerCase() === "mp3") var att = await new Discord.MessageAttachment(res.data.items[0].audio)

                                //send the emote video
                                await message.channel.send(att)
                                msg.delete()

                            }catch{

                                //send the emote video
                                if(musicType.toLocaleLowerCase() === "video") await message.channel.send(res.data.items[0].video)
                                else if(musicType.toLocaleLowerCase() === "mp3") await message.channel.send(res.data.items[0].audio)
                                msg.delete()
                            }
                        })
                    }else{

                        //create embed
                        const err = new Discord.MessageEmbed()
                        err.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") err.setTitle(`There is no mp3 file for this music pack yet ${errorEmoji}`)
                        else if(lang === "ar") err.setTitle(`لا يوجد ملف صوت ${errorEmoji}`)
                        

                        //send the error message
                        message.channel.send(err)
                    }
                }else{

                    //wrong item type
                    const Err = new Discord.MessageEmbed()
                    Err.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") Err.setTitle(`The type of the item is not a music pack ${errorEmoji}`)
                    else if(lang === "ar") Err.setTitle(`يجب عليك البحث عن ميوزك باك ${errorEmoji}`)
                    message.reply(Err)
                }
            }else{
                
                //no music has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No music has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على الميوزك باك الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.channel.send(Err)
            }

        }).catch(err => {

            //request error
            const Err = new Discord.MessageEmbed()
            Err.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") Err.setTitle(`An error happened while getting the data please try again later. ${errorEmoji}`)
            else if(lang === "ar") Err.setTitle(`عذرا. لقد حدث مشكلة اثناء استخراج البيانات الرجاء المحاولةة لاحقا ${errorEmoji}`)
            message.channel.send(Err)
        })
    }
}