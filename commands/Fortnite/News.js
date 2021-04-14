const Canvas = require('canvas')
var wrap = require('word-wrap');
const Gif = require('make-a-gif')
const FortniteAPI = require("fortnite-api-com");
const config = {
  apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
  language: "en",
  debug: true
};
var arrayBR = []
var arrayCR = []
var arraySTW = []

var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'news',
    expectedArgs: '<BR> <STW> <Creative>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, arguments, text, Discord, client, admin) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            if(lang === "en"){
                const mode = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle('Choose a Mode')
                .addFields(
                    {name: 'Battle Royale', value: 'React to Number 1 for Battle Royale'},
                    {name: 'STW', value: 'React to Number 2 for Save The World'},
                    {name: 'Creative', value: 'React to Number 3 for Creative'}
                )
                const msgReact = await message.channel.send(mode)
                await msgReact.react('1️⃣')
                await msgReact.react('2️⃣')
                await msgReact.react('3️⃣')
                const filter = (reaction, user) => {
                    return ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                };
                msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then( async collected => {
                                const reaction = collected.first();

                                const generating = new Discord.MessageEmbed()
                                generating.setColor('#BB00EE')
                                const emoji = client.emojis.cache.get("805690920157970442")
                                generating.setTitle(`Getting News ... ${emoji}`)
                                message.channel.send(generating)
                                .then( async msg => {

                                if(reaction.emoji.name === '1️⃣'){
                                    Fortnite.NewsBR("en")
                                    .then(async res => {

                                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                        const canvas = Canvas.createCanvas(1920, 1080);
                                        const ctx = canvas.getContext('2d');
                                        const PreGif = new Gif(1920,1080)

                                        const length = res.data.motds.length
                                        const layout = 1920 / length

                                        const applyText = (canvas, text) => {
                                            const ctx = canvas.getContext('2d');
                                            let fontSize = 60;
                                            do {
                                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                            } while (ctx.measureText(text).width > (layout - 100));
                                            return ctx.font;
                                        };

                                        for(let i = 0; i < length; i++){
                                            const photo = await Canvas.loadImage(res.data.motds[i].image)
                                            ctx.drawImage(photo,0,0,canvas.width,canvas.height)
                                            var x = 0;
                                            var text = 1
                                            for(let j = 0; j < length; j++){
                                                if(i === j){
                                                    const Used = await Canvas.loadImage('./assets/News/Used.png')
                                                    ctx.drawImage(Used,x,0,layout,100)
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                                    if(res.data.motds[j].tabTitle !== null){
                                                        ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                                                    }
                                                    x += layout
                                                    text += 2;
                                                }else{
                                                    const NotUsed = await Canvas.loadImage('./assets/News/NotUsed.png')
                                                    ctx.drawImage(NotUsed,x,0,layout,100)
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                                    if(res.data.motds[j].tabTitle !== null){
                                                        ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                                                    }
                                                    x += layout
                                                    text += 2;
                                                }
                                            }

                                            //lines
                                            const t = wrap(res.data.motds[i].body, {width: 50})
                                            const lines = (t.split(/\r\n|\r|\n/).length)

                                            var px
                                            var y
                                            var x
                                            if(lines > 4){
                                                px = 45
                                                y = lines * 28
                                                x = 910
                                            }else if(lines >= 2 && lines <= 4){
                                                px = 45
                                                y = lines * 22
                                                x = 910
                                            }else if (lines < 2){
                                                px = 60
                                                y = 0
                                                x = 900
                                            }

                                            const fog = await Canvas.loadImage('./assets/News/fog.png')
                                            ctx.drawImage(fog,0,0,1920,1080)

                                            //credit
                                            const credit = await Canvas.loadImage('./assets/Credits/FNBR.png')
                                            ctx.drawImage(credit,1550,950,370,125)

                                            //title
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='left';
                                            ctx.font = '100px Burbank Big Condensed'
                                            ctx.fillText(res.data.motds[i].title, 50, x - y)

                                            //body
                                            ctx.fillStyle = '#33edff';
                                            ctx.textAlign='left';
                                            ctx.font = `${px}px Burbank Big Condensed`
                                            ctx.fillText(t, 33, 970 - y)

                                            arrayBR[i] = canvas.toBuffer('image/jpeg')
                                        }
                                        if(arrayBR.length == 1){
                                            await PreGif.setImages(arrayBR[0])
                                        }
                                        if(arrayBR.length == 2){
                                            await PreGif.setImages(arrayBR[0],arrayBR[1])
                                        }
                                        if(arrayBR.length == 3){
                                            await PreGif.setImages(arrayBR[0],arrayBR[1],arrayBR[2])
                                        }
                                        if(arrayBR.length == 4){
                                            await PreGif.setImages(arrayBR[0],arrayBR[1],arrayBR[2],arrayBR[3])
                                        }
                                        if(arrayBR.length == 5){
                                            await PreGif.setImages(arrayBR[0],arrayBR[1],arrayBR[2],arrayBR[3],arrayBR[4])
                                        }
                                        
                                        PreGif.setDelay(3 * 1000)
                                        const gif = await PreGif.create()
                                        const att = new Discord.MessageAttachment(gif, 'file.gif')
                                        await message.channel.send(att)
                                        msg.delete()
                                    })
                                    msgReact.delete()
                                }
                                if(reaction.emoji.name === '2️⃣'){
                                    Fortnite.NewsSTW("en")
                                    .then(async res => {
                                        
                                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                        const canvas = Canvas.createCanvas(1920, 1080);
                                        const ctx = canvas.getContext('2d');
                                        const PreGif = new Gif(1920,1080)

                                        const length = res.data.messages.length
                                        const layout = 1920 / length

                                        const applyText = (canvas, text) => {
                                            const ctx = canvas.getContext('2d');
                                            let fontSize = 60;
                                            do {
                                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                            } while (ctx.measureText(text).width > (layout - 100));
                                            return ctx.font;
                                        };

                                        for(let i = 0; i < length; i++){
                                            const photo = await Canvas.loadImage(res.data.messages[i].image)
                                            ctx.drawImage(photo,0,0,canvas.width,canvas.height)
                                            var x = 0;
                                            var text = 1
                                            for(let j = 0; j < length; j++){
                                                if(i === j){
                                                    const Used = await Canvas.loadImage('./assets/News/Used.png')
                                                    ctx.drawImage(Used,x,0,layout,100)
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyText(canvas, res.data.messages[j].adspace);
                                                    ctx.fillText(res.data.messages[j].adspace, ((layout * text) / 2), 66)
                                                    x += layout
                                                    text += 2;
                                                }else{
                                                    const NotUsed = await Canvas.loadImage('./assets/News/NotUsed.png')
                                                    ctx.drawImage(NotUsed,x,0,layout,100)
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyText(canvas, res.data.messages[j].adspace);
                                                    ctx.fillText(res.data.messages[j].adspace, ((layout * text) / 2), 66)
                                                    x += layout
                                                    text += 2;
                                                }
                                            }
                                            //lines
                                            const t = wrap(res.data.messages[i].body, {width: 50})
                                            const lines = (t.split(/\r\n|\r|\n/).length)

                                            var px
                                            var y
                                            var x
                                            if(lines > 4){
                                                px = 45
                                                y = lines * 28
                                                x = 910
                                            }else if(lines >= 2 && lines <= 4){
                                                px = 45
                                                y = lines * 22
                                                x = 910
                                            }else if (lines < 2){
                                                px = 60
                                                y = 0
                                                x = 900
                                            }

                                            const fog = await Canvas.loadImage('./assets/News/fog.png')
                                            ctx.drawImage(fog,0,0,1920,1080)

                                            //credit
                                            const credit = await Canvas.loadImage('./assets/Credits/FNBR.png')
                                            ctx.drawImage(credit,1550,950,370,125)

                                            //title
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='left';
                                            ctx.font = '100px Burbank Big Condensed'
                                            ctx.fillText(res.data.messages[i].title, 50, x - y)

                                            //body
                                            ctx.fillStyle = '#33edff';
                                            ctx.textAlign='left';
                                            ctx.font = `${px}px Burbank Big Condensed`
                                            ctx.fillText(t, 33, 970 - y)

                                            arraySTW[i] = canvas.toBuffer('image/jpeg')
                                        }
                                        if(arraySTW.length == 1){
                                            await PreGif.setImages(arraySTW[0])
                                        }
                                        if(arraySTW.length == 2){
                                            await PreGif.setImages(arraySTW[0],arraySTW[1])
                                        }
                                        if(arraySTW.length == 3){
                                            await PreGif.setImages(arraySTW[0],arraySTW[1],arraySTW[2])
                                        }
                                        if(arraySTW.length == 4){
                                            await PreGif.setImages(arraySTW[0],arraySTW[1],arraySTW[2],arraySTW[3])
                                        }
                                        if(arraySTW.length == 5){
                                            await PreGif.setImages(arraySTW[0],arraySTW[1],arraySTW[2],arraySTW[3],arraySTW[4])
                                        }
                                        
                                        PreGif.setDelay(3 * 1000)
                                        const gif = await PreGif.create()
                                        const att = new Discord.MessageAttachment(gif, 'file.gif')
                                        await message.channel.send(att)
                                        msg.delete()
                                    })
                                    msgReact.delete()
                                }
                                if(reaction.emoji.name === '3️⃣'){
                                    Fortnite.NewsCreative("en")
                                    .then(async res => {
                                        

                                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                        const canvas = Canvas.createCanvas(1920, 1080);
                                        const ctx = canvas.getContext('2d');
                                        const PreGif = new Gif(1920,1080)

                                        const length = res.data.motds.length
                                        const layout = 1920 / length

                                        const applyText = (canvas, text) => {
                                            const ctx = canvas.getContext('2d');
                                            let fontSize = 60;
                                            do {
                                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                            } while (ctx.measureText(text).width > (layout - 100));
                                            return ctx.font;
                                        };

                                        for(let i = 0; i < length; i++){
                                            const photo = await Canvas.loadImage(res.data.motds[i].image)
                                            ctx.drawImage(photo,0,0,canvas.width,canvas.height)
                                            var x = 0;
                                            var text = 1
                                            for(let j = 0; j < length; j++){
                                                if(i === j){
                                                    const Used = await Canvas.loadImage('./assets/News/Used.png')
                                                    ctx.drawImage(Used,x,0,layout,100)
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                                    if(res.data.motds[j].tabTitle !== null){
                                                        ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                                                    }
                                                    x += layout
                                                    text += 2;
                                                }else{
                                                    const NotUsed = await Canvas.loadImage('./assets/News/NotUsed.png')
                                                    ctx.drawImage(NotUsed,x,0,layout,100)
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                                    if(res.data.motds[j].tabTitle !== null){
                                                        ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                                                    }
                                                    x += layout
                                                    text += 2;
                                                }
                                            }
                                            //lines
                                            const t = wrap(res.data.motds[i].body, {width: 50})
                                            const lines = (t.split(/\r\n|\r|\n/).length)

                                            var px
                                            var y
                                            var x
                                            if(lines > 4){
                                                px = 45
                                                y = lines * 28
                                                x = 910
                                            }else if(lines >= 2 && lines <= 4){
                                                px = 45
                                                y = lines * 22
                                                x = 910
                                            }else if (lines < 2){
                                                px = 60
                                                y = 0
                                                x = 900
                                            }

                                            const fog = await Canvas.loadImage('./assets/News/fog.png')
                                            ctx.drawImage(fog,0,0,1920,1080)

                                            //credit
                                            const credit = await Canvas.loadImage('./assets/Credits/FNBR.png')
                                            ctx.drawImage(credit,1550,950,370,125)

                                            //title
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='left';
                                            ctx.font = '100px Burbank Big Condensed'
                                            ctx.fillText(res.data.motds[i].title, 50, x - y)

                                            //body
                                            ctx.fillStyle = '#33edff';
                                            ctx.textAlign='left';
                                            ctx.font = `${px}px Burbank Big Condensed`
                                            ctx.fillText(t, 33, 970 - y)

                                            arrayCR[i] = canvas.toBuffer('image/jpeg')
                                        }
                                        if(arrayCR.length == 1){
                                            await PreGif.setImages(arrayCR[0])
                                        }
                                        if(arrayCR.length == 2){
                                            await PreGif.setImages(arrayCR[0],arrayCR[1])
                                        }
                                        if(arrayCR.length == 3){
                                            await PreGif.setImages(arrayCR[0],arrayCR[1],arrayCR[2])
                                        }
                                        if(arrayCR.length == 4){
                                            await PreGif.setImages(arrayCR[0],arrayCR[1],arrayCR[2],arrayCR[3])
                                        }
                                        if(arrayCR.length == 5){
                                            await PreGif.setImages(arrayCR[0],arrayCR[1],arrayCR[2],arrayCR[3],arrayCR[4])
                                        }
                                        
                                        PreGif.setDelay(3 * 1000)
                                        const gif = await PreGif.create()
                                        const att = new Discord.MessageAttachment(gif, 'file.gif')
                                        await message.channel.send(att)
                                        msg.delete()
                                    })
                                    msgReact.delete()
                                
                                }
                            })
                        })
                }
                if(lang === "ar"){
                    const mode = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle('اخطر الطور')
                    .addFields(
                        {name: 'Battle Royale', value: 'صوت رقم واحد للحصول على اخبار الباتل رويال'},
                        {name: 'STW', value: 'صوت رقم اثنان للحصول على اخبار انقاذ العالم'},
                        {name: 'Creative', value: 'صوت رقم ثلاثة للحصول على اخبار الكريتف'}
                    )
                    const msgReact = await message.channel.send(mode)
                    await msgReact.react('1️⃣')
                    await msgReact.react('2️⃣')
                    await msgReact.react('3️⃣')
                    const filter = (reaction, user) => {
                        return ['1️⃣', '2️⃣', '3️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };
                    msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                .then( async collected => {
                                    const reaction = collected.first();
    
                                    const generating = new Discord.MessageEmbed()
                                    generating.setColor('#BB00EE')
                                    const emoji = client.emojis.cache.get("805690920157970442")
                                    generating.setTitle(`جاري البحث عن اخبار ... ${emoji}`)
                                    message.channel.send(generating)
                                    .then( async msg => {
    
                                    if(reaction.emoji.name === '1️⃣'){
                                        Fortnite.NewsBR("ar")
                                        .then(async res => {
                                            
    
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
    
                                            const canvas = Canvas.createCanvas(1920, 1080);
                                            const ctx = canvas.getContext('2d');
                                            const PreGif = new Gif(1920,1080)
    
                                            const length = res.data.motds.length
                                            const layout = 1920 / length

                                            const applyText = (canvas, text) => {
                                                console.log("mesuraing", text)
                                                const ctx = canvas.getContext('2d');
                                                let fontSize = 60;
                                                do {
                                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                                } while (ctx.measureText(text).width > (layout - 100));
                                                return ctx.font;
                                            };
    
                                            for(let i = 0; i < length; i++){
                                                const photo = await Canvas.loadImage(res.data.motds[i].image)
                                                ctx.drawImage(photo,0,0,canvas.width,canvas.height)
                                                var x = 0;
                                                var text = 1
                                                
                                                        const Used = await Canvas.loadImage('./assets/News/Used.png')
                                                        ctx.drawImage(Used,x,0,layout,100)
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        if(res.data.motds[i].tabTitle !== null){
                                                            ctx.font = applyText(canvas, res.data.motds[i].tabTitle);
                                                            ctx.fillText(res.data.motds[i].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.font = applyText(canvas, res.data.motds[i].title);
                                                        ctx.fillText(res.data.motds[i].title, ((layout * text) / 2), 66)
                                                    }
                                                        x += layout
                                                        text += 2;
                                                    
                                                }
                                                //lines
                                                const t = wrap(res.data.motds[i].body, {width: 50})
                                                const lines = (t.split(/\r\n|\r|\n/).length)
    
                                                var px
                                                var y
                                                var x
                                                if(lines > 4){
                                                    px = 45
                                                    y = lines * 35
                                                    x = 890
                                                }else if(lines >= 2 && lines <= 4){
                                                    px = 45
                                                    y = lines * 28
                                                    x = 890
                                                }else if (lines < 2){
                                                    px = 60
                                                    y = 0
                                                    x = 885
                                                }

                                                const fog = await Canvas.loadImage('./assets/News/fog.png')
                                                ctx.drawImage(fog,0,0,1920,1080)
    
                                                //credit
                                                const credit = await Canvas.loadImage('./assets/Credits/FNBR.png')
                                                ctx.drawImage(credit,8,950,370,125)
    
                                                //title
                                                ctx.fillStyle = '#ffffff';
                                                ctx.textAlign='right';
                                                ctx.font = '100px Arabic'
                                                ctx.fillText(res.data.motds[i].title, 1870, x - y)
    
                                                //body
                                                ctx.fillStyle = '#33edff';
                                                ctx.textAlign='right';
                                                ctx.font = `${px}px Arabic`
                                                ctx.fillText(t, 1885, 970 - y)

                                                arrayBR[i] = canvas.toBuffer('image/jpeg')
                                            }
                                            if(arrayBR.length == 1){
                                                await PreGif.setImages(arrayBR[0])
                                            }
                                            if(arrayBR.length == 2){
                                                await PreGif.setImages(arrayBR[0],arrayBR[1])
                                            }
                                            if(arrayBR.length == 3){
                                                await PreGif.setImages(arrayBR[0],arrayBR[1],arrayBR[2])
                                            }
                                            if(arrayBR.length == 4){
                                                await PreGif.setImages(arrayBR[0],arrayBR[1],arrayBR[2],arrayBR[3])
                                            }
                                            if(arrayBR.length == 5){
                                                await PreGif.setImages(arrayBR[0],arrayBR[1],arrayBR[2],arrayBR[3],arrayBR[4])
                                            }
                                            
                                            PreGif.setDelay(3 * 1000)
                                            const gif = await PreGif.create()
                                            const att = new Discord.MessageAttachment(gif, 'file.gif')
                                            await message.channel.send(att)
                                            msg.delete()
                                        })
                                        msgReact.delete()
                                    }
                                    if(reaction.emoji.name === '2️⃣'){
                                        Fortnite.NewsSTW("ar")
                                        .then(async res => {
                                            
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
    
                                            const canvas = Canvas.createCanvas(1920, 1080);
                                            const ctx = canvas.getContext('2d');
                                            const PreGif = new Gif(1920,1080)
    
                                            const length = res.data.messages.length
                                            const layout = 1920 / length

                                            const applyText = (canvas, text) => {
                                                const ctx = canvas.getContext('2d');
                                                let fontSize = 60;
                                                do {
                                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                                } while (ctx.measureText(text).width > (layout - 100));
                                                return ctx.font;
                                            };
    
                                            for(let i = 0; i < length; i++){
                                                const photo = await Canvas.loadImage(res.data.messages[i].image)
                                                ctx.drawImage(photo,0,0,canvas.width,canvas.height)
                                                var x = 0;
                                                var text = 1
                                                for(let j = 0; j < length; j++){
                                                    if(i === j){
                                                        const Used = await Canvas.loadImage('./assets/News/Used.png')
                                                        ctx.drawImage(Used,x,0,layout,100)
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = applyText(canvas, res.data.messages[j].adspace);
                                                        ctx.fillText(res.data.messages[j].adspace, ((layout * text) / 2), 66)
                                                        x += layout
                                                        text += 2;
                                                    }else{
                                                        const NotUsed = await Canvas.loadImage('./assets/News/NotUsed.png')
                                                        ctx.drawImage(NotUsed,x,0,layout,100)
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = applyText(canvas, res.data.messages[j].adspace);
                                                        ctx.fillText(res.data.messages[j].adspace, ((layout * text) / 2), 66)
                                                        x += layout
                                                        text += 2;
                                                    }
                                                }
                                                //lines
                                                const t = wrap(res.data.messages[i].body, {width: 50})
                                                const lines = (t.split(/\r\n|\r|\n/).length)
    
                                                var px
                                                var y
                                                var x
                                                if(lines > 4){
                                                    px = 45
                                                    y = lines * 35
                                                    x = 890
                                                }else if(lines >= 2 && lines <= 4){
                                                    px = 45
                                                    y = lines * 28
                                                    x = 890
                                                }else if (lines < 2){
                                                    px = 60
                                                    y = 0
                                                    x = 885
                                                }

                                                const fog = await Canvas.loadImage('./assets/News/fog.png')
                                                ctx.drawImage(fog,0,0,1920,1080)
    
                                                //credit
                                                const credit = await Canvas.loadImage('./assets/Credits/FNBR.png')
                                                ctx.drawImage(credit,8,950,370,125)
    
                                                //title
                                                ctx.fillStyle = '#ffffff';
                                                ctx.textAlign='right';
                                                ctx.font = '100px Arabic'
                                                ctx.fillText(res.data.messages[i].title, 1870, x - y)
    
                                                //body
                                                ctx.fillStyle = '#33edff';
                                                ctx.textAlign='right';
                                                ctx.font = `${px}px Arabic`
                                                ctx.fillText(t, 1885, 970 - y)
    
                                                arraySTW[i] = canvas.toBuffer('image/jpeg')
                                            }
                                            if(arraySTW.length == 1){
                                                await PreGif.setImages(arraySTW[0])
                                            }
                                            if(arraySTW.length == 2){
                                                await PreGif.setImages(arraySTW[0],arraySTW[1])
                                            }
                                            if(arraySTW.length == 3){
                                                await PreGif.setImages(arraySTW[0],arraySTW[1],arraySTW[2])
                                            }
                                            if(arraySTW.length == 4){
                                                await PreGif.setImages(arraySTW[0],arraySTW[1],arraySTW[2],arraySTW[3])
                                            }
                                            if(arraySTW.length == 5){
                                                await PreGif.setImages(arraySTW[0],arraySTW[1],arraySTW[2],arraySTW[3],arraySTW[4])
                                            }
                                            
                                            PreGif.setDelay(3 * 1000)
                                            const gif = await PreGif.create()
                                            const att = new Discord.MessageAttachment(gif, 'file.gif')
                                            await message.channel.send(att)
                                            msg.delete()
                                        })
                                        msgReact.delete()
                                    }
                                    if(reaction.emoji.name === '3️⃣'){
                                        Fortnite.NewsCreative("ar")
                                        .then(async res => {
                                            
    
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
    
                                            const canvas = Canvas.createCanvas(1920, 1080);
                                            const ctx = canvas.getContext('2d');
                                            const PreGif = new Gif(1920,1080)
    
                                            const length = res.data.motds.length
                                            const layout = 1920 / length

                                            const applyText = (canvas, text) => {
                                                const ctx = canvas.getContext('2d');
                                                let fontSize = 60;
                                                do {
                                                    ctx.font = `${fontSize -= 1}px Arabic`;
                                                } while (ctx.measureText(text).width > (layout - 100));
                                                return ctx.font;
                                            };
    
                                            for(let i = 0; i < length; i++){
                                                const photo = await Canvas.loadImage(res.data.motds[i].image)
                                                ctx.drawImage(photo,0,0,canvas.width,canvas.height)
                                                var x = 0;
                                                var text = 1
                                                for(let j = 0; j < length; j++){
                                                    if(i === j){
                                                        const Used = await Canvas.loadImage('./assets/News/Used.png')
                                                        ctx.drawImage(Used,x,0,layout,100)
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                                        if(res.data.motds[j].tabTitle !== null){
                                                        ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                                                    }
                                                        x += layout
                                                        text += 2;
                                                    }else{
                                                        const NotUsed = await Canvas.loadImage('./assets/News/NotUsed.png')
                                                        ctx.drawImage(NotUsed,x,0,layout,100)
                                                        ctx.fillStyle = '#ffffff';
                                                        ctx.textAlign='center';
                                                        ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                                        if(res.data.motds[j].tabTitle !== null){
                                                        ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                                                    }else{
                                                        ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                                                    }
                                                        x += layout
                                                        text += 2;
                                                    }
                                                }
                                                //lines
                                                const t = wrap(res.data.motds[i].body, {width: 50})
                                                const lines = (t.split(/\r\n|\r|\n/).length)
    
                                                var px
                                                var y
                                                var x
                                                if(lines > 4){
                                                    px = 45
                                                    y = lines * 35
                                                    x = 890
                                                }else if(lines >= 2 && lines <= 4){
                                                    px = 45
                                                    y = lines * 28
                                                    x = 890
                                                }else if (lines < 2){
                                                    px = 60
                                                    y = 0
                                                    x = 885
                                                }

                                                const fog = await Canvas.loadImage('./assets/News/fog.png')
                                                ctx.drawImage(fog,0,0,1920,1080)
    
                                                //credit
                                                const credit = await Canvas.loadImage('./assets/Credits/FNBR.png')
                                                ctx.drawImage(credit,8,950,370,125)
    
                                                //title
                                                ctx.fillStyle = '#ffffff';
                                                ctx.textAlign='right';
                                                ctx.font = '100px Arabic'
                                                ctx.fillText(res.data.motds[i].title, 1870, x - y)
    
                                                //body
                                                ctx.fillStyle = '#33edff';
                                                ctx.textAlign='right';
                                                ctx.font = `${px}px Arabic`
                                                ctx.fillText(t, 1885, 970 - y)
    
                                                arrayCR[i] = canvas.toBuffer('image/jpeg')
                                            }
                                            if(arrayCR.length == 1){
                                                await PreGif.setImages(arrayCR[0])
                                            }
                                            if(arrayCR.length == 2){
                                                await PreGif.setImages(arrayCR[0],arrayCR[1])
                                            }
                                            if(arrayCR.length == 3){
                                                await PreGif.setImages(arrayCR[0],arrayCR[1],arrayCR[2])
                                            }
                                            if(arrayCR.length == 4){
                                                await PreGif.setImages(arrayCR[0],arrayCR[1],arrayCR[2],arrayCR[3])
                                            }
                                            if(arrayCR.length == 5){
                                                await PreGif.setImages(arrayCR[0],arrayCR[1],arrayCR[2],arrayCR[3],arrayCR[4])
                                            }
                                            
                                            PreGif.setDelay(3 * 1000)
                                            const gif = await PreGif.create()
                                            const att = new Discord.MessageAttachment(gif, 'file.gif')
                                            await message.channel.send(att)
                                            msg.delete()
                                        })
                                        msgReact.delete()
                                    
                                    }
                                })
                            })
                    }

        })
    },
    
    requiredRoles: []
}
