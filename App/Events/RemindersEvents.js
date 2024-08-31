const Discord = require('discord.js')
const Canvas = require('canvas')
const moment = require('moment')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Reminder)

    var UID = []
    var number = 1

    //handle new active playlists
    const remindersEvent = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("reminders").once('value', async function (data) {
            const status = data.val().Active

            //check if the status is true
            if(status){

                //request fortnite itemshop
                await FNBRMENA.itemshop("en")
                .then(async res => {

                    //store shop data first time bot is active
                    if(number === 0){
                        UID = await res.data.lastUpdate.uid
                        number++
                    }

                    //if there is a change is shop
                    if(JSON.stringify(res.data.lastUpdate.uid) !== JSON.stringify(UID)){
                        UID = await res.data.lastUpdate.uid

                        //seeting up the db firestore
                        var db = admin.firestore()

                        //define the collection
                        const docRef = await db.collection("Users")

                        //get the collection data
                        const snapshot = await docRef.get()

                        //get all docs in Users collection
                        snapshot.forEach(async doc => {

                            const userReminders = await docRef.doc(`${doc.id}`).collection("Reminders").get()
                            userReminders.forEach(async e => {

                                //loop though every item id that is in the itemshop
                                for(let j = 0; j < res.data.shop.length; j++){

                                    if(e.id === res.data.shop[j].mainId){
                                        //the item has been released

                                        FNBRMENA.searchByID(e.data().lang, res.data.shop[j].mainId)
                                        .then(async userITEM => {

                                            //registering fonts
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                                                family: 'Arabic',
                                                style: "bold"
                                            });
                                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                                                family: 'Burbank Big Condensed',
                                                style: "bold"
                                            })

                                            //aplyText
                                            const applyText = (canvas, text, width, font) => {
                                                const ctx = canvas.getContext('2d');
                                                let fontSize = font;
                                                do {
                                                    if(e.data().lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    else if(e.data().lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                                                } while (ctx.measureText(text).width > width);
                                                return ctx.font;
                                            }

                                            //creating canvas
                                            const canvas = Canvas.createCanvas(1024, 1024);
                                            const ctx = canvas.getContext('2d');

                                            //skin informations
                                            if(userITEM.data.item.introduction != null){
                                                var chapter = userITEM.data.item.introduction.chapter.substring(userITEM.data.item.introduction.chapter.indexOf(" "), userITEM.data.item.introduction.chapter.length).trim()
                                                var season = userITEM.data.item.introduction.season.substring(userITEM.data.item.introduction.season.indexOf(" "), userITEM.data.item.introduction.season.length).trim()

                                                if(e.data().lang === "en") var seasonChapter = `C${chapter}S${season}`
                                                else if(e.data().lang == "ar")var seasonChapter = `الفصل ${chapter} الموسم ${season}`

                                            }else{

                                                if(e.data().lang === "en") var seasonChapter = `${userITEM.data.item.added.version}v`
                                                else if(e.data().lang == "ar")var seasonChapter = `تحديث ${userITEM.data.item.added.version}`
                                                
                                            }

                                            if(userITEM.data.item.gameplayTags.length != 0){
                                                for(let j = 0; j < userITEM.data.item.gameplayTags.length; j++){
                                                    if(userITEM.data.item.gameplayTags[j].includes('Source')){

                                                        if(userITEM.data.item.gameplayTags[j].toLowerCase().includes("itemshop")){

                                                            if(e.data().lang === "en") var Source = "ITEMSHOP"
                                                            else if(e.data().lang === "ar") var Source = "متجر العناصر"
                                                        }else if(userITEM.data.item.gameplayTags[j].toLowerCase().includes("battlepass")){

                                                            if(e.data().lang === "en") var Source = "BATTLEPASS"
                                                            else if(e.data().lang === "ar") var Source = "بطاقة المعركة"
                                                        }else if(userITEM.data.item.gameplayTags[j].toLowerCase().includes("event")){

                                                            if(e.data().lang === "en") var Source = "EVENT"
                                                            else if(e.data().lang === "ar") var Source = "حدث"
                                                        }else if(userITEM.data.item.gameplayTags[j].toLowerCase().includes("platform") || (userITEM.data.item.gameplayTags[j].toLowerCase().includes("promo"))){

                                                            if(e.data().lang === "en") var Source = "EXCLUSIVE"
                                                            else if(e.data().lang === "ar") var Source = "حصري"
                                                        }

                                                        break
                                                    }else var Source = userITEM.data.item.type.name.toUpperCase()
                                                }

                                            }else var Source = userITEM.data.item.type.name.toUpperCase()

                                            //item details
                                            var name = userITEM.data.item.name
                                            var price = userITEM.data.item.price
                                            var image = userITEM.data.item.images.icon
                                            if(userITEM.data.item.series !== null) var rarity = userITEM.data.item.series.id
                                            else var rarity = userITEM.data.item.rarity.id

                                            //searching...
                                            if(rarity === "Legendary"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)

                                            }else if(rarity === "Epic"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "Rare"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "Uncommon"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "Common"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "MarvelSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "DCUSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "CUBESeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "CreatorCollabSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "ColumbusSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "ShadowSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "SlurpSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "FrozenSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "LavaSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else if(rarity === "PlatformSeries"){

                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }else{
                                                
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                                ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 1024, 1024)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                                ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                                
                                            }

                                            //add the item name
                                            ctx.textAlign = 'center';
                                            ctx.fillStyle = '#ffffff';
                                            ctx.font = applyText(canvas, name, 900, 72)

                                            if(e.data().lang === "en"){
                                                ctx.fillText(name, 512, (1024 - 30))

                                                //add the item season chapter text
                                                ctx.textAlign = "left"
                                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                                ctx.fillText(seasonChapter, 5, (1024 - 7.5))

                                                //add the item source
                                                ctx.textAlign = "right"
                                                ctx.font = applyText(canvas, Source, 900, 40)
                                                ctx.fillText(Source, (1024 - 5), (1024 - 7.5))

                                            }else if(e.data().lang === "ar"){
                                                ctx.fillText(name, 512, (1024 - 60))

                                                //add season chapter text
                                                ctx.textAlign = "left"
                                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                                ctx.fillText(seasonChapter, 5, (1024 - 12.5))

                                                //add the item source
                                                ctx.textAlign = "right"
                                                ctx.font = applyText(canvas, Source, 900, 40)
                                                ctx.fillText(Source, (1024 - 5), (1024 - 12.5))

                                            }

                                            //inilizing tags
                                            var y = 7
                                            var x = (canvas.width - 30) - 7

                                            for(let i = 0; i < userITEM.data.item.gameplayTags.length; i++){

                                                //if the item is animated
                                                if(userITEM.data.item.gameplayTags[i].includes('Animated')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                                    y += 40
                                                }

                                                //if the item is reactive
                                                if(userITEM.data.item.gameplayTags[i].includes('Reactive')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                                    y += 40
                                                }

                                                //if the item is synced emote
                                                if(userITEM.data.item.gameplayTags[i].includes('Synced')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                                    y += 40
                                                }

                                                //if the item is traversal
                                                if(userITEM.data.item.gameplayTags[i].includes('Traversal')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                                    y += 40
                                                }

                                                //if the item has styles
                                                if(userITEM.data.item.gameplayTags[i].includes('HasVariants') || userITEM.data.item.gameplayTags[i].includes('HasUpgradeQuests')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                                    y += 40
                                                }
                                            }

                                            //if the item contains copyrited audio
                                            if(userITEM.data.item.copyrightedAudio){

                                                //the itm is animated add the animated icon
                                                const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                                ctx.drawImage(skinholder, x, y, 30, 30)

                                                y += 40
                                            }

                                            //if the item contains built in emote
                                            if(userITEM.data.item.builtInEmote != null){

                                                //add the builtInEmote icon
                                                const builtInEmote = await Canvas.loadImage(userITEM.data.item.builtInEmote.images.icon)
                                                ctx.drawImage(builtInEmote, x, y, 30, 30)
                                            }

                                            //setting up moment
                                            moment.locale(e.data().lang)
                                            const Now = moment()
                                            const long = moment(e.data().date)
                                            const day = Now.diff(long, 'days')

                                            //get the collection from the database
                                            const remindersLeft = await db.collection("Users").doc(`${doc.id}`).collection(`Reminders`).get()

                                            //create embed
                                            const itemInfo = new Discord.EmbedBuilder()
                                            itemInfo.setColor(FNBRMENA.Colors(rarity))

                                            //set titles and fields
                                            if(e.data().lang == "en"){
                                                itemInfo.setAuthor({name: `Reminder Alert, ${userITEM.data.item.name}`, iconURL: image})
                                                itemInfo.setDescription(`The ${userITEM.data.item.name} (${userITEM.data.item.type.name}) is now in the itemshop, the item has been removed from your reminders and you have now 1 extra space to add another new item to your reminder list.\n\nInformation about ${userITEM.data.item.name}:\n**Price:** \`${price}\`\n**Days Waiting:** \`${day} day(s)\`\n\nYou have ${remindersLeft.size - 1} reminders out of 20.`)
                                            }else if(e.data().lang === "ar"){
                                                itemInfo.setAuthor({name: `تنبيه للتذكير, ${userITEM.data.item.name}`, iconURL: image})
                                                itemInfo.setDescription(`عنصر ${userITEM.data.item.name} (${userITEM.data.item.type.name}) الأن متوفر في متجر العناصر, تم حذف العنصلا من نظام التذكيرات و لديك الان مساحة اضافية لاضافة عناصر اخرى. \n\nمعلومات عن ${userITEM.data.item.name}:\n**السعر:** \`${price}\`\n**الأيام المنتظرة:** \`${day} يوم\`\n\nلديك ${remindersLeft.size - 1} عنصر مضاف من اصل 20.`)
                                            }

                                            //send the message
                                            const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${userITEM.data.item.id}.png`})
                                            await message.send({content: `<@${doc.id}>`, embeds: [itemInfo], files: [att]})
                                            await docRef.doc(`${doc.id}`).collection("Reminders").doc(res.data.shop[j].mainId).delete()

                                        }).catch(async err => {
                                            FNBRMENA.eventsLogs(admin, client, err, 'reminders')
                                
                                        })
                                    }
                                }
                            })
                        })
                    }
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'reminders')
        
                })
            }
        })
    }
    setInterval(remindersEvent, 1 * 60000)
}