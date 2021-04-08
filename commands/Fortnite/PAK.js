const Canvas = require('canvas');
const axios = require('axios');

module.exports = {
    commands: 'pak',
    expectedArgs: '[ Pak Number ]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;
            if(lang === "en"){
                axios.get(`https://benbotfn.tk/api/v1/cosmetics/br/dynamic/${args}?lang=en`)
                .then(async res => {
                    console.log(res.data);

                    // generating animation
                    const generating = new Discord.MessageEmbed()
                    generating.setColor('#BB00EE')
                    const emoji = client.emojis.cache.get("805690920157970442")
                    generating.setTitle(`Getting the API Ready ... ${emoji}`)
                    message.channel.send(generating)
                    .then( async msg => {

                        var length = res.data.length;

                        // picture sizes here for paid ...
                        var shape = (length / 2);
                        if (shape % 2 !== 0){
                            shape += 1;
                            shape = shape | 0;
                        }
                        console.log(shape)
                        var x = 0;                   var row = 1;
                        var y = 0;                   var colum = (shape);
                        var newline = 0;              var heightline = 0;
                        if(colum === 1){
                            var height = 512;
                        }else{
                            var height = 512 + 5;

                        }
                        //forcing to be an int
                        if (colum % 2 !== 0){
                            colum = colum | 0;
                        }

                        // creating width for paid
                        var width = (colum * 512) + (5 * colum) - 5;
                        
                        //creating height for paid
                        for (let i = 0; i < length; i++){
                            if ((i + 1) === length){
                                break
                            }
                            heightline += 1;
                            if (colum === heightline){
                                heightline = 0;
                                height += 512;
                            }
                        }

                        const applyText = (canvas, text) => {
                            const ctx = canvas.getContext('2d');
                            let fontSize = 36;
                            do {
                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            } while (ctx.measureText(text).width > 420);
                            return ctx.font;
                        };

                        //AR text font
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                        // creating canvas
                        const canvas = Canvas.createCanvas(width, height);
                        const ctx = canvas.getContext('2d');
                        
                        // creating the background
                        const background = await Canvas.loadImage('./assets/background.jpg')
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                        //adding skins to canvas
                        for (let i = 0; i < length; i++){
        
                            //skin informations
                            var name = res.data[i].name;
                            var description = res.data[i].description;
                            var image = res.data[i].icons.icon;
                            if(res.data[i].series === null){
                                var rarity = res.data[i].rarity;
                            }else{
                                var rarity = res.data[i].series.name;
                            }
                            newline = newline + 1;
        
                            //searching
                            if(rarity === 'Legendary'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                
                            }
                            if(rarity === 'Epic'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Rare'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Uncommon'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'MARVEL SERIES'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'DC SERIES'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'DARK SERIES'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Icon Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Star Wars Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Shadow Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Slurp Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Frozen Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Lava Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            if(rarity === 'Gaming Legends Series'){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                ctx.drawImage(skinholder, x, y, 512, 512)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.drawImage(skinborder, x, y, 512, 512)
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '46px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 430))
                                ctx.textAlign='center';
                                ctx.font = applyText(canvas, description);
                                ctx.fillText(description, (256 + x), (y + 470))
                                const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                            }
                            
                            
                            // changing x and y
                            x = x + 5 + 512; 
                            if (colum === newline){
                                y = y + 5 + 512;
                                x = 0;
                                newline = 0;
                            }
                        }
                        const sending = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle('Sending the image please wait')
                        msg.edit(sending)

                        //send the image to discord channel
                        const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 100}))
                        await message.channel.send(att)
                        msg.delete({timeout: 500})

                        const info = new Discord.MessageEmbed()
                        info.setColor('#BB00EE')
                        info.setTitle('All cosmetic names in pak ' + args)
                        var string ="• " + res.data[0].name
                        for(let i = 1; i < length; i++){
                            string += "\n• " + res.data[i].name;
                        }
                        string += "\n\n• " + length +" Cosmetic(s) in total "
                        info.setDescription(string)
                        info.setFooter('Generated By FNBR_MENA Bot')
                        info.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                        message.channel.send(info)
                    
                    }).catch(err => {
                        console.log(err);
                    })
                }).catch(err => {
                    const errorData = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(':x: Pak file could not be found!')
                    message.channel.send(errorData)
                })

            } if(lang === "ar"){
                axios.get(`https://benbotfn.tk/api/v1/cosmetics/br/dynamic/${args}?lang=ar`)
                    .then(async res => {
                        console.log(res.data);
                        // generating animation
                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#BB00EE')
                        const emoji = client.emojis.cache.get("805690920157970442")
                        generating.setTitle(`جاري اعداد الـ API ... ${emoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            var length = res.data.length;

                            // picture sizes here for paid ...
                            var shape = (length / 2);
                            if (shape % 2 !== 0){
                                shape += 1;
                                shape = shape | 0;
                            }
                            console.log(shape)
                            var x = 0;                   var row = 1;
                            var y = 0;                   var colum = (shape);
                            var newline = 0;              var heightline = 0;
                            if(colum === 1){
                                var height = 512;
                            }else{
                                var height = 512 + 5;

                            }
                            //forcing to be an int
                            if (colum % 2 !== 0){
                                colum = colum | 0;
                            }

                            // creating width for paid
                            var width = (colum * 512) + (5 * colum) - 5;
                            
                            //creating height for paid
                            for (let i = 0; i < length; i++){
                                if ((i + 1) === length){
                                    break
                                }
                                heightline += 1;
                                if (colum === heightline){
                                    heightline = 0;
                                    height += 512;
                                }
                            }

                            //Font
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                            const applyText = (canvas, text) => {
                                const ctx = canvas.getContext('2d');
                                let fontSize = 40;
                                do {
                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                } while (ctx.measureText(text).width > 420);
                                return ctx.font;
                            };

                            // creating canvas
                            const canvas = Canvas.createCanvas(width, height);
                            const ctx = canvas.getContext('2d');
                            
                            // creating the background
                            const background = await Canvas.loadImage('./assets/background.jpg')
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                            //adding skins to canvas
                            for (let i = 0; i < length; i++){
            
                                //skin informations
                                var name = res.data[i].name;
                                var description = res.data[i].description;
                                var image = res.data[i].icons.icon;
                                if(res.data[i].series === null){
                                    var rarity = res.data[i].rarity;
                                }else{
                                    var rarity = res.data[i].series.name;
                                }
                                newline = newline + 1;
            
                                //searching
                                if(rarity === 'أسطوري'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                    
                                }
                                if(rarity === 'ملحمي'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'نادر'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'غير شائع'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة MARVEL'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة DC'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة DARK'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة المشاهير'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة Star Wars'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'Shadow Series'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة الشراب Series'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة التجمد'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة الحمم'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                if(rarity === 'سلسلة أساطير الألعاب'){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = '46px Arabic'
                                    ctx.fillText(name, (256 + x), (y + 430))
                                    ctx.font = applyText(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, (256 + x), (y + 470))
                                    const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(credit, (30 + x), (y + 35), 146, 40);
                                }
                                
                                
                                // changing x and y
                                x = x + 5 + 512; 
                                if (colum === newline){
                                    y = y + 5 + 512;
                                    x = 0;
                                    newline = 0;
                                }
                            }
                            const sending = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle('جاري ارسال الصورة الرجاء الانتظار')
                            msg.edit(sending)

                            //send the image to discord channel
                            const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 100}))
                            await message.channel.send(att)
                            msg.delete({timeout: 500})

                            const info = new Discord.MessageEmbed()
                            info.setColor('#BB00EE')
                            info.setTitle('جميع العناصر في باك ' + args)
                            var string ="• " + res.data[0].name
                            for(let i = 1; i < length; i++){
                                string += "\n• " + res.data[i].name;
                            }
                            string += "\n\n• المجموع " + length +" عناصر"
                            info.setDescription(string)
                            info.setFooter('Generated By FNBR_MENA Bot')
                            info.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                            message.channel.send(info)
                        
                        }).catch(err => {
                            console.log(err);
                        })
                    }).catch(err => {
                        const errorData = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(":x: عذرا لا يوجد ملف بالرمز هذا")
                        message.channel.send(errorData)
                    })
                }
            })
    },
    
    requiredRoles: []
}