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
    descriptionEN: 'Use this command to extract all the cosmetics in a single pak file',
    descriptionAR: 'أستخدم الأمر لأستخراج جميع العناصر المشفرة في ملف معين',
    expectedArgsEN: 'Use this command then type pak file number.',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب رقم الملف.',
    argsExample: ['1002', '1013'],
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

        //request data
        Fortnite.CosmeticsSearchAll(query)
        .then(async res => {

            //the length
            var length = res.data.length;

            //generating animation
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Loading a total ${length} ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${length} ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                //variables
                var x = 0;
                var y = 0;
                var width = 0;
                var height = 1024;
                var newline = 0;

                //creating length to calc the width and height
                if(length <= 2)length = res.data.length 
                else if(length > 2 && length <= 4)length = res.data.length / 2
                else if(length > 4 && length <= 7)length = res.data.length / 3
                else length = res.data.length / 4

                //forcing to be int
                if (length % 2 !== 0){
                    length += 1;
                    length = length | 0;
                }

                //creating width
                if(res.data.length === 1) width = 1024
                else width += (length * 1024) + (length * 10) - 10

                //creating height
                for(let i = 0; i < res.data.length; i++){
                    
                    if(newline === length){
                        height += 1024 + 10
                        newline = 0
                    }
                    newline++
                }

                //aplyText
                const applyTextName = (canvas, text) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = 92;
                    do {
                        if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                        else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                    } while (ctx.measureText(text).width > 900);
                    return ctx.font;
                };

                //applytext
                const applyTextDescription = (canvas, text) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = 35;
                    do {
                        if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                        else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                    } while (ctx.measureText(text).width > 840);
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

                    //remove any lines
                    description = description.replace("\r\n", "")

                    //add introduces and set string
                    if(res.data[i].introduction !== null) description += `\n${res.data[i].introduction.text}`
                    if(res.data[i].set !== null) description += `\n${res.data[i].set.text}`

                    //split every line
                    description = description.split(/\r\n|\r|\n/)

                    //searching
                    if(rarity === 'legendary'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'epic'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'rare'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'uncommon'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'common'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'marvel'){
                         //creating image
                         const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                         ctx.drawImage(skinholder, x, y, 1024, 1024)
                         const skin = await Canvas.loadImage(image);
                         ctx.drawImage(skin, x, y, 1024, 1024)
                         const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                         ctx.drawImage(skinborder, x, y, 1024, 1024)
                         if(lang === "en"){
                             ctx.fillStyle = '#ffffff';
                             ctx.textAlign='center';
                             ctx.font = applyTextName(canvas, name);
                             ctx.fillText(name, 512 + x, 860 + y)
                             ctx.font = applyTextDescription(canvas, description[0]);
                             let descriptionY = 930 + y
                             ctx.fillText(description[0], 512 + x, descriptionY)
                             ctx.font = '15px Burbank Big Condensed'
                             descriptionY += 35
                             for(let p = 1; p < description.length; p++){
                                 ctx.fillText(description[p], 512 + x, descriptionY)
                                 descriptionY += 15
                             }
                         }else if(lang === "ar"){
                             ctx.fillStyle = '#ffffff';
                             ctx.textAlign='center';
                             ctx.font = applyTextName(canvas, name);
                             ctx.fillText(name, 512 + x, 850 + y)
                             ctx.font = applyTextDescription(canvas, description[0]);
                             let descriptionY = 930 + y
                             ctx.fillText(description[0], 512 + x, descriptionY)
                             ctx.font = '15px Arabic'
                             descriptionY += 35
                             for(let p = 1; p < description.length; p++){
                                 ctx.fillText(description[p], 512 + x, descriptionY)
                                 descriptionY += 15
                             }
                         }
                    }else if(rarity === 'dc'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'dark'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'icon'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'starwars'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'shadow'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'slurp'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'frozen'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'lava'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else if(rarity === 'gaminglegends'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }else{
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, x, y, 1024, 1024)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 1024, 1024)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 1024, 1024)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 860 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Burbank Big Condensed'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = applyTextName(canvas, name);
                            ctx.fillText(name, 512 + x, 850 + y)
                            ctx.font = applyTextDescription(canvas, description[0]);
                            let descriptionY = 930 + y
                            ctx.fillText(description[0], 512 + x, descriptionY)
                            ctx.font = '15px Arabic'
                            descriptionY += 35
                            for(let p = 1; p < description.length; p++){
                                ctx.fillText(description[p], 512 + x, descriptionY)
                                descriptionY += 15
                            }
                        }
                    }

                    //adding tags
                    if(res.data[i].gameplayTags !== null){

                        var yTags = y
                        for(let g = 0; g < res.data[i].gameplayTags.length; g++){

                            //if the item is animated
                            if(res.data[i].gameplayTags[g].includes('Animated')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item is reactive
                            if(res.data[i].gameplayTags[g].includes('Reactive')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item is synced emote
                            if(res.data[i].gameplayTags[g].includes('Synced')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item is traversal
                            if(res.data[i].gameplayTags[g].includes('Traversal')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item has styles
                            if(res.data[i].gameplayTags[g].includes('HasVariants') || res.data[i].gameplayTags[g].includes('HasUpgradeQuests')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }
                        }
                    }
                    
                    // changing x and y
                    x = x + 10 + 1024; 
                    if (length === newline){
                        y = y + 10 + 1024;
                        x = 0;
                        newline = 0;
                    }
                }

                //sending loading msg
                const sending = new Discord.MessageEmbed()
                sending.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") sending.setTitle(`Sending the image please wait ${loadingEmoji}`)
                else if(lang === "ar") sending.setTitle(`جاري ارسال الصورة الرجاء الانتظار ${loadingEmoji}`)
                msg.edit(sending)

                //send the image to discord channel
                const att = new Discord.MessageAttachment(canvas.toBuffer(), text + '.png')
                await message.channel.send(att)
                msg.delete()

                //create info embed
                const info = new Discord.MessageEmbed()

                //add the color
                info.setColor(FNBRMENA.Colors(rarity))

                //adding string
                var string = ""
                if(lang === "en"){

                    //set the title
                    info.setTitle(`All cosmetic names in pak ${text}`)

                    //loop throw every item found
                    for(let i = 0; i < res.data.length; i++){
                        var num = 1 + i
                        string += `\n• ${num}: ${res.data[i].name}`
                    }

                    //add the total string
                    string += `\n\n• ${res.data.length} Cosmetic(s) in total`

                    //add the introduction
                    string += `\n• ${res.data[0].introduction.text}`

                    //add the set if avalabile
                    if(res.data[0].set !== null){
                        string += `\n• ${res.data[0].set.text}`
                    }
                }else if(lang === "ar"){

                    //set the title
                    info.setTitle(`جميع العناصر في باك ${text}`)

                    //loop throw every item found
                    for(let i = 0; i < res.data.length; i++){
                        var num = 1 + i
                        string += `\n• ${num}: ${res.data[i].name}`
                    }

                    //add the total string
                    string += `\n\n• المجموع ${res.data.length} عناصر`

                    //add the introduction
                    string += `\n• ${res.data[0].introduction.text}`

                    //add the set if avalabile
                    if(res.data[0].set !== null){
                        string += `\n• ${res.data[0].set.text}`
                    }
                }

                //set description
                info.setDescription(string)

                //send the message
                message.channel.send(info)
            })
        }).catch(err => {

            const errorData = new Discord.MessageEmbed()
            errorData.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") errorData.setTitle(`Pak file could not be found! ${errorEmoji}`)
            else if(lang === "ar") errorData.setTitle(`عذرا لا يوجد ملف بالرمز هذا ${errorEmoji}`)
            message.channel.send(errorData)
        })
    }
}