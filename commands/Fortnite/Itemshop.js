const FortniteAPI = require("fortnite-api-io");
const lang = require('../../Coinfigs/User.json')
const moment = require('moment')
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');
var sp;
var fe;
var language;
var loading;
var send;
var cosmetics;

module.exports = {
    commands: 'itemshop',
    expectedArgs: '<itemshop>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, arguments, text, Discord, client, admin) => {

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
        
            fortniteAPI.getDailyShop(options = {lang: language})
            .then(async res => {

                // generating animation
                var length = res.featured.length + res.daily.length + res.specialFeatured.length;
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${loading} ${length} ${cosmetics}... ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {

                var f;
                var width;
                var lines = 0;
                var height = 500;
                var x = 250;
                var y = 250;
                var newline = 0;
                if(res.featured.length >= res.specialFeatured.length){
                    f = res.featured.length;
                    if(res.featured.length >= 1 && res.featured.length <= 12){
                        fe = 3;
                        sp = 3;
                        width = (9*512) + (25 * 9) + 1000;
                        for(let i = 0; i<=f; i++){
                            lines++;
                            if(3 === lines){
                                height += 512 +25;
                                lines = 0;
                            }
                        }
                    } else if(res.featured.length > 12){
                        fe = 5;
                        sp = 3;
                        width = (12*512) + (25 * 12) + 500;
                        for(let i = 0; i<f; i++){
                            lines++;
                            if(5 === lines){
                                height += 512 +25;
                                lines = 0;
                            }
                        }
                        height += 300
                    }
                }else if(res.featured.length <= res.specialFeatured.length){
                    f = res.specialFeatured.length;
                    if(res.specialFeatured.length >= 1 && res.specialFeatured.length <= 12){
                        fe = 3;
                        sp = 3;
                        width = (9*512) + (25 * 9) + 1000;
                        for(let i = 0; i<f; i++){
                            lines++;
                            if(3 === lines){
                                height += 512 +25;
                                lines = 0;
                            }
                        }
                    } else if(res.specialFeatured.length > 12){
                        fe = 3;
                        sp = 5;
                        width = (12*512) + (25 * 12) + 500;
                        for(let i = 0; i<f; i++){
                            lines++;
                            if(5 === lines){
                                height += 512 +50;
                                lines = 0;
                            }
                        }
                        height += 300
                    }
                }

                lines = 0;
                if(res.offers.length !== 0){
                    height += 1224
                    for(let i = 0; i < res.offers.length; i++){
                        lines++;
                        if(3 === lines){
                            height += 512 +50;
                            lines = 0;
                        }
                    }
                }

                height += 300;

                //applyText
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
                };

                //AR text font
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //background
                const background = await Canvas.loadImage('./assets/Itemshop/background.png')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //code
                const code = await Canvas.loadImage('./assets/Credits/code.png')
                ctx.drawImage(code, 100, (height - 300), 1000, 200)

                ctx.fillStyle = '#ffffff';
                ctx.font = '150px Burbank Big Condensed'
                ctx.fillText("Featured", x, (y - 50))

                //searching
                for(let i = 0; i < res.featured.length; i++){

                    //skin informations
                    var name = res.featured[i].name;
                    var price = res.featured[i].price;
                    var image = res.featured[i].icon;
                    var rarity = res.featured[i].rarity;
                    var vbucks = "https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png";

                    //moment
                    var Now = moment();
                    var last = moment(res.featured[i].lastAppearance);
                    const day = Now.diff(last, 'days');
                    newline = newline + 1;

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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                        ctx.font = '40px Burbank Big Condensed'
                        ctx.fillText(name, (30 + x), (y + 430))
                        ctx.font = '30px Burbank Big Condensed'
                        ctx.fillText(price, (30 + x), (y + 470))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                
                // changing x and y
                x = x + 25 + 512; 
                if (fe === newline){
                    y = y + 25 + 512;
                    x = 250;
                    newline = 0;
                }
                
            }

            if(fe == 3){
                x = 2086;
                y = 250;
                newline = 0;
            }else if(fe === 5){
                x = 3160;
                y = 250;
                newline = 0;
            }

                        ctx.fillStyle = '#ffffff';
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.fillText("Daily", x, (y - 50))

                    //searching
                    for(let i = 0; i < res.daily.length; i++){

                        //skin informations
                        var name = res.daily[i].name;
                        var price = res.daily[i].price;
                        var image = res.daily[i].icon;
                        var rarity = res.daily[i].rarity;
                        var vbucks = "https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png";

                        //moment
                        var Now = moment();
                        var last = moment(res.daily[i].lastAppearance);
                        const day = Now.diff(last, 'days');
                        newline = newline + 1;

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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }

                        // changing x and y
                        x = x + 25 + 512; 
                        if (newline === 3){
                           y = y + 25 + 512;
                           if(fe == 3){
                            x = 2086;
                            newline = 0;
                        }else if(fe === 5){
                            x = 3160;
                            newline = 0;
                        }
                        }
                        
                    }

                    if(res.specialFeatured.length !== 0){

                    if (sp == 5){
                        x = 3747 + 250;
                        y = 250;
                        newline = 0;
                    }else if (sp == 3){
                        if(fe === 5){
                            x = 5046;
                            y = 250;
                            newline = 0;
                        }else if (fe === 3){
                            x = 3922;
                            y = 250;
                            newline = 0;
                        }
                    }

                        ctx.fillStyle = '#ffffff';
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.fillText("Special Featured", x, (y - 50))

                    //searching
                    for(let i = 0; i < res.specialFeatured.length; i++){

                        //skin informations
                        var name = res.specialFeatured[i].name;
                        var price = res.specialFeatured[i].price;
                        var image = res.specialFeatured[i].icon;
                        var rarity = res.specialFeatured[i].rarity;
                        var vbucks = "https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png";

                        //moment
                        var Now = moment();
                        var last = moment(res.specialFeatured[i].lastAppearance);
                        const day = Now.diff(last, 'days');
                        newline = newline + 1;

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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
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
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Burbank Big Condensed'
                                ctx.fillText(day + " Days", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name);
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='left';
                                ctx.font = '36px Arabic'
                                ctx.fillText(price, (84 + x), (y + 475))
                                ctx.textAlign='right';
                                ctx.font = '36px Arabic'
                                ctx.fillText(day + " يوم", (470 + x), (y + 475))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (25 + x), (y + 435), 50, 50);
                            }
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }

                        // changing x and y
                        x = x + 25 + 512; 
                       if (sp === newline){
                          y = y + 25 + 512;
                          if (sp == 5){
                            x = 3747 + 250;
                            newline = 0;                    
                          }else if (sp == 3){
                                if(fe === 5){
                                    x = 5046;
                                    newline = 0;
                                }else if (fe === 3){
                                    x = 3922;
                                    newline = 0;
                                }
                            }
                        }
                    }
                }

                const sending = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(`${send} ${emoji}`)
                msg.edit(sending)

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