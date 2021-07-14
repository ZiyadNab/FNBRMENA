const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const Canvas = require('canvas')
const config = require('../Coinfigs/config.json')
const FortniteAPI = require("fortniteapi.io-api")
const fortniteAPI = new FortniteAPI(config.apis.fortniteio)

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Bundles)

    //result
    var response = []
    var offer = []
    var available = []
    var number = 0

    const Bundle = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("bundles").once('value', async function (data) {
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === true){

                axios.get(`https://fortniteapi.io/v2/bundles?lang=${lang}&available=true`, { headers: {'Content-Type': 'application/json','Authorization': "d4ce1562-839ff66b-3946ccb6-438eb9cf",} })
                .then(async res => {

                    //store data when the bot if on
                    if(number === 0){

                        //store only available bundles
                        for(let i = 0; i < res.data.bundles.length; i++){
                            response[i] = await res.data.bundles[i].offerId
                        }

                        number++
                    }

                    //if the client wants to pust data
                    if(push === true){
                        response = []
                    }

                    //store only available bundles
                    for(let i = 0; i < res.data.bundles.length; i++){
                        offer[i] = await res.data.bundles[i].offerId
                    }

                    //compare diff
                    if(JSON.stringify(offer) !== JSON.stringify(response)){

                        //diff has been found now loop throw all the available bundles
                        for(let i = 0; i < offer.length; i++){

                            //if there is a new avaliable bundle
                            if(!response.includes(offer[i])){

                                available = await res.data.bundles.filter(id => {
                                    return id.offerId === offer[i]
                                })

                                //canvas variables
                                var width = 0
                                var height = 512
                                var newline = 0
                                var x = 0
                                var y = 0

                                //canvas length
                                var length = available[0].granted.length

                                if(length <= 2) length = length
                                else if(length >= 3 && length <= 4) length = length / 2
                                else if(length > 4 && length <= 7) length = length / 3
                                else if(length > 7 && length <= 50)length = length / 5
                                else length = length / 10

                                //forcing to be int
                                if (length % 2 !== 0){
                                    length += 1;
                                    length = length | 0;
                                }
                                
                                //creating width
                                if(available[0].granted.length === 1) width = 512
                                else width += (length * 512) + (length * 5) - 5

                                //creating height
                                for(let i = 0; i < available[0].granted.length; i++){
                                    
                                    if(newline === length){
                                        height += 512 + 5
                                        newline = 0
                                    }
                                    
                                    if(available[0].granted[i].templateId !== "MtxPurchaseBonus") newline++
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

                                //loop throw every item
                                for(let i = 0; i < available[0].granted.length; i++){

                                    if(available[0].granted[i].templateId !== "MtxPurchased" && available[0].granted[i].templateId !== "MtxPurchaseBonus"){

                                        //request data
                                        await fortniteAPI.getItemDetails(itemId = available[0].granted[i].templateId, options = {lang: lang})
                                        .then(async res => {

                                            //skin informations
                                            var name = res.items[0].name;
                                            var description = res.items[0].description
                                            var image = res.items[0].images.icon
                                            if(res.items[0].series === null) var rarity = res.items[0].rarity.id
                                            else var rarity = res.items[0].series.id
                                            newline = newline + 1;

                                            //searching for a comatiable rarity
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                            if(rarity === 'PlatformSeries'){
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
                                                    ctx.font = '40px Burbank Big Condensed'
                                                    ctx.fillText(name, (256 + x), (y + 425))
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
                                            for(let i = 0; i < res.items[0].gameplayTags.length; i++){

                                                //if the item is animated
                                                if(res.items[0].gameplayTags[i].includes('Animated')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                                    ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                                    yTags += 40
                                                }

                                                //if the item is reactive
                                                if(res.items[0].gameplayTags[i].includes('Reactive')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                                    ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                                    yTags += 40
                                                }

                                                //if the item is synced emote
                                                if(res.items[0].gameplayTags[i].includes('Synced')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                                    ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                                    yTags += 40
                                                }

                                                //if the item is traversal
                                                if(res.items[0].gameplayTags[i].includes('Traversal')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                                    ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                                    yTags += 40
                                                }

                                                //if the item has styles
                                                if(res.items[0].gameplayTags[i].includes('HasVariants') || res.items[0].gameplayTags[i].includes('HasUpgradeQuests')){

                                                    //the itm is animated add the animated icon
                                                    const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                                    ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                                    yTags += 40
                                                }
                                            }

                                            //if the item contains copyrited audio
                                            if(res.items[0].copyrightedAudio === true){

                                                //the itm is animated add the animated icon
                                                const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                                ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                                yTags += 40
                                            }

                                            // changing x and y
                                            x = x + 5 + 512; 
                                            if (length === newline){
                                                y = y + 5 + 512;
                                                x = 0;
                                                newline = 0;
                                            }
                                        })
                                    }
                                }

                                //add the vbucks image is there is a one
                                var vbucks = 0

                                //loop throw every granted item
                                for(let i = 0; i < available[0].granted.length; i++){

                                    //add every vbucks to the vbucks variable
                                    if(available[0].granted[i].templateId === "MtxPurchased" || favailable[0].granted[i].templateId === "MtxPurchaseBonus"){
                                        vbucks += await available[0].granted[i].quantity

                                    }

                                }

                                //load the image if there is a vbucks
                                if(vbucks !== 0){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage('https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png');
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Burbank Big Condensed'
                                        ctx.fillText(vbucks + ' V-Bucks', (256 + x), (y + 425))
                                        ctx.font = applyText(canvas, 'Valuable currency used to purchase goods from the store.');
                                        ctx.textAlign='center';
                                        ctx.fillText('Valuable currency used to purchase goods from the store.', (256 + x), (y + 480))
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '40px Arabic'
                                        ctx.fillText(vbucks + 'فيبوكس ', (256 + x), (y + 425))  
                                        ctx.font = applyText(canvas, 'عملة ثمينة تُستخدَم لشراء البضائع من المتجر.');
                                        ctx.textAlign='center';
                                        ctx.fillText('عملة ثمينة تُستخدَم لشراء البضائع من المتجر.', (256 + x), (y + 480))
                                    }
                                }

                                //creating embed
                                const bundle = new Discord.MessageEmbed()

                                //add color
                                bundle.setColor('#00ffff')

                                //add title
                                bundle.setTitle(available[0].name)

                                //add description
                                bundle.setDescription(available[0].description)

                                //moment language
                                moment.locale(lang)

                                //add the dates
                                if(lang === "en"){
                                    if(available[0].expiryDate !== null){
                                        bundle.addFields(
                                            {name: "Available", value: "Yes!"},
                                            {name: "Available Since", value: moment(available[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                            {name: "Will be gone at", value: moment(available[0].expiryDate).format("dddd, MMMM Do of YYYY")}
                                        )
                                    }else{
                                        bundle.addFields(
                                            {name: "Available", value: "Yes!"},
                                            {name: "Available Since", value: moment(available[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                            {name: "Will be gone at", value: "Not yet known"}
                                        )
                                    }
                                }else if(lang === "ar"){
                                    if(available[0].expiryDate !== null){
                                        bundle.addFields(
                                            {name: "متاحة للشراء", value: "نعم"},
                                            {name: "متاحة منذ", value: moment(available[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                            {name: "سوف تغادر في", value: moment(available[0].expiryDate).format("dddd, MMMM Do من YYYY")}
                                        )
                                    }else{
                                        bundle.addFields(
                                            {name: "متاحة للشراء", value: "نعم"},
                                            {name: "متاحة منذ", value: moment(available[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                            {name: "سوف تغادر في", value: "لا يوجد تاريخ معلوم حتى الان"}
                                        )
                                    }
                                }

                                //add cutsom prices SAR
                                var pricesSA = {
                                    "paymentCurrencyCode": "SAR",
                                    "paymentCurrencySymbol": "SR",
                                    "paymentCurrencyAmountNatural": parseFloat(available[0].prices[1].paymentCurrencyAmountNatural * 3.75).toFixed(2)
                                }

                                //add sar
                                bundle.addFields(
                                    {name: pricesSA.paymentCurrencyCode, value: pricesSA.paymentCurrencyAmountNatural + pricesSA.paymentCurrencySymbol, inline: true}
                                )

                                //add cutsom prices KWD
                                var pricesKWD = {
                                    "paymentCurrencyCode": "KWD",
                                    "paymentCurrencySymbol": "KD",
                                    "paymentCurrencyAmountNatural": parseFloat(available[0].prices[1].paymentCurrencyAmountNatural * 0.30).toFixed(2)
                                }

                                //add kwd
                                bundle.addFields(
                                    {name: pricesKWD.paymentCurrencyCode, value: pricesKWD.paymentCurrencyAmountNatural + pricesKWD.paymentCurrencySymbol, inline: true}
                                )

                                //prices
                                for(let p = 0; p < available[0].prices.length - 1; p++){
                                    bundle.addFields(
                                        {name: available[0].prices[p].paymentCurrencyCode, value: available[0].prices[p].paymentCurrencyAmountNatural + available[0].prices[p].paymentCurrencySymbol, inline: true}
                                    )
                                }

                                //tumbnail and image
                                if(available[0].displayAssets.length !== 0){

                                    //store the url
                                    var url = available[0].displayAssets[0].url
                                        
                                    //decode and encode
                                    url = decodeURI(url);
                                    url = encodeURI(url);

                                    //add thumbnail
                                    bundle.setThumbnail(url)

                                    //add the image
                                    if(available[0].thumbnail !== null){

                                        //store the url
                                        var url = available[0].thumbnail
                                        
                                        //decode and encode
                                        url = decodeURI(url);
                                        url = encodeURI(url);

                                        //set the image
                                        bundle.setImage(url)
                                    }else{

                                        //store the url
                                        var url = available[0].displayAssets[0].background
                                        
                                        //decode and encode
                                        url = decodeURI(url);
                                        url = encodeURI(url);

                                        //set the image
                                        bundle.setImage(url)
                                    }
                                }else{

                                    //add the image
                                    if(available[0].thumbnail !== null){

                                        //store the url
                                        var url = available[0].thumbnail
                                        
                                        //decode and encode
                                        url = decodeURI(url);
                                        url = encodeURI(url);

                                        //set the image
                                        bundle.setImage(url)
                                    }
                                }

                                const att = new Discord.MessageAttachment(canvas.toBuffer(), offerID + '.png')
                                await message.send(att)
                                await message.send(bundle)
                            
                            }
                        }

                        //store only available bundles
                        for(let i = 0; i < res.data.bundles.length; i++){
                            response[i] = await res.data.bundles[i].offerId
                        }

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("bundles").update({
                            Push: false
                        })
                    }
                })
            }
        })
    }
    setInterval(Bundle, 1 * 60000)
}