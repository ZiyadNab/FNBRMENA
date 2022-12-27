const Canvas = require('canvas');
const { DiscordAPIError } = require('discord.js');

module.exports = {
    commands: 'poi',
    type: 'Fortnite',
    descriptionEN: 'Get an image for any in-game POI.',
    descriptionAR: 'احصل على صورة لأي منطقة داخل اللعبة.',
    minArgs: 0,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Set the request version
        var version = args.length !== 0 ? text : ``

        // Check version
        if(version < 11){

            // Version is not supported
            const notSupportedVersionError = new Discord.EmbedBuilder()
            notSupportedVersionError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") notSupportedVersionError.setTitle(`Not supported version, Must be Chapter 2 and above ${emojisObject.errorEmoji}.`)
            else if(userData.lang === "ar") notSupportedVersionError.setTitle(`تحديث غير مدعوم , يجب ان يكون الفصل الثاني وأعلى ${emojisObject.errorEmoji}.`)
            return message.reply({embeds: [notSupportedVersionError], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
        }

        // Request data
        FNBRMENA.listCurrentPOI(userData.lang, version)
        .then(async res => {

            // Check data result
            if(!res.data.result){

                // If there is no pois found
                const noPOIsFoundError = new Discord.EmbedBuilder()
                noPOIsFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noPOIsFoundError.setTitle(`No POIs found ${emojisObject.errorEmoji}.`)
                else if(userData.lang === "ar") noPOIsFoundError.setTitle(`لا يمكنني العثور على مناطق ${emojisObject.errorEmoji}.`)
                return message.reply({embeds: [noPOIsFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // Creating embed
            const POIsEmbed = new Discord.EmbedBuilder()
            POIsEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                POIsEmbed.setTitle(`POIs Images`)
                POIsEmbed.setDescription('Please click on the Drop-Down menu and choose a poi.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                POIsEmbed.setTitle(`صور المناطق`)
                POIsEmbed.setDescription('الرجاء الضغط على السهم لاختيار منطقة.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            // Create a row for cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()
            
            // Add cancel button
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
            
            // Create a row for drop down menu for categories
            const POIsTypesRow = new Discord.ActionRowBuilder()

            // Get every poi name and its data to list
            var foundPOIs = [], stored = []
            for(let i = 0; i < res.data.list.length; i++){
                if(!stored.includes(res.data.list[i].name)){
                    stored.push(res.data.list[i].name)
                    foundPOIs.push({
                        label: `${res.data.list[i].name}`,
                        value: `${i}`,
                    })
                }
            }

            const POIsDropMenu = new Discord.SelectMenuBuilder()
            POIsDropMenu.setCustomId('pois')
            if(userData.lang === "en") POIsDropMenu.setPlaceholder('Select a POI!')
            else if(userData.lang === "ar") POIsDropMenu.setPlaceholder('اختر منطقة!')
            POIsDropMenu.addOptions(foundPOIs)

            // Add the drop menu to the categoryDropMenu
            POIsTypesRow.addComponents(POIsDropMenu)

            // Send the message
            const dropMenuMessage = await message.reply({embeds: [POIsEmbed], components: [POIsTypesRow, buttonDataRow], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
            })

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                // If cancel button has been clicked
                if(collected.customId === "Cancel") dropMenuMessage.delete()

                // If a poi has been chosen
                if(collected.customId === "pois"){

                    // Generating animation
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Getting the image for ${res.data.list[collected.values[0]].name} ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري البحث عن صور ${res.data.list[collected.values[0]].name} ${emojisObject.loadingEmoji}`)
                    dropMenuMessage.edit({embeds: [generating], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                    
                    try {

                        // Registering fonts
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                        // Canvas
                        const canvas = Canvas.createCanvas(1920, 1080);
                        const ctx = canvas.getContext('2d');

                        // Background
                        const background = await Canvas.loadImage(res.data.list[collected.values[0]].images[0].url)
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                        // Add blue fog
                        const fog = await Canvas.loadImage('./assets/News/fog.png')
                        ctx.drawImage(fog, 0, 0, canvas.width, canvas.height)

                        // Credits
                        if(userData.lang === "en"){
                            
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '60px Burbank Big Condensed'
                            ctx.fillText(`FNBRMENA | ${res.data.list[collected.values[0]].name}`, 15, 55)
                        }else{

                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '60px Arabic'
                            ctx.fillText(`فنبر مينا | ${res.data.list[collected.values[0]].name}`, canvas.width - 15, 55)
                        }

                        // Send the picture
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.list[collected.values[0]].name}.png`})
                        dropMenuMessage.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })

                    }catch(err) {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)

                    }
                }

            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
            })

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)

        })
    }
}    