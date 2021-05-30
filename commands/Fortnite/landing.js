const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');
const { MessageButton } = require('discord-buttons');

module.exports = {
    commands: 'land',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            fortniteAPI.listCurrentPOI(options = {lang: lang})
            .then(async res => {

                //variables
                var loading = ""
                var loop = 1

                //inisilizing loading
                if(lang === "en"){
                    loading = "Getting a list of poi's"
                }else if(lang === "ar"){
                    loading = "جاري تحميل جميع المناطق"
                }

                //generating animation
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${loading} ${res.list.length} ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    //get a random number
                    var randomImage = Math.floor(Math.random() * res.list.length)
                    
                    //creating embed
                    const picked = new Discord.MessageEmbed()
                    
                    //create the color
                    picked.setColor('#BB00EE')

                    //set title
                    if(lang === "en"){
                        picked.setTitle("Landing Picker")
                    }else if(lang === "ar"){
                        picked.setTitle("النزول العشوائي")
                    }

                    //set description
                    if(lang === "en"){
                        picked.setDescription("you are gonna land at **" + res.list[randomImage].name + "**")
                    }else if(lang === "ar"){
                        picked.setDescription("راح تنزل في منطقة **" + res.list[randomImage].name + "**")
                    }

                    //Registering fonts
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                    //canvas
                    const canvas = Canvas.createCanvas(1920, 1080);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage(res.list[randomImage].images[0].url)
                    ctx.drawImage(background, 0, 0, 1920, 1080)

                    //add blue fog
                    const fog = await Canvas.loadImage('./assets/News/fog.png')
                    ctx.drawImage(fog,0,0,1920,1080)

                    //credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '60px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 15, 55)

                    //encoding...
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), res.list[randomImage].name + '.png')

                    //set the image
                    picked.attachFiles([att])
                    picked.setImage('attachment://' + att);

                    loop = 0
                    message.channel.send(picked)
                })
            })
        })
    }
}    