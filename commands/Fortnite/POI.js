const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const Canvas = require('canvas');

module.exports = {
    commands: 'poi',
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

            //creating variables
            var str = ""
            var reply = ""
            var loading = ""

            if(lang === "en"){
                loading = "Getting the image for "
            }else if(lang === "ar"){
                loading = "جاري البحث عن صور"
            }

            //creating embed
            const place = new Discord.MessageEmbed()

            //set the embed color
            place.setColor('#BB00EE')

            //set the title
            if(lang === "en"){
                place.setTitle("Please Choose a POI from the list")
            }else if(lang === "ar"){
                place.setTitle("الرجاء الاختيار من القائمة بالاسفل")
            }

            //get every poi name and its data to list
            for(let i = 0; i < res.list.length; i++){
                str += "• " + i + " " + res.list[i].name +"\n"
            }

            place.setDescription(str)

            //send the message
            await message.channel.send(place)
            .then( async msg => {

                //filtering
                const filter = m => m.author.id === message.author.id
                if(lang === "en"){
                    reply = "please choose from above list the command will stop listen in 20 sec"
                }else if(lang === "ar"){
                    reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                }
                message.reply(reply)
                .then( async notify => {
                    notify.delete({timeout: 20000})
                    await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                    .then( async collected => {

                        console.log(collected.first().content)

                        //listen for user input
                        if(collected.first().content >= 0 && collected.first().content < res.list.length){

                            //delete messages
                            msg.delete()
                            notify.delete()

                            //generating animation
                            const generating = new Discord.MessageEmbed()
                            generating.setColor('#BB00EE')
                            const emoji = client.emojis.cache.get("805690920157970442")
                            generating.setTitle(`${loading} ${res.list[collected.first().content].name} ${emoji}`)
                            message.channel.send(generating)
                            .then( async msg => {

                            //Registering fonts
                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                            //canvas
                            const canvas = Canvas.createCanvas(1920, 1080);
                            const ctx = canvas.getContext('2d');

                            const creating = new Discord.MessageEmbed()
                            creating.setColor('#BB00EE')
                            if(lang === "en"){
                                creating.setTitle(`Creating image ${emoji}`)
                            }else if(lang === "ar"){
                                creating.setTitle(`جاري انشاء الصوره ${emoji}`)
                            }
                            msg.edit(creating)

                            //background
                            const background = await Canvas.loadImage(res.list[collected.first().content].images[0].url)
                            ctx.drawImage(background, 0, 0, 1920, 1080)

                            //add blue fog
                            const fog = await Canvas.loadImage('./assets/News/fog.png')
                            ctx.drawImage(fog,0,0,1920,1080)

                            //credits
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '60px Burbank Big Condensed'
                            ctx.fillText("FNBRMENA", 15, 55)

                            //send the picture
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), res.list[collected.first().content].name+'.png')
                            await message.channel.send(att)
                            msg.delete()
                            })

                        }else{

                            //if user typed a number out of range
                            if(lang === "en"){
                                msg.delete()
                                notify.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                message.reply(error)
                            }else if(lang === "ar"){
                                msg.delete()
                                notify.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                            }
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
}    