const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = {
    commands: 'stream',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //request the file using the given file id
        FNBRMENA.Streams(text)
        .then(async res => {
            fs.writeFileSync('./ssssdwws.json', JSON.stringify(res, null, 2))

            const multiLanguages = []
            for(let i = 0; i < res.playlists.length; i++){
                if(res.playlists[i].type === "master") multiLanguages.push(res.playlists[i])
            }

            //creating embed
            const avaliableStreamLanguagesEmbed = new Discord.EmbedBuilder()
            avaliableStreamLanguagesEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                avaliableStreamLanguagesEmbed.setAuthor({name: `Streams`, iconURL: 'https://imgur.com/f8N9MP1.png'})
                avaliableStreamLanguagesEmbed.setDescription('Please click on the Drop-Down menu and choose a stream language.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                avaliableStreamLanguagesEmbed.setAuthor({name: `الفيديو`, iconURL: 'https://imgur.com/f8N9MP1.png'})
                avaliableStreamLanguagesEmbed.setDescription('الرجاء الضغط على السهم لغة الفيديو.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            //create a row for cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()
                
            //add EN cancel button
            if(userData.lang === "en") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel")
            )
            

            else if(userData.lang === "ar") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("اغلاق")
            )

            //create a row for drop down menu for categories
            const avaliableStreamLanguagesRow = new Discord.ActionRowBuilder()

            //get every stream language name and its data
            var foundLanguages = [], stored = []
            for(let i = 0; i < multiLanguages.length; i++){

                //if a new language has been found then add it to drop menu options
                if(!stored.includes(multiLanguages[i].language)){
                    stored.push(multiLanguages[i].language)
                    foundLanguages.push({
                        label: `${multiLanguages[i].language}`,
                        value: `${i}`,
                    })
                }
            }

            //create the drop menu
            const avaliableStreamLanguagesDropMenu = new Discord.StringSelectMenuBuilder()
            avaliableStreamLanguagesDropMenu.setCustomId('userData.lang')
            if(userData.lang === "en") avaliableStreamLanguagesDropMenu.setPlaceholder('Nothing a language!')
            else if(userData.lang === "ar") avaliableStreamLanguagesDropMenu.setPlaceholder('الرجاء اختيار لغة!')
            avaliableStreamLanguagesDropMenu.addOptions(foundLanguages)

            //add the drop menu to the categoryDropMenu
            avaliableStreamLanguagesRow.addComponents(avaliableStreamLanguagesDropMenu)

                //send the message
                const dropMenuMessage = await message.reply({embeds: [avaliableStreamLanguagesEmbed], components: [avaliableStreamLanguagesRow, buttonDataRow]})

                //filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                })

                //await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    //if canecl button has been clicked
                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                    //if the user chose a language
                    if(collected.customId === "userData.lang"){
                        dropMenuMessage.delete()

                        //inilizing ffmpeg
                        const videoData = ffmpeg(multiLanguages[collected.values[0]].url)
                        //videoData.outputOptions("-bsf:a aac_adtstoasc")
                        // videoData.videoFilters({
                        //     filter: 'drawtext',
                        //     options: {
                        //         fontfile: './assets/font/BurbankBigCondensed-Black.ttf',
                        //         text: 'FNBRMENA',
                        //         fontsize: 60,
                        //         fontcolor: 'white',
                        //         x: 30,
                        //         y: 30,
                        //     }
                        // })
                        videoData.output(`${text}-${multiLanguages[collected.values[0]].type}_${multiLanguages[collected.values[0]].language}.mp4`)
                        videoData.run()

                        //a file added
                        videoData.on('start', function (commandLine) {
                            console.log('Spawned Ffmpeg with command: ' + commandLine);
                        })

                        //catch errors
                        videoData.on("error", error => {
                            console.log(error)
                        })

                        //video progress
                        videoData.on('progress', function (progress) {
                            console.log('Processing: ' + progress.currentKbps + '% done')
                        })

                        //convert .m3u8 to mp4
                        videoData.on('end', async function (err, stdout, stderr) {
                            console.log('Finished processing!')
                        })
                    }

                }).catch(err => {

                    //time has passed
                    if(err instanceof Error) FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    else{
                        const timeError = new Discord.EmbedBuilder()
                        timeError.setColor(FNBRMENA.Colors("embedError"))
                        timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                        message.reply({embeds: [timeError]})
                    }
                })

        }).catch(async err => {

            //if the error type is an axios
            if(err.isAxiosError){
                
                //file not found error
                const fileNotFoundError = new Discord.EmbedBuilder()
                fileNotFoundError.setColor(FNBRMENA.Colors('embedError'))
                if(userData.lang === "en") fileNotFoundError.setTitle(`The requested file cannot not found. ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") fileNotFoundError.setTitle(`عذرا لم يتم العثور على الملف المطلوب ${emojisObject.errorEmoji}`)
                message.reply({embeds: [fileNotFoundError]})

            }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}