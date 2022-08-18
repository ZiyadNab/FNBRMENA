module.exports = {
    commands: 'music',
    type: 'Fortnite',
    descriptionEN: 'Use this command to get any music pack in a video form.',
    descriptionAR: 'أستعمل الأمر لأستخراج فيديو لأي ميوزك لوبي بأختيارك.',
    expectedArgsEN: 'Use this command then type the music name or the music id',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم او اي دي الميوزك',
    argsExample: ['The End\'', 'MusicPack_034_SXRocketEvent'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //inisilizing data
        var SearchType = "name"

        //if input is an id
        if(text.includes("_")) SearchType = "id"

        //request the emote video
        FNBRMENA.SearchByType(userData.lang, text, 'music', SearchType)
        .then(async res => {

            //check if the user entered a valid emote name
            if(res.data.items.length > 0){

                if(res.data.items[0].video !== null || res.data.items[0].audio !== null){

                    //create random landing embed message
                    const musicTypeEmbed = new Discord.EmbedBuilder()
                    musicTypeEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        musicTypeEmbed.setAuthor({name: `Music Packs`, iconURL: `https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/28/T_Ui_Music_256.png`})
                        musicTypeEmbed.setDescription('Please choose the output type Audio or Video.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                    }else if(userData.lang === "ar"){
                        musicTypeEmbed.setAuthor({name: `حزم الموسيقى`, iconURL: `https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/28/T_Ui_Music_256.png`})
                        musicTypeEmbed.setDescription('الرجاء اختيار نوع اخراج الملف صوت او فيديو.\n.`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                    }
                    
                    //create a row for buttons
                    const buttonsDataRow = new Discord.ActionRowBuilder()

                    //audio button
                    const audioButton = new Discord.ButtonBuilder()
                    audioButton.setCustomId('Audio')
                    audioButton.setStyle(Discord.ButtonStyle.Primary)
                    if(res.data.items[0].audio === null) audioButton.setDisabled(true)
                    if(userData.lang === "en") audioButton.setLabel("Audio")
                    else if(userData.lang === "ar") audioButton.setLabel("صوت")

                    //audio button
                    const videoButton = new Discord.ButtonBuilder()
                    videoButton.setCustomId('Video')
                    videoButton.setStyle(Discord.ButtonStyle.Primary)
                    if(res.data.items[0].video === null) videoButton.setDisabled(true)
                    if(userData.lang === "en") videoButton.setLabel("Video")
                    else if(userData.lang === "ar") videoButton.setLabel("فيديو")

                    //cancle button
                    const cancelButton = new Discord.ButtonBuilder()
                    cancelButton.setCustomId('Cancel')
                    cancelButton.setStyle(Discord.ButtonStyle.Danger)
                    if(userData.lang === "en") cancelButton.setLabel("Cancel")
                    else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
                    
                    //add the buttons to the buttonsDataRow
                    buttonsDataRow.addComponents(audioButton, videoButton, cancelButton)

                    //send the button
                    const musicTypeMessaghe = await message.reply({embeds: [musicTypeEmbed], components: [buttonsDataRow]})

                    //filtering the user clicker
                    const filter = i => i.user.id === message.author.id

                    //await the user click
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate();

                        //if canel button has been clicked
                        if(collected.customId === "Cancel") musicTypeMessaghe.delete()
                        else{
                            musicTypeMessaghe.delete()

                            //send the generating message
                            const generating = new Discord.EmbedBuilder()
                            generating.setColor(FNBRMENA.Colors("embed"))
                            if(userData.lang === "en") generating.setTitle(`Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                            message.reply({embeds: [generating]})
                            .then(async msg => {

                                try{

                                    //send attatchment
                                    if(collected.customId === "Video") var att = await new Discord.AttachmentBuilder(res.data.items[0].video)
                                    else if(collected.customId === "Audio") var att = await new Discord.AttachmentBuilder(res.data.items[0].audio)

                                    //send the emote video
                                    await message.reply({files: [att]})
                                    msg.delete()

                                }catch{

                                    //send the emote video
                                    if(collected.customId === "Video") await message.reply(res.data.items[0].video)
                                    else if(collected.customId === "Audio") await message.reply(res.data.items[0].audio)
                                    msg.delete()
                                }
                            }).catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    
                            })
                        }
                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })

                }else{

                    //no data for the music has been found
                    const noDataForTheMusicHasBeenFoundError = new Discord.EmbedBuilder()
                    noDataForTheMusicHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noDataForTheMusicHasBeenFoundError.setTitle(`This music doesn't have any video or audio yet, please check back again later ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noDataForTheMusicHasBeenFoundError.setTitle(`لا تحتوي هاذي الموسيقى على فيديو او صوت, اعد المحاولة مرا اخرى في وقت لاحق ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noDataForTheMusicHasBeenFoundError]})
                }

            }else{
                
                //no music has been found
                const noMusicHasBeenFoundError = new Discord.EmbedBuilder()
                noMusicHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noMusicHasBeenFoundError.setTitle(`No music pack has been found please check your speling and try again ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noMusicHasBeenFoundError.setTitle(`لا يمكنني العثور على الموسيقى الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noMusicHasBeenFoundError]})
            }

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}