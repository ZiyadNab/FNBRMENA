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

        //inizilizing variables
        var num = 0
        var Last = ""
        var mess = ""

        if(lang === "en"){
            mess = "Getting info about the item"
        }else if(lang === "ar"){
            mess = "جاري البحث عن معلومات العنصر" 
        }

        //maneging the time
        var time = moment(message.createdAt)

        //checking if the item is valid
        fortniteAPI.listItemsByName(itemName = text, options = {lang: lang})
        .then( async res => {

            if(res.items.length > 0){
                if(res.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")){

                    const generating = new Discord.MessageEmbed()
                    generating.setColor('#BB00EE')
                    const emoji = client.emojis.cache.get("805690920157970442")
                    generating.setTitle(`${mess} ${emoji}`)
                    message.channel.send(generating)
                    .then( async msg => {
                        
                        //seeting up the db firestore
                        var db = admin.firestore()

                        //json data 
                        const reminder = {
                            id: message.author.id,
                            mainId: res.items[num].id,
                            date: time,
                            lang: lang
                        }

                        //get the collection from the database
                        const snapshot = await db.collection("Reminders").get()

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