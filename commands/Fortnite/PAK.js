const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');
const FortniteAPI = require("fortnite-api-com");
const config = {
  apikey: FNBRMENA.APIKeys("FortniteAPI.com"),
  language: "en",
  debug: true
};
var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'pak',
    expectedArgs: '[ Pak Number ]',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //settings
        var query = {
            dynamicPakId: text,
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
            generating.setColor(FNBRMENA.Colors("embed"))
            generating.setTitle(`${loading} ${length} ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                //variables
                var x = 0;
                var y = 0;
                var width = 0
                var height = 512
                var newline = 0;

                //creating length to calc the width and height
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
                if(res.data.length === 1){
                    width = 512
                }else{
                    width += (length * 512) + (length * 5) - 5
                }

                //creating height
                for(let i = 0; i < res.data.length; i++){
                    
                    if(newline === length){
                        height += 512 + 5
                        newline = 0
                    }
                    newline++
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

                //reseting newline
                newline = 0

                //adding skins to canvas
                for (let i = 0; i < res.data.length; i++){

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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                const sending = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(send)
                msg.edit(sending)

                //send the image to discord channel
                const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.jpg')
                await message.channel.send(att)
                msg.delete()

                const info = new Discord.MessageEmbed()
                info.setColor(FNBRMENA.Colors("embed"))
                var string = ""
                if(lang === "en"){
                    info.setTitle('All cosmetic names in pak ' + text)
                  for(let i = 0; i < res.data.length; i++){
                      var num = 1 + i
                      string += "\n• " + num +": " + res.data[i].name
                  }
                  string += "\n\n• " + res.data.length +" Cosmetic(s) in total "
                  string += "\n• " + res.data[0].introduction.text
                  if(res.data[0].set !== null){
                    string += "\n• " + res.data[0].set.text
                  }
                }else if(lang === "ar"){
                    info.setTitle('جميع العناصر في باك ' + text)
                  for(let i = 0; i < res.data.length; i++){
                      var num = 1 + i
                      string += "\n• " + num +": " + res.data[i].name
                  }
                  string += "\n\n• المجموع " + res.data.length +" عناصر"
                  string += "\n• " + res.data[0].introduction.text
                  if(res.data[0].set !== null){
                    string += "\n• " + res.data[0].set.text
                  }
                }
                info.setDescription(string)
                message.channel.send(info)
            })
        }).catch(err => {
            if(lang === "en"){
              const errorData = new Discord.MessageEmbed()
              .setColor(FNBRMENA.Colors("embed"))
              .setTitle(`Pak file could not be found! ${errorEmoji}`)
              message.channel.send(errorData)
            }else if(lang === "ar"){
              const errorData = new Discord.MessageEmbed()
              .setColor(FNBRMENA.Colors("embed"))
              .setTitle(`عذرا لا يوجد ملف بالرمز هذا ${errorEmoji}`)
              message.channel.send(errorData)
            }
        })
    }
}