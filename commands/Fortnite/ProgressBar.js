const axios = require('axios');
const Canvas = require('canvas')
var gonee;
var lefttt;
var Slength;
var days;

module.exports = {
    commands: 'progress',
    expectedArgs: '<Progress>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, arguments, text, Discord, client, admin) => {
        axios.get('https://api.peely.de/v1/br/progress/data')
        .then(async (res) => {
            admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
                var lang = data.val().lang;

                if(lang === "en"){
                    gonee = " Days Gone"
                    lefttt = " Days Left"
                    Slength = "Season Length "
                    days = " Days"
                }
                if(lang === "ar"){
                    gonee = " يوم مضى"
                    lefttt = " يوم متبقي"
                    Slength = "طول السيزون "
                    days = " يوم"
                }

                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`Generating Season Info ... ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {

                var percentage = (res.data.data.DaysGone / res.data.data.SeasonLength);
                var length = 817 * percentage

                //font
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                
                //canvas
                const canvas = Canvas.createCanvas(1100, 300);
                const ctx = canvas.getContext('2d'); 

                //background
                const background = await Canvas.loadImage('./assets/Bar/card.png')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en"){
                    ctx.font = '25px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '25px Arabic'
                }
                ctx.fillText(Slength+ res.data.data.SeasonLength +days, (1100 / 2), 290)

                //bar
                const bar = await Canvas.loadImage('./assets/Bar/Bar.png')
                ctx.drawImage(bar, 165, 144, length, 33)
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en"){
                    ctx.font = '30px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '30px Arabic'
                }
                ctx.fillText(((percentage * 100) | 0) + "%", (length + 142), 170)

                //gone
                const gone = await Canvas.loadImage('./assets/Bar/green.png')
                ctx.drawImage(gone, 165, 183, length, 8)
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en"){
                    ctx.font = '30px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '30px Arabic'
                }
                ctx.fillText(res.data.data.DaysGone+gonee, (length / 2) + 165, 220)

                //left
                var leftlength = ((res.data.data.DaysLeft + 1) / res.data.data.SeasonLength)
                var leftt = 817 * leftlength
                const left = await Canvas.loadImage('./assets/Bar/BarWhite.png')
                ctx.drawImage(left, (length + 165), 130, leftt, 8)
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en"){
                    ctx.font = '30px Burbank Big Condensed'
                    ctx.fillText(res.data.data.DaysLeft+lefttt, (length + (leftt / 2) + 165), 118)
                }else if(lang === "ar"){
                    ctx.font = '30px Arabic'
                    ctx.fillText(res.data.data.DaysLeft+lefttt, (length + (leftt / 2) + 165), 109)
                }
                

                const att = new Discord.MessageAttachment(canvas.toBuffer(), "season5.png")
                await message.channel.send(att)

                const progress = new Discord.MessageEmbed()
                progress.setColor('#BB00EE')
                progress.setTitle('Progress Bar')
                progress.setDescription('FNBR_MENA Bot has generated a season progress for you')
                progress.addFields(
                        {name: 'Days Left', value: res.data.data.DaysLeft, inline: true},
                        {name: 'Days Gone', value: res.data.data.DaysGone, inline: true},
                        {name: 'Season Length', value: res.data.data.SeasonLength, inline: true}
                    )
                    progress.setFooter('Generated By FNBR_MENA Bot')
                    progress.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                    message.reply(progress);
                    msg.delete()
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err)
            })
        })
    },
    
    requiredRoles: []
}