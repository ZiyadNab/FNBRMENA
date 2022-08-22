const Canvas = require('canvas');
const { DiscordAPIError } = require('discord.js');

module.exports = {
    commands: 'poi',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //define version
        var version = ``
        if(args.length !== 0) version = text

        //request data
        FNBRMENA.listCurrentPOI(userData.lang, version)
        .then(async res => {

            //if there is pois found
            if(res.data.list.length !== 0){

                //creating embed
                const POIsEmbed = new Discord.EmbedBuilder()
                POIsEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    POIsEmbed.setTitle(`POIs Images`)
                    POIsEmbed.setDescription('Please click on the Drop-Down menu and choose a poi.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    POIsEmbed.setTitle(`صور المناطق`)
                    POIsEmbed.setDescription('الرجاء الضغط على السهم لاختيار منطقة.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
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
                const POIsTypesRow = new Discord.ActionRowBuilder()

                //get every poi name and its data to list
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

                //add the drop menu to the categoryDropMenu
                POIsTypesRow.addComponents(POIsDropMenu)

                //send the message
                const dropMenuMessage = await message.reply({embeds: [POIsEmbed], components: [POIsTypesRow, buttonDataRow]})

                //filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                })

                //await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel") dropMenuMessage.delete()

                    //if a poi has been chosen
                    if(collected.customId === "pois"){
                        dropMenuMessage.delete()

                        //generating animation
                        const generating = new Discord.EmbedBuilder()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(userData.lang === "en") generating.setTitle(`Getting the image for ${res.data.list[collected.values[0]].name} ${emojisObject.loadingEmoji}`)
                        else if(userData.lang === "ar") generating.setTitle(`جاري البحث عن صور ${res.data.list[collected.values[0]].name} ${emojisObject.loadingEmoji}`)
                        message.reply({embeds: [generating]})
                        .then(async msg => {

                            //Registering fonts
                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                            //canvas
                            const canvas = Canvas.createCanvas(1920, 1080);
                            const ctx = canvas.getContext('2d');

                            //background
                            const background = await Canvas.loadImage(res.data.list[collected.values[0]].images[0].url)
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                            //add blue fog
                            const fog = await Canvas.loadImage('./assets/News/fog.png')
                            ctx.drawImage(fog, 0, 0, canvas.width, canvas.height)

                            //credits
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

                            //send the picture
                            const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.list[collected.values[0]].name}.png`})
                            await message.reply({files: [att]})
                            msg.delete()

                        }).catch(async err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

                        })
                    }

                }).catch(async err => {
                    dropMenuMessage.delete()
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })

            }else{

                //if there is no pois found
                const noPOIsFoundError = new Discord.EmbedBuilder()
                noPOIsFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noPOIsFoundError.setTitle(`No POIs found for ${res.data.gameVersion} version ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noPOIsFoundError.setTitle(`لا يمكنني العثور على مناطق في تحديث ${res.data.gameVersion} ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noPOIsFoundError]})
            }

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}    