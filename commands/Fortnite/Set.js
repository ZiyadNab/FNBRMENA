const error = require('../Errors')
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
    commands: 'set',
    expectedArgs: '[ Name of the set ]',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            var query = {
                set: text,
                language: lang
            };

            //text lang
            var string
            if(lang === "en"){
                string = "Searching for Cosmetics"
            }else if(lang === "ar"){
                string = "جاري البحث عن عناصر"
            }

            //generating text
            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`${string} ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {
            
                Fortnite.CosmeticsSearchAll(query)
                .then(async res => {

                    //variables
                    var width = 0
                    var height = 512
                    var newline = 0
                    var x = 0
                    var y = 0

                    //creating length
                    var length = res.data.length
                    if(length <= 2){
                        length = res.data.length
                    }else if(length > 2 && length <= 4){
                        length = res.data.length / 2
                    }else if(length > 4 && length <= 7){
                        length = res.data.length / 3
                    }else{
                        length = res.data.length / 4
                    }

                    //forcing to be int
                    if (length % 2 !== 0){
                        length += 1;
                        length = length | 0;
                    }

                    //creating width
                    width += (length * 512) + (length * 5) - 5

                    //creating height
                    for(let i = 0; i < res.data.length; i++){
                        
                        if(newline === length){
                            height += 512 + 5
                            newline = 0
                        }
                        newline++
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

                    for (let i = 0; i < res.data.length; i++){

                        //skin informations
                        var name = res.data[i].name;
                        var description = res.data[i].description;
                        if (res.data[i].images.icon === null){
                            var image = res.data[i].images.smallIcon;
                        } else {
                            var image = res.data[i].images.icon;
                        }
                        var rarity = res.data[i].rarity.value;
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
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
                        }
                        if(rarity === 'epic'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'icon'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'starwars'){
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'shadow'){
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'slurp'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'frozen'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'lava'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'gaminglegends'){
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
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        // changing x and y
                        x = x + 5 + 512; 
                        if (length === newline){
                            y = y + 5 + 512;
                            x = 0;
                            newline = 0;
                        }
                    }

                    if(res.data.length < 20){
                        const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                        await message.channel.send(att)
                    }else{
                        const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                        await message.channel.send(att)
                    }
                    msg.delete()
                    const embed = new Discord.MessageEmbed()
                    embed.setColor('BB00EE')
                    var string = ""
                    for(let i = 0; i < res.data.length; i++){
                        var num = 1 + i
                        string += "\n• " + num +": " + res.data[i].name
                    }
                    if(lang === "en"){
                        string += "\n\n• All Cosmetic "+res.data.length
                        embed.setTitle("All Cosmetics In Set " + res.data[0].set.value)
                        
                    }else if(lang === "ar"){
                        string += "\n\n• المجموع " + res.data.length +" عناصر"
                        embed.setTitle("جميع العناصر في مجموعة " + res.data[0].set.value)
                        
                    }
                    embed.setDescription(string)
                    message.channel.send(embed)

                }).catch(err =>{
                    if(lang === "en"){
                        const errorData = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`Sorry, No cosmetics has been found ${errorEmoji}`)
                        msg.delete()
                        message.channel.send(errorData)
                    }else if(lang === "ar"){
                        const errorData = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`عذرا لم يتم العثور على عناصر ${errorEmoji}`)
                        msg.delete()
                        message.channel.send(errorData)
                    }
                })
            })
        })
    },
}