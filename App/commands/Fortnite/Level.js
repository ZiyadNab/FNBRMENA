const Canvas = require('canvas')
const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'level',
    type: 'Fortnite',
    descriptionEN: 'Generates an image contains statistics about any account.',
    descriptionAR: 'استرجاع صورة تحتوي على إحصائيات حول أي حساب.',
    expectedArgsEN: 'To start, use the command then the account display name.',
    expectedArgsAR: 'للبدء ، استخدم الأمر ثم اسم عرض الحساب.',
    hintEN: 'You can find statistics about any account regardless of the account platform whether its Xbox, Playstation or, Epic Games.',
    hintAR: 'يمكنك العثور على إحصائيات حول أي حساب بغض النظر عن النظام الأساسي للحساب سواء كان Xbox أو Playstation أو Epic Games.',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // List of colors
        const listOfColors = [
            '00e7ff,0006ff',
            'FF00F3,9700FF',
            '23FF00,116F02',
            'FF0000,8C0000',
            'E1FEFE,66FFFF',
            '00FFAA,01764F',
            'FF0080,810041',
            'AE00FF,570180',
            '6400FF,330180',
            'A6FF00,588701',
            'F4FF00,818701',
            'FFAA00,895C01',
            '9E00FF,D086FD',
            '000000,000000',
            '003AFF,031B6B',
            '00F2F9,F900F9',
            '002DF9,00F9F5',
            '6D00F9,F900EE',
            '00F939,DFFE00',
            'FEC400,3E00FF'
        ]

        // Draw player stats
        const drawPlayerLvlStats = async (res, outfit, loadingscreen, color, msg) => {

            // Generating messages
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading player's data... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات اللاعب... ${emojisObject.loadingEmoji}`)
            msg.edit({embeds: [generating], components: [], files: []})
            .catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            })

            try {
                
                // Registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                
                // Applytext
                const applyText = (canvas, text, font, width, langCheck) => {
                    const ctx = canvas.getContext('2d')
                    let fontSize = font
                    do {
                        if(langCheck){
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                            
                        }else ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                    } while (ctx.measureText(text).width > width)
                    return ctx.font
                }

                // Creating canvas
                const canvas = Canvas.createCanvas(900 + tableWidth * 300, 2400)
                const ctx = canvas.getContext('2d')

                // Get random color
                const randomNumber = async (list) => {
                    return Math.floor(Math.random() * list)
                }

                // Background initializer function
                const backgroundInitializer = async (randomColor) => {

                    // Background gradient
                    const backgroundGRD = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
                    backgroundGRD.addColorStop(0, `#${randomColor.substring(0, randomColor.indexOf(','))}`)
                    backgroundGRD.addColorStop(1, `#${randomColor.substring(randomColor.indexOf(',') + 1, randomColor.length)}`)
                    ctx.fillStyle = backgroundGRD
                    ctx.fillRect(0, 0, canvas.width, canvas.height) //background

                    // Check for custom loadingscreen
                    if(!loadingscreen){

                        // Get a random loadingscreen
                        const listOfLoadingscreans = await FNBRMENA.Search(userData.lang, "custom", "&type=loadingscreen")
                        ctx.globalAlpha = 0.5;
                        const randomImage = await randomNumber(listOfLoadingscreans.data.items.length)
                        const loadingscreanIMG = await Canvas.loadImage(listOfLoadingscreans.data.items[randomImage].images.featured)
                        ctx.drawImage(loadingscreanIMG, 0, 0, canvas.width, canvas.height)
                        ctx.globalAlpha = 1;
                    }else{
                        ctx.globalAlpha = 0.5;
                        const loadingscreanIMG = await Canvas.loadImage(loadingscreen.data.items[0].images.featured)
                        ctx.drawImage(loadingscreanIMG, 0, 0, canvas.width, canvas.height)
                        ctx.globalAlpha = 1;
                    }

                    // LHS plate
                    const leftHandSideGRD = ctx.createLinearGradient(3300, canvas.height + 200, canvas.width + 1000, 0)
                    leftHandSideGRD.addColorStop(0, `#${randomColor.substring(0, randomColor.indexOf(','))}`)
                    leftHandSideGRD.addColorStop(1, `#${randomColor.substring(randomColor.indexOf(',') + 1, randomColor.length)}`)
                    ctx.fillStyle = leftHandSideGRD
                    ctx.save()
                    ctx.translate(canvas.width - 190, 0);
                    ctx.rotate(Math.PI / 19);
                    ctx.translate(-(canvas.width - 190), -0);
                    ctx.fillRect(canvas.width - 190, -100, 1000, canvas.height + 200); //left hand side
                    ctx.restore()

                    // Check for custom outfit
                    if(!outfit){

                        // Request data
                        await FNBRMENA.Search(userData.lang, "custom", "&gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
                        .then(async listOfOutfits => {

                            do {
                                var randomImage = await randomNumber(listOfOutfits.data.items.length)

                            } while(listOfOutfits.data.items[randomImage].builtInEmote !== null &&
                                listOfOutfits.data.items[randomImage].styles.length > 2)

                            // Outfit img 
                            const outfitIMG = await Canvas.loadImage(listOfOutfits.data.items[randomImage].images.featured)
                            ctx.drawImage(outfitIMG, canvas.width - 1550, 300, canvas.height - 300, canvas.height - 300)
                        })
                    }else{

                        if(outfit.data.items[0].images.featured !== null){

                            // Outfit img 
                            const outfitIMG = await Canvas.loadImage(outfit.data.items[0].images.featured)
                            ctx.drawImage(outfitIMG, canvas.width - 1550, 300, canvas.height - 300, canvas.height - 300)
                        }else{

                            // Request data
                            await FNBRMENA.Search(userData.lang, "custom", "&gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
                            .then(async listOfOutfits => {

                                do {
                                    var randomImage = await randomNumber(listOfOutfits.data.items.length)

                                } while(listOfOutfits.data.items[randomImage].builtInEmote !== null &&
                                    listOfOutfits.data.items[randomImage].styles.length > 2)

                                // Outfit img 
                                const outfitIMG = await Canvas.loadImage(listOfOutfits.data.items[randomImage].images.featured)
                                ctx.drawImage(outfitIMG, canvas.width - 1550, 300, canvas.height - 300, canvas.height - 300)
                            })
                        }
                    }

                    // Add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(`FNBRMENA | ${userInput.name.toUpperCase()}`, 115, 110)

                    // Add stats type
                    if(userInput.type === "all"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/IGV05Yq.png')
                        ctx.drawImage(allTypeIMG, 115, 120, 120, 120)
                    }
                    if(userInput.type === "kbm"){
                        const kbmTypeIMG = await Canvas.loadImage('https://imgur.com/gUCgxuZ.png')
                        ctx.drawImage(kbmTypeIMG, 115, 120, 120, 120)
                    }
                    if(userInput.type === "controller"){
                        const controllerTypeIMG = await Canvas.loadImage('https://imgur.com/BfRpXon.png')
                        ctx.drawImage(controllerTypeIMG, 115, 120, 120, 120)
                    }
                    if(userInput.type === "touch"){
                        const touchTypeIMG = await Canvas.loadImage('https://imgur.com/mVWCmjy.png')
                        ctx.drawImage(touchTypeIMG, 115, 120, 120, 120)
                    }

                    // Add player's platform
                    if(userInput.platform === "epic"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/tSDjS5L.png')
                        ctx.drawImage(allTypeIMG, 115, 250, 120, 120)
                    }
                    if(userInput.platform === "psn"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/gnVRNSs.png')
                        ctx.drawImage(allTypeIMG, 115, 250, 120, 120)
                    }
                    if(userInput.platform === "xbl"){
                        const allTypeIMG = await Canvas.loadImage('https://imgur.com/zmJKwQw.png')
                        ctx.drawImage(allTypeIMG, 115, 250, 120, 120)
                    }

                }

                // Get a random color
                if(!color) var randomColor = listOfColors[await randomNumber(listOfColors.length)]
                else var randomColor = color

                // Create grediant background
                await backgroundInitializer(randomColor)

                // Send the image
                var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.data.account.name}.png`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {

                    // Try sending it on jpg file format [LOWER QUALITY]
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.data.account.name}.jpg`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                })

            }catch(err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)

            }
        }

        // Create an embed
        const lvlStatsPlatformEmbed = new Discord.EmbedBuilder()
        lvlStatsPlatformEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            lvlStatsPlatformEmbed.setTitle(`Select a Platform`)
            lvlStatsPlatformEmbed.setDescription('Please click on the Drop-Down menu and select a platform.\n`You have only 30 seconds until this operation ends, Make it quick`!')
        }else if(userData.lang === "ar"){
            lvlStatsPlatformEmbed.setTitle(`اختر منصه`)
            lvlStatsPlatformEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع المنصه.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
        }

        // Create a row for cancel button
        const cancelButtonDataRow = new Discord.ActionRowBuilder()
        
        // Add buttons
        if(userData.lang === "en") cancelButtonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`Cancel`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )

        else if(userData.lang === "ar") cancelButtonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`Cancel`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )

        // Create a row for drop down menu for categories
        const lvlStatsPlatformRow = new Discord.ActionRowBuilder()

        // Add English options
        if(userData.lang === "en") userInput.platformOptions.push(
            {
                label: `Epic Games`,
                value: `epic`,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `Playstation`,
                value: `psn`,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `Xbox`,
                value: `xbl`,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        // Add Arabic options
        else if(userData.lang === "ar") userInput.platformOptions.push(
            {
                label: `ايبك قيمز`,
                value: `epic`,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `بلايستيشن`,
                value: `psn`,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `اكسبوكس`,
                value: `xbl`,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        const lvlStatsPlatformDropMenu = new Discord.StringSelectMenuBuilder()
        lvlStatsPlatformDropMenu.setCustomId(`platform`)
        if(userData.lang === "en") lvlStatsPlatformDropMenu.setPlaceholder('Nothing selected!')
        else if(userData.lang === "ar") lvlStatsPlatformDropMenu.setPlaceholder('الرجاء الأختيار!')
        lvlStatsPlatformDropMenu.addOptions(userInput.platformOptions)

        // Add the drop menu to the categoryDropMenu
        lvlStatsPlatformRow.addComponents(lvlStatsPlatformDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [lvlStatsPlatformEmbed], components: [lvlStatsPlatformRow, cancelButtonDataRow], files: []})
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
            collected.deferUpdate()

            // If cancel button has been clicked
            if(collected.customId === `Cancel`) colllector.stop()

            // If the user selected a platform
            if(collected.customId === `platform`){

                //request data
                FNBRMENA.FNBRMENAStats(text, collected.values[0])
                .then(async res => {

                    // Draw player level stats
                    drawPlayerLvlStats(res, false, false, false, dropMenuMessage)
                
                }).catch(async err => {
                    if(err.response.data.status === 404){

                        if(err.response.data.error === "The requested account does not exist."){

                            // Epic games string
                            if(userInput.platform === "epic" && userData.lang === "en") var usedPlatform = 'Epicgames'
                            else if(userInput.platform === "epic" && userData.lang === "ar") var usedPlatform = 'ايبك قيمز'

                            // Psn string
                            if(userInput.platform === "psn" && userData.lang === "en") var usedPlatform = 'Playstation'
                            else if(userInput.platform === "psn" && userData.lang === "ar") var usedPlatform = 'بلايستيشن'

                            // Xbl string
                            if(userInput.platform === "xbl" && userData.lang === "en") var usedPlatform = 'XBOX'
                            else if(userInput.platform === "xbl" && userData.lang === "ar") var usedPlatform = 'اكسبوكس'

                            const noUserHasBeenFoundError = new Discord.EmbedBuilder()
                            noUserHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noUserHasBeenFoundError.setTitle(`Can't find \`${text}\` in ${usedPlatform} platform. Please try again ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noUserHasBeenFoundError.setTitle(`لا يمكنني العثور على حساب \`${text}\` في منصه ${usedPlatform} حاول مجددا ${emojisObject.errorEmoji}.`)
                            await dropMenuMessage.edit({embeds: [noUserHasBeenFoundError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })

                        }else if(err.response.data.error === "The requested profile didn't play any matches yet."){

                            const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                            noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`\`${text}\` hasn't played any matchs yet ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب \`${text}\` لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}.`)
                            await dropMenuMessage.edit({embeds: [noMatchsPlayedYetError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })

                        }

                    }else if(err.response.data.status === 403){

                        const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                        theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`\`${text}\` account is private, Try again later ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`عذرا حساب \`${text}\` خاص ، حاول مجددآ في وقت لاحق ${emojisObject.errorEmoji}.`)
                        await dropMenuMessage.edit({embeds: [theUserAccountIsPrivate], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })
    }
}
