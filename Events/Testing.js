const config = require('../../Coinfigs/config.json')
const Canvas = require('canvas')
var wrap = require('word-wrap');
const Gif = require('make-a-gif')
const FortniteAPI = require("fortnite-api-com");
const config = {
  apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
  language: "en",
  debug: true
};

var Fortnite = new FortniteAPI(config);

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.channels.rules)

    var data = []
    const News = async () => {
        Fortnite.NewsBR("en")
        .then(async res => {
            console.log(res, data)
            if(JSON.stringify(res) !== JSON.stringify(data)){
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
                            if(res.data.motds[j].tabTitle !== null){
                                ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                        }else{
                            ctx.font = applyText(canvas, res.data.motds[j].title);
                            ctx.fillText(res.data.motds[j].title, ((layout * text) / 2), 66)
                        }
                            x += layout
                            text += 2;
                        }else{
                            const NotUsed = await Canvas.loadImage('./assets/News/NotUsed.png')
                            ctx.drawImage(NotUsed,x,0,layout,100)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            if(res.data.motds[j].tabTitle !== null){
                                ctx.font = applyText(canvas, res.data.motds[j].tabTitle);
                                ctx.fillText(res.data.motds[j].tabTitle, ((layout * text) / 2), 66)
                        }else{
                            ctx.font = applyText(canvas, res.data.motds[j].title);
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
                                    
                data = res
            }
        })
    }
    setInterval(News, 60 * 1000)
}