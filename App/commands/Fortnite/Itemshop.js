const moment = require('moment')
const Canvas = require('canvas')
const axios = require('axios')

module.exports = {
    commands: ['itemshop', 'shop'],
    type: 'Fortnite',
    descriptionEN: 'Get an image for the current itemshop.',
    descriptionAR: 'الحصول على صورة لمتجر العنصر الحالي.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 30,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        FNBRMENA.itemshop(userData.lang)
        .then(async res => {

            // Constant variavble holds the shop data
            const data = res.data.shop.filter(e => {
                return e.mainType !== "sparks_song"
            })

            // Generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading a total ${data.length} cosmetics please wait... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${data.length} عنصر الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
            const msg = await message.reply({embeds: [generating], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
            try {

                data.sort((a, b) => {
                    const idA = a.section.id;
                    const idB = b.section.id;
                    if (idA < idB) return -1;
                    if (idA > idB) return 1;
                    return 0;
                });

                // ...Start generating shop image

                // Calculate image dimensions

                // Canvas variables
                var width = 100
                var height = 512 + 100 + 275
                var newline = 0
                var x = 50
                var y = 50

                // Canvas length
                var length = data.length

                if (length <= 10) length = length / 2
                else if (length >= 10 && length <= 20) length = length / 4
                else if (length > 20 && length <= 50) length = length / 6
                else if (length > 50 && length <= 100) length = length / 8
                else if (length > 100 && length <= 150) length = length / 11
                else if (length > 150 && length <= 200) length = length / 15
                else length = length / 14

                // Forcing to be int
                if (length % 2 !== 0) {
                    length += 1;
                    length = length | 0;
                }

                // Creating width
                width += (length * 512) + (length * 10) - 10

                // Creating height
                for (let i = 0; i < data.length; i++) {

                    if (newline === length) {
                        height += 512 + 10
                        newline = 0
                    }
                    newline++
                }

                // Registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', { family: 'Arabic', weight: "400", style: "bold" });
                Canvas.registerFont('./assets/font/BurbankBigRegularBlack.otf', { family: 'Burbank Big Condensed' })

                // AplyText
                const applyText = (canvas, text, width, font) => {
                    const ctx = canvas.getContext('2d')
                    let fontSize = font
                    do {
                        if (userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                        else if (userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                    } while (ctx.measureText(text).width > width);
                    return ctx.font
                }

                // Create canvas
                const canvas = Canvas.createCanvas(width, height)
                const ctx = canvas.getContext('2d')
                ctx.fillStyle = '#ffffff'

                // Set background
                const background = await Canvas.loadImage('./assets/Itemshop/background.png')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                // Loop through every shop item
                newline = 0
                for (const item of data) {
                    if(item.mainType === "sparks_song") continue

                    const image = item.displayAssets[0]?.url ? item.displayAssets[0].url : "https://firebasestorage.googleapis.com/v0/b/fnbrmena-bot.appspot.com/o/code_images%2FHVH5sqV.png?alt=media&token=41c26ee2-c98e-492d-a84c-299a69ac6012"
                    const rarity = item.series ? item.series?.id : item.rarity?.id
                    newline++

                    
                    console.log(item.displayName)

                    // Searching...
                    if (rarity === "Legendary") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "Epic") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "Rare") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "Uncommon") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "Common") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "MarvelSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "DCUSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "CUBESeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "CreatorCollabSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "ColumbusSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "ShadowSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "SlurpSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "FrozenSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "LavaSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else if (rarity === "PlatformSeries") {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    } else {

                        // Creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)

                    }

                    // Display item name
                    ctx.textAlign = 'center'
                    ctx.font = applyText(canvas, item.displayName, 450, 40)
                    ctx.fillText(item.displayName, 256 + x, (512 - 15) + y)

                    // Add the item price

                    // Write vbucks image
                    const vbucks = await Canvas.loadImage('https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png');
                    ctx.drawImage(vbucks, (5 + x), (y + 484), 25, 25);

                    // Set banners
                    if(item.banner?.id.toLowerCase() === "new"){
                        const newBanner = await Canvas.loadImage('./assets/Itemshop/newbanner.png');
                        ctx.drawImage(newBanner, (10 + x), (y + 10), 80, 45);
                    }

                    ctx.textAlign = "left"
                    ctx.font = applyText(canvas, item.price.finalPrice, 450, 20)
                    ctx.fillText(item.price.finalPrice, 32 + x, (512 - 5) + y)

                    // Add last seen date

                    // Moment
                    var Now = moment();
                    const day = Now.diff(item.previousReleaseDate !== null ? moment(item.previousReleaseDate) : moment(item.firstReleaseDate), 'days');
                    ctx.textAlign = "right"
                    ctx.font = applyText(canvas, day, 450, 20)
                    ctx.fillText(userData.lang === "en" ? `${day} Days` : `${day} يوم`, (512 - 2.5) + x, (512 - 4) + y)
                    
                    // Utilizing tags
                    var yTags = 7 + y
                    var xTags = ((512 - 59) - 4) + x

                    // Loop through granted items
                    if (item.granted.length < 8) for (const granted of item.granted) {

                        if ((granted.id !== item.mainId) && granted.images.icon !== null) {

                            // The granted icons
                            const grantedItem = await Canvas.loadImage(granted.images.icon)
                            ctx.drawImage(grantedItem, xTags, yTags, 50, 50)

                            yTags += 55
                        }
                    }
                    console.log("4")

                    // Add juno style top left
                    const filteredIndex = item.displayAssets.findIndex(item => item.primaryMode === 'Juno');
                    if(filteredIndex != -1){
                        
                        //draw the npc img
                        const juno = await Canvas.loadImage(item.displayAssets[filteredIndex].url);
                        ctx.drawImage(juno, x + 5, y + 5, 90, 90)
                    }
                    console.log("5")

                    // Changing x and y
                    x = x + 10 + 512;
                    if (length === newline) {
                        y = y + 10 + 512;
                        x = 50;
                        newline = 0;
                    }
                }

                // Add code
                ctx.fillStyle = '#ffffff'
                ctx.textAlign = 'left';
                const code = await Canvas.loadImage(userData.lang === "en" ? './assets/Itemshop/code.png' : './assets/Itemshop/codeAR.png')
                ctx.drawImage(code, canvas.width - 1050, (height - 250), 1000, 200)
                ctx.font = `125px Burbank Big Condensed`

                // Add the timer
                await axios({
                    method: "GET",
                    url: "https://api.nitestats.com/v1/epic/modes-smart"
                }).then(async cal => {
                    moment.locale("en")

                    // Get the states array
                    const currentDate = moment();
                    let activeDailyStoreEnd = moment(cal.data.channels['client-events'].states[0].state.dailyStoreEnd);
                    if (currentDate.isAfter(activeDailyStoreEnd)) {
                        
                        activeDailyStoreEnd = moment(cal.data.channels['client-events'].states[1].state.dailyStoreEnd);
                    }
                    
                    const date = moment.duration(moment(activeDailyStoreEnd).diff(moment()))
                    const hours = date.hours()
                    const minutes = date.minutes()
                    const seconds = date.seconds()

                    // Display the timer
                    const timer = await Canvas.loadImage('./assets/Itemshop/timer.png')
                    ctx.drawImage(timer, 42, (height - 642), 1000, 1000)
                    ctx.textAlign = 'left';
                    ctx.font = `150px Burbank Big Condensed`
                    ctx.fillText(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`, 300, (height - 95))
                })
                
                moment.locale(userData.lang)
                ctx.textAlign = 'center';
                ctx.font = `120px ${userData.lang === "en" ? "Burbank Big Condensed" : "Arabic"}`
                ctx.fillText(moment(res.data.lastUpdate.date).format(`dddd, Do MMMM YYYY`), (width / 2), (height - 55))

                // Send the itemshop image
                var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.lastUpdate.uid}.png`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {

                    // Try sending it on jpg file format [LOWER QUALITY]
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.lastUpdate.uid}.jpg`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                })
                
            } catch(err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}