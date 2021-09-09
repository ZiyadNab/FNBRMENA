const Canvas = require('canvas');

module.exports = {
    commands: 'poi',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data
        FNBRMENA.listCurrentPOI(options = {lang: lang})
        .then(async res => {

            //creating embed
            const place = new Discord.MessageEmbed()

            //set the embed color
            place.setColor(FNBRMENA.Colors("embed"))

            //set the title
            if(lang === "en") place.setTitle("Please Choose a POI from the list")
            else if(lang === "ar") place.setTitle("الرجاء الاختيار من القائمة بالاسفل")

            //get every poi name and its data to list
            var str = ""
            for(let i = 0; i < res.data.list.length; i++){
                str += "• " + i + " " + res.data.list[i].name +"\n"
            }

            place.setDescription(str)

            //send the message
            await message.channel.send(place)
            .then( async msg => {

                //filtering
                const filter = m => m.author.id === message.author.id
                if(lang === "en") var reply = "please choose from above list the command will stop listen in 20 sec"
                else if(lang === "ar") var reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                //send the list of poi message
                message.reply(reply)

                //listening for input
                .then( async notify => {

                    //collect messages
                    await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                    .then( async collected => {

                        //delete messages
                        msg.delete()
                        notify.delete()

                        //listen for user input
                        if(collected.first().content >= 0 && collected.first().content < res.data.list.length){

                            //generating animation
                            const generating = new Discord.MessageEmbed()
                            generating.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") generating.setTitle(`Getting the image for ${res.data.list[collected.first().content].name} ${loadingEmoji}`)
                            else if(lang === "ar") generating.setTitle(`جاري البحث عن صور ${res.data.list[collected.first().content].name} ${loadingEmoji}`)
                            message.channel.send(generating)
                            .then( async msg => {

                                //Registering fonts
                                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                                //canvas
                                const canvas = Canvas.createCanvas(1920, 1080);
                                const ctx = canvas.getContext('2d');

                                //creating image edit message
                                const creating = new Discord.MessageEmbed()
                                creating.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") creating.setTitle(`Creating image ${loadingEmoji}`)
                                else if(lang === "ar") creating.setTitle(`جاري انشاء الصوره ${loadingEmoji}`)
                                msg.edit(creating)

                                //background
                                const background = await Canvas.loadImage(res.data.list[collected.first().content].images[0].url)
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
                                const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.list[collected.first().content].name+'.png')
                                await message.channel.send(att)
                                msg.delete()
                            })

                        }else{

                            ///if user typed a number out of range
                            const error = new Discord.MessageEmbed()
                            error.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                            else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                            message.reply(error)

                        }
                    }).catch(err => {

                        //delete messages
                        msg.delete()
                        notify.delete()

                        const error = new Discord.MessageEmbed()
                        error.setColor(FNBRMENA.Colors("embed"))
                        error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                        message.reply(error)
                    })
                })
            })
        })
    }
}    