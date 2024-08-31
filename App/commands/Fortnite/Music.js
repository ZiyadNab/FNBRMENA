module.exports = {
    commands: 'music',
    type: 'Fortnite',
    descriptionEN: 'Get a MP4/MP3 file for any music pack in-game.',
    descriptionAR: 'احصل على ملف MP4/MP3 لأي حزمة موسيقى داخل اللعبة.',
    expectedArgsEN: 'To use the command you need to specify any music pack name.',
    expectedArgsAR: 'لاستخدام الأمر ، تحتاج إلى تحديد اسم أي رقصه.',
    argsExample: ['The End\'', 'MusicPack_034_SXRocketEvent'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Inisilizing data
        var SearchType = "name"

        // If input is an id
        if(text.includes("_")) SearchType = "id"

        // Request the emote video
        FNBRMENA.SearchByType(userData.lang, text, 'music', SearchType)
        .then(async res => {

            // Check if the user entered a valid emote name
            if(res.data.items.length <= 0){

                // No music has been found
                const noMusicHasBeenFoundError = new Discord.EmbedBuilder()
                noMusicHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noMusicHasBeenFoundError.setTitle(`No music pack has been found please check your speling and try again ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noMusicHasBeenFoundError.setTitle(`لا يمكنني العثور على الموسيقى الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
                return message.reply({embeds: [noMusicHasBeenFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            if(res.data.items[0].video === null && res.data.items[0].audio === null){

                // No data for the music has been found
                const noDataForTheMusicHasBeenFoundError = new Discord.EmbedBuilder()
                noDataForTheMusicHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noDataForTheMusicHasBeenFoundError.setTitle(`This music doesn't have any video or audio yet, please check back again later ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noDataForTheMusicHasBeenFoundError.setTitle(`لا تحتوي هاذي الموسيقى على فيديو او صوت, اعد المحاولة مرا اخرى في وقت لاحق ${emojisObject.errorEmoji}`)
                return message.reply({embeds: [noDataForTheMusicHasBeenFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // Create random landing embed message
            const musicTypeEmbed = new Discord.EmbedBuilder()
            musicTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                musicTypeEmbed.setAuthor({name: `Music Packs`, iconURL: `https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/28/T_Ui_Music_256.png`})
                musicTypeEmbed.setDescription('Please choose the output type Audio or Video.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                musicTypeEmbed.setAuthor({name: `حزم الموسيقى`, iconURL: `https://static.wikia.nocookie.net/fortnite_gamepedia/images/2/28/T_Ui_Music_256.png`})
                musicTypeEmbed.setDescription('الرجاء اختيار نوع اخراج الملف صوت او فيديو.\n.`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }
            
            // Create a row for buttons
            const buttonsDataRow = new Discord.ActionRowBuilder()

            // Audio button
            const audioButton = new Discord.ButtonBuilder()
            audioButton.setCustomId('Audio')
            audioButton.setStyle(Discord.ButtonStyle.Success)
            if(res.data.items[0].audio === null) audioButton.setDisabled(true)
            if(userData.lang === "en") audioButton.setLabel("Audio")
            else if(userData.lang === "ar") audioButton.setLabel("صوت")

            // Video button
            const videoButton = new Discord.ButtonBuilder()
            videoButton.setCustomId('Video')
            videoButton.setStyle(Discord.ButtonStyle.Primary)
            if(res.data.items[0].video === null) videoButton.setDisabled(true)
            if(userData.lang === "en") videoButton.setLabel("Video")
            else if(userData.lang === "ar") videoButton.setLabel("فيديو")

            // Cancle button
            const cancelButton = new Discord.ButtonBuilder()
            cancelButton.setCustomId('Cancel')
            cancelButton.setStyle(Discord.ButtonStyle.Danger)
            if(userData.lang === "en") cancelButton.setLabel("Cancel")
            else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
            
            // Add the buttons to the buttonsDataRow
            buttonsDataRow.addComponents(audioButton, videoButton, cancelButton)

            // Send the button
            const musicTypeMessage = await message.reply({embeds: [musicTypeEmbed], components: [buttonsDataRow]})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === musicTypeMessage.id && i.guild.id === message.guild.id)
            })

            // Await the user click
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                // If canel button has been clicked
                if(collected.customId === "Cancel") musicTypeMessage.delete()
                else{

                    // Send the generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`)
                    musicTypeMessage.edit({embeds: [generating], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                    try {

                        // Send attatchment
                        if(collected.customId === "Video") var att = new Discord.AttachmentBuilder(res.data.items[0].video)
                        else if(collected.customId === "Audio") var att = new Discord.AttachmentBuilder(res.data.items[0].audio)

                        // Send the music video
                        musicTypeMessage.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {

                            // Try sending it as a content message
                            if(collected.customId === "Video"){
                                musicTypeMessage.edit(res.data.items[0].video)
                                .catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, musicTypeMessage)
                                })
                            }else if(collected.customId === "Audio"){
                                musicTypeMessage.edit(res.data.items[0].audio)
                                .catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, musicTypeMessage)
                                })
                            }
                        })
                    }catch(err) {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, musicTypeMessage)
            
                    }
                }
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, musicTypeMessage)
            })

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)

        })
    }
}