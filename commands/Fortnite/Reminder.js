const Canvas = require('canvas')
const moment = require('moment')

module.exports = {
    commands: 'remind',
    type: 'Fortnite',
    descriptionEN: 'You can remind any item from the shop so he bot will tag you once the item has been released in the itemshop.',
    descriptionAR: 'تقدر تخلي البوت يذكرك لأي عنصر من الشوب واذا نزل راح يحط لك تاق و يعلمك انه نزل.',
    expectedArgsEN: 'ُTo get the bot reminds you just type the command then the item name.',
    expectedArgsAR: 'عشان تخلي البوت يذكرك كل الي عليك تكتب الأمر ثمن اسم العنصر',
    argsExample: ['Ninja', 'Harley Quinn'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inizilizing variables
        var num = 0
        var Last = ""
        var type = 'name'

        //maneging the time
        moment.locale("en")
        var time = moment(message.createdAt).format()

        //handleing errors
        var errorHandleing = 0

        //if the type is id
        if(text.includes("_")) type = 'id'

        //checking if the item is valid
        await FNBRMENA.Search(lang, type, text)
        .then( async res => {

            //if there is more than one item
            if(await res.data.items.length > 1){

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

                            //check if its a number
                            if(!isNaN(collectedType.first().content)){

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
                            }else{
                                //add an error
                                errorHandleing++

                                //if user typed a number out of range
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        })
                    })
                })
            }

            if(errorHandleing === 0){

                //if the item is correct
                if(res.data.items.length !== 0){

                    //if the item is from the shop
                    if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")){

                        //seeting up the db firestore
                        var db = admin.firestore()

                        //get the collection from the database
                        const snapshot = await db.collection("Reminders").get()

                        //get every single collection
                        var access = true
                        await snapshot.forEach(doc => {
                            if(doc.data().mainId === res.data.items[num].id && doc.data().id === message.author.id){
                                access = false
                            }
                        })

                        //if the item doen't exists in the database
                        if(access){
                            const generating = new Discord.MessageEmbed()
                            generating.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") generating.setTitle(`Getting info about the item ${loadingEmoji}`)
                            else if(lang === "ar") generating.setTitle(`جاري البحث عن معلومات العنصر ${loadingEmoji}`)
                            message.channel.send(generating)
                            .then( async msg => {

                                //aplyText
                                const applyTextName = (canvas, text) => {
                                    const ctx = canvas.getContext('2d');
                                    let fontSize = 92;
                                    do {
                                        if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                        else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                                    } while (ctx.measureText(text).width > 900);
                                    return ctx.font;
                                };

                                //applytext
                                const applyTextDescription = (canvas, text) => {
                                    const ctx = canvas.getContext('2d');
                                    let fontSize = 35;
                                    do {
                                        if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                        else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                                    } while (ctx.measureText(text).width > 840);
                                    return ctx.font;
                                };

                                //registering fonts
                                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                //creating canvas
                                const canvas = Canvas.createCanvas(1024, 1024);
                                const ctx = canvas.getContext('2d');

                                //set the item info
                                var name = res.data.items[num].name
                                var price = res.data.items[num].price
                                var description = res.data.items[num].description
                                var image = res.data.items[num].images.icon
                                if(res.data.items[num].series !== null) var rarity = res.data.items[num].series.id
                                else var rarity = res.data.items[num].rarity.id

                                //remove any lines
                                description = description.replace("\r\n", "")

                                //add introduces and set string
                                if(res.data.items[num].introduction !== null) description += `\n${res.data.items[num].introduction.text}`
                                if(res.data.items[num].set !== null) description += `\n${res.data.items[num].set.partOf}`

                                //split every line
                                description = description.split(/\r\n|\r|\n/)

                                //searching...
                                if(rarity === "Legendary"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Epic"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Rare"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Uncommon"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Common"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "MarvelSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "DCUSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "CUBESeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "CreatorCollabSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "ColumbusSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "ShadowSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "SlurpSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "FrozenSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "LavaSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "PlatformSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else{
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930
                                        ctx.fillText(description[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < description.length; x++){
                                            ctx.fillText(description[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }

                                //inilizing tags
                                var y = 24
                                var x = 934

                                for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){

                                    //if the item is animated
                                    if(res.data.items[num].gameplayTags[i].includes('Animated')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item is reactive
                                    if(res.data.items[num].gameplayTags[i].includes('Reactive')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item is synced emote
                                    if(res.data.items[num].gameplayTags[i].includes('Synced')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item is traversal
                                    if(res.data.items[num].gameplayTags[i].includes('Traversal')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item has styles
                                    if(res.data.items[num].gameplayTags[i].includes('HasVariants') || res.data.items[num].gameplayTags[i].includes('HasUpgradeQuests')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }
                                }

                                //if the item contains copyrited audio
                                if(res.data.items[num].copyrightedAudio === true){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                    ctx.drawImage(skinholder, x, y, 60, 60)

                                    y += 70
                                }

                                //json data 
                                const reminder = {
                                    id: message.author.id,
                                    mainId: res.data.items[num].id,
                                    date: `${time}`,
                                    lang: lang
                                }

                                //creating an array to store the response
                                var list = []
                                var counter = 0

                                //get every single collection
                                await snapshot.forEach(doc => {
                                    list[counter] = doc.id
                                    counter++
                                })

                                //add the reminder to the database but step by step
                                for(let i = 0; i <= list.length; i++){

                                    //check if there an exisiting data with that number i
                                    const doc = await db.collection("Reminders").doc(`${i}`).get()
                                    if (!doc.exists){

                                        //store the data
                                        await db.collection("Reminders").doc(`${i}`).set(reminder)
                                        break
                                    }
                                }

                                //change the local of the moment
                                moment.locale(lang)

                                //lastseen
                                if(res.data.items[num].lastAppearance !== null){

                                    //setting up moment js
                                    const Now = moment();
                                    var LastSeenDays = Now.diff(res.data.items[num].lastAppearance, 'days');
                                    var LastSeenDate = moment(res.data.items[num].lastAppearance).format("ddd, hA")

                                    //set a last release message
                                    if(lang === "en") Last = LastSeenDays + " days at " + LastSeenDate
                                    else if(lang === "ar") Last = LastSeenDays + " يوم في " + LastSeenDate

                                }else{

                                    //set non message last release
                                    if(lang === "en") Last = "not out yet or the sorce is not an itemshop"
                                    else if(lang === "ar") Last = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                                }

                                //create embed
                                const itemInfo = new Discord.MessageEmbed()

                                //set color
                                itemInfo.setColor(FNBRMENA.Colors(rarity))

                                //set titles and fields
                                if(lang == "en"){
                                    itemInfo.setTitle(`When ${res.data.items[num].name} release in the itemshop ill inform u`)
                                    itemInfo.addFields(
                                        {name: "Name:", value: name},
                                        {name: "Description:", value: res.data.items[num].description},
                                        {name: "Price:", value: price},
                                        {name: "Last Appearance:", value: Last},
                                    )
                                }else if(lang === "ar"){
                                    itemInfo.setTitle(`اوك اذا نزل ${res.data.items[num].name} بعلمك`)
                                    itemInfo.addFields(
                                        {name: "الاسم:", value: name},
                                        {name: "الوصف:", value: res.data.items[num].description},
                                        {name: "السعر:", value: price},
                                        {name: "اخر ظهور:", value: Last},
                                    )
                                }

                                //send the message
                                const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                                await message.channel.send(att)
                                await message.channel.send(itemInfo)
                                msg.delete()

                            })
                        }else{

                            //if user typed a number out of range
                            const errorRequest = new Discord.MessageEmbed()
                            errorRequest.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") errorRequest.setTitle(`The item is already added for the reminding system ${errorEmoji}`)
                            else if(lang === "ar") errorRequest.setTitle(`تم بالفعل اضافة العنصر من قبل في نظام التذكير ${errorEmoji}`)
                            message.reply(errorRequest)

                        }
                    }else{

                        //if user typed a number out of range
                        const errorRequest = new Discord.MessageEmbed()
                        errorRequest.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") errorRequest.setTitle(`The item source is not an itemshop please reselect again ${errorEmoji}`)
                        else if(lang === "ar") errorRequest.setTitle(`لا يمكنني تذكيرك بالعنصر لانه ليس من عناصر الايتم شوب ${errorEmoji}`)
                        message.reply(errorRequest)
                    }
                }else{
                    
                    //if user typed a number out of range
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`No cosmetic has been found check your speling and try again ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                    message.reply(errorRequest)

                }
            }

            //handeling errors
        }).catch(err => {
            console.log(err)
        })
    },
}