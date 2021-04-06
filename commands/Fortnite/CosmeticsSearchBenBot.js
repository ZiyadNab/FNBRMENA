const FortniteAPI = require("fortnite-api-com");
const Canvas = require('canvas');
const key = require('../../Coinfigs/config.json');
const axios = require("axios");


module.exports = {
    commands: 'searchben',
    expectedArgs: '<Cosmetics Name>',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command (=',
    callback: (message, arguments, text, Discord) => {

        var str = arguments[0];
        for (let i = 1; i < arguments.length; i++){
            str = str +' '+ arguments[i];
        }
        const replaced = str.split(' ').join('+');

        axios.get('https://benbotfn.tk/api/v1/cosmetics/br/search?lang=ar&searchLang=en&matchMethod=full&name='+str)
            .then(async res => {

                //font
                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = 36;
                    do {
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    } while (ctx.measureText(text).width > 420);
                    return ctx.font;
                };

                //lang
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                //creating canvas
                const canvas = Canvas.createCanvas(512, 512);
                const ctx = canvas.getContext('2d');

                //skin informations
                var name = res.data.name;
                var description = res.data.description;
                var image = res.data.icons.icon
                if(res.data.series === null){
                    var rarity = res.data.rarity;
                }else{
                    var rarity = res.data.series.name;
                }

                //searching
                if(rarity === 'أسطوري'){
                    //creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'ملحمي'){
                    //creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'نادر'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'غير شائع'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'شائع'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'سلسلة MARVEL'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'سلسلة DC'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'سلسلة DARK'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'سلسلة المشاهير'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                   
                }
                if(rarity === 'سلسلة Star Wars'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'Shadow Series'){
                    //creating image                  
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                   
                }
                if(rarity === 'سلسلة الشراب Series'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                    
                }
                if(rarity === 'سلسلة التجمد'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
        
                }
                if(rarity === 'سلسلة الحمم'){
                    //creating image                 
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                }
                if(rarity === 'سلسلة أساطير الألعاب'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 425)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 470)
                    
                }

                const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}), replaced+'.jpg')
                await message.channel.send(att)

        })
        .catch((err) => {
            console.log(err)
        })
    },
    
    requiredRoles: []
}