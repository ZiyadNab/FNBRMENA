const Canvas = require('canvas')
const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'ranked',
    type: 'Fortnite',
    descriptionEN: 'Generates an image contains ranked statistics about any account.',
    descriptionAR: 'استرجاع صورة تحتوي على إحصائيات التصنيف حول أي حساب.',
    expectedArgsEN: 'To start, use the command then the account display name.',
    expectedArgsAR: 'للبدء ، استخدم الأمر ثم اسم عرض الحساب.',
    hintEN: 'You can find ranked statistics about any account regardless of the account platform whether its Xbox, Playstation or, Epic Games.',
    hintAR: 'يمكنك العثور على إحصائيات التصنيف حول أي حساب بغض النظر عن النظام الأساسي للحساب سواء كان Xbox أو Playstation أو Epic Games.',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        moment.locale(userData.lang)
        const ranks = [
            {
                ar: 'غير مصنف',
                en: 'Unranked',
                procColor: 'black',
                emoji: client.emojis.cache.get("1121149262458277988"),
            },
            {
                ar: 'برونزي I',
                en: 'Bronze I',
                procColor: '#ff7200',
                emoji: client.emojis.cache.get("1121149282972618793"),
            },
            {
                ar: 'برونزي II',
                en: 'Bronze II',
                procColor: '#ff7200',
                emoji: client.emojis.cache.get("1121152021949595802"),
            },
            {
                ar: 'برونزي III',
                en: 'Bronze III',
                procColor: '#ff7200',
                emoji: client.emojis.cache.get("1121152197661569174"),
            },
            {
                ar: 'فضي I',
                en: 'Silver I',
                procColor: '#bababa',
                emoji: client.emojis.cache.get("1121152305962680440"),
            },
            {
                ar: 'فضي II',
                en: 'Silver II',
                procColor: '#bababa',
                emoji: client.emojis.cache.get("1121152370932453426"),
            },
            {
                ar: 'فضي III',
                en: 'Silver III',
                procColor: '#bababa',
                emoji: client.emojis.cache.get("1121152663216730223"),
            },
            {
                ar: 'ذهبي I',
                en: 'Gold I',
                procColor: '#ffff2a',
                emoji: client.emojis.cache.get("1121152719709802526"),
            },
            {
                ar: 'ذهبي II',
                en: 'Gold II',
                procColor: '#ffff2a',
                emoji: client.emojis.cache.get("1121152770590920814"),
            },
            {
                ar: 'ذهبي III',
                en: 'Gold III',
                procColor: '#ffff2a',
                emoji: client.emojis.cache.get("1121152904431161364"),
            },
            {
                ar: 'بلاتيني I',
                en: 'Platinum I',
                procColor: '#00ffff',
                emoji: client.emojis.cache.get("1121152978540314767"),
            },
            {
                ar: 'بلاتيني II',
                en: 'Platinum II',
                procColor: '#00ffff',
                emoji: client.emojis.cache.get("1121153046668378132"),
            },
            {
                ar: 'بلاتيني III',
                en: 'Platinum III',
                procColor: '#00ffff',
                emoji: client.emojis.cache.get("1121153122589487114"),
            },
            {
                ar: 'ألماسي I',
                en: 'Diamond I',
                procColor: '#8ed3f8',
                emoji: client.emojis.cache.get("1121153184535158884"),
            },
            {
                ar: 'ألماسي II',
                en: 'Diamond II',
                procColor: '#8ed3f8',
                emoji: client.emojis.cache.get("1121153252147343440"),
            },
            {
                ar: 'ألماسي III',
                en: 'Diamond III',
                procColor: '#8ed3f8',
                emoji: client.emojis.cache.get("1121153535346745425"),
            },
            {
                ar: 'نخبوي',
                en: 'Elite',
                procColor: '#7fa386',
                emoji: client.emojis.cache.get("1121153595677618247"),
            },
            {
                ar: 'بطولي',
                en: 'Champion',
                procColor: '#ffd71a',
                emoji: client.emojis.cache.get("1121153663382065162"),
            },
            {
                ar: 'خرافي',
                en: 'Unreal',
                procColor: '#de00ff',
                emoji: client.emojis.cache.get("1121153703030833274"),
            },
        ]

        // Draw Ranked Stats
        const drawRankedStats = async (data, msg) => {

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
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic', weight: "700", style: "italic"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "italic"})

                // Creating canvas
                const canvas = Canvas.createCanvas(2560, 1440)
                const ctx = canvas.getContext('2d')

                // Load background
                const overlayIMG = await Canvas.loadImage(`./assets/Ranked/${data.rankedData.baseRankId}.png`)
                ctx.drawImage(overlayIMG, 0, 0, canvas.width, canvas.height)

                // Side bar
                const RHS = await Canvas.loadImage(`./assets/Ranked/RHS.png`)
                ctx.drawImage(RHS, -30, -15, canvas.width + 30, canvas.height + 30)
                y = 1275
                for(let i = 0; i <= 17; i++){
                    if(i <= data.rankedData.highestDivision) ctx.globalAlpha = 1
                    else ctx.globalAlpha = 0.5
                    if(data.rankedData.lastUpdated === "1970-01-01T00:00:00Z")ctx.globalAlpha = 0.5
                    const RHSRanks = await Canvas.loadImage(`https://fnbrmena.com/api/media/v1/fortnite/ranked/ranked_icon_color_${i}.png`)
                    ctx.drawImage(RHSRanks, 2471, y, 82, 82)
                    y -= 70
                } ctx.globalAlpha = 1

                // Rank spark
                if(data.rankedData.lastUpdated !== "1970-01-01T00:00:00Z"){
                    var currentMode = 0;
                    var modes = ['destination-over', 'lighter', 'multiply', 'screen', 'overlay', 'darken',
                                'lighten', 'color-dodge', 'color-burn', 'hard-light', 'soft-light', 
                                'exclusion', 'hue', 'saturation', 'color', 'luminosity' ]
                    const overlay = await Canvas.loadImage(`./assets/Ranked/RankedBG.png`)
                    var mode = modes[currentMode]
                    currentMode = (currentMode+1)%(modes.length)
                    const tempCanvas = Canvas.createCanvas(2560, 1440)
                    const tempCtx = tempCanvas.getContext('2d')
                    tempCtx.drawImage(overlay, 0,0)
                    tempCtx.globalCompositeOperation = 'source-atop'
                    tempCtx.fillStyle = ranks[data.rankedData.currentDivision + 1].procColor
                    tempCtx.fillRect(0,0,canvas.width, canvas.height)
                    tempCtx.globalCompositeOperation = mode
                    tempCtx.drawImage(overlay, 0,0)
                    tempCtx.globalCompositeOperation = 'source-over'
                    ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height)
                }

                // Center Circle
                const CC = await Canvas.loadImage(`./assets/Ranked/CenterCircle.png`)
                ctx.drawImage(CC, 0, 0, canvas.width, canvas.height)
                ctx.beginPath()
                if(data.rankedData.lastUpdated !== "1970-01-01T00:00:00Z"){
                    ctx.strokeStyle = ranks[data.rankedData.currentDivision + 1].procColor
                    ctx.arc(1280, 490, 360, -1.5707963267948966, ((data.rankedData.promotionProgress * Math.PI) * 2) - 1.5707963267948966 , false)
                }else{
                    ctx.strokeStyle = ranks[0].procColor
                    ctx.arc(1280, 490, 360, 0, 0, true)
                }
                ctx.lineWidth = 15
                ctx.stroke()

                // Drop shadow
                ctx.shadowOffsetY = 40
                ctx.shadowOffsetX = 40
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)"
                if(data.rankedData.lastUpdated !== "1970-01-01T00:00:00Z") ctx.shadowColor = ranks[data.rankedData.currentDivision + 1].procColor
                ctx.shadowBlur = 60

                // Add rank image
                const rankImage = await Canvas.loadImage(data.rankedData.images.currentDivision)
                ctx.drawImage(rankImage, 805, 7, 950, 950)

                // Change shadow color
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)"

                // Add the rank promotion progress
                ctx.fillStyle = 'white'
                ctx.font = '72px Burbank Big Condensed'
                ctx.textAlign = "center"
                if(data.rankedData.currentPlayerRanking) ctx.fillText(`#${data.rankedData.currentPlayerRanking}`, canvas.width / 2, 935)
                else ctx.fillText(`${(data.rankedData.promotionProgress * 100) | 0}%`,  canvas.width / 2, 935)

                // Change drop shadow
                ctx.shadowOffsetY = 0
                ctx.shadowOffsetX = 0
                if(data.rankedData.lastUpdated !== "1970-01-01T00:00:00Z") ctx.shadowColor = ranks[data.rankedData.currentDivision + 1].procColor

                // Rank name
                if(userData.lang === "en"){
                    ctx.font = '250px Burbank Big Condensed'
                    ctx.fillText(ranks[data.rankedData.lastUpdated === "1970-01-01T00:00:00Z" ? 0 : data.rankedData.currentDivision + 1].en.toUpperCase(),  canvas.width / 2, 1185)
                }else if(userData.lang === "ar"){
                    ctx.font = '250px Arabic'
                    ctx.fillText(ranks[data.rankedData.lastUpdated === "1970-01-01T00:00:00Z" ? 0 : data.rankedData.currentDivision + 1].ar,  canvas.width / 2, 1185)
                }

                // Change shadow color
                ctx.shadowOffsetY = 10
                ctx.shadowOffsetX = 10
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)"

                // Add the account name
                ctx.textAlign = "left"
                ctx.globalAlpha = 0.2
                ctx.font = '75px Burbank Big Condensed'
                ctx.fillStyle = ctx.fillStyle = "white"
                ctx.beginPath()
                ctx.roundRect(-30, 55, ctx.measureText(`FNBRMENA | ${data.account.displayName}`.toUpperCase()).width + 80, 100, [20])
                ctx.fill()
                ctx.globalAlpha = 1
                ctx.fillText(`FNBRMENA | ${data.account.displayName}`.toUpperCase(),  25, 130)

                if(data.rankedData.rankingType === "ranked-zb") var rankingType = await Canvas.loadImage(`https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FIoJKRyk.png?alt=media&token=88be0a4a-db43-4a63-ad4c-88633879fc22`)
                else if(data.rankedData.rankingType === "ranked-br") var rankingType = await Canvas.loadImage(`https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FhoZI3ew.png?alt=media&token=55c11d8a-f8b7-4c8e-97a3-7783bf29fcf8`)
                else var rankingType = await Canvas.loadImage(`https://media.fortniteapi.io/images/037a909c38715a43d8d0babd06a43d2c/transparent.png`)
                ctx.drawImage(rankingType, 7, 160, 110, 110)

                // Reset shadow blur
                ctx.shadowBlur = 60

                // Set last updated field
                ctx.textAlign = "center"
                ctx.fillStyle = 'white'
                ctx.globalAlpha = 0.5
                if(userData.lang === "en"){
                    ctx.font = '50px Burbank Big Condensed'
                    if(data.rankedData.lastUpdated === "1970-01-01T00:00:00Z") ctx.fillText(`THE PLAYER HASN'T PLAYED RANKED MATCHES YET!`,  canvas.width / 2, 990)
                    else ctx.fillText(`LAST UPDATED ${moment(data.rankedData.lastUpdated).fromNow().toUpperCase()}`,  canvas.width / 2, 990)
                }else if(userData.lang === "ar"){
                    ctx.font = '50px Arabic'
                    if(data.rankedData.lastUpdated === "1970-01-01T00:00:00Z") ctx.fillText(`لم يلعب اللاعب طور التصنيف بعد!`,  canvas.width / 2, 990)
                    else ctx.fillText(`اخر تحديث ${moment(data.rankedData.lastUpdated).fromNow().toUpperCase()}`,  canvas.width / 2, 990)
                }

                // Set account status
                if(userData.lang === "en"){
                    ctx.font = '50px Burbank Big Condensed'
                    if(data.rankedData.stats) ctx.fillText(`${data.rankedData.stats.matches} MATCHES        -        ${data.rankedData.stats.wins} WINS        -        ${data.rankedData.stats.deaths} DEATHS        -        ${data.rankedData.stats.kills} KILLS        -        ${(data.rankedData.stats.minutesPlayed / 60) | 0} HOURS PLAYED`,  canvas.width / 2, canvas.height - 15)
                    else ctx.fillText(`NO STATS AVAILABLE!`,  canvas.width / 2, canvas.height - 15)
                }else if(userData.lang === "ar"){
                    ctx.font = '50px Arabic'
                    if(data.rankedData.stats) ctx.fillText(`${data.rankedData.stats.matches} مواجهة        -        ${data.rankedData.stats.wins} أنتصار        -        ${data.rankedData.stats.deaths} خسارة        -        ${data.rankedData.stats.kills} ذبحات        -        ${(data.rankedData.stats.minutesPlayed / 60) | 0} ساعة لعب`,  canvas.width / 2, canvas.height - 15)
                    else ctx.fillText(`لا توجد احصائيات!`,  canvas.width / 2, canvas.height - 15) 
                }

                ctx.globalAlpha = 1

                // Send the image
                var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${data.account.id}.png`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {

                    // Try sending it on jpg file format [LOWER QUALITY]
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${data.account.id}.jpg`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                })

            } catch (err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }

        }

        // User input
        var userInput = {
            platform: null,
            playlist: null,
            avSeasons: [],
            platformOptions: [],
            playlistOptions: [],
            statsPlaylistRow: null
        }

        // Create an embed
        const rankedStatsPlatformEmbed = new Discord.EmbedBuilder()
        rankedStatsPlatformEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            rankedStatsPlatformEmbed.setAuthor({name: `Player Ranked Stats`, iconURL: 'https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FKnaEbr7.png?alt=media&token=7e69303f-0f23-42b6-a623-8e4915d0835f'})
            rankedStatsPlatformEmbed.setDescription(`This command will return an image contains the ${text} player ranked stats. Please click on the Drop-Down menu and select a platform.\n\n\`You have only 30 seconds until this operation ends, Make it quick\`!`)
        }else if(userData.lang === "ar"){
            rankedStatsPlatformEmbed.setAuthor({name: `إحصائيات تصنيف اللاعب`, iconURL: 'https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FKnaEbr7.png?alt=media&token=7e69303f-0f23-42b6-a623-8e4915d0835f'})
            rankedStatsPlatformEmbed.setDescription(`سيعيد هذا الأمر صورة تحتوي على إحصائيات مرتبة اللاعب ${text}. الرجاء الضغط على السهم لاختيار نوع المنصه.\n\n\`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل\`!`)
        }

        // Create a row for cancel button
        const cancelButtonDataRow = new Discord.ActionRowBuilder()
        
        // Add buttons
        if(userData.lang === "en") cancelButtonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`Cancel-${alias}`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )

        else if(userData.lang === "ar") cancelButtonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId(`Cancel-${alias}`)
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )

        // Create a row for drop down menu for categories
        const rankedStatsPlatformRow = new Discord.ActionRowBuilder()

        // Add English options
        if(userData.lang === "en") userInput.platformOptions.push(
            {
                label: `Epic Games`,
                value: `epic`,
                default: false,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `Playstation`,
                value: `psn`,
                default: false,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `Xbox`,
                value: `xbl`,
                default: false,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        // Add Arabic options
        else if(userData.lang === "ar") userInput.platformOptions.push(
            {
                label: `ايبك قيمز`,
                value: `epic`,
                default: false,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `بلايستيشن`,
                value: `psn`,
                default: false,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `اكسبوكس`,
                value: `xbl`,
                default: false,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        const statsPlatformDropMenu = new Discord.StringSelectMenuBuilder()
        statsPlatformDropMenu.setCustomId(`Platform-${alias}`)
        if(userData.lang === "en") statsPlatformDropMenu.setPlaceholder('Select a Platform!')
        else if(userData.lang === "ar") statsPlatformDropMenu.setPlaceholder('اختر منصه!')
        statsPlatformDropMenu.addOptions(userInput.platformOptions)

        // Add the drop menu to the categoryDropMenu
        rankedStatsPlatformRow.addComponents(statsPlatformDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [rankedStatsPlatformEmbed], components: [rankedStatsPlatformRow, cancelButtonDataRow], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for user input
        const colllector = await message.channel.createMessageComponentCollector({filter, time: 3 * 60000, errors: ['time'] })
        colllector.on('collect', async collected => {
            collected.deferUpdate()

            // If cancel button has been clicked
            if(collected.customId === `Cancel-${alias}`) colllector.stop()

            // If the user selected a platform
            if(collected.customId === `Platform-${alias}`){

                // Add the chosen platform to userInput obj
                userInput.platform = collected.values[0]

                // Set platform options
                userInput.platformOptions.forEach(e => (userInput.platform === e.value) ? e.default = true : e.default = false)
                rankedStatsPlatformRow.components[0].setOptions(userInput.platformOptions)

                // Add English options
                if(userData.lang === "en") userInput.playlistOptions = [
                    {
                        label: `Ranked Battle Royale`,
                        value: `br`,
                        default: false,
                        // emoji: `${emojisObject.build.name}:${emojisObject.build.id}`
                    },
                    {
                        label: `Ranked Zero Build`,
                        value: `zb`,
                        default: false,
                        // emoji: `${emojisObject.nobuild.name}:${emojisObject.nobuild.id}`
                    },
                    {
                        label: `Ranked Rocket Racing`,
                        value: `dr`,
                        default: false,
                        // emoji: `${emojisObject.rocketracing.name}:${emojisObject.rocketracing.id}`
                    },
                    {
                        label: `Ranked Rocket Racing`,
                        value: `rr`,
                        default: false,
                        // emoji: `${emojisObject.rocketracing.name}:${emojisObject.rocketracing.id}`
                    },
                ]

                // Add Arabic options
                else if(userData.lang === "ar") userInput.playlistOptions = [
                    {
                        label: `باتل رويال مُصنّفة`,
                        value: `br`,
                        default: false,
                        // emoji: `${emojisObject.build.name}:${emojisObject.build.id}`
                    },
                    {
                        label: `بلا بناء مُصنّفة`,
                        value: `zb`,
                        default: false,
                        // emoji: `${emojisObject.nobuild.name}:${emojisObject.nobuild.id}`
                    },
                    {
                        label: `سباق سيارات مُصنّفة`,
                        value: `dr`,
                        default: false,
                        // emoji: `${emojisObject.rocketracing.name}:${emojisObject.rocketracing.id}`
                    },
                    {
                        label: `سباق سيارات مُصنّفة`,
                        value: `rrn`,
                        default: false,
                        // emoji: `${emojisObject.rocketracing.name}:${emojisObject.rocketracing.id}`
                    },
                ]

                // Builds or zero build 
                const statsPlaylistDropMenu = new Discord.StringSelectMenuBuilder()
                statsPlaylistDropMenu.setCustomId(`Playlist-${alias}`)
                if(userData.lang === "en") statsPlaylistDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") statsPlaylistDropMenu.setPlaceholder('الرجاء الأختيار!')
                statsPlaylistDropMenu.addOptions(userInput.playlistOptions)

                // Add the drop menu to the categoryDropMenu
                userInput.statsPlaylistRow = new Discord.ActionRowBuilder()
                userInput.statsPlaylistRow.addComponents(statsPlaylistDropMenu)

                // Edit the main message
                dropMenuMessage.edit({embeds: [rankedStatsPlatformEmbed], components: [rankedStatsPlatformRow, userInput.statsPlaylistRow, cancelButtonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
                
            }

            // If the user selected a playlist
            if(collected.customId === `Playlist-${alias}`){

                // Add the chosen type to userInput obj
                userInput.playlist = collected.values[0]

                // Set platform options
                userInput.platformOptions.forEach(e => (userInput.platform === e.value) ? e.default = true : e.default = false)
                rankedStatsPlatformRow.components[0].setOptions(userInput.platformOptions)

                // Set playlist options
                userInput.playlistOptions.forEach(e => (userInput.playlist === e.value) ? e.default = true : e.default = false)
                userInput.statsPlaylistRow.components[0].setOptions(userInput.playlistOptions)

                // Create a row for buttons
                const buttonDataRow = new Discord.ActionRowBuilder()

                // Add buttons
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`current-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Current")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`current-${alias}`)
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("التصنيف الحالي")
                )

                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Seasonal-${alias}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("Seasonal")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Seasonal-${alias}`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setLabel("موسمي")
                )

                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Cancel-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Cancel-${alias}`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )

                // Edit the main message
                dropMenuMessage.edit({embeds: [rankedStatsPlatformEmbed], components: [rankedStatsPlatformRow, userInput.statsPlaylistRow, buttonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })

            }

            // If user clicked on the Seasonal button
            if(collected.customId === `Seasonal-${alias}`){
                userInput.avSeasons = []

                await FNBRMENA.RankedStats(text, userInput.platform, userInput.playlist)
                .then(async res => {

                    // Set platform options
                    userInput.platformOptions.forEach(e => (userInput.platform === e.value) ? e.default = true : e.default = false)
                    rankedStatsPlatformRow.components[0].setOptions(userInput.platformOptions)

                    // Set playlist options
                    userInput.playlistOptions.forEach(e => (userInput.playlist === e.value) ? e.default = true : e.default = false)
                    userInput.statsPlaylistRow.components[0].setOptions(userInput.playlistOptions)

                    // Request seasons data
                    for(const i of res.data.rankedData) userInput.avSeasons.push({
                        label: `${ranks[i.lastUpdated === "1970-01-01T00:00:00Z" ? 0 : i.currentDivision + 1][userData.lang]}`,
                        description: `${userData.lang === "en" ? i.currentRanking ? 'Current Ranking' : moment(i.endTime).fromNow() : i.currentRanking ? 'التصنيف الحالي' : moment(i.endTime).fromNow()}`,
                        value: `${i.trackguid}`,
                        emoji: `${ranks[i.lastUpdated === "1970-01-01T00:00:00Z" ? 0 : i.currentDivision + 1].emoji.name}:${ranks[i.lastUpdated === "1970-01-01T00:00:00Z" ? 0 : i.currentDivision + 1].emoji.id}`
                    })

                    // Stats Seasonal/Lifetime 
                    const rankedStatsSeasonDropMenu = new Discord.StringSelectMenuBuilder()
                    rankedStatsSeasonDropMenu.setCustomId(`Season-${alias}`)
                    if(userData.lang === "en") rankedStatsSeasonDropMenu.setPlaceholder('Nothing selected!')
                    else if(userData.lang === "ar") rankedStatsSeasonDropMenu.setPlaceholder('الرجاء الأختيار!')
                    rankedStatsSeasonDropMenu.addOptions(userInput.avSeasons)

                    // Add the drop menu to the categoryDropMenu
                    const rankedStatsSeasonRow = new Discord.ActionRowBuilder()
                    rankedStatsSeasonRow.addComponents(rankedStatsSeasonDropMenu)
                    
                    // Edit the main message
                    dropMenuMessage.edit({embeds: [rankedStatsPlatformEmbed], components: [rankedStatsPlatformRow, userInput.statsPlaylistRow, rankedStatsSeasonRow, cancelButtonDataRow], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })
                    
                }).catch(async err => {
                    if(err.response.status === 404){

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

                        }

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

            // If the user selected a season
            if(collected.customId === `Season-${alias}`){

                FNBRMENA.RankedStats(text, userInput.platform, userInput.playlist)
                .then(res => {

                    // Call the draw function
                    drawRankedStats({
                        account: res.data.account,
                        rankedData: res.data.rankedData.find(e => e.trackguid === collected.values[0])}, dropMenuMessage)
                    
                }).catch(async err => {
                    if(err.response.status === 404){

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

                        }

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

            // If user clicked on the current button
            if(collected.customId === `current-${alias}`){

                FNBRMENA.RankedStats(text, userInput.platform, userInput.playlist)
                .then(res => {

                    // Call the draw function
                    drawRankedStats({
                        account: res.data.account,
                        rankedData: res.data.rankedData[res.data.rankedData.length - 1]}, dropMenuMessage)
                    
                }).catch(async err => {
                    if(err.response.status === 404){

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

                        }

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

        })

        // When time ends
        colllector.on('end', async (e) => {

            const map = []
            e.map(interaction => map.push(interaction.customId))

            if(map.includes("Cancel") || (!map.includes(`current-${alias}`) && !map.includes(`Seasonal-${alias}`) && !map.includes(`Season-${alias}`))) try {
                dropMenuMessage.delete()
            } catch {
                    
            }

        })
    }
}
