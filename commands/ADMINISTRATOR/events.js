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

        //inisilizing data
        var str = ""
        var reply = ""
        var num = 0

        //an array contains every active event
        const events = [
            "blogposts",
            "itemshop",
            "section",
            "set",
            "pak",
            "playlists"
        ]

        //sent the embed to let the modes choose which to change status
        const listOfEvents = new Discord.MessageEmbed()
        listOfEvents.setColor('#BB00EE')

        //set title
        if(lang === "en"){
            listOfEvents.setTitle("Pleasy Choose an event to change its status")
        }else if(lang === "ar"){
            listOfEvents.setTitle("الرجاء اختيار من القائمه بالاسفل")
        }

        //loop throw every event
        for(let i = 0; i < events.length; i++){
            str += "• " + i + ": " + events[i] + "\n"
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
            message.reply(reply)
            .then( async notify => {
                notify.delete({timeout: 20000})
                await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                .then( async collected => {

                    //listen for user input
                    if(collected.first().content >= 0 && collected.first().content < events.length){

                        //delete messages
                        msg.delete()
                        notify.delete()
                        
                        //ask the user what status should be placed
                        const method = new Discord.MessageEmbed()
                        method.setColor('#BB00EE')
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
                        const msgReact = await message.channel.send(method)
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
                                admin.database().ref("ERA's").child("Events").child(events[collected.first().content]).update({
                                    Active: "true"
                                })

                                //send the embed
                                if(lang === "en"){
                                    const done = new Discord.MessageEmbed()
                                    done.setColor('#BB00EE')
                                    done.setTitle(`The ${events[collected.first().content]} event has been turned on ${checkEmoji}`)
                                    message.channel.send(done)
                                }else if(lang === "ar"){
                                    const done = new Discord.MessageEmbed()
                                    done.setColor('#BB00EE')
                                    done.setTitle(`تم تفعيل امر ${events[collected.first().content]} ${checkEmoji}`)
                                    message.channel.send(done)
                                }
                            }

                            if(reaction.emoji.name === '❎'){
                                //change the command status
                                admin.database().ref("ERA's").child("Events").child(events[collected.first().content]).update({
                                    Active: "false"
                                })

                                //send the embed
                                if(lang === "en"){
                                    const done = new Discord.MessageEmbed()
                                    done.setColor('#BB00EE')
                                    done.setTitle(`The ${events[collected.first().content]} event has been turned off ${checkEmoji}`)
                                    message.channel.send(done)
                                }else if(lang === "ar"){
                                    const done = new Discord.MessageEmbed()
                                    done.setColor('#BB00EE')
                                    done.setTitle(`تم ايقاف امر ${events[collected.first().content]} ${checkEmoji}`)
                                    message.channel.send(done)
                                }
                            }
                        })

                        //delete the embed message
                        msgReact.delete()

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
    }
}