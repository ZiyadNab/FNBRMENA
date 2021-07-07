const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const Canvas = require('canvas')

module.exports = {
    commands: 'style',
    expectedArgs: '[ Name of the cosmetic ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inislizing num
        var num = 0

        //handleing errors
        var errorHandleing = 0

        //request data
        FNBRMENA.SearchByType(lang, text, 'outfit')
        .then(async res => {

            //if there is no item found
            if(res.data.items.length === 0){

                //create an error
                errorHandleing++

                if(lang === "en"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`No cosmetic has been found check your speling and try again ${errorEmoji}`)
                    message.reply(Err)
                }else if(lang === "ar"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                    message.reply(Err)
                }
            }

            //if the result is more than one item
            if(res.data.items.length > 1){

                //create embed
                const list = new Discord.MessageEmbed()

                //set the color
                list.setColor('#BB00EE')

                //set title
                if(lang === "en") list.setTitle(`Please choose your item from the list below`)
                else if(lang === "ar") list.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

                //loop throw every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.items.length; i++){

                    //store the name to the string
                    string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                }

                //how many items where matchinh the user input?
                if(lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                else if(lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                //set Description
                list.setDescription(string)

                //send the message and wait for answer
                await message.channel.send(list)
                .then(async list => {

                    //filtering outfits
                    const filter = async m => await m.author.id === message.author.id

                    //add the reply
                    if(lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                    else if(lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                    
                    await message.reply(reply)
                    .then( async notify => {

                        //listen for user input
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //delete messages
                            await notify.delete()
                            await list.delete()

                            //if the user chosen inside range
                            if(collected.first().content >= 0 && collected.first().content < res.data.items.length){

                                //change the item index
                                num = collected.first().content
                            }else{

                                //add an error
                                errorHandleing++

                                //if user typed a number out of range
                                if(lang === "en"){
                                    msg.delete()
                                    notify.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                    message.reply(error)
                                }else if(lang === "ar"){
                                    msg.delete()
                                    notify.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                    message.reply(error)
                                }
                            }
                        })
                    })
                })
            }

            //if there is no error
            if(errorHandleing === 0){
                
                //if there is an item that has styles
                if(res.data.items.length > 0 && res.data.items[num].displayAssets.length !== 0){

                    //getting item data loading
                    const generating = new Discord.MessageEmbed()
                    generating.setColor('#BB00EE')
                    const emoji = client.emojis.cache.get("805690920157970442")
                    if(lang === "en") generating.setTitle(`Loading item data... ${emoji}`)
                    else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${emoji}`)
                    message.channel.send(generating)
                    .then( async msg => {

                        //aplyText
                        const applyText = (canvas, text) => {
                            const ctx = canvas.getContext('2d');
                            let fontSize = 36;
                            do {
                                if(lang === "en"){
                                    ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                }else if(lang === "ar"){
                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                }
                            } while (ctx.measureText(text).width > 420);
                            return ctx.font;
                        };

                        //registering fonts
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                        //loop throw every style
                        for(let i = 0; i < res.data.items[num].displayAssets.length; i ++){

                            //creating canvas
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            //set the item info
                            var name = res.data.items[num].name
                            var description = res.data.items[num].description
                            var image = res.data.items[num].displayAssets[i].url
                            if(res.data.items[num].series !== null) var rarity = res.data.items[num].series.id
                            else var rarity = res.data.items[num].rarity.id

                            //searching...
                            if(rarity === "Legendary"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "Epic"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "Rare"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "Uncommon"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "Common"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "MarvelSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "DCUSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "CUBESeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "CreatorCollabSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "ColumbusSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "ShadowSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "SlurpSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "FrozenSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "LavaSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else if(rarity === "PlatformSeries"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }else{
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, 256, 430)
                                    ctx.font = applyText(canvas, description);
                                    ctx.fillText(description, 256, 470)
                                }
                            }

                            //inilizing tags
                            var y = 12
                            var x = 467

                            for(let p = 0; p < res.data.items[num].gameplayTags.length; p++){
                                //if the item is animated
                                if(res.data.items[num].gameplayTags[p].includes('Animated')){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                    y += 40
                                }

                                //if the item is animated
                                if(res.data.items[num].gameplayTags[p].includes('Reactive')){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                    y += 40
                                }

                                //if the item is animated
                                if(res.data.items[num].gameplayTags[p].includes('Synced')){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                    y += 40
                                }

                                //if the item is animated
                                if(res.data.items[num].gameplayTags[p].includes('Traversal')){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                    y += 40
                                }

                                //if the item is animated
                                if(res.data.items[num].gameplayTags[p].includes('HasVariants')){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                    ctx.drawImage(skinholder, x, y, 30, 30)

                                    y += 40
                                }
                            }

                            //send the item picture
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.items[num].displayAssets[i].displayAsset + '.png')
                            await message.channel.send(att)

                        }
                        msg.delete()
                    })
                }else if(lang === "en"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`No styles has been found ${errorEmoji}`)
                    message.reply(Err)
                }else if(lang === "ar"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لا يمكنني العثور على ستايلات ${errorEmoji}`)
                    message.reply(Err)
                }
            }
        })
    }
}