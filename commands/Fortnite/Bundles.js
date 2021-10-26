const moment = require("moment")
const Canvas = require('canvas')

module.exports = {
    commands: 'bundle',
    type: 'Fortnite',
    descriptionEN: 'By using this command you will be able to get all the informations about a bundle of your choice (Only real money bundles)',
    descriptionAR: 'بأستعمال الأمر يمكنك استرجاع جميع المعلومات عن أي حزمة بأختيارك (فقط الحزم المالية)',
    expectedArgsEN: 'To use the command you need to specifiy a bundle name or a bundle name that contains a specifiy word.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد أسم الحزمة او اي حرف من اي حزمة',
    hintEN: 'You can search for a bundle with just one word you dont need to spell the bundle name correctly just type the words you know. e.g. search by (der) that will give u a list of all the bundles contains word der like Derby Dynamo',
    hintAR: 'يمكنك البحث فقط بأسخدام حرف واحد لا تحتاج الى ان تكتب اسم الحزمة بالكامل فقط اكتب الحروف الي تتذكرها من الحزمة. مثل البحث بأستخدام كلمة (der) سوف تحصل على قائمة لجميع الحزم التي تبدأ بكلمة der مثل Derby Dynamo',
    argsExample: ['Derby Dynamo Challenge Pack', 'D'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inisilizing number
        var num = null
        var outfit = ""

        const offerID = await FNBRMENA.getBundles("en")
        .then(async res => {

            //filtering
            const id = res.data.bundles.filter(obj => {
                return obj.name.toLowerCase().includes(text.toLowerCase())
            })

            //ask the user what bundles he means
            if(await id.length > 1){

                //create embed
                const bundles = new Discord.MessageEmbed()

                //add the color
                bundles.setColor(FNBRMENA.Colors("embed"))

                //create and fill a string of names
                var str = ""
                for(let i = 0; i < id.length; i++){
                    str += '• ' + i + ': ' + id[i].name + '\n'
                }

                //add description
                bundles.setDescription(str)

                //send the choices
                await message.channel.send(bundles)
                .then( async msg => {

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //send the reply to the user
                    if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                    else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                    //send the reply
                    await message.reply(reply)
                    .then( async notify => {

                        //await messages
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //deleting messages
                            msg.delete()
                            notify.delete()

                            //if the user input in range
                            if(await collected.first().content >= 0 && collected.first().content < id.length){

                                //store user input
                                num = await collected.first().content

                            }else{

                                //create embed
                                const error = new Discord.MessageEmbed()

                                //set color
                                error.setColor(FNBRMENA.Colors("embed"))

                                //set title
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)

                                //send msg
                                message.reply(error)
                                
                            }
                        }).catch(err => {

                            //create embed
                            const error = new Discord.MessageEmbed()

                            //set color
                            error.setColor(FNBRMENA.Colors("embed"))

                            //set title
                            if(lang === "en") error.setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                            else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)

                            //send msg
                            message.reply(error)
                        })
                    })
                })
                if(num !== null){
                    return id[num].offerId
                }
            }

            //there is onle one bundle
            if(id.length === 1){
                return id[0].offerId
            }
            
            //no bundle has been found
            if(id.length === 0){
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No bundle has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على الحزمة الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(Err)
            }
        })

        if(offerID){

            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Give just a sec to get the bundle data ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`عطني وقت بس قاعد اجيب معلومات الحزمة ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                FNBRMENA.getBundles(lang)
                .then(async res => {

                    //filtering
                    const found = await res.data.bundles.filter(obj => {
                        return obj.offerId === offerID
                    })

                    //canvas variables
                    var width = 0
                    var height = 1024
                    var newline = 0
                    var x = 0
                    var y = 0

                    //canvas length
                    var length = found[0].granted.length

                    if(length <= 2) length = length
                    else if(length >= 3 && length <= 4) length = length / 2
                    else if(length > 4 && length <= 7) length = length / 3
                    else if(length > 7 && length <= 50)length = length / 5
                    else length = length / 10

                    //forcing to be int
                    if (length % 2 !== 0){
                        length += 1;
                        length = length | 0;
                    }
                    
                    //creating width
                    if(found[0].granted.length === 1) width = 1024
                    else width += (length * 1024) + (length * 10) - 10

                    //creating height
                    for(let i = 0; i < found[0].granted.length; i++){
                        
                        if(newline === length){
                            height += 1024 + 10
                            newline = 0
                        }
                        
                        if(found[0].granted[i].templateId !== "MtxPurchaseBonus") newline++
                    }

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

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
                    }

                    //creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //res.dataeting newline
                    newline = 0

                    //loop throw every item
                    for(let i = 0; i < found[0].granted.length; i++){

                        if(found[0].granted[i].templateId !== "MtxPurchased" && found[0].granted[i].templateId !== "MtxPurchaseBonus" &&
                         !found[0].granted[i].templateId.includes("bundleschedule") && found[0].granted[i].templateId !== "campaignaccess"
                         && found[0].granted[i].templateId !== "stwstarterbundle07_getrewards"){

                            //request data
                            await FNBRMENA.Search(lang, "id", found[0].granted[i].templateId)
                            .then(async res => {

                                //skin informations
                                var name = res.data.items[0].name;
                                if(res.data.items[0].type.id === "outfit") outfit = res.data.items[0].name
                                var description = res.data.items[0].description
                                var image = res.data.items[0].images.icon
                                if(res.data.items[0].series === null) var rarity = res.data.items[0].rarity.id
                                else var rarity = res.data.items[0].series.id
                                newline = newline + 1;

                                //remove any lines
                                description = description.replace("\r\n", "")

                                //add introduces and set string
                                if(res.data.items[0].introduction !== null) description += `\n${res.data.items[0].introduction.text}`
                                if(res.data.items[0].set !== null) description += `\n${res.data.items[0].set.partOf}`

                                //split every line
                                description = description.split(/\r\n|\r|\n/)

                                //searching...
                                if(rarity === "Legendary"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Epic"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Rare"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Uncommon"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Common"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "MarvelSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "DCUSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "CUBESeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "CreatorCollabSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "ColumbusSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "ShadowSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "SlurpSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "FrozenSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "LavaSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "PlatformSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else{
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, x, y, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, x, y, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 860 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name);
                                        ctx.fillText(name, 512 + x, 850 + y)
                                        ctx.font = applyTextDescription(canvas, description[0]);
                                        let descriptionY = 930 + y
                                        ctx.fillText(description[0], 512 + x, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let p = 1; p < description.length; p++){
                                            ctx.fillText(description[p], 512 + x, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }

                                var yTags = y
                                for(let i = 0; i < res.data.items[0].gameplayTags.length; i++){

                                    //if the item is animated
                                    if(res.data.items[0].gameplayTags[i].includes('Animated')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                        ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                        yTags += 70
                                    }

                                    //if the item is reactive
                                    if(res.data.items[0].gameplayTags[i].includes('Reactive')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                        ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                        yTags += 70
                                    }

                                    //if the item is synced emote
                                    if(res.data.items[0].gameplayTags[i].includes('Synced')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                        ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                        yTags += 70
                                    }

                                    //if the item is traversal
                                    if(res.data.items[0].gameplayTags[i].includes('Traversal')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                        ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                        yTags += 70
                                    }

                                    //if the item has styles
                                    if(res.data.items[0].gameplayTags[i].includes('HasVariants') || res.data.items[0].gameplayTags[i].includes('HasUpgradeQuests')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                        ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                        yTags += 70
                                    }
                                }

                                //if the item contains copyrited audio
                                if(res.data.items[0].copyrightedAudio === true){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                    ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                    yTags += 70
                                }

                                // changing x and y
                                x = x + 10 + 1024; 
                                if (length === newline){
                                    y = y + 10 + 1024;
                                    x = 0;
                                    newline = 0;
                                }
                            })
                        }
                    }

                    //add the vbucks image is there is a one
                    var vbucks = 0

                    //loop throw every granted item
                    for(let i = 0; i < found[0].granted.length; i++){

                        //add every vbucks to the vbucks variable
                        if(found[0].granted[i].templateId === "MtxPurchased" || found[0].granted[i].templateId === "MtxPurchaseBonus"){
                            vbucks += await found[0].granted[i].quantity

                        }

                    }

                    //load the image if there is a vbucks
                    if(vbucks !== 0){

                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage('https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png');
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, vbucks + ' V-Bucks');
                            ctx.fillText(vbucks + ' V-Bucks', (512 + x), (y + 860))
                            ctx.font = applyTextDescription(canvas, 'Valuable currency used to purchase goods from the store.');
                            ctx.textAlign='center';
                            ctx.fillText('Valuable currency used to purchase goods from the store.', (512 + x), (y + 930))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, vbucks + 'فيبوكس ');
                            ctx.fillText(vbucks + 'فيبوكس ', (512 + x), (y + 860))  
                            ctx.font = applyTextDescription(canvas, 'عملة ثمينة تُستخدَم لشراء البضائع من المتجر.');
                            ctx.textAlign='center';
                            ctx.fillText('عملة ثمينة تُستخدَم لشراء البضائع من المتجر.', (512 + x), (y + 930))
                        }
                    }

                    //load the image if there is a challenges pack
                    for(let i = 0; i < found[0].granted.length; i++){

                        //found an challenge pack
                        if(found[0].granted[i].templateId.includes("bundleschedule")){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage('https://i.imgur.com/MaGvfNq.png');
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, found[0].name);
                                ctx.fillText(found[0].name, (512 + x), (y + 860))
                                ctx.font = applyTextDescription(canvas, `Additional quests for ${outfit}.`);
                                ctx.textAlign='center';
                                ctx.fillText(`Additional quests for ${outfit}.`, (512 + x), (y + 930))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, found[0].name);
                                ctx.fillText(found[0].name, (512 + x), (y + 860))  
                                ctx.font = applyTextDescription(canvas, `مهام إضافية لـ ${outfit}.`);
                                ctx.textAlign='center';
                                ctx.fillText(`مهام إضافية لـ ${outfit}.`, (512 + x), (y + 930))
                            }
                        }

                        //found an stw access
                        if(found[0].granted[i].templateId !== "campaignaccess"){

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage('https://imgur.com/4LmOgaj.png');
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, `Save the World Access`);
                                ctx.fillText(`Save the World Access`, (512 + x), (y + 860))
                                ctx.font = applyTextDescription(canvas, `Permanent access to the PvE campaign (on compatible devices).`);
                                ctx.textAlign='center';
                                ctx.fillText(`Permanent access to the PvE campaign (on compatible devices).`, (512 + x), (y + 930))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, `الوصول إلى أنقِذ العالم`);
                                ctx.fillText(`الوصول إلى أنقِذ العالم`, (512 + x), (y + 860))  
                                ctx.font = applyTextDescription(canvas, `الوصول الدائم إلى حملة اللاعب ضد البيئة (على الأجهزة المتوافقة).`);
                                ctx.textAlign='center';
                                ctx.fillText(`الوصول الدائم إلى حملة اللاعب ضد البيئة (على الأجهزة المتوافقة).`, (512 + x), (y + 930))
                            }

                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage('https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png');
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, 1000 + ' V-Bucks');
                                ctx.fillText(1000 + ' V-Bucks', (512 + x), (y + 860))
                                ctx.font = applyTextDescription(canvas, 'Valuable currency used to purchase goods from the store.');
                                ctx.textAlign='center';
                                ctx.fillText('Valuable currency used to purchase goods from the store.', (512 + x), (y + 930))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, 1000 + 'فيبوكس ');
                                ctx.fillText(1000 + 'فيبوكس ', (512 + x), (y + 860))  
                                ctx.font = applyTextDescription(canvas, 'عملة ثمينة تُستخدَم لشراء البضائع من المتجر.');
                                ctx.textAlign='center';
                                ctx.fillText('عملة ثمينة تُستخدَم لشراء البضائع من المتجر.', (512 + x), (y + 930))
                            }
                        }
                    }

                    //creating embed
                    const bundle = new Discord.MessageEmbed()

                    //add color
                    bundle.setColor(FNBRMENA.Colors("embed"))

                    //add title
                    bundle.setTitle(found[0].name)

                    //add description
                    bundle.setDescription(found[0].description)

                    //payable? and dates
                    moment.locale(lang)
                    if(lang === "en"){

                        //if the bundle is available
                        if(found[0].available) bundle.addFields({name: "Available", value: `\`Yes!\``})
                        else bundle.addFields({name: "Available", value: `\`No!\``})

                        //available since
                        if(found[0].viewableDate !== null) bundle.addFields({name: "Available Since", value: `\`${moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")}\``})
                        else bundle.addFields({name: "Available Since", value:`\`Not known yet!\``})

                        //if there is no expire date
                        if(found[0].expiryDate !== null) bundle.addFields({name: "Will be gone at", value: `\`${moment(found[0].expiryDate).format("dddd, MMMM Do of YYYY")}\``})
                        else bundle.addFields({name: "Will be gone at", value: `\`Not known yet!\``})
                                
                    }else if(lang === "ar"){

                        //if the bundle is available
                        if(found[0].available) bundle.addFields({name: "متاحة للشراء", value: `\`نعم!\``})
                        else bundle.addFields({name: "متاحة للشراء", value: `\`لا!\``})

                        //available since
                        if(found[0].viewableDate !== null) bundle.addFields({name: "متاحة منذ", value: `\`${moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")}\``})
                        else bundle.addFields({name: "متاحة منذ", value:`\`لا يوجد تاريخ معلوم حتى الان!\``})

                        //if there is no expire date
                        if(found[0].expiryDate !== null) bundle.addFields({name: "سوف تغادر في", value: `\`${moment(found[0].expiryDate).format("dddd, MMMM Do من YYYY")}\``})
                        else bundle.addFields({name: "سوف تغادر في", value: `\`لا يوجد تاريخ معلوم حتى الان!\``})

                    }

                    //check if there is prices
                    if(found[0].prices.length !== 0){

                        //add prices
                        for(let i = 0; i < found[0].prices.length; i++){
                            bundle.addFields(
                                {name: found[0].prices[i].paymentCurrencyCode, value: `\`${found[0].prices[i].paymentCurrencyAmountNatural} ${found[0].prices[i].paymentCurrencySymbol}\``, inline: true}
                            )
                        }

                    }else if(lang === "en") bundle.addFields({name: 'Prices', value: `\`There is no prices yet\``})
                    else if(lang === "ar") bundle.addFields({name: 'الاسعار', value: `\`لا يوجد اسعار حاليا\``})
                    

                    //tumbnail and image
                    if(found[0].displayAssets.length !== 0){

                        //store the url
                        var url = found[0].displayAssets[0].url
                            
                        //decode and encode
                        url = decodeURI(url);
                        url = encodeURI(url);

                        //add thumbnail
                        bundle.setThumbnail(url)

                        //add the image
                        if(found[0].thumbnail !== null){

                            //store the url
                            var url = found[0].thumbnail
                            
                            //decode and encode
                            url = decodeURI(url);
                            url = encodeURI(url);

                            //set the image
                            bundle.setImage(url)
                        }else{

                            //store the url
                            var url = found[0].displayAssets[0].background
                            
                            //decode and encode
                            url = decodeURI(url);
                            url = encodeURI(url);

                            //set the image
                            bundle.setImage(url)
                        }
                    }else{

                        //add the image
                        if(found[0].thumbnail !== null){

                            //store the url
                            var url = found[0].thumbnail
                            
                            //decode and encode
                            url = decodeURI(url);
                            url = encodeURI(url);

                            //set the image
                            bundle.setImage(url)
                        }
                    }

                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${offerID}.png`)
                    await message.channel.send(att)
                    message.channel.send(bundle)
                    msg.delete()

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
    }
}