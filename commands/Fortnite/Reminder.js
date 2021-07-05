const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas')
const moment = require('moment')
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'remind',
    expectedArgs: '[ Name of the cosmetic ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

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

        //inizilizing variables
        var num = 0
        var Last = ""

        //maneging the time

        moment.locale("en")
        var time = moment(message.createdAt).format()

        //checking if the item is valid
        fortniteAPI.listItemsByName(itemName = text, options = {lang: lang})
        .then( async res => {

            //if there is more than one item
            if(await res.items.length > 1){

                //creating embed
                const Choosing = new Discord.MessageEmbed()
                Choosing.setColor('#BB00EE')

                //set title
                if(lang === "en"){
                    Choosing.setTitle('There are ' + res.items.length + ' cosmetics please choose one of them: ') 
                }else if(lang === "ar"){
                    Choosing.setTitle('يوجد ' + res.items.length + ' عنصر بنفس الأسم الرجاء الأختيار: ') 
                }

                //loop threw every matching item
                for (let i = 0; i < res.items.length; i++){
                    if(lang === "en"){
                        Choosing.addFields(
                            {name: res.items[i].name + ' ' + res.items[i].type.name, value: `react with number ${numbers[i]}`}
                        )
                    }else if(lang === "ar"){
                        Choosing.addFields(
                            {name: res.items[i].name + ' ' + res.items[i].type.name, value: `الرجاء الضغط على رقم ${numbers[i]}`}
                        )
                    }
                }

                //add reaction
                let msgID = await message.channel.send(Choosing)
                for (let i = 0; i < res.items.length; i++){
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
                        for (let i = 0; i < res.items.length; i++){
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

            //if the item is correct
            if(res.items.length !== 0){

                //if the item is from the shop
                if(res.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")){

                    //seeting up the db firestore
                    var db = admin.firestore()

                    //get the collection from the database
                    const snapshot = await db.collection("Reminders").get()

                    //get every single collection
                    var access = true
                    await snapshot.forEach(doc => {
                        if(doc.data().mainId === res.items[num].id && doc.data().id === message.author.id){
                            access = false
                        }
                    })

                    //if the item doen't exists in the database
                    if(access){
                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#BB00EE')
                        const emoji = client.emojis.cache.get("805690920157970442")
                        if(lang === "en") generating.setTitle(`Getting info about the item ${emoji}`)
                        else if(lang === "ar") generating.setTitle(`جاري البحث عن معلومات العنصر ${emoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            //json data 
                            const reminder = {
                                id: message.author.id,
                                mainId: res.items[num].id,
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
                            var name = res.items[num].name
                            var price = res.items[num].price
                            var description = res.items[num].description
                            var image = res.items[num].images.icon
                            if(res.items[num].series !== null){
                                var rarity = res.items[num].series.id
                            }else{
                                var rarity = res.items[num].rarity.id
                            }


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

                            //change the local of the moment
                            moment.locale(lang)

                            //lastseen
                            if(res.items[num].lastAppearance !== null){
                                const Now = moment();
                                var LastSeenDays = Now.diff(res.items[num].lastAppearance, 'days');
                                var LastSeenDate = moment(res.items[num].lastAppearance).format("ddd, hA")
                                if(lang === "en"){
                                    Last = LastSeenDays + " days at " + LastSeenDate
                                }else if(lang === "ar"){
                                    Last = LastSeenDays + " يوم في " + LastSeenDate
                                }
                            }else{
                                if(lang === "en"){
                                    Last = "not out yet or the sorce is not an itemshop"
                                }else if(lang === "ar"){
                                    Last = "لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب"
                                }
                            }

                            //create embed
                            const itemInfo = new Discord.MessageEmbed()

                            //set color
                            itemInfo.setColor('#BB00EE')

                            //set titles and fields
                            if(lang == "en"){
                                itemInfo.setTitle(`When ${res.items[num].name} release in the itemshop ill inform u`)
                                itemInfo.addFields(
                                    {name: "Name:", value: name},
                                    {name: "Description:", value: description},
                                    {name: "Price:", value: price},
                                    {name: "Last Appearance:", value: Last},
                                )
                            }else if(lang === "ar"){
                                itemInfo.setTitle(`اوك اذا نزل ${res.items[num].name} بعلمك`)
                                itemInfo.addFields(
                                    {name: "الاسم:", value: name},
                                    {name: "الوصف:", value: description},
                                    {name: "السعر:", value: price},
                                    {name: "اخر ظهور:", value: Last},
                                )
                            }

                            const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                            await message.channel.send(att)
                            await message.channel.send(itemInfo)
                            msg.delete()
                        })
                    }else{
                        if(lang === "en"){
                            const Err = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`The item is already added for the reminding system ${errorEmoji}`)
                            message.reply(Err)
                        }else if(lang === "ar"){
                            const Err = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`تم بالفعل اضافة العنصر من قبل في نظام التذكير ${errorEmoji}`)
                            message.reply(Err)
                        }
                    }
                }else{
                    if(lang === "en"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`The item source is not an itemshop please reselect again ${errorEmoji}`)
                        message.reply(Err)
                    }else if(lang === "ar"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`لا يمكنني تذكيرك بالعنصر لانه ليس من عناصر الايتم شوب ${errorEmoji}`)
                        message.reply(Err)
                    }
                }
            }else{
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

            //handeling errors
        }).catch(err => {
            console.log(err)
        })
    },
}