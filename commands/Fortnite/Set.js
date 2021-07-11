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
    commands: 'set',
    expectedArgs: '[ Name of the set ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        var query = {
            set: text,
            language: lang
        }

        //generating text
        const generating = new Discord.MessageEmbed()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en") generating.setTitle(`Searching for Cosmetics... ${loadingEmoji}`)
        else if(lang === "ar") generating.setTitle(`جاري البحث عن عناصر... ${loadingEmoji}`)
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
                if(length <= 2) length = res.data.length
                else if(length > 2 && length <= 4) length = res.data.length / 2
                else if(length > 4 && length <= 7) length = res.data.length / 3
                else length = res.data.length / 4

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
                    var name = res.data[i].name
                    var description = res.data[i].description
                    if (res.data[i].images.icon === null) var image = res.data[i].images.smallIcon
                    else var image = res.data[i].images.icon
                    var rarity = res.data[i].rarity.value
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
                    }

                    var yTags = y
                    for(let g = 0; g < res.data[i].gameplayTags.length; g++){

                        //if the item is animated
                        if(res.data[i].gameplayTags[g].includes('Animated')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                            ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                            yTags += 40
                        }

                        //if the item is reactive
                        if(res.data[i].gameplayTags[g].includes('Reactive')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                            ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                            yTags += 40
                        }

                        //if the item is synced emote
                        if(res.data[i].gameplayTags[g].includes('Synced')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                            ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                            yTags += 40
                        }

                        //if the item is traversal
                        if(res.data[i].gameplayTags[g].includes('Traversal')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                            ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                            yTags += 40
                        }

                        //if the item has styles
                        if(res.data[i].gameplayTags[g].includes('HasVariants')){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                            ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                            yTags += 40
                        }
                    }

                    // changing x and y
                    x = x + 5 + 512; 
                    if (length === newline){
                        y = y + 5 + 512;
                        x = 0;
                        newline = 0;
                    }
                }

                if(res.data.length < 20) var att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                else var att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                await message.channel.send(att)
                msg.delete()

                //create set embed
                const embed = new Discord.MessageEmbed()

                //set color
                embed.setColor(FNBRMENA.Colors(rarity))

                //loop throw every item
                var string = ""
                for(let i = 0; i < res.data.length; i++){
                    var num = 1 + i
                    string += "\n• " + num +": " + res.data[i].name
                }

                //if user lang is english
                if(lang === "en"){
                    string += `\n\n• All Cosmetic ${res.data.length}`
                    embed.setTitle(`All cosmetics in set ${res.data[0].set.value}`)
                    
                }else if(lang === "ar"){
                    string += `\n\n• المجموع ${res.data.length} عناصر`
                    embed.setTitle(`جميع العناصر في مجموعة ${res.data[0].set.value}`)
                    
                }

                //set description
                embed.setDescription(string)

                //send the embed
                message.channel.send(embed)

            }).catch(err =>{

                //no emote has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`Sorry, No cosmetics has been found ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`عذرا لم يتم العثور على عناصر ${errorEmoji}`)
                message.channel.send(Err)

            })
        })
    },
}