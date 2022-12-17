module.exports = {
    commands: 'emote',
    type: 'Fortnite',
    descriptionEN: 'Use this command to get any emote in a video form.',
    descriptionAR: 'أستعمل الأمر لأستخراج فيديو لأي رقصة بأختيارك.',
    expectedArgsEN: 'Use this command then type the emote name or the emote id (Not all emote supported YET)',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم او اي دي الرقصة (ليس جميع الرقصات مدعومة)',
    argsExample: ['Fishin\'', 'EID_JellyFrog'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Inisilizing data
        var SearchType = "name"

        // If input is an id
        if(text.includes("_")) SearchType = "id"

        // Request the emote video
        FNBRMENA.SearchByType(userData.lang, text, 'emote', SearchType)
        .then(async res => {

            // Check if the user entered a valid emote name
            if(res.data.items.length > 0){
                
                // Check if the emote has a video
                if(res.data.items[0].video !== null){

                    // Send the generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                    const msg = await message.reply({embeds: [generating], components: [], files: []})
                    try {

                        // Send attatchment
                        const att = new Discord.AttachmentBuilder(res.data.items[0].video)

                        // Send the emote video
                        msg.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {

                            // Try sending it as a contect message
                            msg.edit({content: res.data.items[0].video, embeds: [], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                            })
                        })

                    }catch(err){
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    }
                }else{

                    // Create embed
                    const noVideoFoundError = new Discord.EmbedBuilder()
                    noVideoFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noVideoFoundError.setTitle(`There is no video for ${res.data.items[0].name} yet ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noVideoFoundError.setTitle(`لا يوجد فيديو لرقصة ${res.data.items[0].name} ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noVideoFoundError]})
                }

            }else{

                // No emote has been found
                const noEmoteHasBeenFoundError = new Discord.EmbedBuilder()
                noEmoteHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noEmoteHasBeenFoundError.setTitle(`No emote has been found check your speling and try again ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noEmoteHasBeenFoundError.setTitle(`لا يمكنني العثور على الرقصه الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noEmoteHasBeenFoundError]})

            }

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}