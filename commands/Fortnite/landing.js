const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
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

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

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

                //generating animation
                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                generating.setTitle(`${loading} ${res.list.length} ${emoji}`)
                message.channel.send(generating)
                .then( async msg => {
                    //creating embed
                    const picked = new Discord.MessageEmbed()

                    //get a random number
                    var randomImage = Math.floor(Math.random() * res.list.length)
                    
                    //create the color
                    await picked.setColor('#BB00EE')

                    //set title
                    if(lang === "en"){
                        await picked.setTitle("Landing Picker")
                    }else if(lang === "ar"){
                        await picked.setTitle("النزول العشوائي")
                    }

                    //set description
                    if(lang === "en"){
                        await picked.setDescription("you are gonna land at **" + res.list[randomImage].name + "**")
                    }else if(lang === "ar"){
                        await picked.setDescription("راح تنزل في منطقة **" + res.list[randomImage].name + "**")
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
                    await picked.attachFiles([att])
                    await picked.setImage('attachment://' + att);

                    //send the data
                    const pickedAgain = await message.channel.send("", {buttons: [again, stop], embed: picked})

                    //delete generating msg
                    msg.delete()

                    //filtering
                    const filter = (button) => button.clicker.user.id === message.author.id;

                    //await click
                    await pickedAgain.awaitButtons(filter, { max: 1, time: 30000, errors: ['time'] })
                    .then(async collected => {

                        if(collected.first().id === "again"){
                            //call the picker function
                            await picker()

                            //delete the start message
                            pickedAgain.delete()
                        }

                        if(collected.first().id === "stop"){
                            //delete the start message
                            pickedAgain.delete()
                            return
                        }

                    }).catch(err => {

                        //if user took 1 minutes without pressing start
                        pickedAgain.delete()
                        return
                    })
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
            const clicked = await message.channel.send(reply, start)

            //filtering
            const filter = (button) => button.clicker.user.id === message.author.id;

            //await click
            await clicked.awaitButtons(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(async collected => {

                //call the picker function
                await picker()

                //delete the start message
                clicked.delete()

            }).catch(err => {

                //if user took 1 minutes without pressing start
                clicked.delete()
                if(lang === "en"){
                    const error = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`ْUntil when ill wait for u to start ? BTW i canceled your prosses if you are ready just type it again ${errorEmoji}`)
                    message.reply(error)
                }else if(lang === "ar"){
                    const error = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`الى متى انتظرك تبدا ؟ الزبده طفيت الامر اذا كنت جاهز اكتبه ثانية ${errorEmoji}`)
                    message.reply(error)
                }
            })
        })
    }
}    