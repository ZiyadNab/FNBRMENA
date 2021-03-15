const FortniteAPI = require("fortnite-api-com");
const Canvas = require('canvas');
const key = require('../../Coinfigs/config.json')
const config = {
  apikey: key.apis.fortniteapi,
  language: "en",
  debug: true
};
var ready;
var language;
var loading;
var send;

var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'new',
    expectedArgs: '<newcosmetics>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;
            Fortnite.CosmeticsNew(lang)
                .then(async res => {

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

                    // generating animation
                    const generating = new Discord.MessageEmbed()
                    generating.setColor('#BB00EE')
                    const emoji = client.emojis.cache.get("805690920157970442")
                    generating.setTitle(`${loading} ${res.data.items.length} ${cosmetics}... ${emoji}`)
                    message.channel.send(generating)
                    .then( async msg => {

                    // picture sizes here ...
                    var shape = (res.data.items.length / 2);
                    if (shape % 2 !== 0){
                        shape += 1;
                        shape = shape | 0;
                    }
                    var x = 5;                             var reseting = 0;
                    var y = 5;                      var colum = (shape / 2);
                    var newline = 0;                        var heightline = 0;
                    var height = 512 + 5;

                    //forcing to be an int
                    if (colum % 2 !== 0){
                        colum = colum | 0;
                    }

                    // creating width
                    var width = (colum * 512) + (5 * colum) + 5;
                    console.log(colum)
                    
                    //creating height
                    for (let i = 0; i < (res.data.items.length - 1); i++){

                        heightline += 1;
                        if (colum === heightline){
                            heightline = 0;
                            height += 512 + 5;
                        }
                    }

                    height += 5;

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
                    };

                    //AR text font
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    // creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');
                    
                    // creating the background
                    const background = await Canvas.loadImage('./assets/background.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //adding skins to canvas
                    for (let i = 0; i < res.data.items.length; i++){

                        //skin informations
                        var name = res.data.items[i].name;
                        var description = res.data.items[i].description;
                        if (res.data.items[i].images.icon === null){
                            var image = res.data.items[i].images.smallIcon;
                        } else {
                            var image = res.data.items[i].images.icon;
                        }
                        var rarity = res.data.items[i].rarity.value;
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
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            
                        }
                        if(rarity === 'epic'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/epic.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/borderEpic.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'icon'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/icon.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/borderIcon.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'starwars'){
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'shadow'){
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'slurp'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/slurp.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/borderSlurp.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'frozen'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/frozen.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/borderFrozen.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'lava'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/lava.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/borderLava.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        if(rarity === 'gaminglegends'){
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (30 + x), (y + 430))
                                ctx.font = '30px Burbank Big Condensed'
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (30 + x), (y + 430))
                                
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (30 + x), (y + 470))
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        }
                        
                        
                        // changing x and y
                        x = x + 5 + 512; 
                        if (colum === newline){
                            y = y + 5 + 512;
                            x = 5;
                            newline = 0;
                        }
                    }
                    //sending embed
                    const sending = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`${send} ${emoji}`)
                    msg.edit(sending)

                    //send the image to discord channel
                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                    await message.channel.send(att)
                    msg.delete()

                })
                    
                }).catch(err => {
                    console.log(err);
            });
        })
    },
    
    requiredRoles: []
}