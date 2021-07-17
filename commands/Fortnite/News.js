const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas')
var wrap = require('word-wrap')
const Gif = require('gif-encoder-2')

module.exports = {
    commands: 'news',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 20,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //index
        let data = []

        //handle errors
        var errorHandleing = 0

        //news types
        const NewsTypes = [
            "BR",
            "STW",
            "Creative"
        ]

        //inilizing x, y
        var x = 50
        var y = 970
        
        //request data
        await FNBRMENA.News(lang)
        .then(async res => {

            //ask the user what type of news he needs
            const list = new Discord.MessageEmbed()

            //set the color
            list.setColor(FNBRMENA.Colors("embed"))

            //set title
            if(lang === "en") list.setTitle(`Please choose your item from the list below`)
            else if(lang === "ar") list.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

            //how many items where matchinh the user input?
            if(lang === "en") var string = `• 0: Battle Royale\n• 1: STW\n• 2: Creative`
            else if(lang === "ar") var string = `• 0: باتل رويال\n• 1: طور إنقاذ العالم\n• 2: طور الإبداعي`

            //set Description
            list.setDescription(string)

            //send the message and wait for answer
            await message.channel.send(list)
            .then(async list => {

                //filtering outfits
                const filter = async m => await m.author.id === message.author.id

                //add the reply
                if(lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                else if(lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                
                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                    .then( async collected => {

                        //delete messages
                        await notify.delete()
                        await list.delete()

                        //if the user chosen inside range
                        if(collected.first().content >= 0 && collected.first().content < NewsTypes.length){

                            //store the news data to the data variable
                            if(NewsTypes[collected.first().content] === NewsTypes[0])
                            data = await res.data.data.br
                            if(NewsTypes[collected.first().content] === NewsTypes[1])
                            data = await res.data.data.stw
                            if(NewsTypes[collected.first().content] === NewsTypes[2])
                            data = await res.data.data.creative
                             
                        }else{

                            //add an error
                            errorHandleing++

                            //if user typed a number out of range
                            const error = new Discord.MessageEmbed()
                            error.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                            else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                            message.reply(error)
                            
                        }
                    }).catch(err => {

                        //add an error
                        errorHandleing++

                        const error = new Discord.MessageEmbed()
                        error.setColor(FNBRMENA.Colors("embed"))
                        error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                        message.reply(error)
                    })
                })
            }).catch(err => {

                //add an error
                errorHandleing++

                //if user typed a number out of range
                const errorRequest = new Discord.MessageEmbed()
                errorRequest.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") errorRequest.setTitle(`Request entry too large ${errorEmoji}`)
                else if(lang === "ar") errorRequest.setTitle(`تم تخطي الكمية المحدودة من عدد العناصر ${errorEmoji}`)
                message.reply(errorRequest)

            })
        })

        //create the news gif based on user choice
        if(errorHandleing === 0){

            //aplyText
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d')
                let fontSize = 36
                do {
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`
                    }
                } while (ctx.measureText(text).width > 420)
                return ctx.font;
            }

            //registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

            //create canvas
            const canvas = Canvas.createCanvas(1920, 1080);
            const ctx = canvas.getContext('2d');

            //create the gif layout
            const encoder = new Gif(canvas.width, canvas.height)

            //start encoding
            encoder.start()

            //add gif delay between image and image
            encoder.setDelay(3 * 1000)

            //loop throw every 
            for(let i = 0; i < data.motds.length; i++){

                //inislizing variables
                var title = data.motds[i].title
                var tabTitle = data.motds[i].tabTitle
                var body = data.motds[i].body
                var image = data.motds[i].image

                //add the news image at index i
                const newsImage = await Canvas.loadImage(image)
                ctx.drawImage(newsImage, 0, 0, canvas.width, canvas.height)

                //add the news image at index i
                const newsImage = await Canvas.loadImage('./assets/News/fog.png')
                ctx.drawImage(newsImage, 0, 0, canvas.width, canvas.height)

                //body
                ctx.fillStyle = '#33edff';
                if(lang === "en"){
                    ctx.textAlign = 'left';
                    ctx.font = `60px Burbank Big Condensed`;
                    ctx.fillText(body, x, y)
                }else if(lang === "ar"){
                    ctx.textAlign = 'right';
                    ctx.font = `60px Arabic`;
                    ctx.fillText(body, canvas.width - x, y)
                }

                //add frame
                encoder.addFrame(ctx)
            }

            //stop endcoding
            encoder.finish()

            //send the message
            const att = new Discord.MessageAttachment(encoder.out.getData(),  `${data.hash}.gif`)
            await message.channel.send(att)
        }
    }
}