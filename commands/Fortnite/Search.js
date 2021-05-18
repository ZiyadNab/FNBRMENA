const moment = require('moment');
const Canvas = require('canvas');
const key = require('../../Coinfigs/config.json');
const FortniteAPI = require("fortnite-api-com");
const config = {
    apikey: key.apis.fortniteapi,
    language: "en",
    debug: true
};
  
var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'search',
    expectedArgs: '[ Name of the cosmetic ]',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            var query = {
                matchMethod: "full",
                name: text,
                language: lang
            };
            
            Fortnite.CosmeticsSearchAll(query)
            .then(async res => {

                //generating msg
                var mess
                if(lang === "en"){
                    mess = "Getting Cosmetic Info..."
                }else if(lang === "ar"){
                    mess = "جاري البحث عن معلومات العنصر..."
                }

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
                //num for the specific item
                var num

                //if there is no item with this name
                
                if(res.data.length === 1){
                    num = 0;
                }
                if(res.data.length > 1){
                    const Choosing = new Discord.MessageEmbed()
                    Choosing.setColor('#BB00EE')
                    if(lang === "en"){
                        Choosing.setTitle('There are ' + res.data.length + ' cosmetics please choose one of them: ') 
                    }else if(lang === "ar"){
                        Choosing.setTitle('يوجد ' + res.data.length + ' عنصر بنفس الأسم الرجاء الأختيار: ') 
                    }
                    for (let i = 0; i < res.data.length; i++){
                        if(lang === "en"){
                            Choosing.addFields(
                                {name: res.data[i].name + ' ' + res.data[i].type.displayValue, value: `react with number ${numbers[i]}`}
                                )
                        }else if(lang === "ar"){
                            Choosing.addFields(
                                {name: res.data[i].name + ' ' + res.data[i].type.displayValue, value: `الرجاء الضغط على رقم ${numbers[i]}`}
                                )
                        }
                    }
                    let msgID = await message.channel.send(Choosing)
                    for (let i = 0; i < res.data.length; i++){
                        msgID.react(numbers[i])
                    }

                    const filter = (reaction, user) => {
                        return [numbers[0], numbers[1],numbers[3], numbers[4],numbers[5], 
                                numbers[6],numbers[7], numbers[8],numbers[9], numbers[10]]
                                .includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    await msgID.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then( async collected => {
                            const reaction = collected.first();
                            for (let i = 0; i < res.data.length; i++){
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

                //initializing values
                var set
                var name = res.data[num].name;
                if(res.data[num].set !== null){
                    set = res.data[num].set.text
                }else{
                    if(lang === "en"){
                        set = "There is no set to theis cosmetic"
                    }else if(lang === "ar"){
                        set = "لا يوجد مجموعة لهذا العنصر"
                    }
                }
                var description = res.data[num].description
                if(res.data[num].images.featured !== null){
                    var image = res.data[num].images.featured
                }else{
                    var image = res.data[num].images.icon
                }
                var rarity = res.data[num].rarity.value
                if (res.data[num].shopHistory !== null){
                    var history = res.data[num].shopHistory
                }

                //searching...
                if(rarity === "legendary"){
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
                }else if(rarity === "epic"){
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
                }else if(rarity === "rare"){
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
                }else if(rarity === "uncommon"){
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
                }else if(rarity === "common"){
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
                }else if(rarity === "marvel"){
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
                }else if(rarity === "dc"){
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
                }else if(rarity === "dark"){
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
                }else if(rarity === "icon"){
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
                }else if(rarity === "starwars"){
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
                }else if(rarity === "shadow"){
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
                }else if(rarity === "slurp"){
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
                }else if(rarity === "frozen"){
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
                }else if(rarity === "lava"){
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
                }else if(rarity === "gaminglegends"){
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

                //creating date variables
                var FirstSeenDays
                var FirstSeenDate
                var LastSeenDays
                var LastSeenDate

                //introduction
                var Introduction
                if(lang === "en"){
                    introduction = "no data"
                }else if(lang === "ar"){
                    introduction = "لا يوجد معلومات"
                }
                if(res.data[num].introduction !== null){
                    introduction = res.data[num].introduction.text
                }

                //checking history
                if (res.data[num].shopHistory !== null){
                    //setting the first seen date
                    const Now = moment();
                    FirstSeenDays = Now.diff(history[num], 'days');
                    FirstSeenDate = moment(history[num]).format("ddd, hA")

                    //setting the last seen date
                    var length = history.length
                    LastSeenDays = Now.diff(history[length - 1], 'days');
                    LastSeenDate = moment(history[length - 1]).format("ddd, hA")
                }
                
                const itemInfo = new Discord.MessageEmbed()
                itemInfo.setColor('#BB00EE')
                if(lang === "en"){
                    var displayRarity = res.data[num].rarity.displayValue
                    itemInfo.setTitle('Cosmetics By Search')
                    itemInfo.setDescription('FNBR_MENA Bot has found your cosmetic')
                    
                    if(res.data[num].shopHistory !== null){
                        itemInfo.addFields(
                        {name: 'Name', value: name},
                        {name: 'Description', value: description},
                        {name: 'Rarity', value: displayRarity},
                        {name: 'Set:', value: set},
                        {name: 'Introduction', value: introduction},
                        {name: 'Occurrences', value: res.data[num].shopHistory.length},
                        {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                        {name: 'Last Seen', value: LastSeenDays + " days ago at " + LastSeenDate}
                        )
                    } else {
                        itemInfo.addFields(
                        {name: 'Name', value: name},
                        {name: 'Description', value: description},
                        {name: 'Rarity', value: displayRarity},
                        {name: 'Set:', value: set},
                        {name: 'Introduction', value: introduction},
                        {name: 'Occurrences', value: "0"},
                        {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                        {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                        )
                    }
                    itemInfo.setFooter('Generated By FNBR_MENA Bot')
                    itemInfo.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')

                    } else if(lang === "ar"){
                        var displayRarity = res.data[num].rarity.displayValue
                        itemInfo.setTitle('البحث عن عناصر')
                        itemInfo.setDescription('لقد تم البحث عن العنصر ...')
                        
                        if(res.data[num].shopHistory !== null){
                            itemInfo.addFields(
                            {name: 'الأسم', value: name},
                            {name: 'الوصف', value: description},
                            {name: 'الندرة', value: displayRarity},
                            {name: 'المجموعة:', value: set},
                            {name: 'تم عرضه في', value: introduction},
                            {name: 'عدد نزول العنصر', value: res.data[num].shopHistory.length + " مرة"},
                            {name: 'اول ظهور', value: FirstSeenDays + " يوم في الساعة " + FirstSeenDate},
                            {name: 'اخر ظهور', value: LastSeenDays + " يوم في الساعة " + LastSeenDate}
                            )
                        } else {
                            itemInfo.addFields(
                            {name: 'الأسم', value: name},
                            {name: 'الوصف', value: description},
                            {name: 'الندرة', value: displayRarity},
                            {name: 'المجموعة:', value: set},
                            {name: 'تم عرضه في', value: introduction},
                            {name: 'عدد نزول العنصر', value: "ولا مرة نزل"},
                            {name: 'اول ظهور', value: 'لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب'},
                            {name: 'اخر ظهور', value: 'لم يتم نزول العنصر بعد او مصدر العنصر ليس من الايتم شوب'}
                            )
                        }
                        itemInfo.setFooter('تم ارسالها من FNBR_MENA Bot')
                        itemInfo.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                        }

                        // credits
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, 15, 15, 146, 40);

                        const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                        msg.delete()
                        await message.channel.send(att)
                        message.channel.send(itemInfo)
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