const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()

module.exports = {
    commands: 'events',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inilizing data
        const red = client.emojis.cache.get("855805718779002899")
        const green = client.emojis.cache.get("855805718363111434")

        //ask the user what status should be placed
        const method = new Discord.MessageEmbed()
        method.setColor('#BB00EE')
        if(lang === "en"){
            method.setTitle('Choose a method')
            method.addFields(
                {name: 'View', value: 'React to :one:'},
                {name: 'Edit', value: 'React to :two:'}
            )
        }else if(lang === "ar"){
            method.setTitle('اختر طريقه')
            method.addFields(
                {name: 'مشاهدة', value: 'اضغط على :one:'},
                {name: 'تعديل', value: 'اضغط على :two:'}
            )
        }
        const msgReact = await message.channel.send(method)

        //add reactions
        await msgReact.react('1️⃣')
        msgReact.react('2️⃣')

        //filtering
        const filter = (reaction, user) => {
            return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        //listen for reactions
        await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then( async react => {
            const reaction = react.first();

            //view the status
            if(reaction.emoji.name === '1️⃣'){

                //delete the embed message
                msgReact.delete()

                //request data from the database
                FNBRMENA.Admin(admin, message, "", "Events")
                .then(async res => {

                    //create embed
                    const view = new Discord.MessageEmbed()

                    //add the color
                    view.setColor('#BB00EE')
                    
                    //for loop foe each event
                    for(let i = 0; i < Object.keys(res).length; i++){

                        //creating string
                        var str = ""

                        //check lang
                        if(lang === "en"){

                            //active ?
                            if(res[Object.keys(res)[i]].Active === "true"){
                                str += `Active: ${green} \n`
                            }else{
                                str += `Active: ${red} \n`
                            }

                            //lang
                            if(res[Object.keys(res)[i]].Lang === "en"){
                                str += `Lang: :flag_us:`
                            }else if(res[Object.keys(res)[i]].Lang === "ar"){
                                str += `Lang: :flag_sa:`
                            }

                            //event field
                            view.addFields(
                                {name: Object.keys(res)[i], value: str, inline: true}
                            )

                        }else if(lang === "ar"){

                            //active ?
                            if(res[Object.keys(res)[i]].Active === "true"){
                                str += `الحالة: ${green} \n`
                            }else{
                                str += `الحالة: ${red} \n`
                            }

                            //lang
                            if(res[Object.keys(res)[i]].Lang === "en"){
                                str += `اللغة: :flag_us:`
                            }else if(res[Object.keys(res)[i]].Lang === "ar"){
                                str += `اللغة: :flag_sa:`
                            }

                            //event field
                            view.addFields(
                                {name: Object.keys(res)[i], value: str, inline: true}
                            )
                        }
                    }

                    //send the result
                    message.channel.send(view)
                })
            }

            //edit
            if(reaction.emoji.name === '2️⃣'){

                //delete the embed message
                msgReact.delete()

                //request data
                FNBRMENA.Admin(admin, message, "", "Events")
                .then(async res => {

                    //sent the embed to let the modes choose which to change status
                    const listOfEvents = new Discord.MessageEmbed()

                    //add color
                    listOfEvents.setColor('#BB00EE')

                    //set title
                    if(lang === "en"){
                        listOfEvents.setTitle("Pleasy Choose an event to change its status")
                    }else if(lang === "ar"){
                        listOfEvents.setTitle("الرجاء اختيار من القائمه بالاسفل")
                    }

                    //loop throw every event
                    var str = ""
                    for(let i = 0; i < Object.keys(res).length; i++){
                        str += "• " + i + ": " + Object.keys(res)[i] + "\n"
                    }

                    //add description
                    listOfEvents.setDescription(str)

                    //send the message
                    await message.channel.send(listOfEvents)
                    .then( async msg => {

                        //filtering
                        const filter = m => m.author.id === message.author.id
                        if(lang === "en"){
                            reply = "please choose from above list the command will stop listen in 20 sec"
                        }else if(lang === "ar"){
                            reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                        }

                        //send the message
                        message.reply(reply)
                        .then( async notify => {

                            //await messages
                            await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                            .then( async collected => {

                                //listen for user input
                                if(collected.first().content >= 0 && collected.first().content < Object.keys(res).length){

                                    //delete messages
                                    msg.delete()
                                    notify.delete()
                                    
                                    //ask the user what he wants to change
                                    const change = new Discord.MessageEmbed()

                                    //add the color
                                    change.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en"){
                                        change.setTitle('Choose a method')
                                        change.addFields(
                                            {name: 'Change event status', value: 'React to :one:'},
                                            {name: 'Change event language', value: 'React to :negative_squared_cross_mark:'}
                                        )
                                    }else if(lang === "ar"){
                                        change.setTitle('اختر طريقه')
                                        change.addFields(
                                            {name: 'تغير الحالة', value: 'اضغط على :one:'},
                                            {name: 'تعديل اللغة', value: 'اضغط على :two:'}
                                        )
                                    }

                                    //send the message
                                    const messageReact = await message.channel.send(change)

                                    //add reactions
                                    await messageReact.react('1️⃣')
                                    messageReact.react('2️⃣')

                                    //filtering
                                    const filter = (reaction, user) => {
                                        return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                                    };

                                    //listen for reactions
                                    await messageReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                    .then( async react => {
                                        const reaction = react.first();

                                        //change access
                                        if(reaction.emoji.name === '1️⃣'){

                                            //delete the embed message
                                            messageReact.delete()

                                            //ask the user what status should be placed
                                            const method = new Discord.MessageEmbed()

                                            //add the color
                                            method.setColor('#BB00EE')

                                            //add title
                                            if(lang === "en"){
                                                method.setTitle('Choose a method')
                                                method.addFields(
                                                    {name: 'Turn on the event', value: 'React to :white_check_mark:'},
                                                    {name: 'Turn off the event', value: 'React to :negative_squared_cross_mark:'}
                                                )
                                            }else if(lang === "ar"){
                                                method.setTitle('اختر طريقه')
                                                method.addFields(
                                                    {name: 'تفعيل الامر', value: 'اضغط على :white_check_mark:'},
                                                    {name: 'ايقاف الامر', value: 'اضغط على :negative_squared_cross_mark:'}
                                                )
                                            }

                                            //send the message
                                            const msgReact = await message.channel.send(method)

                                            //add reactions
                                            await msgReact.react('✅')
                                            msgReact.react('❎')

                                            //filtering
                                            const filter = (reaction, user) => {
                                                return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                                            };

                                            //listen for reactions
                                            await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                                            .then( async react => {
                                                const reaction = react.first();
                                                if(reaction.emoji.name === '✅'){

                                                    //change the command status
                                                    admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                        Active: "true"
                                                    })

                                                    //send the embed
                                                    if(lang === "en"){
                                                        const done = new Discord.MessageEmbed()
                                                        done.setColor('#BB00EE')
                                                        done.setTitle(`The ${Object.keys(res)[collected.first().content]} event has been turned on ${checkEmoji}`)
                                                        message.channel.send(done)
                                                    }else if(lang === "ar"){
                                                        const done = new Discord.MessageEmbed()
                                                        done.setColor('#BB00EE')
                                                        done.setTitle(`تم تفعيل امر ${Object.keys(res)[collected.first().content]} ${checkEmoji}`)
                                                        message.channel.send(done)
                                                    }
                                                }

                                                if(reaction.emoji.name === '❎'){

                                                    //change the command status
                                                    admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                        Active: "false"
                                                    })

                                                    //send the embed
                                                    if(lang === "en"){
                                                        const done = new Discord.MessageEmbed()
                                                        done.setColor('#BB00EE')
                                                        done.setTitle(`The ${Object.keys(res)[collected.first().content]} event has been turned off ${checkEmoji}`)
                                                        message.channel.send(done)
                                                    }else if(lang === "ar"){
                                                        const done = new Discord.MessageEmbed()
                                                        done.setColor('#BB00EE')
                                                        done.setTitle(`تم ايقاف امر ${Object.keys(res)[collected.first().content]} ${checkEmoji}`)
                                                        message.channel.send(done)
                                                    }
                                                }
                                            })

                                            //delete the embed message
                                            msgReact.delete()
                                            
                                        }

                                        

                                        //change language
                                        if(reaction.emoji.name === '2️⃣'){

                                            //delete the embed message
                                            messageReact.delete()

                                            //set embed
                                            const method = new Discord.MessageEmbed()

                                            //add color
                                            method.setColor('#BB00EE')

                                            //add title
                                            if(lang === "en"){
                                                method.setTitle('Choose a language please')
                                            }else if(lang === "ar"){
                                                method.setTitle('من فضلك اختر لغة')
                                            }
                                            
                                            if(lang === "en"){
                                                method.addFields(
                                                    {name: 'Arabic', value: 'React to the Saudi Arabia flag :flag_sa:'},
                                                    {name: 'English', value: 'React to the US flag :flag_us:'}
                                                )
                                            }else if(lang === "ar"){
                                                method.addFields(
                                                    {name: 'عربي', value: 'صوت على علم السعودية :flag_sa:'},
                                                    {name: 'انجليزي', value: 'صوت على علم امريكا :flag_us:'}
                                                )
                                            }

                                            //send the embed
                                            const msgReact = await message.channel.send(method)

                                            //add reactions
                                            await msgReact.react('🇸🇦')
                                            msgReact.react('🇺🇸')

                                            //filter
                                            const filter = (reaction, user) => {
                                                return ['🇸🇦', '🇺🇸'].includes(reaction.emoji.name) && user.id === message.author.id;
                                            }

                                            //await user click
                                            await msgReact.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                                            .then( async collect => {
                                                const reaction = collect.first();

                                                //change to english
                                                if(reaction.emoji.name === '🇺🇸'){

                                                    admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                        Lang: "en"
                                                    })

                                                    const change = new Discord.MessageEmbed()
                                                    .setColor('#BB00EE')
                                                    .setTitle(`The Event's language has been changed to English ${checkEmoji}`)
                                                    message.channel.send(change)
                                                }

                                                //change to arabic
                                                if(reaction.emoji.name === '🇸🇦'){

                                                    admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                        Lang: "ar"
                                                    })

                                                const change = new Discord.MessageEmbed()
                                                    .setColor('#BB00EE')
                                                    .setTitle(`تم تغير اللغة الى العربية ${checkEmoji}`)
                                                    message.channel.send(change)
                                                }

                                                msgReact.delete()

                                            }).catch(err => {
                                                msgReact.delete()
                                                const error = new Discord.MessageEmbed()
                                                .setColor('#BB00EE')
                                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                message.reply(error)
                                            })
                                            
                                        }
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

                                //if user took to long to excute the command
                                notify.delete()
                                msg.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                message.reply(error)
                                    
                            })
                        })
                    })
                })
            }
        }).catch(err => {

            //if user took to long to excute the command
            msgReact.delete()
            const error = new Discord.MessageEmbed()
            .setColor('#BB00EE')
            .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
            message.reply(error)
                
        })
    }
}