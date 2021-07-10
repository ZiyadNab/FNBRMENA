const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const Canvas = require('canvas')

module.exports = {
    commands: 'details',
    expectedArgs: '[ Name of the cosmetic ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

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

        //set inizial value
        var SearchType = "name"

        //take over the index
        var num = 0

        //handeling errors
        var errorHandleing = 0

        //if the search type is an id
        if(text.includes("_")) SearchType = "id"

        //details
        const details = [
            "info",
            "styles",
            "grants"
        ]
        var detailsIndex = 0

        //requst data
        FNBRMENA.Search(lang, SearchType, text)
        .then(async res => {

            //get the item rarity
            if(res.data.items[num].series === null) var embedColor = res.data.items[num].rarity.id
            else var embedColor = res.data.items[num].series.id

            //if the result is more than one item
            if(res.data.items.length > 1){

                //create embed
                const list = new Discord.MessageEmbed()

                //set the color
                list.setColor(FNBRMENA.Colors("embed"))

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
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        })
                    })
                }).catch(err => {

                    //add an error
                    errorHandleing++

                    //if user typed a number out of range
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Request entry too large ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`تم تخطي الكمية المحدودة من عدد العناصر ${errorEmoji}`)
                    message.reply(errorRequest)

                })
            }

            //if there is no item found
            if(res.data.items.length === 0){

                //add an error
                errorHandleing++

                //if user typed a number out of range
                const errorRequest = new Discord.MessageEmbed()
                errorRequest.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") errorRequest.setTitle(`No cosmetic has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") errorRequest.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(errorRequest)
                
            }

            //if everything is correct
            if(errorHandleing === 0 && res.data.items.length > 0){

                //ask the user what method he needs
                const question = new Discord.MessageEmbed()

                //set color
                question.setColor(FNBRMENA.Colors(embedColor))

                //set author
                question.setAuthor(`${res.data.items[num].name} | ${res.data.items[num].type.name}`, res.data.items[num].images.icon)

                //set description
                if(lang === "en") question.setDescription(`• 0: Info\n• 1: Styles\n• 2: Grants`)
                else if(lang === "ar") question.setDescription(`• 0: معلومات\n• 1: ستايلات\n• 2: عناصر العنصر`)

                //send the message
                await message.channel.send(question)
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
                            if(collected.first().content >= 0 && collected.first().content < details.length){

                                //change the item index
                                detailsIndex = await collected.first().content
                            }else{

                                //add an error
                                errorHandleing++

                                //if user typed a number out of range
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        })
                    })
                })

                //list styles or grants
                if(errorHandleing === 0){

                    //if the user input is info
                    if(details[detailsIndex] === "info"){

                        //create info embed
                        const info = new Discord.MessageEmbed()

                        //set color
                        info.setColor(FNBRMENA.Colors(embedColor))

                        //set author
                        info.setAuthor(`${res.data.items[num].name} | ${res.data.items[num].type.name}`, res.data.items[num].images.icon)

                        //rarity id
                        if(res.data.items[num].series === null) var rarityID = res.data.items[num].rarity.id
                        else var rarityID = res.data.items[num].series.id

                        //rarity name
                        if(res.data.items[num].series === null) var rarityName = res.data.items[num].rarity.name
                        else var rarityName = res.data.items[num].series.name

                        //set
                        if(res.data.items[num].set !== null) var set = res.data.items[num].set.partOf
                        else if(lang === "en") var set = `There is no set for ${res.data.items[num].name} ${res.data.items[num].type.name}`
                        else if(lang === "ar") var set = `لا يوجد مجموعة ${res.data.items[num].type.name} ${res.data.items[num].name}`

                        //Introduction
                        if(res.data.items[num].introduction !== null) var introduction = res.data.items[num].introduction.text
                        else if(lang === "en") var introduction = `There is no introduction for ${res.data.items[num].name} ${res.data.items[num].type.name} yet`
                        else if(lang === "ar") var introduction = `لم يتم تقديم ${res.data.items[num].type.name} ${res.data.items[num].name} بعد`

                        //Description
                        if(res.data.items[num].description !== "") var description = res.data.items[num].description
                        else if(lang === "en") var description = `There is no description for ${res.data.items[num].name} ${res.data.items[num].type.name}`
                        else if(lang === "ar") var description = `لا يوجد وصف ${res.data.items[num].type.name} ${res.data.items[num].name}`

                        if(lang === "en"){
                            
                            //add id, name, description, rarity, introduction and added
                            info.addFields(
                                {name: "ID", value: res.data.items[num].id, inline: true},
                                {name: "Name", value: res.data.items[num].name, inline: true},
                                {name: "Description", value: rdescription, inline: true},
                                {name: "Rarity", value: `${rarityID} \n ${rarityName}`, inline: true},
                                {name: "Set", value: set, inline: true},
                                {name: "Introduction", value: introduction, inline: true},
                                {name: "Added", value: `Date: ${res.data.items[num].added.date} \nVersion: ${res.data.items[num].added.version}`, inline: true},
                                {name: "Price", value: res.data.items[num].price, inline: true},
                            )

                            //if the item is from the battlepass
                            if(res.data.items[num].battlepass !== null) info.addFields({name: "Battlepass", value: `${res.data.items[num].battlepass.displayText.chapterSeason} \n Tier: ${res.data.items[num].battlepass.tier} \nType: ${res.data.items[num].battlepass.type}`, inline: true})

                            //if the item is not from the itemshop
                            else info.addFields({name: "Battlepass", value: `The ${res.data.items[num].name} ${res.data.items[num].type.name} is not from the battlepass`, inline: true})

                            //if the item has a shop history
                            if(res.data.items[num].shopHistory !== null) info.addFields({name: "Shop History", value: res.data.items[num].shopHistory, inline: true})

                            //if the item has a shop history but not released yet
                            else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) info.addFields({name: "Shop History", value: `the ${res.data.items[num].name} ${res.data.items[num].type.name} has not released yet`, inline: true})

                            //if the item is not from the item shop
                            else info.addFields({name: "Shop History", value: `the ${res.data.items[num].name} ${res.data.items[num].type.name} is not an itemshop item`, inline: true})

                            //add gameplay tags
                            info.addFields({name: "Gameplay Tags", value: res.data.items[num].gameplayTags, inline: true})
                            
                        }else if(lang === "ar"){

                            //add id, name, description, rarity, introduction and added
                            info.addFields(
                                {name: "الأي دي", value: res.data.items[num].id, inline: true},
                                {name: "الأسم", value: res.data.items[num].name, inline: true},
                                {name: "الوصف", value: description, inline: true},
                                {name: "الندرة", value: `${rarityID} \n ${rarityName}`, inline: true},
                                {name: "المجموعة", value: set, inline: true},
                                {name: "تم تقديمة", value: introduction, inline: true},
                                {name: "تم اضافته", value: `التاريخ: ${res.data.items[num].added.date} \التحديث: ${res.data.items[num].added.version}`, inline: true},
                                {name: "السعر", value: res.data.items[num].price, inline: true},
                            )

                            //if the item is from the battlepass
                            if(res.data.items[num].battlepass !== null) info.addFields({name: "باتل باس", value: `${res.data.items[num].battlepass.displayText.chapterSeason} \n التاير: ${res.data.items[num].battlepass.tier} \النوع: ${res.data.items[num].battlepass.type}`, inline: true})

                            //if the item is not from the itemshop
                            else info.addFields({name: "باتل باس", value: `${res.data.items[num].type.name} ${res.data.items[num].name} ليس من الباتل باس`, inline: true})

                            //if the item has a shop history
                            if(res.data.items[num].shopHistory !== null) info.addFields({name: "تاريخ الشوب", value: res.data.items[num].shopHistory, inline: true})

                            //if the item has a shop history but not released yet
                            else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) info.addFields({name: "تاريخ الشوب", value: `${res.data.items[num].type.name} ${res.data.items[num].name} لم يتم نزوله بعد`, inline: true})

                            //if the item is not from the item shop
                            else info.addFields({name: "تاريخ الشوب", value: `${res.data.items[num].type.name} ${res.data.items[num].name} ليس عنصر ايتم شوب`, inline: true})

                            //add gameplay tags
                            info.addFields({name: "العلامات", value: res.data.items[num].gameplayTags, inline: true})
                            
                        }

                        info.setFooter('Generated By FNBRMENA Bot')
                        message.channel.send(info)
                    }
                    
                    //if the user input is styles
                    if(details[detailsIndex] === "styles"){

                        //getting item data loading
                        const generating = new Discord.MessageEmbed()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                        else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            //check if there is a style in the files
                            const cosmeticvariants = await FNBRMENA.List(lang, "cosmeticvariant")

                            //filtering
                            var styles = []
                            var Counter = 0
                            for(let i = 0; i < cosmeticvariants.data.items.length; i++){
                                if(await cosmeticvariants.data.items[i].name.toLowerCase().substring(0, res.data.items[num].name.length).includes(res.data.items[num].name.toLowerCase())){
                                styles[Counter] = await cosmeticvariants.data.items[i]
                                Counter++
                                }
                            }

                            //if there is a style in the files
                            if(styles.length > 0){

                                //creating canvas
                                const canvas = Canvas.createCanvas(512, 512);
                                const ctx = canvas.getContext('2d');

                                //set the item info
                                var name = res.data.items[num].name
                                var description = res.data.items[num].description
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
                                const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.items[num].id + '.png')
                                await message.channel.send(att)

                                //loop throw every style
                                for(let i = 0; i < styles.length; i ++){

                                    //creating canvas
                                    const canvas = Canvas.createCanvas(512, 512);
                                    const ctx = canvas.getContext('2d');

                                    //set the item info
                                    var name = styles[i].name
                                    var description = styles[i].description
                                    var image = styles[i].images.icon
                                    if(styles[i].series !== null) var rarity = styles[i].series.id
                                    else var rarity = styles[i].rarity.id

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
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), styles[i].id + '.png')
                                    await message.channel.send(att)
                                }

                            }else if(styles.length === 0 && res.data.items[num].displayAssets.length > 0){
                            
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
                            }
                            msg.delete()
                        })
                    }else if(details[detailsIndex] === "styles" && res.data.items[num].displayAssets.length === 0){

                        //send an error
                        const Err = new Discord.MessageEmbed()
                        Err.setColor(FNBRMENA.Colors(embedColor))
                        if(lang === "en") Err.setTitle(`No styles has been found for ${res.data.items[num].name} ${res.data.items[num].type.name} ${errorEmoji}`)
                        else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على ستايلات ${res.data.items[num].type.name} ${res.data.items[num].name} ${errorEmoji}`)
                        message.reply(Err)
                    }

                    //if the user input is grants
                    if(details[detailsIndex] === "grants" && res.data.items[num].grants.length > 0){

                        //getting item data loading
                        const generating = new Discord.MessageEmbed()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                        else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            //creating canvas
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            //set the item info
                            var name = res.data.items[num].name
                            var description = res.data.items[num].description
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
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.items[0].id + '.png')
                            await message.channel.send(att)

                            //loop throw every grant
                            for(let i = 0; i < res.data.items[num].grants.length; i++){

                                //creating canvas
                                const canvas = Canvas.createCanvas(512, 512);
                                const ctx = canvas.getContext('2d');

                                //request data
                                await FNBRMENA.SearchByType(lang, res.data.items[num].grants[i].id, res.data.items[num].grants[i].type.id, "id")
                                .then(async res => {

                                    //set the item info
                                    var name = res.data.items[0].name
                                    var description = res.data.items[0].description
                                    var image = res.data.items[0].images.icon
                                    if(res.data.items[0].series !== null) var rarity = res.data.items[num].series.id
                                    else var rarity = res.data.items[0].rarity.id

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
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.items[0].id + '.png')
                                    await message.channel.send(att)

                                })
                            }
                            msg.delete()
                        })

                    
                    
                    
                    }else if(details[detailsIndex] === "grants" && res.data.items[num].grants.length === 0){

                        //if the item doesn't have any grants
                        const error = new Discord.MessageEmbed()
                        error.setColor(FNBRMENA.Colors(embedColor))
                        if(lang === "en") error.setTitle(`The ${res.data.items[num].name} ${res.data.items[num].type.name} doesn't grants you anything ${errorEmoji}`)
                        else if(lang === "ar") error.setTitle(`${res.data.items[num].type.name} ${res.data.items[num].name} لا يحتوي على اي عناصر اضافية ${errorEmoji}`)
                        message.reply(error)
                    }
                }
            }
        })
    }
}