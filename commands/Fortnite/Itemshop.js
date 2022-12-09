const moment = require('moment')
const Canvas = require('canvas');

module.exports = {
    commands: 'itemshop',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 30,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        FNBRMENA.itemshop(userData.lang)
        .then(async res => {

            //generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading a total ${res.data.shop.length} cosmetics please wait... ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${res.data.shop.length} عنصر الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
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
                for(let i = 0; i < res.data.shop.length; i++){

                    //if its an a Featured item
                    if(res.data.shop[i].section.id === "Featured" || res.data.shop[i].section.id === "Featured2" || res.data.shop[i].section.id === "Featured3"){
                        Featured[FeaturedIndex] = res.data.shop[i]
                        //changing its index
                        FeaturedIndex++
                    }else
                    
                    //if its an a Daily item
                    if(res.data.shop[i].section.id === "Daily"){
                        Daily[DailyIndex] = res.data.shop[i]
                        DailyIndex++
                    }else
                    
                    //if its an a LimitedTime item
                    if(res.data.shop[i].section.id === "LimitedTime"){
                        LimitedTime[LimitedTimeIndex] = res.data.shop[i]
                        LimitedTimeIndex++
                    }else

                    //if its other items then store it here 
                    {
                        SpecialFeatured[SpecialFeaturedIndex] = res.data.shop[i]
                        SpecialFeaturedIndex++
                    }
                }
                
                //canvas stuff
                var FeaturedSection = 0
                var SpecialFeaturedSection = 0
                var LengthSection
                var Division = 0
                var width = 0
                var height = 250
                var Lines = 0
                var x = 125;
                var y = 125;

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
                            width = (9 * 256) + (12 * 9) + 500;

                            //creating height
                            for(let i = 0; i<=LengthSection; i++){
                                Lines++;
                                if(Division === Lines){
                                    height += 256 + 12;
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
                            width = (12*256) + (12 * 12) + 250;

                            //creating height
                            for(let i = 0; i<LengthSection; i++){
                                Lines++;
                                if(Division === Lines){
                                    height += 256 + 12;
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
                            width = (9 * 256) + (12 * 9) + 500;

                            //creating height
                            for(let i = 0; i<=LengthSection; i++){
                                Lines++;
                                if(Division === Lines){
                                    height += 256 + 12;
                                    Lines = 0;
                                }
                            }
                        } else if(SpecialFeatured.length > 12){
                            FeaturedSection = 3
                            SpecialFeaturedSection = 5
                            
                            //see what the division will be
                            if((Featured.length / FeaturedSection) > (SpecialFeatured.length / SpecialFeaturedSection)){
                                Division = 3
                            }else{
                                Division = 5
                            }

                            //creating width
                            width = (12 * 256) + (12 * 12) + 250;
                            
                            //creating height
                            for(let i = 0; i < LengthSection; i++){
                                Lines++;
                                if(Division === Lines){
                                    height += 256 + 12;
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
                    width = (6 * 256) + (12 * 6) + 375;

                    //creating height
                    for(let i = 0; i <= LengthSection; i++){
                        Lines++;
                        if(Division === Lines){
                            height += 256 + 12;
                            Lines = 0;
                        }
                    }
                } else if(Featured.length > 12){
                    LengthSection = Featured.length
                    FeaturedSection = 5;
                    SpecialFeaturedSection = 1;
                    Division = 5

                    //creating width
                    width = (8 * 256) + (12 * 8) + 375;

                    //creating height
                    for(let i = 0; i < LengthSection; i++){
                        Lines++;
                        if(Division === Lines){
                            height += 256 + 12;
                            Lines = 0;
                        }
                    }
                }
                //changing the value of the lines to 0
                Lines = 0;
                if(LimitedTime.length !== 0){
                    if(userData.lang === "en"){
                        if(Featured.length % FeaturedSection === 0){
                            height += 637
                            for(let i = 0; i < LimitedTime.length; i++){
                                if(3 === Lines){
                                    height += 512 + 25;
                                    Lines = 0;
                                }
                                Lines++;
                            }
                        }else{
                            height += 700
                            for(let i = 0; i < LimitedTime.length; i++){
                                if(3 === Lines){
                                    height += 512 + 25;
                                    Lines = 0;
                                }
                                Lines++;
                            }
                        } 
                    } else if(userData.lang === "ar"){
                        if(SpecialFeatured.length !== 0){
                            if(SpecialFeatured.length % SpecialFeaturedSection === 0){
                                height += 637
                                for(let i = 0; i < LimitedTime.length; i++){
                                    if(3 === Lines){
                                        height += 512 + 25;
                                        Lines = 0;
                                    }
                                    Lines++;
                                }
                            }else{
                                height += 762
                                for(let i = 0; i < LimitedTime.length; i++){
                                    if(3 === Lines){
                                        height += 512 + 25;
                                        Lines = 0;
                                    }
                                    Lines++;
                                }
                            }
                        } else if(res.data.daily.length % 3 === 0){
                            height += 762
                            for(let i = 0; i < LimitedTime.length; i++){
                                if(3 === Lines){
                                    height += 512 + 25;
                                    Lines = 0;
                                }
                                Lines++;
                            }
                        }else{
                            height += 762
                            for(let i = 0; i < LimitedTime.length; i++){
                                if(3 === Lines){
                                    height += 512 + 25;
                                    Lines = 0;
                                }
                                Lines++;
                            }
                        }
                    }
                }else{
                    height += 150
                }
                height += 200

                //applyText
                const applyText = (canvas, text, type) => {
                    const ctx = canvas.getContext('2d');
                    if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                        let fontSize = 75;
                        do {
                            if(userData.lang === "en"){
                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            }else if(userData.lang === "ar"){
                                ctx.font = `${fontSize -= 1}px Arabic`;
                            }
                        } while (ctx.measureText(text).width > 400);
                    }else{
                        let fontSize = 30;
                        do {
                            if(userData.lang === "en"){
                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            }else if(userData.lang === "ar"){
                                ctx.font = `${fontSize -= 1}px Arabic`;
                            }
                        } while (ctx.measureText(text).width > 210);
                    }
                    return ctx.font;
                };

                //Register fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //background
                const background = await Canvas.loadImage('./assets/Itemshop/background.png')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //code
                if(userData.lang === "en"){
                    const code = await Canvas.loadImage('./assets/Credits/code.png')
                    ctx.drawImage(code, 50, (height - 150), 500, 100)
                }else if(userData.lang === "ar"){
                    const code = await Canvas.loadImage('./assets/Credits/codeAR.png')
                    ctx.drawImage(code, (canvas.width - 550), (height - 150), 500, 100)
                }

                //date
                var date
                if(userData.lang === "en"){
                    moment.locale("en")
                    date = moment(res.data.lastUpdate.date).format("dddd, MMMM Do of YYYY")
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = `100px Burbank Big Condensed`
                    ctx.fillText(date, (width / 2), (height - 50))
                }else if(userData.lang === "ar"){
                    moment.locale("ar")
                    date = moment(res.data.lastUpdate.date).format("dddd, MMMM Do من YYYY")
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = `100px Arabic`
                    ctx.fillText(date, (width / 2), (height - 50))
                }

                //display items method
                const DisplayShop = async (ctx, canvas, x, y, i, type, WidthC, HeightC
                    ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                    ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize, BannerW, BannerH) => {

                    //skin informations
                    var name = type[i].displayName;
                    var price = type[i].price.finalPrice;
                    if(type[i].displayAssets.length !== 0){
                        if(type[i].displayAssets[0].url !== null) var image = type[i].displayAssets[0].url
                        else if(type[i].granted[0].images.icon !== null) var image = type[i].granted[0].images.icon
                        else var image = 'https://imgur.com/HVH5sqV.png'
                        
                    }else if(type[i].granted[0].images.icon !== null) var image = type[i].granted[0].images.icon
                    else var image = 'https://imgur.com/HVH5sqV.png'
                    var newItem = false
                    if(type[i].banner !== null){
                        if(type[i].banner.id === "New"){
                            newItem = true
                        }
                    }
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
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'Epic'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'Rare'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'Uncommon'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'Common'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'MarvelSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
                            }else{
                                ctx.fillText(name, (NameX + x), (y + NameY))
                            }
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'CUBESeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'CreatorCollabSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'ColumbusSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'ShadowSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'SlurpSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);  
                    }else
                    if(rarity === 'FrozenSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else
                    if(rarity === 'LavaSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);                            
                    }else
                    if(rarity === 'PlatformSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }else{
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, x, y, WidthC, HeightC)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, WidthC, HeightC)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, WidthC, HeightC)
                        if(userData.lang === "en"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/new.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 37))
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
                        }else if(userData.lang === "ar"){
                            if(newItem === true){
                                const newItem = await Canvas.loadImage('./assets/Shop/newAR.png')
                                ctx.drawImage(newItem, x - 10, y - 15, BannerW, BannerH)
                            }
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyText(canvas, name, type);
                            if(JSON.stringify(type) === JSON.stringify(LimitedTime)){
                                ctx.fillText(name, (NameX + x), (y + NameY - 30))
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
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (CreditX + x), (y + CreditY), CreditW, CreditH);
                    }
                    return canvas, ctx
                }

                //sending data to DisplayShop function
                Lines = 0

                //Featured
                if(userData.lang === "en"){
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '75px Burbank Big Condensed'
                    ctx.fillText("Featured", x, (y - 25))
                }else if(userData.lang === "ar"){
                    if(FeaturedSection === 3){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '75px Arabic'
                        ctx.fillText("مميز", x + 793, (y - 25))
                    }else if(FeaturedSection === 5){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '75px Arabic'
                        ctx.fillText("مميز", x + 1330, (y - 25))
                    }
                }

                //Featured Loop
                for(let i = 0; i < Featured.length; i++){
                    //changing the lines
                    Lines++

                    //width and height
                    var WidthC = 256
                    var HeightC = 256
                    var NameX = 125
                    var NameY = 215
                    var PriceX = 37
                    var PriceY = 245
                    var DayX = 243
                    var DayY = 245
                    var vBucksX = 10
                    var vBucksY = 225
                    var vBucksW = 25
                    var vBucksH = 25
                    var CreditX = 7
                    var CreditY = 7
                    var CreditW = 37
                    var CreditH = 20
                    var textSize = 18
                    var BannerW = 55
                    var BannerH = 33

                    //calling the function
                    await DisplayShop(ctx, canvas, x, y, i, Featured, WidthC, HeightC
                        ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                        ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize, BannerW, BannerH)

                    // changing x and y
                    x = x + 12 + 256; 
                    if (FeaturedSection === Lines){
                        y = y + 12 + 256;
                        x = 125;
                        Lines = 0;
                    }
                }
                
                //switching from Featured to Daily
                Lines = 0
                if(FeaturedSection == 3){
                    x = 1043;
                    y = 125;
                }else if(FeaturedSection === 5){
                    x = 1592;
                    y = 125;
                }

                //Daily

                if(userData.lang === "en"){
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '75px Burbank Big Condensed'
                    ctx.fillText("Daily", x, (y - 25))
                }else if(userData.lang === "ar"){
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '75px Arabic'
                    ctx.fillText("يومي", x + 793, (y - 30))
                }
                //Daile Loop
                for(let i = 0; i < Daily.length; i++){
                    //changing the lines
                    Lines++

                    //width and height
                    var WidthC = 256
                    var HeightC = 256
                    var NameX = 125
                    var NameY = 215
                    var PriceX = 37
                    var PriceY = 245
                    var DayX = 243
                    var DayY = 245
                    var vBucksX = 10
                    var vBucksY = 225
                    var vBucksW = 25
                    var vBucksH = 25
                    var CreditX = 7
                    var CreditY = 7
                    var CreditW = 37
                    var CreditH = 20
                    var textSize = 18
                    var BannerW = 55
                    var BannerH = 33

                    //calling the function
                    await DisplayShop(ctx, canvas, x, y, i, Daily, WidthC, HeightC
                        ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                        ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize, BannerW, BannerH)

                    // changing x and y
                    x = x + 12 + 256; 
                    if (3 === Lines){
                        y = y + 12 + 256;
                        Lines = 0
                        if(FeaturedSection == 3){
                            x = 1043;
                        }else if(FeaturedSection === 5){
                            x = 1592;
                        }
                    }
                }

                //Switching from Daily to SpecialFeatured
                Lines = 0
                if (SpecialFeaturedSection == 5){
                    x = 1873 + 125;
                    y = 125;  
                }else if (SpecialFeaturedSection == 3){
                    if(FeaturedSection === 5){
                        x = 2523;
                        y = 125;
                    }else if (FeaturedSection === 3){
                        x = 1961;
                        y = 125;
                    }
                }

                //SpecialFeatured
                if(userData.lang === "en"){
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '75px Burbank Big Condensed'
                    ctx.fillText("Special Featured", x, (y - 25))
                }else if(userData.lang === "ar"){
                    if(SpecialFeaturedSection === 3){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '75px Arabic'
                        ctx.fillText("عروض مميزة", x + 793, (y - 30))
                    }else if(SpecialFeaturedSection === 5){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '75px Arabic'
                        ctx.fillText("عروض مميزه", x + 1330, (y - 30))
                    }
                }
            
                //SpecialFeatured Loop
                for(let i = 0; i < SpecialFeatured.length; i++){
                    //changing the lines
                    Lines++

                    //width and height
                    var WidthC = 256
                    var HeightC = 256
                    var NameX = 125
                    var NameY = 215
                    var PriceX = 37
                    var PriceY = 245
                    var DayX = 243
                    var DayY = 245
                    var vBucksX = 10
                    var vBucksY = 225
                    var vBucksW = 25
                    var vBucksH = 25
                    var CreditX = 7
                    var CreditY = 7
                    var CreditW = 37
                    var CreditH = 20
                    var textSize = 18
                    var BannerW = 55
                    var BannerH = 33

                    //calling the function
                    await DisplayShop(ctx, canvas, x, y, i, SpecialFeatured, WidthC, HeightC
                        ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                        ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize, BannerW, BannerH)

                    // changing x and y
                    x = x + 12 + 256; 
                    if(SpecialFeaturedSection === Lines){
                        y = y + 12 + 256;
                        Lines = 0
                        if(SpecialFeaturedSection == 5){
                            x = 1873 + 125;                  
                        }else if (SpecialFeaturedSection == 3){
                            if(FeaturedSection === 5){
                                x = 2523;
                            }else if (FeaturedSection === 3){
                                x = 1961;
                            }
                        }
                    }
                }

                //Limited Time
                Lines = 0
                if(userData.lang === "en"){
                    x = 125
                    y = canvas.height - (150 + 75 + 512)
                    for(let i = 0; i< LimitedTime.length; i++){
                        if(Lines === 3){
                            y -= 512 + 25
                        }
                        Lines++
                    }
                }else if(userData.lang == "ar"){
                    x = canvas.width - (125 + 512 + 12)
                    y = canvas.height - (150 + 75 + 512)
                    for(let i = 0; i< LimitedTime.length; i++){
                        if(Lines === 3){
                            y -= 512 + 25
                        }
                        Lines++
                    }
                }

                if(LimitedTime.length !== 0){
                    if(userData.lang === "en"){
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '75px Burbank Big Condensed'
                        ctx.fillText("Bundles", x, (y - 27))
                    }else if(userData.lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='right';
                        ctx.font = '75px Arabic'
                        ctx.fillText("الحزم", x + 512, (y - 27))
                    }
                }

                //Limited Time Loop
                Lines = 0
                for(let i = 0; i < LimitedTime.length; i++){
                    //changing the lines
                    Lines++

                    //width and height
                    var WidthC = 512
                    var HeightC = 512
                    var NameX = 256
                    var NameY = 471
                    var PriceX = 52
                    var PriceY = 493
                    var DayX = 491
                    var DayY = 493
                    var vBucksX = 12
                    var vBucksY = 460
                    var vBucksW = 40
                    var vBucksH = 40
                    var CreditX = 15
                    var CreditY = 15
                    var CreditW = 146
                    var CreditH = 40
                    var textSize = 40

                    //calling the function
                    await DisplayShop(ctx, canvas, x, y, i, LimitedTime, WidthC, HeightC
                        ,NameX, NameY, PriceX, PriceY, DayX, DayY, vBucksX, vBucksY, vBucksW
                        ,vBucksH, CreditX, CreditY, CreditW, CreditH, textSize, BannerW, BannerH)

                    // changing x and y
                    if(userData.lang === "en"){
                        x = x + 12 + 512;
                    }else if(userData.lang === "ar"){
                        x = x - (12 + 512);
                    }
                    if (Lines === 3){
                        if(userData.lang === "en"){
                            y = y + 12 + 512;
                            Lines = 0
                            x = 125
                        }else if(userData.lang === "ar"){
                            y = y + 12 + 512;
                            Lines = 0
                            x = canvas.width - (125 + 512 + 12)
                        }
                    }
                }

                //sending message
                const sending = new Discord.EmbedBuilder()
                sending.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") sending.setTitle(`Sending the image please wait ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") sending.setTitle(`جاري ارسال الصورة الرجاء الانتظار ${emojisObject.loadingEmoji}`)
                msg.edit(sending)

                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.lastUpdate.uid}.png`})
                await message.reply({files: [att]})
                msg.delete()
            })
        })
    },
}