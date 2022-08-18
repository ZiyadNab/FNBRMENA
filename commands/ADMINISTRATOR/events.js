module.exports = {
    commands: 'events',
    type: 'Administrators Only',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //ask the user what status should be placed
        const method = new Discord.EmbedBuilder()
        method.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            method.setTitle('Choose a method')
            method.addFields(
                {name: 'View', value: 'React to :one:'},
                {name: 'Edit', value: 'React to :two:'}
            )
        }else if(userData.lang === "ar"){
            method.setTitle('اختر طريقه')
            method.addFields(
                {name: 'مشاهدة', value: 'اضغط على :one:'},
                {name: 'تعديل', value: 'اضغط على :two:'}
            )
        }
        const msgReact = await message.channel.send({embeds: [method]})

        //add reactions
        await msgReact.react('1️⃣')
        msgReact.react('2️⃣')

        //filtering
        const filter = (reaction, user) => {
            return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
        };

        //listen for reactions
        await msgReact.awaitReactions({filter, max: 1, time: 60000, errors: ['time'] })
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
                    const view = new Discord.EmbedBuilder()
                    view.setColor(FNBRMENA.Colors("embed"))
                    
                    //for loop foe each event
                    for(let i = 0; i < Object.keys(res).length; i++){

                        //creating string
                        var str = ""

                        //check userData.lang
                        if(userData.lang === "en"){

                            //active ?
                            if(res[Object.keys(res)[i]].Active) str += `Active: ${emojisObject.greenStatus} \n`
                            else str += `Active: ${emojisObject.redStatus} \n`

                            //userData.lang
                            if(res[Object.keys(res)[i]].Lang === "en") str += `Lang: :flag_us:`
                            else if(res[Object.keys(res)[i]].Lang === "ar") str += `Lang: :flag_sa:`

                            //event field
                            view.addFields(
                                {name: Object.keys(res)[i], value: str, inline: true}
                            )

                        }else if(userData.lang === "ar"){

                            //active ?
                            if(res[Object.keys(res)[i]].Active) str += `الحالة: ${emojisObject.greenStatus} \n`
                            else str += `الحالة: ${emojisObject.redStatus} \n`

                            //userData.lang
                            if(res[Object.keys(res)[i]].Lang === "en") str += `اللغة: :flag_us:`
                            else if(res[Object.keys(res)[i]].Lang === "ar") str += `اللغة: :flag_sa:`

                            //event field
                            view.addFields(
                                {name: Object.keys(res)[i], value: str, inline: true}
                            )
                        }
                    }

                    //send the result
                    message.channel.send({embeds: [view]})
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
                    const listOfEvents = new Discord.EmbedBuilder()
                    listOfEvents.setColor(FNBRMENA.Colors("embed"))

                    //set title
                    if(userData.lang === "en") listOfEvents.setTitle("Please choose an event to change its status")
                    else if(userData.lang === "ar") listOfEvents.setTitle("الرجاء اختيار من القائمه بالاسفل")
                    

                    //loop throw every event
                    var str = ""
                    for(let i = 0; i < Object.keys(res).length; i++){
                        str += "• " + i + ": " + Object.keys(res)[i] + "\n"
                    }

                    //add description
                    listOfEvents.setDescription(str)

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //reply
                    if(userData.lang === "en") reply = "please choose from above list the command will stop listen in 60 sec"
                    else if(userData.lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٦٠ ثانية"

                    //send the message
                    message.reply({content: reply, embeds: [listOfEvents]})
                    .then(async notify => {

                        //await messages
                        await message.channel.awaitMessages({filter, max: 1, time: 60000, errors: ['time'] })
                        .then( async collected => {

                            //listen for user input
                            if(collected.first().content >= 0 && collected.first().content < Object.keys(res).length){

                                //delete messages
                                notify.delete()
                                
                                //ask the user what he wants to change
                                const change = new Discord.EmbedBuilder()

                                //add the color
                                change.setColor(FNBRMENA.Colors("embed"))

                                //add title
                                if(userData.lang === "en"){
                                    change.setTitle('Choose a method')
                                    change.addFields(
                                        {name: 'Change event status', value: 'React to :one:'},
                                        {name: 'Change event language', value: 'React to :negative_squared_cross_mark:'}
                                    )
                                }else if(userData.lang === "ar"){
                                    change.setTitle('اختر طريقه')
                                    change.addFields(
                                        {name: 'تغير الحالة', value: 'اضغط على :one:'},
                                        {name: 'تعديل اللغة', value: 'اضغط على :two:'}
                                    )
                                }

                                //send the message
                                const messageReact = await message.channel.send({embeds: [change]})

                                //add reactions
                                await messageReact.react('1️⃣')
                                messageReact.react('2️⃣')

                                //filtering
                                const filter = (reaction, user) => {
                                    return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
                                };

                                //listen for reactions
                                await messageReact.awaitReactions({filter, max: 1, time: 60000, errors: ['time'] })
                                .then( async react => {
                                    const reaction = react.first();

                                    //change access
                                    if(reaction.emoji.name === '1️⃣'){

                                        //delete the embed message
                                        messageReact.delete()

                                        //ask the user what status should be placed
                                        const method = new Discord.EmbedBuilder()
                                        method.setColor(FNBRMENA.Colors("embed"))

                                        //add title
                                        if(userData.lang === "en"){
                                            method.setTitle('Choose a method')
                                            method.addFields(
                                                {name: 'Turn on the event', value: 'React to :white_check_mark:'},
                                                {name: 'Turn off the event', value: 'React to :negative_squared_cross_mark:'}
                                            )
                                        }else if(userData.lang === "ar"){
                                            method.setTitle('اختر طريقه')
                                            method.addFields(
                                                {name: 'تفعيل الامر', value: 'اضغط على :white_check_mark:'},
                                                {name: 'ايقاف الامر', value: 'اضغط على :negative_squared_cross_mark:'}
                                            )
                                        }

                                        //send the message
                                        const msgReact = await message.channel.send({embeds: [method]})

                                        //add reactions
                                        await msgReact.react('✅')
                                        msgReact.react('❎')

                                        //filtering
                                        const filter = (reaction, user) => {
                                            return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
                                        };

                                        //listen for reactions
                                        await msgReact.awaitReactions({filter, max: 1, time: 60000, errors: ['time'] })
                                        .then( async react => {
                                            const reaction = react.first();
                                            if(reaction.emoji.name === '✅'){

                                                //change the command status
                                                admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                    Active: true
                                                })

                                                //send the embed
                                                const done = new Discord.EmbedBuilder()
                                                done.setColor(FNBRMENA.Colors("embedSuccess"))
                                                if(userData.lang === "en") done.setTitle(`The ${Object.keys(res)[collected.first().content]} event has been turned on ${emojisObject.checkEmoji}`)
                                                else if(userData.lang === "ar") done.setTitle(`تم تفعيل امر ${Object.keys(res)[collected.first().content]} ${emojisObject.checkEmoji}`)
                                                message.channel.send({embeds: [done]})
                                               
                                            }

                                            if(reaction.emoji.name === '❎'){

                                                //change the command status
                                                admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                    Active: false
                                                })

                                                //send the embed
                                                const done = new Discord.EmbedBuilder()
                                                done.setColor(FNBRMENA.Colors("embedSuccess"))
                                                if(userData.lang === "en") done.setTitle(`The ${Object.keys(res)[collected.first().content]} event has been turned off ${emojisObject.checkEmoji}`)
                                                else if(userData.lang === "ar") done.setTitle(`تم ايقاف امر ${Object.keys(res)[collected.first().content]} ${emojisObject.checkEmoji}`)
                                                message.channel.send({embeds: [done]})
                                            }
                                        })

                                        //delete the embed message
                                        msgReact.delete()
                                        
                                    }

                                    //change language
                                    if(reaction.emoji.name === '2️⃣'){

                                        //delete the embed message
                                        messageReact.delete()
                                        const method = new Discord.EmbedBuilder()
                                        method.setColor(FNBRMENA.Colors("embed"))

                                        //add title
                                        if(userData.lang === "en") method.setTitle('Choose a language please')
                                        else if(userData.lang === "ar") method.setTitle('من فضلك اختر لغة')
                                        
                                        if(userData.lang === "en"){
                                            method.addFields(
                                                {name: 'Arabic', value: 'React to the Saudi Arabia flag :flag_sa:'},
                                                {name: 'English', value: 'React to the US flag :flag_us:'}
                                            )
                                        }else if(userData.lang === "ar"){
                                            method.addFields(
                                                {name: 'عربي', value: 'صوت على علم السعودية :flag_sa:'},
                                                {name: 'انجليزي', value: 'صوت على علم امريكا :flag_us:'}
                                            )
                                        }

                                        //send the embed
                                        const msgReact = await message.channel.send({embeds: [method]})

                                        //add reactions
                                        await msgReact.react('🇸🇦')
                                        msgReact.react('🇺🇸')

                                        //filter
                                        const filter = (reaction, user) => {
                                            return ['🇸🇦', '🇺🇸'].includes(reaction.emoji.name) && user.id === message.author.id;
                                        }

                                        //await user click
                                        await msgReact.awaitReactions({filter, max: 1, time: 60000, errors: ['time']})
                                        .then( async collect => {
                                            const reaction = collect.first();

                                            //change to english
                                            if(reaction.emoji.name === '🇺🇸'){

                                                admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                    Lang: "en"
                                                })

                                                const change = new Discord.EmbedBuilder()
                                                change.setColor(FNBRMENA.Colors("embedSuccess"))
                                                change.setTitle(`The Event's language has been changed to English ${emojisObject.checkEmoji}`)
                                                message.channel.send({embeds: [change]})
                                            }

                                            //change to arabic
                                            if(reaction.emoji.name === '🇸🇦'){

                                                admin.database().ref("ERA's").child("Events").child(Object.keys(res)[collected.first().content]).update({
                                                    Lang: "ar"
                                                })

                                                const change = new Discord.EmbedBuilder()
                                                change.setColor(FNBRMENA.Colors("embedSuccess"))
                                                change.setTitle(`تم تغير اللغة الى العربية ${emojisObject.checkEmoji}`)
                                                message.channel.send({embeds: [change]})
                                            }

                                            msgReact.delete()

                                        }).catch(err => {

                                            msgReact.delete()
                                            const error = new Discord.EmbedBuilder()
                                            error.setColor(FNBRMENA.Colors("embedError"))
                                            error.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                                            message.reply({embeds: [error]})
                                        })
                                    }
                                })

                            }else{

                                //if user typed a number out of range
                                notify.delete()

                                //create out of range embed
                                const outOfRangeError = new Discord.EmbedBuilder()
                                outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                                outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [outOfRangeError]})
                                
                            }
                        }).catch(err => {

                            //if user took to long to excute the command
                            notify.delete()

                            const error = new Discord.EmbedBuilder()
                            error.setColor(FNBRMENA.Colors("embedError"))
                            error.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [error]})
                                
                        })
                    })
                })
            }
        }).catch(err => {

            //if user took to long to excute the command
            msgReact.delete()

            const error = new Discord.EmbedBuilder()
            error.setColor(FNBRMENA.Colors("embedError"))
            error.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
            message.reply({embeds: [error]})
                
        })
    }
}