const FortniteAPI = require("fortniteapi.io-api");
const Discord = require('discord.js')
const moment = require('moment')
const key = require('../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.itemshop)
    //result
    var data = []
    var lang = "ar"
    var number = 0

    const Itemshop = async () => {
        fortniteAPI.getDailyShopV2(options = {lang: lang})
        .then(async res => {
            if(number === 0){
                data = res.shop
                number++
            }
            if(JSON.stringify(res.shop) !== JSON.stringify(data)){
                //variables
                var language;
                var loading;
                var send;
                var cosmetics;

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

                //generating animation
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${loading} ${res.shop.length} ${cosmetics}... ${emoji}`)
                message.send(generating)
                .then( async msg => {

                    //creating array of objects
                    var Featured = []
                    var Daily = []
                    var SpecialFeatured = []
                    var LimitedTime = []

                    //creating each array index
                    var FeaturedIndex = 0
                    var DailyIndex = 0
                    var SpecialFeaturedIndex = 0
                    var LimitedTimeIndex = 0

                    //storing items into there arrays
                    for(let i = 0; i < res.shop.length; i++){

                        //if its an a Featured item
                        if(res.shop[i].section.id === "Featured" || res.shop[i].section.id === "Featured2" || res.shop[i].section.id === "Featured3"){
                            Featured[FeaturedIndex] = res.shop[i]
                            //changing its index
                            FeaturedIndex++
                        }else
                        
                        //if its an a Daily item
                        if(res.shop[i].section.id === "Daily"){
                            Daily[DailyIndex] = res.shop[i]
                            DailyIndex++
                        }else
                        
                        //if its an a LimitedTime item
                        if(res.shop[i].section.id === "LimitedTime"){
                            LimitedTime[LimitedTimeIndex] = res.shop[i]
                            LimitedTimeIndex++
                        }else

                        //if its other items then store it here 
                        {
                            SpecialFeatured[SpecialFeaturedIndex] = res.shop[i]
                            SpecialFeaturedIndex++
                        }
                    }
                    
                    //canvas stuff
                    var FeaturedSection = 0
                    var SpecialFeaturedSection = 0
                    var LengthSection
                    var Division = 0
                    var width = 0
                    var height = 500
                    var Lines = 0
                    var x = 250;
                    var y = 250;

                    //checing if there is Special items
                    if(SpecialFeatured.length !== 0){
                        //there is Special items lets check who is bigget (=
                        if(Featured.length >= SpecialFeatured.length){
                            //Featured is bigger than SpecialFeatured
                            LengthSection = Featured.length
                            //checking if we will devide this from 3 or 5
                            if(Featured.length >= 1 && Featured.length <= 12){
                                FeaturedSection = 3
                                SpecialFeaturedSection = 3
                                Division = 3

                                //creating width
                                width = (9*512) + (25 * 9) + 1000;

                                //creating height
                                for(let i = 0; i<=LengthSection; i++){
                                    Lines++;
                                    if(Division === Lines){
                                        height += 512 +25;
                                        Lines = 0;
                                    }
                                }

                            } else if(Featured.length > 12){
                                FeaturedSection = 5
                                SpecialFeaturedSection = 3
                                
                                //see what the division will be
                                if((Featured.length / FeaturedSection) > (SpecialFeatured.length / SpecialFeaturedSection)){
                                    Division = 5
                                }else{
                                    Division = 3
                                }

                                //creating width
                                width = (12*512) + (25 * 12) + 500;

                                //creating height
                                for(let i = 0; i<LengthSection; i++){
                                    Lines++;
                                    if(Division === Lines){
                                        height += 512 +25;
                                        Lines = 0;
                                    }
                                }
                            }
                        } else if(Featured.length <= SpecialFeatured.length){
                            LengthSection = SpecialFeatured.length
                            if(SpecialFeatured.length >= 1 && SpecialFeatured.length <= 12){
                                FeaturedSection = 3
                                SpecialFeaturedSection = 3
                                Division = 3

                                //creating width
                                width = (9*512) + (25 * 9) + 1000;

                                //creating height
                                for(let i = 0; i<=LengthSection; i++){
                                    Lines++;
                                    if(Division === Lines){
                                        height += 512 +25;
                                        Lines = 0;
                                    }
                                }
                            } else if(SpecialFeatured.length > 12){
                                FeaturedSection = 3
                                SpecialFeaturedSection = 5
                                
                                //see what the division will be
                                if((Featured.length / FeaturedSection) > (SpecialFeatured.length / SpecialFeaturedSection)){
                                    Division = 5
                                }else{
                                    Division = 3
                                }

                                //creating width
                                width = (12*512) + (25 * 12) + 500;

                                //creating height
                                for(let i = 0; i<LengthSection; i++){
                                    Lines++;
                                    if(Division === Lines){
                                        height += 512 +25;
                                        Lines = 0;
                                    }
                                }
                            }
                        }
                    } else if(Featured.length >= 1 && Featured.length <= 12){
                        LengthSection = Featured.length
                        FeaturedSection = 3;
                        SpecialFeaturedSection = 1;
                        Division = 3

                        //creating width
                        width = (6*512) + (25 * 6) + 750;

                        //creating height
                        for(let i = 0; i<=LengthSection; i++){
                            Lines++;
                            if(Division === Lines){
                                height += 512 +25;
                                Lines = 0;
                            }
                        }
                    } else if(Featured.length > 12){
                        LengthSection = Featured.length
                        FeaturedSection = 5;
                        SpecialFeaturedSection = 1;
                        Division = 5

                        //creating width
                        width = (8*512) + (25 * 8) + 750;

                        //creating height
                        for(let i = 0; i<LengthSection; i++){
                            Lines++;
                            if(Division === Lines){
                                height += 512 +25;
                                Lines = 0;
                            }
                        }
                    }
                    //changing the value of the lines to 0
                    Lines = 0;
                    if(LimitedTime.length !== 0){
                        if(lang === "en"){
                            if(Featured.length % FeaturedSection === 0){
                                height += 1274
                                for(let i = 0; i < LimitedTime.length; i++){
                                    Lines++;
                                    if(3 === Lines){
                                        height += 512 +50;
                                        Lines = 0;
                                    }
                                }
                            }else{
                                height += 1400
                                for(let i = 0; i < LimitedTime.length; i++){
                                    Lines++;
                                    if(3 === Lines){
                                        height += 512 +50;
                                        Lines = 0;
                                    }
                                }
                            } 
                        } else if(lang === "ar"){
                            if(SpecialFeatured.length !== 0){
                                if(SpecialFeatured.length % SpecialFeaturedSection === 0){
                                    height += 1274
                                    for(let i = 0; i < LimitedTime.length; i++){
                                        Lines++;
                                        if(3 === Lines){
                                            height += 512 +50;
                                            Lines = 0;
                                        }
                                    }
                                }else{
                                    height += 1524
                                    for(let i = 0; i < LimitedTime.length; i++){
                                        Lines++;
                                        if(3 === Lines){
                                            height += 512 +50;
                                            Lines = 0;
                                        }
                                    }
                                }
                            } else if(res.daily.length % 3 === 0){
                                height += 1274
                                for(let i = 0; i < LimitedTime.length; i++){
                                    Lines++;
                                    if(3 === Lines){
                                        height += 512 +50;
                                        Lines = 0;
                                    }
                                }
                            }else{
                                height += 1524
                                for(let i = 0; i < LimitedTime.length; i++){
                                    Lines++;
                                    if(3 === Lines){
                                        height += 512 +50;
                                        Lines = 0;
                                    }
                                }
                            }
                        }
                    }else{
                        height += 600
                    }
                    height += 600

                    //applyText
                    const applyText = (canvas, text, type) => {
                        const ctx = canvas.getContext('2d');
                        if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                            let fontSize = 150;
                            do {
                                if(lang === "en"){
                                    ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                }else if(lang === "ar"){
                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                }
                            } while (ctx.measureText(text).width > 800);
                        }else{
                            let fontSize = 60;
                            do {
                                if(lang === "en"){
                                    ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                }else if(lang === "ar"){
                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                }
                            } while (ctx.measureText(text).width > 420);
                        }
                        return ctx.font;
                    };

                    //Register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/Itemshop/background.png')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //code
                    if(lang === "en"){
                        const code = await Canvas.loadImage('./assets/Credits/code.png')
                        ctx.drawImage(code, 100, (height - 300), 1000, 200)
                    }else if(lang === "ar"){
                        const code = await Canvas.loadImage('./assets/Credits/codeAR.png')
                        ctx.drawImage(code, (canvas.width - 1100), (height - 300), 1000, 200)
                    }

                    const DisplayShop = async (ctx, canvas, x, y, i, type, WidthC, HeightC
                        ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                        ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize) => {

                        //skin informations
                        var name = type[i].displayName;
                        var price = type[i].price.regularPrice;
                        var image = type[i].displayAssets[0].url;
                        if(type[i].series === null){
                            var rarity = type[i].rarity.id;
                        }else{
                            var rarity = type[i].series.id
                        }
                        var vbucks = "https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png";

                        //moment
                        var Now = moment();
                        var last
                        if(type[i].previousReleaseDate !== null){
                            last = moment(type[i].previousReleaseDate);
                        }else{
                            last = moment(type[i].firstReleaseDate)
                        }
                        const day = Now.diff(last, 'days');

                        if(rarity === 'Legendary'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'Epic'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'Rare'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'Uncommon'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'Common'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'MarvelSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name, type);
                                ctx.fillText(name, (NameX + x), (y + NameY))
                                ctx.textAlign='left';
                                ctx.font = `${textSize}px Burbank Big Condensed`
                                ctx.fillText(price, (PriceX + x), (y + PriceY))
                                ctx.textAlign='right';
                                ctx.font = `${textSize}px Burbank Big Condensed`
                                ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, name, type);
                                if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                    ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                }else{
                                    ctx.fillText(name, (NameX + x), (y + NameY))
                                }
                                ctx.textAlign='left';
                                ctx.font = `${textSize}px Arabic`
                                ctx.fillText(price, (PriceX + x), (y + PriceY))
                                ctx.textAlign='right';
                                ctx.font = `${textSize}px Arabic`
                                ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                ctx.textAlign='left';
                                const v = await Canvas.loadImage(vbucks);
                                ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                            }
                        }else
                        if(rarity === 'DCUSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'DarkSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'CreatorCollabSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                            
                        }else
                        if(rarity === 'ColumbusSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'ShadowSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else
                        if(rarity === 'SlurpSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                            
                        }else
                        if(rarity === 'FrozenSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                            
                        }else
                        if(rarity === 'LavaSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                            
                        }else
                        if(rarity === 'PlatformSeriess'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 60))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }else{
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                            ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, WidthC, HeightC)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                            ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                            if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Burbank Big Condensed`
                                    ctx.fillText(day + " Days", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyText(canvas, name, type);
                                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                        ctx.fillText(name, (NameX + x), (y + NameY - 75))
                                    }else{
                                        ctx.fillText(name, (NameX + x), (y + NameY))
                                    }
                                    ctx.textAlign='left';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(price, (PriceX + x), (y + PriceY))
                                    ctx.textAlign='right';
                                    ctx.font = `${textSize}px Arabic`
                                    ctx.fillText(day + " يوم", (DayX + x), (y + DayY))
                                    ctx.textAlign='left';
                                    const v = await Canvas.loadImage(vbucks);
                                    ctx.drawImage(v, (vBucksX + x), (y + vBucksY), vBucksW, vBucksH);
                                }
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                        }
                        return canvas, ctx
                    }

                    //sending data to DisplayShop function
                    Lines = 0
                    var WidthC = 0
                    var HeightC = 0
                    var NameX = 0
                    var NameY = 0
                    var PriceX = 0
                    var PriceY = 0
                    var DayX = 0
                    var DayY = 0
                    var vBucksX = 0
                    var vBucksY = 0
                    var vBucksW = 0
                    var vBucksH = 0
                    var CreditX = 0
                    var CreditY = 0
                    var CreditW = 0
                    var CreditH = 0
                    var textSize = 0

                    //Featured
                    if(lang === "en"){
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.fillText("Featured", x, (y - 50))
                    }else if(lang === "ar"){
                        if(FeaturedSection === 3){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '150px Arabic'
                            ctx.fillText("مميز", x + 1586, (y - 50))
                        }else if(FeaturedSection === 5){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '150px Arabic'
                            ctx.fillText("مميز", x + 2660, (y - 50))
                        }
                    }

                    //Featured Loop
                    for(let i = 0; i < Featured.length; i++){
                        //changing the lines
                        Lines++

                        //width and height
                        WidthC = 512
                        HeightC = 512
                        NameX = 256
                        NameY = 430
                        PriceX = 75
                        PriceY = 490
                        DayX = 487
                        DayY = 490
                        vBucksX = 20
                        vBucksY = 450
                        vBucksW = 50
                        vBucksH = 50
                        CreditX = 15
                        CreditY = 15
                        CreditW = 146
                        CreditH = 40
                        textSize = 36

                        //calling the function
                        await DisplayShop(ctx, canvas, x, y, i, Featured, WidthC, HeightC
                            ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                            ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize)

                        // changing x and y
                        x = x + 25 + 512; 
                        if (FeaturedSection === Lines){
                            y = y + 25 + 512;
                            x = 250;
                            Lines = 0;
                        }
                    }
                    
                    //switching from Featured to Daily
                    Lines = 0
                    if(FeaturedSection == 3){
                        x = 2086;
                        y = 250;
                    }else if(FeaturedSection === 5){
                        x = 3185;
                        y = 250;
                    }

                    //Daily

                    if(lang === "en"){
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.fillText("Daily", x, (y - 50))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '150px Arabic'
                        ctx.fillText("يومي", x + 1586, (y - 60))
                    }
                    //Daile Loop
                    for(let i = 0; i < Daily.length; i++){
                        //changing the lines
                        Lines++

                        //width and height
                        WidthC = 512
                        HeightC = 512
                        NameX = 256
                        NameY = 430
                        PriceX = 75
                        PriceY = 490
                        DayX = 487
                        DayY = 490
                        vBucksX = 20
                        vBucksY = 450
                        vBucksW = 50
                        vBucksH = 50
                        CreditX = 15
                        CreditY = 15
                        CreditW = 146
                        CreditH = 40
                        textSize = 36

                        //calling the function
                        await DisplayShop(ctx, canvas, x, y, i, Daily, WidthC, HeightC
                            ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                            ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize)

                        // changing x and y
                        x = x + 25 + 512; 
                        if (3 === Lines){
                            y = y + 25 + 512;
                            Lines = 0
                            if(FeaturedSection == 3){
                                x = 2086;
                            }else if(FeaturedSection === 5){
                                x = 3185;
                            }
                        }
                    }

                    //Switching from Daily to SpecialFeatured
                    Lines = 0
                    if (SpecialFeaturedSection == 5){
                        x = 3747 + 250;
                        y = 250;  
                    }else if (SpecialFeaturedSection == 3){
                        if(FeaturedSection === 5){
                            x = 5046;
                            y = 250;
                        }else if (FeaturedSection === 3){
                            x = 3922;
                            y = 250;
                        }
                    }

                    //SpecialFeatured
                    if(lang === "en"){
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.fillText("Special Featured", x, (y - 50))
                    }else if(lang === "ar"){
                        if(SpecialFeaturedSection === 3){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '150px Arabic'
                            ctx.fillText("عروض مميزة", x + 1586, (y - 60))
                        }else if(SpecialFeaturedSection === 5){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '150px Arabic'
                            ctx.fillText("عروض مميزه", x + 2660, (y - 60))
                        }
                    }
                
                    //SpecialFeatured Loop
                    for(let i = 0; i < SpecialFeatured.length; i++){
                        //changing the lines
                        Lines++

                        //width and height
                        WidthC = 512
                        HeightC = 512
                        NameX = 256
                        NameY = 430
                        PriceX = 75
                        PriceY = 490
                        DayX = 487
                        DayY = 490
                        vBucksX = 20
                        vBucksY = 450
                        vBucksW = 50
                        vBucksH = 50
                        CreditX = 15
                        CreditY = 15
                        CreditW = 146
                        CreditH = 40
                        textSize = 36

                        //calling the function
                        await DisplayShop(ctx, canvas, x, y, i, SpecialFeatured, WidthC, HeightC
                            ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                            ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize)

                        // changing x and y
                        x = x + 25 + 512; 
                        if(SpecialFeaturedSection === Lines){
                            y = y + 25 + 512;
                            Lines = 0
                            if(SpecialFeaturedSection == 5){
                                x = 3747 + 250;                  
                            }else if (SpecialFeaturedSection == 3){
                                if(FeaturedSection === 5){
                                    x = 5046;
                                }else if (FeaturedSection === 3){
                                    x = 3922;
                                }
                            }
                        }
                    }

                    //Limited Time
                    Lines = 0
                    if(lang === "en"){
                        x = 250
                        y = canvas.height - (300 + 150 + 1024)
                    }else if(lang == "ar"){
                        x = canvas.width - (250 + 1024 + 25)
                        y = canvas.height - (300 + 150 + 1024)
                    }

                    if(lang === "en"){
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.fillText("Bundles", x, (y - 55))
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '150px Arabic'
                        ctx.fillText("الحزم", x + 1024, (y - 55))
                    }

                    //Limited Time Loop
                    for(let i = 0; i < LimitedTime.length; i++){
                        //changing the lines
                        Lines++

                        //width and height
                        WidthC = 1024
                        HeightC = 1024
                        NameX = 512
                        NameY = 942
                        PriceX = 105
                        PriceY = 987
                        DayX = 982
                        DayY = 987
                        vBucksX = 25
                        vBucksY = 920
                        vBucksW = 80
                        vBucksH = 80
                        CreditX = 30
                        CreditY = 30
                        CreditW = 292
                        CreditH = 80
                        textSize = 80

                        //calling the function
                        await DisplayShop(ctx, canvas, x, y, i, LimitedTime, WidthC, HeightC
                            ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                            ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize)

                        // changing x and y
                        if(lang === "en"){
                            x = x + 25 + 1024;
                        }else if(lang === "ar"){
                            x = x - (25 + 1024);
                        }
                        if (Lines === 3){
                            if(lang === "en"){
                                y = y + 25 + 1024;
                                Lines = 0
                                x = 250
                            }else if(lang === "ar"){
                                y = y + 25 + 1024;
                                Lines = 0
                                x = canvas.width - (250 + 1024 + 1024 + 25)
                            }
                        }
                    }

                    //sending message
                    const sending = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`${send} ${emoji}`)
                    msg.edit(sending)

                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                    await message.send(att)
                    msg.delete()
                    data = res.shop
                })
            }
        })
    }
    setInterval(Itemshop, 3 * 30000)
}