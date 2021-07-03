const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment');
const Canvas = require('canvas');
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'search',
    expectedArgs: '[ Name of the cosmetic ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //the item index
        var num = 0

        //handleing errors
        var error = 0

        //specify the type
        var type = "name"

        if(text.includes("+")){
            //storing the items
            var list = []
            var Counter = 0
            while(await text.indexOf("+") !== -1){

                //getting the index of the + in text string
                var stringNumber = text.indexOf("+")
                //substring the cosmetic name and store it
                var cosmetic = text.substring(0,stringNumber)
                //trimming every space
                cosmetic = cosmetic.trim()
                //store it into the array
                list[Counter] = cosmetic
                //remove the cosmetic from text to start again if the while statment !== -1
                text = text.replace(cosmetic + ' +','')
                //remove every space in text
                text = text.trim()
                //add the counter index
                Counter++
                //end of wile lets try aagin
            }
            //still there is the last cosmetic name so lets trim text
            text = text.trim()
            //add the what text holds in the last index
            list[Counter++] = text

            text = `&name=${list[0]}&searchLang=${list[1]}`
            type = "langType"
        }

        //search by parms
        if(args[0] === "*"){
            text = text.replace('* ', '')
            type = "custom"
        }
        
        //request data
        FNBRMENA.Search(lang, type, text)
        .then(async res => {

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
                                error++

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

            if(error === 0){

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

                    //creating canvas
                    const canvas = Canvas.createCanvas(512, 512);
                    const ctx = canvas.getContext('2d');

                    //set the item info
                    var name = res.data.items[num].name
                    if(res.data.items[num].description !== "") var description = res.data.items[num].description
                    else if(lang === "en") var description = "There is no description to this item"
                    else if(lang === "ar") var description = "لا يوجد وصف للعنصر"
                    var image = res.data.items[num].images.icon
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

                    for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){
                        //if the item is animated
                        if(res.data.items[num].gameplayTags[i].includes('Animated')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        //if the item is animated
                        if(res.data.items[num].gameplayTags[i].includes('Reactive')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        //if the item is animated
                        if(res.data.items[num].gameplayTags[i].includes('Synced')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        //if the item is animated
                        if(res.data.items[num].gameplayTags[i].includes('Traversal')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }

                        //if the item is animated
                        if(res.data.items[num].gameplayTags[i].includes('HasVariants')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                            ctx.drawImage(skinholder, x, y, 30, 30)

                            y += 40
                        }
                    }

                    //setting up moment
                    const Now = moment()
                    moment.locale(lang)

                    //inisilizing item details data
                    if(res.data.items[num].set !== null) var set = res.data.items[num].set.partOf
                    else if(lang === "en") var set = "There is no set for the item"
                    else if(lang === "ar") var set = "لا يوجد مجموعة للعنصر"

                    //reactive?
                    if(lang === "en"){
                        if(res.data.items[num].reactive === true) var reactive = "Yes, it is"
                        else if(res.data.items[num].reactive === false) var reactive = "No, it is not"
                    }else if(lang === "ar"){
                        if(res.data.items[num].reactive === true) var reactive = "نعم، عنصر متفاعل"
                        else if(res.data.items[num].reactive === false) var reactive = "لا, ليس عنصر متفاعل"
                    }

                    //copyrighted?
                    if(lang === "en"){
                        if(res.data.items[num].copyrightedAudio === true) var copyrighted = "Yes, it is"
                        else if(res.data.items[num].copyrightedAudio === false) var copyrighted = "No, it is not"
                    }else if(lang === "ar"){
                        if(res.data.items[num].copyrightedAudio === true) var copyrighted = "نعم، يحتوي على حقوق الطبع و النشر"
                        else if(res.data.items[num].copyrightedAudio === false) var copyrighted = "لا، لا يحتوي على حقوق الطبع و النشر"
                    }
                    
                    //occurrences
                    if(res.data.items[num].shopHistory !== null) var occurrences = res.data.items[num].shopHistory.length
                    else var occurrences = 0

                    //first and last
                    if(res.data.items[num].releaseDate !== null){

                        var FirstSeenDays = Now.diff(res.data.items[num].releaseDate, 'days');
                        var FirstSeenDate = moment(res.data.items[num].releaseDate).format("ddd, hA")
                        if(lang === "en") var First = FirstSeenDays + " days at " + FirstSeenDate
                        else if(lang === "ar") var First = FirstSeenDays + " يوم في " + FirstSeenDate
        
                        //last release
                        if(res.data.items[num].lastAppearance !== null){
                            const Now = moment();
                            var LastSeenDays = Now.diff(res.data.items[num].lastAppearance, 'days');
                            var LastSeenDate = moment(res.data.items[num].lastAppearance).format("ddd, hA")
                            if(lang === "en") var Last = LastSeenDays + " days at " + LastSeenDate
                            else if(lang === "ar") var Last = LastSeenDays + " يوم في " + LastSeenDate
                        }
        
                    }else{
                        if(lang === "en"){
                            First = "not out yet or the sorce is not an itemshop"
                            Last = "not out yet or the sorce is not an itemshop"
                        }else if(lang === "ar"){
                            First = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                            Last = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                        }
                    }

                    //create embed for the item details
                    const itemInfo = new Discord.MessageEmbed()

                    //set color
                    itemInfo.setColor('#BB00EE')

                    //set title
                    if(lang === "en"){
                        itemInfo.addFields(
                            {name: "ID", value: res.data.items[num].id},
                            {name: "Name", value: res.data.items[num].name},
                            {name: "Description", value: description},
                            {name: "Type", value: res.data.items[num].type.name},
                            {name: "Rarity", value: res.data.items[num].rarity.name},
                            {name: "Price", value: res.data.items[num].price},
                            {name: "Introduction", value: res.data.items[num].introduction.text},
                            {name: "Set", value: set},
                            {name: "Reactive ?", value: reactive},
                            {name: "Copy Righted Music ?", value: copyrighted},
                            {name: "Added", value: `${Now.diff(res.data.items[num].added.date, 'days')} days at ${moment(res.data.items[num].added.date).format("ddd, hA")}`},
                            {name: "Occurrences", value: occurrences},
                            {name: "First Seen", value: First},
                            {name: "Last Seen", value: Last},
                        )
                    }else if(lang === "ar"){
                        itemInfo.addFields(
                            {name: "الاي دي", value: res.data.items[num].id},
                            {name: "الاسم", value: res.data.items[num].name},
                            {name: "الوصف", value: description},
                            {name: "النوع", value: res.data.items[num].type.name},
                            {name: "الندرة", value: res.data.items[num].rarity.name},
                            {name: "السعر", value: res.data.items[num].price},
                            {name: "تم تقديمه", value: res.data.items[num].introduction.text},
                            {name: "المجموعة", value: set},
                            {name: "متفاعل ؟", value: reactive},
                            {name: "حقوق الطبع و النشر ؟", value: copyrighted},
                            {name: "تم اضافته", value: `${Now.diff(res.data.items[num].added.date, 'days')} يوم في ${moment(res.data.items[num].added.date).format("ddd, hA")}`},
                            {name: "عدد النزول", value: occurrences},
                            {name: "اول ظهور", value: First},
                            {name: "اخر ظهور", value: Last},
                        )
                    }

                    //send the item picture
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.items[num].id+'.png')
                    await message.channel.send(att)
                    await message.channel.send(itemInfo)
                    msg.delete()

                })
            }

        }).catch(err => {
            console.log(err)
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
        })
    }
}