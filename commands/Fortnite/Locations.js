const Canvas = require('canvas')

module.exports = {
    commands: 'location',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //handle errors
        var errorHandleing = 0

        //store the user index choice
        var num = 0

        //list of items images
        const Images = {
            campfire: "https://imgur.com/ei8lsec.png",
        }

        //request data
        await FNBRMENA.listLocations("map")
        .then(async res => {

            //store all the locations in itemsCanBeListed variable
            const itemsCanBeListed = []
            for(let i = 0; i < res.data.items.length; i++){

                if(!itemsCanBeListed.includes(res.data.items[i].mappedType.type))
                itemsCanBeListed.push(res.data.items[i].mappedType.type)
            }

            //inislizing embed
            const list = new Discord.MessageEmbed()
            list.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") list.setTitle(`Please choose your news type from the list below`)
            else if(lang === "ar") list.setTitle(`الرجاء اختيار نوع الأخبار من القائمه بالاسفل`)

            //loop throw every item
            const string = []
            for(let i = 0; i < itemsCanBeListed.length; i++) string.push(`• ${i}: \`${itemsCanBeListed[i]}\``)

            //set Description
            list.setDescription(string)

            //send the message and wait for answer
            await message.channel.send(list)
            .then(async list => {

                //filtering
                const filter = async m => await m.author.id === message.author.id

                //add the reply
                if(lang === "en") var reply = `please choose your news type, listening will be stopped after 20 seconds`
                else if(lang === "ar") var reply = `الرجاء كتابة نوع الأخبار، راح يتوقف الامر بعد ٢٠ ثانية`
                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                    .then( async collected => {

                        //delete messages
                        await notify.delete()
                        await list.delete()

                        //if the user chosen inside range
                        if(collected.first().content >= 0 && collected.first().content < itemsCanBeListed.length){
                            num = collected.first().content
                             
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

            //if there is no errors
            if(errorHandleing === 0){

                //filtering to get all the locations of the chosen item
                const Coordinates = []
                await res.data.items.filter(async obj => {
                    
                    //check if the type is the same of the chosen item?
                    if(itemsCanBeListed[num] == obj.mappedType.type) Coordinates.push(obj)
                })

                //generating animation
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Loading a total ${res.data.npc.length} ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${res.data.npc.length} ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {
                
                    //create canvas
                    const canvas = Canvas.createCanvas(2048, 2048);
                    const ctx = canvas.getContext('2d');

                    //add the map img
                    const map = await Canvas.loadImage(`https://fortnite-api.com/images/map.png`)
                    ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                    //add the border
                    const border = await Canvas.loadImage('./assets/NPC/border.png')
                    ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                    //loop throw every item location and draw it
                    for(let i = 0; i < Coordinates.length; i++){

                        //draw the pin img to the exact location x, y
                        if(Coordinates[i].extra.length === 0){
                            const line = await Canvas.loadImage(Images[itemsCanBeListed[num]])
                            ctx.drawImage(line, Coordinates[i].location.x - 60, Coordinates[i].location.y - 105, 100, 100)
                        }else{
                            const pin = await Canvas.loadImage('https://imgur.com/gqKgua5.png')
                            ctx.drawImage(pin, Coordinates[i].location.x, Coordinates[i].location.y, 30, 51)
                        }
                    }

                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${itemsCanBeListed[num]}.png`)
                    await message.channel.send(att)
                })
            }
        })
    }
}    