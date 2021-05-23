const moment = require('moment');
const Canvas = require('canvas');
const key = require('../../Coinfigs/config.json');
const FortniteAPI = require("fortnite-api-com");
const config = {
    apikey: key.apis.fortniteapi,
    language: "en",
    debug: true
};
  
var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'merge',
    expectedArgs: '[ Name of the cosmetics with + between everyone ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            //list of reactions
            const numbers = {
                0: '0️⃣',
                1: '1️⃣',
                2: '2️⃣',
                3: '3️⃣',
                4: '4️⃣',
                5: '5️⃣',
                6: '6️⃣',
                7: '7️⃣',
                8: '8️⃣',
                9: '9️⃣',
                10: '🔟',
            }

            //lang embed
            var embed
            var of
            var mess
            var send
            if(lang === "en"){
                embed = "Extracting"
                of = "of"
                mess = "Getting API ready"
                send = "Sending the image please wait ..."
            }else if(lang === "ar"){
                embed = "جاري الاستخراج"
                of = "من"
                mess = "جاري تحضير الملفات"
                send = "جاري ارسال الصورة الرجاء الانتظار ..."
            }

            //num for the specific item
            var num = 0
            var i = 0

            //handling errors
            var errors = 0

            //storing the items
            var list = []
            var Counter = 0
            while(await text.indexOf("+") !== -1){

                //getting the index of the + in text string
                var stringNumber = text.indexOf("+")
                //substring the cosmetic name and store it
                var cosmetic = text.substring(0,stringNumber)
                //trimming every space
                cosmetic = cosmetic.trim()
                //store it into the array
                list[Counter] = cosmetic
                //remove the cosmetic from text to start again if the while statment !== -1
                text = text.replace(cosmetic + ' +','')
                //remove every space in text
                text = text.trim()
                //add the counter index
                Counter++
                //end of wile lets try aagin
            }
            //still there is the last cosmetic name so lets trim text
            text = text.trim()
            //add the what text holds in the last index
            list[Counter++] = text

            //canvas variables
            var width = 0
            var height = 512
            var newline = 0
            var x = 0
            var y = 0

            //creating the canvas

            //canvas length
            var length = list.length
            if(length <= 2){
                length = length
            }else if(length >= 3 && length <= 4){
                length = length / 2
            }else if(length > 4 && length <= 7){
                length = length / 3
            }else if(length > 7 && length <= 50){
                length = length / 5
            }else{
                length = length / 10
            }

            //forcing to be int
            if (length % 2 !== 0){
                length += 1;
                length = length | 0;
            }
            
            //creating width
            if(list.length === 1){
                width = 512
            }else{
                width += (length * 512) + (length * 5) - 5
            }

            //creating height
            for(let i = 0; i < list.length; i++){
                
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

            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`${mess} ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

                while(i < list.length) {

                    //console.log(list[i])

                    //setting up the quary
                    var query = {
                        matchMethod: "full",
                        name: list[i],
                        language: lang
                    };

                    console.log(query)

                    //search in the api
                    await Fortnite.CosmeticsSearchAll(query)
                    .then(async res => {

                        const wait = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`${embed} ${i + 1} ${of} ${list.length} ... ${emoji}`)
                        await msg.edit(wait)

                        //if there is more than one cosmetic withe the same name
                        if(res.data.length > 1){
                            const Choosing = new Discord.MessageEmbed()
                            Choosing.setColor('#BB00EE')
                            if(lang === "en"){
                                Choosing.setTitle('There are ' + res.data.length + ' cosmetics please choose one of them: ') 
                            }else if(lang === "ar"){
                                Choosing.setTitle('يوجد ' + res.data.length + ' عنصر بنفس الأسم الرجاء الأختيار: ') 
                            }
                            for (let i = 0; i < res.data.length; i++){
                                if(lang === "en"){
                                    Choosing.addFields(
                                        {name: res.data[i].name + ' ' + res.data[i].type.displayValue, value: `react with number ${numbers[i]}`}
                                        )
                                }else if(lang === "ar"){
                                    Choosing.addFields(
                                        {name: res.data[i].name + ' ' + res.data[i].type.displayValue, value: `الرجاء الضغط على رقم ${numbers[i]}`}
                                        )
                                }
                            }
                            let msgID = await message.channel.send(Choosing)
                            for (let i = 0; i < res.data.length; i++){
                                msgID.react(numbers[i])
                            }
        
                            const filter = (reaction, user) => {
                                return [numbers[0], numbers[1],numbers[3], numbers[4],numbers[5], 
                                        numbers[6],numbers[7], numbers[8],numbers[9], numbers[10]]
                                        .includes(reaction.emoji.name) && user.id === message.author.id;
                            };
        
                            await msgID.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then( async collected => {
                                    const reaction = collected.first();
                                    for (let i = 0; i < res.data.length; i++){
                                    if (reaction.emoji.name === numbers[i]) {
                                        num = i
                                        msgID.delete()
                                    }
                                }
                            }).catch(err => {
                                if(lang === "en"){
                                    msgReact.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                                    message.reply(error)
                                }else if(lang === "ar"){
                                    msgReact.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                                    message.reply(error)
                                }
                            })
                        }

                        //skin informations
                        var name = res.data[num].name;
                        var description = res.data[num].description
                        var image = res.data[num].images.icon
                        var rarity = res.data[num].rarity.value
                        
                        newline = newline + 1;

                        //searching for a comatiable rarity
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
                        //move to next item
                        i++

                        // changing x and y
                        x = x + 5 + 512; 
                        if (length === newline){
                            y = y + 5 + 512;
                            x = 0;
                            newline = 0;
                        }
                    }).catch(err => {
                        errors = 1
                        msg.delete()
                        if(lang === "en"){
                            const Err = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`The ${list[i]} is not a valid cosmetic check your speling and try again ${errorEmoji}`)
                            message.reply(Err)
                        }else if(lang === "ar"){
                            const Err = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`العنصر ${list[i]} ليس صحيحا الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                            message.reply(Err)
                        }

                    })
                    if(errors === 1){
                        break;
                    }
                }

                if(errors !== 1){
                    const sending = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`${send} ${emoji}`)
                    await msg.edit(sending)

                    if(list.length < 20){
                        const att = new Discord.MessageAttachment(canvas.toBuffer(), 'merged.png')
                        await message.channel.send(att)
                    }else{
                        const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                        await message.channel.send(att)
                    }
                    msg.delete()
                }
            })

        })
    },
}