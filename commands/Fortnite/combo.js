const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');
const FortniteAPI = require("fortnite-api-com");
const config = {
  apikey: FNBRMENA.APIKeys("FortniteAPI.com"),
  language: "en",
  debug: true
};

var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'combo',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inilizing values
        var error = 0

        //creating canvas
        const canvas = Canvas.createCanvas(512, 1024);
        const ctx = canvas.getContext('2d');

        //background
        const background = await Canvas.loadImage('./assets/locker/locker.jpg')
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

        //filtering outfits
        const filter = async m => await m.author.id === message.author.id
        if(lang === "en"){
            reply = `please choose your outfit listening, will be stopped after 1 minute`
        }else if(lang === "ar"){
            reply = `الرجاء كتابة اسم السكن راح يتوقع الامر بعد دقيقه`
        }
        await message.reply(reply)
        .then( async notify => {

            //listen for user input
            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
            .then( async collected => {

                //delete messages
                await notify.delete()

                var query = {
                    matchMethod: "full",
                    name: collected.first().content,
                    displayType: "Outfit",
                }

                await Fortnite.CosmeticsSearch(query)
                .then(async res => {

                    //add the outfit
                    const skin = await Canvas.loadImage(res.data.images.icon);
                    ctx.drawImage(skin, 0, 0, 500, 500)

                    //add the background
                    const bg = await Canvas.loadImage('./assets/locker/background.png');
                    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

                }).catch(err => {
                    error = 1
                })
                
            })
        })

        if(error === 1){
            if(lang === "en"){
                const Err = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(`No outfit has been found check your speling and try again ${errorEmoji}`)
                message.channel.send(Err)
            }else if(lang === "ar"){
                const Err = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(`لا يمكنني العثور على السكن الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.channel.send(Err)
            }
        }else{
            
            //filtering
            const filter = async m => await m.author.id === message.author.id
            if(lang === "en"){
                reply = `please choose your backbling type non if you dont want to add backbling, listening will be stopped after 1 minute`
            }else if(lang === "ar"){
                reply = `الرجاء كتابة اسم الشنطه اكتب مابي اذا ما تبي تضيف شنطه راح يتوقع الامر بعد دقيقه`
            }
            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                .then( async collected => {

                    //delete messages
                    await notify.delete()

                    if(lang === "en"){
                        if(collected.first().content.toLowerCase() !== "non"){

                            var query = {
                                matchMethod: "full",
                                name: collected.first().content,
                                displayType: "Back Bling",
                            }

                            await Fortnite.CosmeticsSearch(query)
                            .then(async res => {

                                //add the backpack
                                const pickaxe = await Canvas.loadImage(res.data.images.icon);
                                ctx.drawImage(pickaxe, 25, 535, 200, 200)

                            }).catch(err => {
                                error = 1
                            })
                        }
                    }else if(lang === "ar"){
                        if(collected.first().content !== "مابي"){

                            var query = {
                                matchMethod: "full",
                                name: collected.first().content,
                                displayType: "Back Bling",
                            }

                            await Fortnite.CosmeticsSearch(query)
                            .then(async res => {

                                //add the backpack
                                const pickaxe = await Canvas.loadImage(res.data.images.icon);
                                ctx.drawImage(pickaxe, 25, 535, 200, 200)

                            }).catch(err => {
                                error = 1
                            })
                        }
                    }
                })
            })

            if(error === 1){
                if(lang === "en"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`No backbling has been found check your speling and try again ${errorEmoji}`)
                    message.channel.send(Err)
                }else if(lang === "ar"){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لا يمكنني العثور على الشنطه الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                    message.channel.send(Err)
                }
            }else{

                //filtering
                const filter = async m => await m.author.id === message.author.id
                if(lang === "en"){
                    reply = `please choose your pickaxe type non if you dont want to add pickaxe listening will be stopped after 1 minute`
                }else if(lang === "ar"){
                    reply = `الرجاء كتابة اسم البيكاكس اكتب مابي اذا ما تبي تضيف بيكاكس راح يتوقع الامر بعد دقيقه`
                }
                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                    .then( async collected => {

                        //delete messages
                        await notify.delete()

                        if(lang === "en"){
                            if(collected.first().content.toLowerCase() !== "non"){

                                var query = {
                                    matchMethod: "full",
                                    name: collected.first().content,
                                    displayType: "Harvesting Tool",
                                }

                                await Fortnite.CosmeticsSearch(query)
                                .then(async res => {

                                    //add the pickaxe
                                    const glider = await Canvas.loadImage(res.data.images.icon);
                                    ctx.drawImage(glider, 290, 535, 200, 200)

                                }).catch(err => {
                                    error = 1
                                })
                            }
                        }else if(lang === "ar"){
                            if(collected.first().content !== "مابي"){

                                var query = {
                                    matchMethod: "full",
                                    name: collected.first().content,
                                    displayType: "Harvesting Tool",
                                }

                                await Fortnite.CosmeticsSearch(query)
                                .then(async res => {

                                    //add the pickaxe
                                    const glider = await Canvas.loadImage(res.data.images.icon);
                                    ctx.drawImage(glider, 290, 535, 200, 200)

                                }).catch(err => {
                                    error = 1
                                })

                            }
                        }
                    })
                })

                if(error === 1){
                    if(lang === "en"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`No harvesting tool has been found check your speling and try again ${errorEmoji}`)
                        message.channel.send(Err)
                    }else if(lang === "ar"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`لا يمكنني العثور على البيكاكس الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                        message.channel.send(Err)
                    }
                }else{
                    
                    //filtering
                    const filter = async m => await m.author.id === message.author.id
                    if(lang === "en"){
                        reply = `please choose your glider type non if you dont want to add glider listening will be stopped after 1 minute`
                    }else if(lang === "ar"){
                        reply = `الرجاء كتابة اسم المظلة اكتب مابي اذا ما تبي تضيف مظلة راح يتوقع الامر بعد دقيقه`
                    }
                    await message.reply(reply)
                    .then( async notify => {

                        //listen for user input
                        await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                        .then( async collected => {

                            //delete messages
                            await notify.delete()
                            if(lang === "en"){
                                if(collected.first().content.toLowerCase() !== "non"){

                                    var query = {
                                        matchMethod: "full",
                                        name: collected.first().content,
                                        isplayType: "Glider",
                                    }

                                    await Fortnite.CosmeticsSearch(query)
                                    .then(async res => {

                                        //add the glider
                                        const glider = await Canvas.loadImage(res.data.images.icon);
                                        ctx.drawImage(glider, 25, 800, 200, 200)

                                    }).catch(err => {
                                        error = 1
                                    })

                                }
                            }else if(lang === "ar"){
                                if(collected.first().content !== "مابي"){

                                    var query = {
                                        matchMethod: "full",
                                        name: collected.first().content,
                                        isplayType: "Glider",
                                    }

                                    await Fortnite.CosmeticsSearch(query)
                                    .then(async res => {

                                        //add the glider
                                        const glider = await Canvas.loadImage(res.data.images.icon);
                                        ctx.drawImage(glider, 25, 800, 200, 200)

                                    }).catch(err => {
                                        error = 1
                                    })

                                }
                            }
                        })
                    })

                    if(error === 1){
                        if(lang === "en"){
                            const Err = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`No glider has been found check your speling and try again ${errorEmoji}`)
                            message.channel.send(Err)
                        }else if(lang === "ar"){
                            const Err = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`لا يمكنني العثور على المظلة الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                            message.channel.send(Err)
                        }
                    }else{

                        //filtering
                        const filter = async m => await m.author.id === message.author.id
                        if(lang === "en"){
                            reply = `please choose your emote type non if you dont want to add emote listening will be stopped after 1 minute`
                        }else if(lang === "ar"){
                            reply = `الرجاء كتابة اسم الرقصة اكتب مابي اذا ما تبي تضيف رقصة راح يتوقع الامر بعد دقيقه`
                        }
                        await message.reply(reply)
                        .then( async notify => {

                            //listen for user input
                            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                            .then( async collected => {

                                //delete messages
                                await notify.delete()

                                if(lang === "en"){
                                    if(collected.first().content.toLowerCase() !== "non"){

                                        var query = {
                                            matchMethod: "full",
                                            name: collected.first().content,
                                            displayType: "Emote",
                                        }

                                        await Fortnite.CosmeticsSearch(query)
                                        .then(async res => {

                                            //add the emote
                                            const emote = await Canvas.loadImage(res.data.images.icon);
                                            ctx.drawImage(emote, 290, 800, 200, 200)

                                        }).catch(err => {
                                            error = 1
                                        })

                                    }
                                }else if(lang === "ar"){
                                    if(collected.first().content !== "مابي"){

                                        var query = {
                                            matchMethod: "full",
                                            name: collected.first().content,
                                            displayType: "Emote",
                                        }

                                        await Fortnite.CosmeticsSearch(query)
                                        .then(async res => {

                                            //add the emote
                                            const emote = await Canvas.loadImage(res.data.images.icon);
                                            ctx.drawImage(emote, 290, 800, 200, 200)

                                        }).catch(err => {
                                            error = 1
                                        })
                                        
                                    }
                                }
                            })
                        })

                        if(error === 1){
                            if(lang === "en"){
                                const Err = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`No emote has been found check your speling and try again ${errorEmoji}`)
                                message.channel.send(Err)
                            }else if(lang === "ar"){
                                const Err = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`لا يمكنني العثور على الرقصة الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                                message.channel.send(Err)
                            }
                        }else{

                            //send the image
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), 'combo.png')
                            await message.channel.send(att)

                        }
                    }
                }
            }
        }
    }
}