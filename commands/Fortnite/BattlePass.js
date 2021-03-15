const FortniteAPI = require("fortnite-api-io");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');
var ready;
var language;
var loading;
var send;

module.exports = {
    commands: 'battlepass',
    expectedArgs: '[Number of the season]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            if(lang === "en"){
                ready = "Getting the API Ready ..."
                language = "en"
                loading = "Loading ..."
                send = "Sending the image please wait"
            }
            if(lang === "ar"){
                ready = "جاري اعداد الـ API ..."
                language = "ar"
                loading = "تم اكتمال"
                send = "جاري ارسال الصورة الرجاء الانتظار"
            }

            fortniteAPI.getBattlepassRewards(season = args, options = {lang: language})
                .then(async res => {
                console.log(res.paid);
                // generating animation
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${ready} ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {
                    var length = res.paid.rewards.length + res.free.rewards.length;

                    // picture sizes here for paid ...
                    var shape = (length / 2);
                    if (shape % 2 !== 0){
                        shape += 1;
                        shape = shape | 0;
                    }
                    console.log(shape)
                    var x = 50;
                    var y = 800 + 100;                      
                    var colum = (shape / 5);
                    var newline = 0;                        
                    var heightline = 0;
                    var height = 512 + 150 + 800 + 1024;
                    var free = 0;
                    //forcing to be an int
                    if (colum % 2 !== 0){
                        colum = colum | 0;
                    }
                    // creating width for paid
                    var width = (colum * 512) + (25 * colum) + 75;
                                                
                    //creating height for paid
                    for (let i = 0; i < length; i++){
                        heightline += 1;
                        if (colum === heightline){
                            heightline = 0;
                            height += 512 + 25;
                        }
                    }

                    height += 25;

                    // creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');
                    
                    // creating the background
                    const background = await Canvas.loadImage('./assets/background.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //adding credits
                    const credits = await Canvas.loadImage('assets/Credits/FNBR.png');
                    ctx.drawImage(credits, (width / 2) - 1000, 50,2000, 800)

                    //adding skins to canvas
                    for (let i = 0; i < length; i++){

                        var percentage = (i / length) * 100;
                        percentage = percentage | 0;

                        //counter embed
                        const counter = new Discord.MessageEmbed()
                        counter.setColor("#BB00EE")
                        counter.setTitle(`${loading} ${percentage}% ${emoji}`)
                        await msg.edit(counter)

                        if(i >= res.paid.rewards.length){

                            if (free === 0){
                                x = 50;
                                y += 512 + 25 + 512;
                                newline = 0;
                            }
                    
                            var name = res.free.rewards[free].name;
                            var description = res.free.rewards[free].description;
                            if(res.free.rewards[free].images.icon === null){
                                var image = 'https://i.imgur.com/h3MZw2G.png';
                            }else{
                                var image = res.free.rewards[free].images.icon;
                            }
                            var rarity = res.free.rewards[free].rarity;
                            newline = newline + 1;

                            //searching
                            if(rarity === 'legendary'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/legendary.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 55px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                }
                            }
                            if(rarity === 'epic'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/epic.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                }
                                
                            }
                            if(rarity === 'rare'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/rare.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'uncommon'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'common'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/common.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'marvel'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/marvel.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                }
                                
                            }
                            if(rarity === 'dc'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/dc.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'dark'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/dark.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'icon series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/icon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'star wars series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/starwars.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'shadow series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/shadow.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'slurp series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/slurp.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'frozen series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/frozen.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'lava series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/lava.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'platform series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/gaming.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }

                            free += 1;

                        }

                        if(i < res.paid.rewards.length){
                            //skin informations
                            var name = res.paid.rewards[i].name;
                            var description = res.paid.rewards[i].description;
                            if(res.paid.rewards[i].images.icon === null){
                                var image = 'https://i.imgur.com/h3MZw2G.png';
                            }else{
                                var image = res.paid.rewards[i].images.icon;
                            }
                            var rarity = res.paid.rewards[i].rarity;
                            newline = newline + 1;

                            //searching
                            if(rarity === 'legendary'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/legendary.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'epic'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/epic.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'rare'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/rare.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'uncommon'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'common'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/common.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'marvel'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/marvel.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff'; 
                                ctx.font = '60px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 455))
                                
                                
                                
                            }
                            if(rarity === 'dc'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/dc.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'dark'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/dark.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'icon series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/icon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'star wars series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/starwars.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'shadow series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/shadow.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'slurp series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/slurp.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'frozen series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/frozen.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'lava series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/lava.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'platform series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/gaming.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.font = 'bold 48px Sans'
                                    ctx.fillText(name, (30 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                        }

                        // changing x and y
                        x = x + 25 + 512; 
                        if (colum === newline){
                            y = y + 25 + 512;
                            x = 50;
                            newline = 0;
                        }
                        
                    }
                    const sending = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`${send} ${emoji}`)
                    msg.edit(sending)
                    //send the image to discord channel
                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}), res.season + '.jpg')
                    await message.channel.send(att)
                    msg.delete()

                    if(lang === "en"){
                        const info = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle("Some informations about battlepass season " + res.season)
                        .addFields(
                            {name: "Season:", value: res.season},
                            {name: "All The Items:", value: res.paid.rewards.length + res.free.rewards.length},
                            {name: "Paid Items:", value: res.paid.rewards.length},
                            {name: "Free Items:", value: res.free.rewards.length},
                        )
                        .setFooter('Generated By FNBR_MENA Bot')
                        .setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                        
                        message.channel.send(info)
                    } else if(lang === "ar"){
                        const info = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle("بعض المعلومات عن باتل باس سيزون " + res.season)
                        .addFields(
                            {name: "الموسم:", value: res.season},
                            {name: "جميع العناصر:", value: res.paid.rewards.length + res.free.rewards.length},
                            {name: "العناصر المدفوعة:", value: res.paid.rewards.length},
                            {name: "العناصر المجانية:", value: res.free.rewards.length},
                        )
                        .setFooter('Generated By FNBR_MENA Bot')
                        .setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                        
                        message.channel.send(info)

                    }
                              
                }).catch(err => {
                    console.log(err);
            })
            }).catch(err => {
            console.log(err);
        })
    })
    },
    
    requiredRoles: []
}