const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api")
const moment = require("moment")
const Canvas = require('canvas')
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"))

module.exports = {
    commands: 'bundle',
    expectedArgs: '[ Any words you remember from the bundle name ] ',
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inisilizing number
        var num = null

        const offerID = await fortniteAPI.getBundles()
        .then(async res => {

            //filtering
            const id = res.bundles.filter(obj => {
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

                fortniteAPI.getBundles(options = {lang: lang})
                .then(async res => {

                    //filtering
                    const found = await res.bundles.filter(obj => {
                        return obj.offerId === offerID
                    })

                    //canvas variables
                    var width = 0
                    var height = 512
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
                    if(found[0].granted.length === 1) width = 512
                    else width += (length * 512) + (length * 5) - 5

                    //creating height
                    for(let i = 0; i < found[0].granted.length; i++){
                        
                        if(newline === length){
                            height += 512 + 5
                            newline = 0
                        }
                        
                        if(found[0].granted[i].templateId !== "MtxPurchaseBonus") newline++
                    }

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //applytext
                    const applyText = (canvas, text) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = 40;
                        do {
                            if(lang === "en"){
                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            }else if(lang === "ar"){
                                ctx.font = `${fontSize -= 1}px Arabic`;
                            }
                        } while (ctx.measureText(text).width > 420);
                        return ctx.font;
                    }

                    //creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //reseting newline
                    newline = 0

                    //loop throw every item
                    for(let i = 0; i < found[0].granted.length; i++){

                        if(found[0].granted[i].templateId !== "MtxPurchased" && found[0].granted[i].templateId !== "MtxPurchaseBonus"){

                            //request data
                            await FNBRMENA.Search(lang, "id", found[0].granted[i].templateId)
                            .then(async res => {

                                //skin informations
                                var name = res.data.items[0].name;
                                var description = res.data.items[0].description
                                var image = res.data.items[0].images.icon
                                if(res.data.items[0].series === null) var rarity = res.data.items[0].rarity.id
                                else var rarity = res.data.items[0].series.id
                                newline = newline + 1;

                                //searching for a comatiable rarity
                                if(rarity === 'Legendary'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))  
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'Epic'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'Rare'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'Uncommon'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'Common'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'MarvelSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))  
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'DCUSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'CUBESeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'CreatorCollabSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'ColumbusSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))   
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'ShadowSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'SlurpSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'FrozenSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'LavaSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425)) 
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }
                                if(rarity === 'PlatformSeries'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(name, (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, description);
                                        ctx.textAlign='center';
                                        ctx.fillText(description, (256 + x), (y + 480))
                                    }
                                }

                                var yTags = y
                                for(let i = 0; i < res.data.items[0].gameplayTags.length; i++){

                                    //if the item is animated
                                    if(res.data.items[0].gameplayTags[i].includes('Animated')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                        ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                        yTags += 40
                                    }

                                    //if the item is reactive
                                    if(res.data.items[0].gameplayTags[i].includes('Reactive')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                        ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                        yTags += 40
                                    }

                                    //if the item is synced emote
                                    if(res.data.items[0].gameplayTags[i].includes('Synced')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                        ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                        yTags += 40
                                    }

                                    //if the item is traversal
                                    if(res.data.items[0].gameplayTags[i].includes('Traversal')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                        ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                        yTags += 40
                                    }

                                    //if the item has styles
                                    if(res.data.items[0].gameplayTags[i].includes('HasVariants') || res.data.items[0].gameplayTags[i].includes('HasUpgradeQuests')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                        ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                        yTags += 40
                                    }
                                }

                                //if the item contains copyrited audio
                                if(res.data.items[0].copyrightedAudio === true){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                    ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                    yTags += 40
                                }

                                // changing x and y
                                x = x + 5 + 512; 
                                if (length === newline){
                                    y = y + 5 + 512;
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
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage('https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png');
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(vbucks + ' V-Bucks', (256 + x), (y + 425))
                            ctx.font = applyText(canvas, 'Valuable currency used to purchase goods from the store.');
                            ctx.textAlign='center';
                            ctx.fillText('Valuable currency used to purchase goods from the store.', (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(vbucks + 'فيبوكس', (256 + x), (y + 425))  
                            ctx.font = applyText(canvas, 'عملة ثمينة تُستخدَم لشراء البضائع من المتجر.');
                            ctx.textAlign='center';
                            ctx.fillText('عملة ثمينة تُستخدَم لشراء البضائع من المتجر.', (256 + x), (y + 480))
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

                        //if there is no expire date
                        if(found[0].expiryDate !== null){

                            //if the bundle is available
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "Available", value: "Yes!"},
                                    {name: "Available Since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Will be gone at", value: moment(found[0].expiryDate).format("dddd, MMMM Do of YYYY")}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "Available", value: "No!"},
                                    {name: "Available since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Gone since", value: moment(found[0].expiryDate).format("dddd, MMMM Do of YYYY")}
                                )
                            }
                        }else{
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "Available", value: "Yes!"},
                                    {name: "Available Since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Will be gone at", value: "Not yet known"}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "Available", value: "No!"},
                                    {name: "Available since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Gone since", value: "Not yet known"}
                                )
                            }
                        }
                    }else if(lang === "ar"){

                        //if there is no expire date
                        if(found[0].expiryDate !== null){

                            //if the bundle is available
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "نعم"},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "سوف تغادر في", value: moment(found[0].expiryDate).format("dddd, MMMM Do من YYYY")}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "لا",},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "غادرت منذ", value: moment(found[0].expiryDate).format("dddd, MMMM Do من YYYY")}
                                )
                            }
                        }else{
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "نعم"},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "سوف تغادر في", value: "لا يوجد تاريخ معلوم حتى الان"}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "لا",},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "غادرت منذ", value: "لا يوجد تاريخ معلوم حتى الان"}
                                )
                            }
                        }
                    }

                    if(found[0].prices.length !== 0){

                        //add cutsom prices SAR
                        var pricesSA = {
                            "paymentCurrencyCode": "SAR",
                            "paymentCurrencySymbol": "SR",
                            "paymentCurrencyAmountNatural": parseFloat(found[0].prices[1].paymentCurrencyAmountNatural * 3.75).toFixed(2)
                        }

                        //add sar
                        bundle.addFields(
                            {name: pricesSA.paymentCurrencyCode, value: pricesSA.paymentCurrencyAmountNatural + pricesSA.paymentCurrencySymbol, inline: true}
                        )

                        //add cutsom prices KWD
                        var pricesKWD = {
                            "paymentCurrencyCode": "KWD",
                            "paymentCurrencySymbol": "KD",
                            "paymentCurrencyAmountNatural": parseFloat(found[0].prices[1].paymentCurrencyAmountNatural * 0.30).toFixed(2)
                        }

                        //add kwd
                        bundle.addFields(
                            {name: pricesKWD.paymentCurrencyCode, value: pricesKWD.paymentCurrencyAmountNatural + pricesKWD.paymentCurrencySymbol, inline: true}
                        )

                        //prices
                        for(let i = 0; i < found[0].prices.length - 1; i++){
                            bundle.addFields(
                                {name: found[0].prices[i].paymentCurrencyCode, value: found[0].prices[i].paymentCurrencyAmountNatural + found[0].prices[i].paymentCurrencySymbol, inline: true}
                            )
                        }
                    }else{
                        if(lang === "en"){
                            bundle.addFields(
                                {name: 'Prices', value: 'There is no prices yet'}
                            )
                        }else if(lang === "ar"){
                            bundle.addFields(
                                {name: 'الاسعار', value: 'لا يوجد اسعار حاليا'}
                            )
                        }
                    }

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

                    const att = new Discord.MessageAttachment(canvas.toBuffer(), offerID + '.png')
                    await message.channel.send(att)
                    message.channel.send(bundle)
                    msg.delete()

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
    }
}