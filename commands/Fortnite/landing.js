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
                var reply = ""

                //inisilizing loading and reply
                if(lang === "en"){
                    loading = "Getting a list of poi's"
                    reply = "The command randomly pick a POI if u don't know where to drop!"
                }else if(lang === "ar"){
                    loading = "جاري تحميل جميع المناطق"
                    reply = "اذا كنت ما تعرف وين تنزل اكتب الامر خلي البوت بعلمك ممكن تفوز ما تدري"
                }

                const picker = async () => {
                    //generating animation
                    const generating = new Discord.MessageEmbed()
                    generating.setColor('#BB00EE')
                    const emoji = client.emojis.cache.get("805690920157970442")
                    generating.setTitle(`${loading} ${res.list.length} ${emoji}`)
                    message.channel.send(generating)
                    .then( async msg => {
                        //creating embed
                        const pickedAgain = new Discord.MessageEmbed()

                        //get a random number
                        var randomImage = Math.floor(Math.random() * res.list.length)
                        
                        //create the color
                        await pickedAgain.setColor('#BB00EE')

                        //set title
                        if(lang === "en"){
                            await pickedAgain.setTitle("Landing Picker")
                        }else if(lang === "ar"){
                            await pickedAgain.setTitle("النزول العشوائي")
                        }

                        //set description
                        if(lang === "en"){
                            await pickedAgain.setDescription("you are gonna land at **" + res.list[randomImage].name + "**")
                        }else if(lang === "ar"){
                            await pickedAgain.setDescription("راح تنزل في منطقة **" + res.list[randomImage].name + "**")
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
                        await pickedAgain.attachFiles([att])
                        await pickedAgain.setImage('attachment://' + att);

                        //creating button
                        let again = new MessageButton()

                        //button style
                        again.setStyle('blurple')

                        //button label
                        if(lang === "en"){
                            again.setLabel('Try Again!')
                        }else if(lang === "ar"){
                            again.setLabel('محاولة اخرى!')
                        }

                        //button id
                        again.setID('again');

                        //creating button
                        let stop = new MessageButton()

                        //button style
                        stop.setStyle('red')

                        //button label
                        if(lang === "en"){
                            stop.setLabel('Stop!')
                        }else if(lang === "ar"){
                            stop.setLabel('ايقاف!')
                        }

                        //button id
                        stop.setID('stop');

                        await message.channel.send("", {buttons: [again, stop], embed: pickedAgain})
                        .then(b => {
                            client.on('clickButton', async (button) => {
                                //... my code

                                if(button.message.id === b.id){
                                    if(button.clicker.user.id === message.author.id){
                                        if(button.id === "again"){
                                            picker()
                                            b.delete()
                                        }
                                        if(button.id === "stop"){
                                            b.delete()
                                        }
                                    }
                                }
                            })
                        })
                        msg.delete()
                    })
                }

                //creating button
                let start = new MessageButton()

                //button style
                start.setStyle('blurple')

                //button label
                if(lang === "en"){
                    start.setLabel('Start!')
                }else if(lang === "ar"){
                    start.setLabel('ابدا!')
                }

                //button id
                start.setID('start');

                //send the button
                await message.channel.send(reply, start)
                .then(async clicked => {
                    client.on('clickButton', async (button) => {
                        //... my code

                        if(button.message.id === clicked.id){
                            if(button.clicker.user.id === message.author.id){
                                if(button.id === "start"){
                                    await picker()
                                    clicked.delete()
                                }
                            }
                        }
                    })
                })
            })
        })
    }
}    