const axios = require('axios')
const Canvas = require('canvas');
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')
const fort = require("fortnite-api-com");
const credintials = {
    apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
    language: "en",
    debug: true
};

var Fortnite = new fort(credintials);

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.PAK)
    //result
    var data = []
    var pakNumberData = []
    var pakGuildData = []
    var Counter = 0
    var pakNumber
    var pakFile
    var pakGuild

    const PAK = async () => {
        Fortnite.AES()
        .then(async res => {
            if(JSON.stringify(res.data.dynamicKeys) !== JSON.stringify(data)){
                Counter = 0
                for(let i = 0; i < res.data.dynamicKeys.length; i++){
                    pakFile = res.data.dynamicKeys[i].pakFilename
                    if(pakFile.endsWith("pak")){
                        if(pakFile.substring(12, 20) !== "optional"){
                            pakNumber = pakFile.substring(8,12)
                            if(pakNumberData.includes(pakNumber)){
                                pakGuild = res.data.dynamicKeys[i].pakGuid
                                if(!pakGuildData.includes(pakGuild)){
                                    //run a command
                                    var query = {
                                        dynamicPakId: pakNumber,
                                        language: "ar"
                                    };
                                    Fortnite.CosmeticsSearchAll(query)
                                    .then(async res => {
                                        // generating animation
                                        const generating = new Discord.MessageEmbed()
                                        generating.setColor('#BB00EE')
                                        const emoji = client.emojis.cache.get("805690920157970442")
                                        generating.setTitle(`جاري اعداد الـ API ... ${emoji}`)
                                        message.send(generating)
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
                                                var image = res.data[i].images.icon;
                                                var rarity = res.data[i].rarity.displayValue
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                    
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                    ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                            await message.send(att)
                                            msg.delete()
    
                                            const info = new Discord.MessageEmbed()
                                            info.setColor('#BB00EE')
                                            var string =" "
                                            for(let i = 0; i < length; i++){
                                                var num = 1 + i
                                                string += "\n• " + num +": " + res.data[i].name
                                            }
                                            string += "\n\n• المجموع " + length +" عناصر"
                                            info.setDescription(string)
                                            message.send(info)
                                        })
                                    })

                                    pakGuildData[Counter] = pakGuild
                                }
                            }else{
                                //run a command
                                var query = {
                                    dynamicPakId: pakNumber,
                                    language: "ar"
                                };
                                Fortnite.CosmeticsSearchAll(query)
                                .then(async res => {
                                    // generating animation
                                    const generating = new Discord.MessageEmbed()
                                    generating.setColor('#BB00EE')
                                    const emoji = client.emojis.cache.get("805690920157970442")
                                    generating.setTitle(`جاري اعداد الـ API ... ${emoji}`)
                                    message.send(generating)
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
                                            var image = res.data[i].images.icon;
                                            var rarity = res.data[i].rarity.displayValue
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                                                
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                                ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
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
                                        await message.send(att)
                                        msg.delete()

                                        const info = new Discord.MessageEmbed()
                                        info.setColor('#BB00EE')
                                        var string =" "
                                        for(let i = 0; i < length; i++){
                                            var num = 1 + i
                                            string += "\n• " + num +": " + res.data[i].name
                                        }
                                        string += "\n\n• المجموع " + length +" عناصر"
                                        info.setDescription(string)
                                        message.send(info)
                                    })
                                })

                                pakGuildData[Counter] = pakGuild
                                pakNumberData[Counter] = pakNumber
                            }
                            Counter++
                        }
                    }
                }
            }
        })
    }
    setInterval(PAK, 10 * 1000)
}