const moment = require('moment');
const Canvas = require('canvas');
const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);

module.exports = {
    commands: 'search',
    expectedArgs: '[ Name of the cosmetic ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            //list of reactions
            const numbers = {
                0: '0️⃣',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
                10: '🔟',
            }

            //var num
            var num = 0
            
            //get the item id
            const id = await fortniteAPI.listItems()
            .then(async res => {

                //filtering and return the cosmetic
                const items = await res.items.filter(found => {
                    return found.name.toLowerCase() === text.toLowerCase()
                })

                //if there is more than one item
                if(items.length > 1){

                    //creating embed
                    const Choosing = new Discord.MessageEmbed()
                    Choosing.setColor('#BB00EE')

                    //set title
                    if(lang === "en"){
                        Choosing.setTitle('There are ' + items.length + ' cosmetics please choose one of them: ') 
                    }else if(lang === "ar"){
                        Choosing.setTitle('يوجد ' + items.length + ' عنصر بنفس الأسم الرجاء الأختيار: ') 
                    }

                    //loop threw every matching item
                    for (let i = 0; i < items.length; i++){
                        if(lang === "en"){
                            Choosing.addFields(
                                {name: items[i].name + ' ' + items[i].type.name, value: `react with number ${numbers[i]}`}
                            )
                        }else if(lang === "ar"){
                            Choosing.addFields(
                                {name: items[i].name + ' ' + items[i].type.name, value: `الرجاء الضغط على رقم ${numbers[i]}`}
                            )
                        }
                    }

                    //add reaction
                    let msgID = await message.channel.send(Choosing)
                    for (let i = 0; i < items.length; i++){
                        msgID.react(numbers[i])
                    }

                    //filter the user choice
                    const filter = (reaction, user) => {
                        return [numbers[0], numbers[1],numbers[3], numbers[4],numbers[5], 
                                numbers[6],numbers[7], numbers[8],numbers[9], numbers[10]]
                                .includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    //based on user choice change the num value
                    await msgID.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then( async collected => {
                            const reaction = collected.first();
                            for (let i = 0; i < items.length; i++){
                            if (reaction.emoji.name === numbers[i]) {
                                num = i
                                msgID.delete()
                            }
                        }
                    }).catch(err => {
                        if(lang === "en"){
                            msgReact.delete()
                            const error = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                            message.reply(error)
                        }else if(lang === "ar"){
                            msgReact.delete()
                            const error = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                            message.reply(error)
                        }
                    })
                }
                //return the item id
                return items[num].id

            }).catch(err => {
                
            })
            
            num = 0
            fortniteAPI.getItemDetails(itemId = id, options = {lang: lang})
            .then(async res => {

                //variables
                var set
                var name
                var rarity
                var description
                var image
                var mess
                var price
                var FirstSeenDate
                var LastSeenDays
                var LastSeenDate
                var First
                var Last
                var occurrences
                var reactive
                var copyrighted
                var AddedDate
                var AddedDay
                var Type

                //initializing values
                moment.locale(lang)

                //type
                Type = res.item.type.name

                //first reales
                if(res.item.releaseDate !== null){
                    const Now = moment();
                    FirstSeenDays = Now.diff(res.item.releaseDate, 'days');
                    FirstSeenDate = moment(res.item.releaseDate).format("ddd, hA")
                    if(lang === "en"){
                        First = FirstSeenDays + " days at " + FirstSeenDate
                    }else if(lang === "ar"){
                        First = FirstSeenDays + " يوم في " + FirstSeenDate
                    }

                    //last release
                    if(res.item.lastAppearance !== null){
                        const Now = moment();
                        LastSeenDays = Now.diff(res.item.lastAppearance, 'days');
                        LastSeenDate = moment(res.item.lastAppearance).format("ddd, hA")
                        if(lang === "en"){
                            Last = LastSeenDays + " days at " + LastSeenDate
                        }else if(lang === "ar"){
                            Last = LastSeenDays + " يوم في " + LastSeenDate
                        }
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

                //added
                if(res.item.added !== null){
                    const Now = moment();
                    AddedDay = Now.diff(res.item.added.date, 'days');
                    AddedDate = moment(res.item.added.date).format("ddd, hA")
                }

                //occurrences
                if(res.item.shopHistory !== null){
                    occurrences = res.item.shopHistory.length
                }else{
                    occurrences = 0
                }

                //set
                if(res.item.set !== null){
                    set = res.item.set.partOf
                }else{
                    if(lang === "en"){
                        set = "There is no set to theis cosmetic"
                    }else if(lang === "ar"){
                        set = "لا يوجد مجموعة لهذا العنصر"
                    }
                }

                //price
                if(res.item.battlepass !== null){
                    if(lang === "en"){
                        price = `Season: ${res.item.battlepass.season} Tier: ${res.item.battlepass.tier} Battlepass Name: ${res.item.battlepass.battlePassName}`
                    }else if(lang === "ar"){
                        price = `سيزون: ${res.item.battlepass.season} تاير: ${res.item.battlepass.tier} اسم الباتل باس: ${res.item.battlepass.battlePassName}`
                    }
                }else{
                    price = res.item.price
                }

                //reactive
                if(res.item.reactive !== false){
                    if(lang === "en"){
                        reactive = "Yes, it is"
                    }else if(lang === "ar"){
                        reactive = "نعم، عنصر متفاعل"
                    }
                }else{
                    if(lang === "en"){
                        reactive = "No, it is not"
                    }else if(lang === "ar"){
                        reactive = "لا, ليس عنصر متفاعل"
                    }
                }

                //copyrightedAudio
                if(res.item.copyrightedAudio !== false){
                    if(lang === "en"){
                        copyrighted = "Yes, it is"
                    }else if(lang === "ar"){
                        copyrighted = "نعم، يحتوي على حقوق الطبع و النشر"
                    }
                }else{
                    if(lang === "en"){
                        copyrighted = "No, it is not"
                    }else if(lang === "ar"){
                        copyrighted = "لا، لا يحتوي على حقوق الطبع و النشر"
                    }
                }

                //name
                name = res.item.name;

                //description
                description = res.item.description

                //image
                if(res.item.images.featured){
                    image = res.item.images.featured
                }else{
                    image = res.item.images.icon
                }

                //rarity
                if(res.item.series !== null){
                    rarity = res.item.series.id
                }else{
                    rarity = res.item.rarity.id
                }

                //generating msg
                if(lang === "en"){
                    mess = "Getting Cosmetic Info..."
                }else if(lang === "ar"){
                    mess = "جاري البحث عن معلومات العنصر..."
                }

                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${mess} ${emoji}`)
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

                const informations = new Discord.MessageEmbed()
                informations.setColor('#BB00EE')
                if(lang === "en"){
                    informations.setTitle('Info about ' + name)
                    informations.addFields(
                        {name: "Name", value: name},
                        {name: "Description", value: description},
                        {name: "Type", value: Type},
                        {name: "Rarity", value: rarity},
                        {name: "Price", value: price},
                        {name: "Set", value: set},
                        {name: "Reactive ?", value: reactive},
                        {name: "Copy Righted Music ?", value: copyrighted},
                        {name: "Added", value: AddedDay + " days at " + AddedDate},
                        {name: "Occurrences", value: occurrences},
                        {name: "First Seen", value: First},
                        {name: "Last Seen", value: Last},
                    )
                }else if(lang === "ar"){
                    informations.setTitle('معلومات عن ' + name)
                    informations.addFields(
                        {name: "الاسم", value: name},
                        {name: "الوصف", value: description},
                        {name: "النوع", value: Type},
                        {name: "الندرة", value: rarity},
                        {name: "السعر", value: price},
                        {name: "المجموعة", value: set},
                        {name: "متفاعل ؟", value: reactive},
                        {name: "حقوق الطبع و النشر ؟", value: copyrighted},
                        {name: "تم اضافته", value: AddedDay + " يوم في " + AddedDate},
                        {name: "عدد النزول", value: occurrences},
                        {name: "اول ظهور", value: First},
                        {name: "اخر ظهور", value: Last},
                    )
                }
                const videos = new Discord.MessageEmbed()
                videos.setColor('#BB00EE')
                if(res.item.video !== null){
                    if(lang === "en"){
                        videos.setTitle("Video for the "+Type)
                        videos.setURL(res.item.video)
                    }else if(lang === "ar"){
                        videos.setTitle("مقطع الفيديو لل"+Type)
                        videos.setURL(res.item.video)
                    }
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                    msg.delete()
                    await message.channel.send(att)
                    await message.channel.send(informations)
                    message.channel.send(videos)
                }else{
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                    msg.delete()
                    await message.channel.send(att)
                    message.channel.send(informations)
                }
            })

            }).catch(err => {
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
        })
    },
}