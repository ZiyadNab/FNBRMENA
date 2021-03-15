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
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/legendary.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderLegendary.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 15, 15, 146, 40);
                    
                }
                if(rarity === 'ملحمي'){
                    //creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/epic.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderEpic.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'نادر'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/rare.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderRare.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'غير شائع'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/uncommon.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderUncommon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة MARVEL'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/marvel.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderMarvel.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة DC'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/dc.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderDc.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة DARK'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/dark.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderDark.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة المشاهير'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/icon.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderIcon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = '15px Sans'
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 15, 15, 146, 40);
                   
                }
                if(rarity === 'سلسلة Star Wars'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/starwars.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderStarwars.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'Shadow Series'){
                    //creating image                  
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/shadow.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderShadow.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                   
                }
                if(rarity === 'سلسلة الشراب Series'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/slurp.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderSlurp.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة التجمد'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/frozen.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderFrozen.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
        
                }
                if(rarity === 'سلسلة الحمم'){
                    //creating image                 
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/lava.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderLava.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                }
                if(rarity === 'سلسلة أساطير الألعاب'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/New/gaming.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderGaming.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '46px Arabic'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = applyText(canvas, description);
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
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