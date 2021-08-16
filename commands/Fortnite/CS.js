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
    commands: 'cs',
    descriptionEN: 'Returns a list of all cosmetics that got added in a specific season by your choice.',
    descriptionAR: 'أمر يسترجع لك جميع العناصر الي نزلت في موسم معين من اختيارك.',
    expectedArgsEN: 'To get a list of cosmetice is a certain season. this of what season you need to extract then what type of cosmatics like Outfits, Emotes..., then use this command',
    expectedArgsAR: 'للحصول على عناصر موسم معين يجب عليك اولا التفكير بالموسم و الفصل المراد استخراج العناصر منه ثم اختيار نوع العناصر مثل رقصات، سكنات... من بعذ ذلك استعمل الأمر لأستخراجهم',
    hintEN: 'The first number represents the chapter and the second number represents the season (Without spaces between them)',
    hintAR: 'الرقم الأول يمثل الشابتر. و الرقم الثاني يمثل الموسم (بدون مسافة بين الرقمين)',
    argsExample: ['25', '19'],
    expectedArgs: '',
    minArgs: 1,
    maxArgs: 2,
    cooldown: 60,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //voting
        const p = new Discord.MessageEmbed()
        p.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            p.setTitle('Choose a method')
            p.addFields(
                {name: 'Outfit', value: 'React to Number :one:'},
                {name: 'Back Bling', value: 'React to Number :two:'},
                {name: 'Pickaxe', value: 'React to Number :three:'},
                {name: 'Glider', value: 'React to Number :four:'},
                {name: 'Emote', value: 'React to Number :five:'},
            )
        }else if(lang === "ar"){
            p.setTitle('اختر طريقة')
            p.addFields(
                {name: 'سكنات', value: 'اختر رقم :one:'},
                {name: 'شنطات', value: 'اختر رقم :two:'},
                {name: 'بيكاكسات', value: 'اختر رقم :three:'},
                {name: 'مظلات', value: 'اختر رقم :four:'},
                {name: 'رقصات', value: 'اختر رقم :five:'},
            )
        }
        const msgReact = await message.channel.send(p)
        await msgReact.react('1️⃣')
        await msgReact.react('2️⃣')
        await msgReact.react('3️⃣')
        await msgReact.react('4️⃣')
        await msgReact.react('5️⃣')
        const filter = (reaction, user) => {
        return ['1️⃣', '2️⃣', '3️⃣', '4️⃣','5️⃣'].includes(reaction.emoji.name) && user.id === message.author.id};
        await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then( async collected => {
            const reaction = collected.first();
            if(reaction.emoji.name === '1️⃣'){
                var query = {
                    language: lang,
                    introductionChapter: args[0],
                    introductionSeason: args[1],
                    displayType: "Outfit"
                }
            }
            if(reaction.emoji.name === '2️⃣'){
                var query = {
                    language: lang,
                    introductionChapter: args[0],
                    introductionSeason: args[1],
                    displayType: "Back Bling"
                }
            }
            if(reaction.emoji.name === '3️⃣'){
                var query = {
                    language: lang,
                    introductionChapter: args[0],
                    introductionSeason: args[1],
                    displayType: "Harvesting Tool"
                }
            }
            if(reaction.emoji.name === '4️⃣'){
                var query = {
                    language: lang,
                    introductionChapter: args[0],
                    introductionSeason: args[1],
                    displayType: "Glider"
                }
            }
            if(reaction.emoji.name === '5️⃣'){
                var query = {
                    language: lang,
                    introductionChapter: args[0],
                    introductionSeason: args[1],
                    displayType: "Emote"
                }
            }

            Fortnite.CosmeticsSearchAll(query)
            .then(async res => {

                msgReact.delete()

                //creating length
                var length = res.data.length
                if(length <= 10){
                    length = length
                }else if(length > 10 && length <= 50){
                    length = length / 5
                }else if(length > 50 && length <= 70){
                    length = length / 7
                }else if(length > 70 && length < 100){
                    length = length / 10
                }else if(length > 100 && length < 200){
                    length = length / 13
                }else{
                    length = length / 20
                }

                if (length % 2 !== 0){
                    length = length | 0;
                }

                //variables
                var width = 0
                var height = 512
                var newline = 0
                var x = 0
                var y = 0

                //creating width
                width += (length * 512) + (length * 5) - 5

                //creating height
                for(let i = 0; i < res.data.length; i++){
                    
                    if(newline === length){
                        height += 512 + 5
                        newline = 0
                    }
                    newline++
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
                    } while (ctx.measureText(text).width > 230);
                    return ctx.font;
                }

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //text lang
                var string
                if(lang === "en"){
                    string = `Found ${res.data.length} item`
                }else if(lang === "ar"){
                    string = `لقت تم اكتشاف ${res.data.length} عنصر`
                }

                //reseting newline
                newline = 0

                //generating text
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                generating.setTitle(`${string} ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    for(let i = 0; i < res.data.length; i++){

                        //skin informations
                        var name = res.data[i].name;
                        var description = res.data[i].description;
                        if(res.data[i].images.featured === null){
                            var image = res.data[i].images.icon;
                        }else{
                            var image = res.data[i].images.featured;
                        }
                        var rarity = res.data[i].rarity.value
                        newline = newline + 1;

                        //searching
                        if(rarity === 'legendary'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                            
                        }
                        if(rarity === 'epic'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'rare'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'uncommon'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'common'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'marvel'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'dc'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'dark'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'icon'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'starwars'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'shadow'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'slurp'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'frozen'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'lava'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        if(rarity === 'gaminglegends'){
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
                                ctx.font = '30px Burbank Big Condensed'
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
                            // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        }
                        // changing x and y
                        x = x + 5 + 512; 
                        if (length === newline){
                            y = y + 5 + 512;
                            x = 0;
                            newline = 0;
                        }
                    }
                    const att = await new Discord.MessageAttachment(canvas.toBuffer('image/jpeg'))
                    await message.channel.send(att)
                    await msg.delete()
                })
            })
        }).catch(err => {
            msgReact.delete()
            const error = new Discord.MessageEmbed()
            .setColor(FNBRMENA.Colors("embed"))
            .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
            message.reply(error)
        })
    }
}