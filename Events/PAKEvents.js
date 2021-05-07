const axios = require('axios')
const Canvas = require('canvas');
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')
const fort = require("fortnite-api-com");
const credintials = {
    apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
    language: "en",
    debug: true
};

var Fortnite = new fort(credintials);

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.PAK)
    //result
    var data = []
    var pakNumberData = []
    var pakGuildData = []
    var Counter = 0
    var pakNumber
    var pakFile
    var pakGuild
    var lang = "ar"

    const PAK = async () => {
        Fortnite.AES()
        .then(async res => {
            if(JSON.stringify(res.data.dynamicKeys) !== JSON.stringify(data)){
                Counter = 0
                for(let i = 0; i < res.data.dynamicKeys.length; i++){
                    pakFile = res.data.dynamicKeys[i].pakFilename
                    if(pakFile.endsWith("pak")){
                        if(pakFile.substring(12, 20) !== "optional"){
                            pakNumber = pakFile.substring(8,12)
                            pakGuild = res.data.dynamicKeys[i].pakGuid
                            if(pakNumberData.includes(pakNumber)){
                                if(!pakGuildData.includes(pakGuild)){
                                    //run a command
                                    //settings
                                    var query = {
                                        dynamicPakId: pakNumber,
                                        language: lang
                                    };

                                    Fortnite.CosmeticsSearchAll(query)
                                    .then(async res => {

                                        //variables
                                        var loading;
                                        var send

                                        //language stuff
                                        if(lang === "en"){
                                            loading = "Loading a total"
                                            send = "Sending the image please wait"
                                        }
                                        if(lang === "ar"){
                                            loading = "تحميل جميع العناصر بمجموع"
                                            send = "جاري ارسال الصورة الرجاء الانتظار"
                                        }

                                        //the length
                                        var length = res.data.length;

                                        // generating animation
                                        const generating = new Discord.MessageEmbed()
                                        generating.setColor('#BB00EE')
                                        const emoji = client.emojis.cache.get("805690920157970442")
                                        generating.setTitle(`${loading} ${length} ${emoji}`)
                                        message.send(generating)
                                        .then( async msg => {

                                            //variables
                                            var x = 0;
                                            var y = 0;
                                            var colum = (length / 2);
                                            var newline = 0;
                                            var heightline = 0;

                                            //checing the number of the images to set the first height
                                            if(colum === 1){
                                                var height = 512;
                                            }else{
                                                var height = 512 + 5;

                                            }

                                            //forcing to be an int
                                            if(colum < 1){
                                                colum = 1
                                                height = 512
                                            }else if(colum % 2 !== 0){
                                                colum = colum | 0;
                                            }

                                            // creating width
                                            var width = (colum * 512) + (5 * colum) - 5;
                                            
                                            //creating height
                                            for(let i = 1; i < length; i++){
                                                if (colum === heightline){
                                                    heightline = 0;
                                                    height += 512;
                                                }
                                                heightline += 1;
                                            }

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

                                            //Registering fonts
                                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                                            // creating canvas
                                            const canvas = Canvas.createCanvas(width, height);
                                            const ctx = canvas.getContext('2d');
                                            
                                            // creating the background
                                            const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                                            //adding skins to canvas
                                            for (let i = 0; i < length; i++){
                            
                                                //skin informations
                                                var name = res.data[i].name;
                                                var description = res.data[i].description;
                                                var image = res.data[i].images.icon;
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
                                                    if(lang === "en"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                    
                                                }else
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'uncommon'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'common'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'marvel'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'dc'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'dark'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'icon'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'starwars'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'shadow'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'slurp'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'frozen'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'lava'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else
                                                if(rarity === 'gaminglegends'){
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }else{
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
                                                        ctx.font = '46px Burbank Big Condensed'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }else if(lang === "ar"){
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = '46px Arabic'
                                                        ctx.fillText(name, (256 + x), (y + 430))
                                                        ctx.font = applyText(canvas, description);
                                                        ctx.fillText(description, (256 + x), (y + 470))
                                                    }
                                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                }
                                
                                                // changing x and y
                                                x = x + 5 + 512; 
                                                if (colum === newline){
                                                    y = y + 5 + 512;
                                                    x = 0;
                                                    newline = 0;
                                                }
                                            }
                                            const sending = new Discord.MessageEmbed()
                                            .setColor('#BB00EE')
                                            .setTitle(send)
                                            msg.edit(sending)

                                            //send the image to discord channel
                                            const att = new Discord.MessageAttachment(canvas.toBuffer(), pakNumber+'.jpg')
                                            await message.send(att)
                                            msg.delete()

                                            const info = new Discord.MessageEmbed()
                                            info.setColor('#BB00EE')
                                            var string = ""
                                            if(lang === "en"){
                                                info.setTitle('All cosmetic names in pak ' + res.data[0].dynamicPakId)
                                            for(let i = 0; i < length; i++){
                                                var num = 1 + i
                                                string += "\n• " + num +": " + res.data[i].name
                                            }
                                            string += "\n\n• " + length +" Cosmetic(s) in total "
                                            string += "\n• " + res.data[0].introduction.text
                                            if(res.data[0].set !== null){
                                                string += "\n• " + res.data[0].set.text
                                            }
                                            }else if(lang === "ar"){
                                                info.setTitle('جميع العناصر في باك ' + res.data[0].dynamicPakId)
                                            for(let i = 0; i < length; i++){
                                                var num = 1 + i
                                                string += "\n• " + num +": " + res.data[i].name
                                            }
                                            string += "\n\n• المجموع " + length +" عناصر"
                                            string += "\n• " + res.data[0].introduction.text
                                            if(res.data[0].set !== null){
                                                string += "\n• " + res.data[0].set.text
                                            }
                                            }
                                            info.setDescription(string)
                                            message.send(info)
                                        })
                                    }).catch(err => {
                                        pakGuildData[Counter] = ""
                                        pakNumberData[Counter] = ""
                                    })

                                    pakGuildData[Counter] = pakGuild
                                }
                            }else{
                                //run a command
                                //settings
                                var query = {
                                    dynamicPakId: pakNumber,
                                    language: lang
                                };

                                Fortnite.CosmeticsSearchAll(query)
                                .then(async res => {

                                    //variables
                                    var loading;
                                    var send

                                    //language stuff
                                    if(lang === "en"){
                                        loading = "Loading a total"
                                        send = "Sending the image please wait"
                                    }
                                    if(lang === "ar"){
                                        loading = "تحميل جميع العناصر بمجموع"
                                        send = "جاري ارسال الصورة الرجاء الانتظار"
                                    }

                                    //the length
                                    var length = res.data.length;

                                    // generating animation
                                    const generating = new Discord.MessageEmbed()
                                    generating.setColor('#BB00EE')
                                    const emoji = client.emojis.cache.get("805690920157970442")
                                    generating.setTitle(`${loading} ${length} ${emoji}`)
                                    message.send(generating)
                                    .then( async msg => {

                                        //variables
                                        var x = 0;
                                        var y = 0;
                                        var colum = (length / 2);
                                        var newline = 0;
                                        var heightline = 0;

                                        //checing the number of the images to set the first height
                                        if(colum === 1){
                                            var height = 512;
                                        }else{
                                            var height = 512 + 5;

                                        }

                                        //forcing to be an int
                                        if(colum < 1){
                                            colum = 1
                                            height = 512
                                        }else if(colum % 2 !== 0){
                                            colum = colum | 0;
                                        }

                                        // creating width
                                        var width = (colum * 512) + (5 * colum) - 5;
                                        
                                        //creating height
                                        for(let i = 1; i < length; i++){
                                            if (colum === heightline){
                                                heightline = 0;
                                                height += 512;
                                            }
                                            heightline += 1;
                                        }

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

                                        //Registering fonts
                                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                                        // creating canvas
                                        const canvas = Canvas.createCanvas(width, height);
                                        const ctx = canvas.getContext('2d');
                                        
                                        // creating the background
                                        const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                                        //adding skins to canvas
                                        for (let i = 0; i < length; i++){
                        
                                            //skin informations
                                            var name = res.data[i].name;
                                            var description = res.data[i].description;
                                            var image = res.data[i].images.icon;
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
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                
                                            }else
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'uncommon'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'common'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'marvel'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'dc'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'dark'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'icon'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'starwars'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'shadow'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'slurp'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'frozen'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'lava'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else
                                            if(rarity === 'gaminglegends'){
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }else{
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
                                                    ctx.font = '46px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = '46px Arabic'
                                                    ctx.fillText(name, (256 + x), (y + 430))
                                                    ctx.font = applyText(canvas, description);
                                                    ctx.fillText(description, (256 + x), (y + 470))
                                                }
                                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                            }
                            
                                            // changing x and y
                                            x = x + 5 + 512; 
                                            if (colum === newline){
                                                y = y + 5 + 512;
                                                x = 0;
                                                newline = 0;
                                            }
                                        }
                                        const sending = new Discord.MessageEmbed()
                                        .setColor('#BB00EE')
                                        .setTitle(send)
                                        msg.edit(sending)

                                        //send the image to discord channel
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), pakNumber+'.jpg')
                                        await message.send(att)
                                        msg.delete()

                                        const info = new Discord.MessageEmbed()
                                        info.setColor('#BB00EE')
                                        var string = ""
                                        if(lang === "en"){
                                            info.setTitle('All cosmetic names in pak ' + res.data[0].dynamicPakId)
                                        for(let i = 0; i < length; i++){
                                            var num = 1 + i
                                            string += "\n• " + num +": " + res.data[i].name
                                        }
                                        string += "\n\n• " + length +" Cosmetic(s) in total "
                                        string += "\n• " + res.data[0].introduction.text
                                        if(res.data[0].set !== null){
                                            string += "\n• " + res.data[0].set.text
                                        }
                                        }else if(lang === "ar"){
                                            info.setTitle('جميع العناصر في باك ' + res.data[0].dynamicPakId)
                                        for(let i = 0; i < length; i++){
                                            var num = 1 + i
                                            string += "\n• " + num +": " + res.data[i].name
                                        }
                                        string += "\n\n• المجموع " + length +" عناصر"
                                        string += "\n• " + res.data[0].introduction.text
                                        if(res.data[0].set !== null){
                                            string += "\n• " + res.data[0].set.text
                                        }
                                        }
                                        info.setDescription(string)
                                        message.send(info)
                                    })
                                }).catch(err => {
                                    pakGuildData[Counter] = ""
                                    pakNumberData[Counter] = ""
                                })

                                pakGuildData[Counter] = pakGuild
                                pakNumberData[Counter] = pakNumber
                            }
                            Counter++
                        }
                    }
                }
                data = res.data.dynamicKeys
            }
        })
    }
    setInterval(PAK, 1 * 6000)
}