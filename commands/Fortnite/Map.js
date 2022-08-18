const Canvas = require('canvas');
const moment = require('moment')

module.exports = {
    commands: 'map',
    type: 'Fortnite',
    descriptionEN: 'Returns a map image.',
    descriptionAR: 'أمر يسترجع لك صورة الماب.',
    expectedArgsEN: 'ُTo get the current map image use just the command, and if you want to get older map images type the season number from 1 till current season.',
    expectedArgsAR: 'للحصول على صورة الماب فقط اكتب الأمر. للحصول علي صورة مابات قديمة اكتب رقم السيزون من السيزون 1 حتى السيزون الحالي',
    hintEN: 'You can get a specific update map like season 3 chapter 2 you can get every map with seeing the water dries',
    hintAR: 'يمكنك الحصول على ماب لتحديث معين على سبيل المثال الموسم الثالث شابتر تو تقدر تحصل على صور كل تحديث و تشوف الماء يجف مع كل صورة.',
    argsExample: ['', '5', '13'],
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        moment.locale(userData.lang)

        // if the use did not add any season number
        if(text === ''){

            //generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading... ${emojisObject.loadingEmoji}`)
            else if(userData.lang == "ar") generating.setTitle(`جاري التحميل... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then(async msg => {

                //request data
                FNBRMENA.Map(userData.lang)
                .then(async res => {

                    //get the image data
                    if(res.data.data.images.pois === null) var image = res.data.data.images.blank
                    else var image = res.data.data.images.pois
                    
                    //creating canvas
                    const canvas = Canvas.createCanvas(2048, 2048);
                    const ctx = canvas.getContext('2d');

                    //map image
                    const map = await Canvas.loadImage(image)
                    ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                    //fnbrmena credits
                    const border = await Canvas.loadImage('./assets/NPC/border.png')
                    ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                    //send the map image
                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), 'map.png')
                    await message.reply({files: [att]})
                    msg.delete()

                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    
                })
            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
                
        }else{

            //request data
            FNBRMENA.MapIO()
            .then(async res => {

                //check if user entered a valid season that has images
                var allAvaliableVersions = []
                var Counter = 0

                //loop throw every map avaliable
                for(let i = 0; i < res.data.maps.length; i++){

                    //only go in when the version first number matches the user input
                    if(res.data.maps[i].patchVersion.substring(0, res.data.maps[i].patchVersion.indexOf(".")) == text){

                        //store the all avaliable versions in the array
                        allAvaliableVersions[Counter++] = res.data.maps[i]

                    }
                }

                //if the allAvaliableVersions is empty then no matching game version found
                if(allAvaliableVersions.length != 0){

                    //create an embed
                    const allAvaliableVersionsEmbed = new Discord.EmbedBuilder()
                    allAvaliableVersionsEmbed.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en"){
                        allAvaliableVersionsEmbed.setAuthor({name: `Map History`, iconURL: `https://fortnite-api.com/images/cosmetics/br/spid_139_tiltedmap/decal.png`})
                        allAvaliableVersionsEmbed.setDescription('Please click on the Drop-Down menu and choose a game verion.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                    }else if(userData.lang === "ar"){
                        allAvaliableVersionsEmbed.setAuthor({name: `تاريخ الماب`, iconURL: `https://fortnite-api.com/images/cosmetics/br/spid_139_tiltedmap/decal.png`})
                        allAvaliableVersionsEmbed.setDescription('الرجاء الضغط على السهم لاختيار تحديث.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
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
                    
                    //add AR cancel button
                    else if(userData.lang === "ar") buttonDataRow.addComponents(
                        new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("اغلاق")
                    )
                    
                    //create a row for drop down menu for categories
                    const allAvaliableVersionsRow = new Discord.ActionRowBuilder()

                    //loop throw every patch
                    var versionsFound = []
                    for(let i = 0; i < allAvaliableVersions.length; i++){

                        if(userData.lang === "en"){
                            versionsFound.push({
                                label: `${allAvaliableVersions[i].patchVersion}'s version\n`,
                                description: `${moment(allAvaliableVersions[i].releaseDate).fromNow()}`,
                                value: `${i}`,
                            })

                        }else if(userData.lang === "ar"){
                            versionsFound.push({
                                label: `تحديث ${allAvaliableVersions[i].patchVersion}\n`,
                                description: `${moment(allAvaliableVersions[i].releaseDate).fromNow()}`,
                                value: `${i}`,
                            })
                        }
                    }

                    const allAvaliableVersionsDropMenu = new Discord.SelectMenuBuilder()
                    allAvaliableVersionsDropMenu.setCustomId('versions')
                    if(userData.lang === "en") allAvaliableVersionsDropMenu.setPlaceholder('Nothing selected!')
                    else if(userData.lang === "ar") allAvaliableVersionsDropMenu.setPlaceholder('الرجاء الأختيار!')
                    allAvaliableVersionsDropMenu.addOptions(versionsFound)

                    //add the drop menu to the categoryDropMenu
                    allAvaliableVersionsRow.addComponents(allAvaliableVersionsDropMenu)

                    //send the message
                    const allAvaliableVersionsDropDownMessage = await message.reply({embeds: [allAvaliableVersionsEmbed], components: [allAvaliableVersionsRow, buttonDataRow]})

                    //filtering the user clicker
                    const filter = i => i.user.id === message.author.id

                    //await the user click
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate();

                        //if cancel button has been clicked
                        if(collected.customId === "Cancel") allAvaliableVersionsDropDownMessage.delete()
                        
                        //if the user selected a map version
                        if(collected.customId === "versions"){
                            allAvaliableVersionsDropDownMessage.delete()

                            //generating animation
                            const generating = new Discord.EmbedBuilder()
                            generating.setColor(FNBRMENA.Colors("embed"))
                            if(userData.lang === "en") generating.setTitle(`Loading ${allAvaliableVersions[collected.values[0]].patchVersion}'s map... ${emojisObject.loadingEmoji}`)
                            else if(userData.lang == "ar") generating.setTitle(`جاري التحميل ماب ${allAvaliableVersions[collected.values[0]].patchVersion}... ${emojisObject.loadingEmoji}`)
                            message.reply({embeds: [generating]})
                            .then(async msg => {
                                
                                //creating canvas
                                const canvas = Canvas.createCanvas(2048, 2048);
                                const ctx = canvas.getContext('2d');

                                //map image
                                const map = await Canvas.loadImage(allAvaliableVersions[collected.values[0]].url)
                                ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                                //fnbrmena credits
                                const border = await Canvas.loadImage('./assets/NPC/border.png')
                                ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                                //send the map image
                                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${allAvaliableVersions[collected.values[0]].patchVersion}.png`)
                                await message.reply({files: [att]})
                                msg.delete()

                            }).catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                                
                            })
                        }
                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        
                    })

                }else{

                    //create embed handleing the season error
                    const noSeasonHasBeenFoundError = new Discord.EmbedBuilder()
                    noSeasonHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noSeasonHasBeenFoundError.setTitle(`Sorry there is no season with that number ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noSeasonHasBeenFoundError.setTitle(`عذرا لا يوجد موسم بنفس هذا الرقم ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noSeasonHasBeenFoundError]})

                }
            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                
            })
        }
    }
}