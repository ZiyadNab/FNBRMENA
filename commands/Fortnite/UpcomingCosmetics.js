const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const Canvas = require('canvas');
const moment = require('moment')

module.exports = {
    commands: 'upcoming',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        fortniteAPI.listUpcomingItems(options = {lang: lang})
        .then(async res => {
            console.log(res.items.length)

            //variables
            var width = 0
            var height = 512
            var newline = 0
            var x = 0
            var y = 0

            //creating length
            var length = res.items.length
            if(length <= 2){
                length = res.items.length
            }else if(length > 2 && length <= 4){
                length = res.items.length / 2
            }else if(length > 4 && length <= 7){
                length = res.items.length / 3
            }else if(length > 7 && length <= 50){
                length = res.items.length / 5
            }else{
                length = res.items.length / 10
            }

            if (length % 2 !== 0){
                length += 1;
                length = length | 0;
            }

            //creating width
            width += (length * 512) + (length * 5) - 5

            //creating height
            for(let i = 0; i < res.items.length; i++){
                
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
                let fontSize = 60;
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

            newline = 0
            for(let i = 0; i < res.items.length; i++){

                //skin informations
                var name = res.items[i].name;
                var image = res.items[i].images.icon;
                if(res.items[i].series === null){
                    var rarity = res.items[i].rarity.id;
                }else{
                    var rarity = res.items[i].series.id
                }

                //moment
                var Now = moment();
                var last = moment(res.items[i].added.date);
                const day = Now.diff(last, 'days');
                newline++

                if(rarity === 'Legendary'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'Epic'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'Rare'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'Uncommon'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'Common'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'MarvelSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                }else
                if(rarity === 'DCUSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'CUBESeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'CreatorCollabSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'ColumbusSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'ShadowSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'SlurpSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                }else
                if(rarity === 'FrozenSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);    
                }else
                if(rarity === 'LavaSeries'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
                    }
                    // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);    
                }else
                if(rarity === 'PlatformSeriess'){
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
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
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Burbank Big Condensed`
                        ctx.fillText(day + " Days", (487 + x), (y + 490))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 430))
                        ctx.textAlign='right';
                        ctx.font = `${36}px Arabic`
                        ctx.fillText(day + " يوم", (487 + x), (y + 490))
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
            const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 50}))
            await message.channel.send(att)
        })
    }
}    