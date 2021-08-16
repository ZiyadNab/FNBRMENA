const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'emote',
    descriptionEN: 'Use this command to get any emote in a video form.',
    descriptionAR: 'أستعمل الأمر لأستخراج فيديو لأي رقصة بأختيارك.',
    expectedArgsEN: 'Use this command then type the emote name or the emote id (Not all emote supported YET)',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم او اي دي الرقصة (ليس جميع الرقصات مدعومة)',
    argsExample: ['Fishin\'', 'EID_JellyFrog'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inisilizing data
        var SearchType = "name"

        //if input is an id
        if(text.includes("_")) SearchType = "id"

        //request the emote video
        FNBRMENA.SearchByType(lang, text, 'emote', SearchType)
        .then(async res => {

            //check if the user entered a valid emote name
            if(res.data.items.length > 0){
                
                //check if the emote has a video
                if(res.data.items[0].video !== null){

                    //send the generating message
                    const generating = new Discord.MessageEmbed()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") generating.setTitle(`Loading the emote information ${loadingEmoji}`)
                    else if(lang === "ar") generating.setTitle(`جاري تحميل بيانات الرقصة ${loadingEmoji}`)
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
                    err.setColor(FNBRMENA.Colors("embed"))

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

                //no emote has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No emote has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على الرقصه الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.channel.send(Err)

            }

        }).catch(err => {

        })
    }
}