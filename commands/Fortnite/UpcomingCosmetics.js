const jimp = require('jimp');
const fnbrjs = require('fnbr.js');
const Canvas = require('canvas');
const fnbrco = new fnbrjs('964da610-56e8-4e52-8ec1-8d0bdc6f9892');

module.exports = {
    commands: 'upcoming',
    expectedArgs: '<Upcoming>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, arguments, text, Discord, client) => {

        fnbrco.getUpcoming()
        .then((res) => {
            console.log(res.length);
            
                // generating animation
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`Generating ... ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {

                // picture sizes here ...
                var shape = (res.length / 4);
                if (shape % 2 !== 0){
                    shape += 1;
                    shape = shape | 0;
                }
                console.log(shape)
                var x = 50;                         
                var y = 800 + 100;                  var colum = (shape / 2);
                var newline = 0;                    var heightline = 0;
                var height = 512 + 100 + 800;

                //forcing
                if (colum % 2 !== 0){
                    colum = colum | 0;
                }

                // creating width
                var width = (colum * 512) + (25 * colum) + 75;
                
                //creating height
                for (let i = 0; i < res.length; i++){
                    if ((i + 2) === res.length){
                        break
                    }
                    heightline += 1;
                    if (colum === heightline){
                        heightline = 0;
                        height += 512 + 25;
                    }
                }

                height += 50;

                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = 60;
                    do {
                    ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    } while (ctx.measureText(text).width > 400);
                    return ctx.font;
                };

                // creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');
                
                // creating the background
                const background = await Canvas.loadImage('./assets/background.jpg')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //adding credits
                const credits = await Canvas.loadImage('assets/Credits/FNBR.png');
                ctx.drawImage(credits, (width / 2) - 1000, 50,2000, 800)

                //adding skins to canvas
                for (let i = 0; i < res.length; i++){

                    var percentage = (i / res.length) * 100;
                    percentage = percentage | 0;

                    //counter embed
                    const counter = new Discord.MessageEmbed()
                    counter.setColor("#BB00EE")
                    counter.setTitle(`Loading... ${percentage}% ${emoji}`)
                    await msg.edit(counter)

                    //skin informations
                    var name = res[i].name;
                    var description = res.description;
                    var image = res[i].images.icon;
                    var rarity = res[i].rarity;
                    newline = newline + 1;

                    //searching
                    if(rarity === 'legendary'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/legendary.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                        
                    }
                    if(rarity === 'epic'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/epic.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderEpic.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'rare'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/rare.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderRare.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'uncommon'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/uncommon.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderUncommon.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'marvel'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/marvel.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderMarvel.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'dc'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/dc.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderDc.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'dark'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/dark.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderDark.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'icon_series'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/icon.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderIcon.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'starwars'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/starwars.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderStarwars.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'shadow'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/shadow.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderShadow.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'slurp'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/slurp.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderSlurp.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'frozen'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/frozen.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderFrozen.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'lava'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/lava.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderLava.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    if(rarity === 'gaming_legends'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/New/gaming.png')
                        ctx.drawImage(skinholder, x, y, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/New/borderGaming.png')
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.drawImage(skinborder, x, y, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, name);
                        ctx.fillText(name, (256 + x), (y + 450))
                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                    }
                    
                    
                    // changing x and y
                    x = x + 25 + 512; 
                    if (colum === newline){
                        y = y + 25 + 512;
                        x = 50;
                        newline = 0;
                    }
                }

                //send the image to discord channel
                const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                msg.delete()
                message.channel.send(att)

            })
        })
        .catch((err) => {
            console.log(err)
        })
    },
    requiredRoles: []
}    