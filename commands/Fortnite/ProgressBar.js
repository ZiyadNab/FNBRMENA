const axios = require('axios');
const moment = require('moment')
const Canvas = require('canvas')

module.exports = {
    commands: 'progress',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        axios.get('https://thomaskeig.co/api/progress/fortnite.json')
        .then(async (res) => {
            admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
                var lang = data.val().lang;

                //var
                var gonee;
                var lefttt;
                var Slength;
                var days;
                var gen;

                if(lang === "en"){
                    gen = "Generating Season Info"
                    gonee = " Days Gone"
                    lefttt = " Days Left"
                    Slength = "Season Length "
                    days = " Days"
                }
                if(lang === "ar"){
                    gen = "جاري تحميل معلومات السيزون"
                    gonee = " يوم مضى"
                    lefttt = " يوم متبقي"
                    Slength = "طول السيزون "
                    days = " يوم"
                }

                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${gen} ... ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    //variables
                    var starts = `${res.data.start_year}-0${res.data.start_month}-${res.data.start_day}`
                    var ends = moment(`${res.data.end_year}-0${res.data.end_month}-${res.data.end_day}`)

                    //dates
                    var now = moment()
                    var gone = now.diff(starts, 'days') 
                    var left = ends.diff(now, 'days') 
                    var length = gone + left

                    var percent = (gone / length);
                    var percentage = 817 * percent

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
                    ctx.fillText(Slength + length + days, (1100 / 2), 288)

                    //bar
                    const bar = await Canvas.loadImage('./assets/Bar/Bar.png')
                    ctx.drawImage(bar, 165, 144, percentage, 33)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '30px Burbank Big Condensed'
                    if(percentage > (817 / 2)){
                        ctx.fillStyle = '#ffffff';
                        ctx.fillText(((percent * 100) | 0) + "%", (percentage + 125), 170)
                    }else {
                        ctx.fillStyle = '#000000';
                        ctx.fillText(((percent * 100) | 0) + "%", (percentage + 195), 170)
                    }

                    //gone
                    const gonePIC = await Canvas.loadImage('./assets/Bar/green.png')
                    ctx.drawImage(gonePIC, 165, 183, percentage,8)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    if(lang === "en"){
                        ctx.font = '30px Burbank Big Condensed'
                    }else if(lang === "ar"){
                        ctx.font = '30px Arabic'
                    }
                    ctx.fillText(gone+gonee, (percentage / 2) + 165, 220)

                    //left
                    var leftlength = (left / length)
                    leftLength = 817 * leftlength
                    const leftPIC = await Canvas.loadImage('./assets/Bar/BarWhite.png')
                    ctx.drawImage(leftPIC, (percentage + 165), 130, leftLength, 8)
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    if(lang === "en"){
                        ctx.font = '30px Burbank Big Condensed'
                        ctx.fillText(left+lefttt, (percentage + (leftLength / 2) + 165), 118)
                    }else if(lang === "ar"){
                        ctx.font = '30px Arabic'
                        ctx.fillText(left+lefttt, (percentage + (leftLength / 2) + 165), 109)
                    }
                    

                    const att = new Discord.MessageAttachment(canvas.toBuffer(), "season6.png")
                    await message.channel.send(att)

                    const progress = new Discord.MessageEmbed()
                    progress.setColor('#BB00EE')
                    if(lang === "en"){
                        progress.setTitle('Progress Bar')
                        progress.setDescription('Info about this season')
                    }else if(lang === "ar"){
                        progress.setTitle('Progress Bar')
                        progress.setDescription('معلومات عن السيزون')
                    }
                    progress.addFields(
                        {name: lefttt, value: left, inline: true},
                        {name: gonee, value: gone, inline: true},
                        {name: Slength, value: length, inline: true}
                    )
                        progress.setFooter('Generated By FNBRMENA Bot')
                        progress.setAuthor('FNBRMENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBRMENA')
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
        }).catch(err => {

        })
    },
}