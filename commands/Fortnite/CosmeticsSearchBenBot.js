const FortniteAPI = require("fortnite-api-com");
const Canvas = require('canvas');
const key = require('../../Coinfigs/config.json')
const config = {
    apikey: key.apis.fortniteapi,
    language: "en",
    debug: true
  };

var Fortnite = new FortniteAPI(config);



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

        var query = {
            matchMethod: "contains",
            name: str,
            language:"en"
          };

        Fortnite.CosmeticsSearch(query)
        .then( async (res) => {
            console.log(res.data);
                //creating canvas
                const canvas = Canvas.createCanvas(512, 512);
                const ctx = canvas.getContext('2d');

                //skin informations
                var name = res.data.name;
                var description = res.data.description;
                if (res.data.icons.featured == null){
                    var image = res.data.icons.icon
                }else{
                    var image = res.data.icons.featured
                }
                if(res.data.series === null){
                    var rarity = res.data.rarity;
                }else{
                    var rarity = res.data.series.name;
                }

                //searching
                if(rarity === 'legendary'){
                    //creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/legendary.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderLegendary.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = 'bold 40px Sans'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = '15px Sans'
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 15, 15, 146, 40);
                    
                }
                if(rarity === 'epic'){
                    //creating image
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/epic.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderEpic.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'rare'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/rare.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderRare.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'غير شائع'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/uncommon.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderUncommon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة MARVEL'){
                    //creating image                    
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/marvel.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderMarvel.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة DC'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/dc.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderDc.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة DARK'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/dark.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderDark.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة المشاهير'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/icon.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderIcon.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = 'bold 40px Sans'
                    ctx.fillText(name, 256, 430)
                    ctx.textAlign='center';
                    ctx.font = '15px Sans'
                    ctx.fillText(description, 256, 460)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 15, 15, 146, 40);
                   
                }
                if(rarity === 'سلسلة Star Wars'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/starwars.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderStarwars.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'Shadow Series'){
                    //creating image                  
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/shadow.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderShadow.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                   
                }
                if(rarity === 'سلسلة الشراب Series'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/slurp.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderSlurp.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                    
                }
                if(rarity === 'سلسلة التجمد'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/frozen.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderFrozen.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
        
                }
                if(rarity === 'سلسلة الحمم'){
                    //creating image                 
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/lava.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderLava.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 30, 35, 146, 40);
                }
                if(rarity === 'سلسلة أساطير الألعاب'){
                    //creating image                   
                    const skinholder = await Canvas.loadImage('./assets/Rarities/Standard/gaming.png')
                    ctx.drawImage(skinholder, 0,0, 512, 512)
                    const skin = await Canvas.loadImage(image);
                    ctx.drawImage(skin, 0,0, 512, 512)
                    const skinborder = await Canvas.loadImage('./assets/Rarities/Standard/borderGaming.png')
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.drawImage(skinborder, 0,0, 512, 512)
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '40px Sans'
                    ctx.fillText(name, 30, 430)
                    ctx.font = '30px Sans'
                    ctx.fillText(description, 30, 470)
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