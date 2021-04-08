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
                language = "en"
                loading = "Loading a total"
                send = "Sending the image please wait"
                cosmetics = "cosmetics please wait"
            }
            if(lang === "ar"){
                language = "ar"
                loading = "تحميل جميع العناصر بمجموع"
                send = "جاري ارسال الصورة الرجاء الانتظار"
                cosmetics = "عنصر الرجاء الانتظار"
            }

            fortniteAPI.getBattlepassRewards(season = args, options = {lang: language})
                .then(async res => {
    
                // generating animation
                var length = res.paid.rewards.length + res.free.rewards.length;
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${loading} ${length} ${cosmetics}... ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    // picture sizes here for paid ...
                    var shape = (length / 2);
                    if (shape % 2 !== 0){
                        shape += 1;
                        shape = shape | 0;
                    }
                    var x = 50;
                    var y = 800 + 100;                      
                    var colum = (shape / 5);
                    var newline = 0;                        
                    var heightline = 0;
                    var height = 512 + 150 + 800 + 1024;
                    var free = 0;
                    var adding = 0
                    var count = 0;
                    var highcount = 0;
                    //forcing to be an int
                    if (colum % 2 !== 0){
                        colum = colum | 0;
                    }
                    // creating width for paid
                    var width = (colum * 512) + (25 * colum) + 75;
                                                
                    //creating height for paid
                    for (let i = 0; i < res.paid.rewards.length; i++){
                        heightline += 1;
                        if (colum === heightline){
                            heightline = 0;
                            height += 512 + 25;
                            highcount += 1;
                        }
                    }

                    for (let i = 0; i < res.free.rewards.length; i++){
                        heightline += 1;
                        if (colum === heightline){
                            heightline = 0;
                            height += 512 + 25;
                        }
                    }

                    //checking high
                    if(((highcount * colum) - res.paid.rewards.length) === 0){
                        height -= 512
                    }

                    height += 25;

                    //AR text font
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

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

                        if(i >= res.paid.rewards.length){

                            if (free === 0){

                                //seeing if the items were endded at the end of the photo
                                if(((count * colum) - res.paid.rewards.length) !== 0){
                                    adding = 512
                                }
                                x = 50;
                                y += 512 + 25 + adding;
                                newline = 0;
                            }
                    
                            var name = res.free.rewards[free].name;
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
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = 'bold 55px Sans'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                }
                            }
                            if(rarity === 'epic'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                }
                                
                            }
                            if(rarity === 'rare'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'uncommon'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'common'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'marvel'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                }
                                
                            }
                            if(rarity === 'dc'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'dark'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'icon series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'star wars series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'shadow series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'slurp series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'frozen series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'lava series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'platform series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
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
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'epic'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'rare'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'uncommon'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'common'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'marvel'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center'; 
                                ctx.font = '60px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 455))
                                
                                
                                
                            }
                            if(rarity === 'dc'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'dark'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'icon series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'star wars series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'shadow series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                            if(rarity === 'slurp series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'frozen series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'lava series'){
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
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                                
                            }
                            if(rarity === 'platform series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Burbank Big Condensed'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                } else if (lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '60px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 455))
                                    
                                    
                                }
                                
                            }
                        }

                        // changing x and y
                        x = x + 25 + 512; 
                        if (colum === newline){
                            y = y + 25 + 512;
                            x = 50;
                            newline = 0;
                            count += 1;
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