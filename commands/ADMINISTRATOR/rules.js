const config = require('../../Configs/config.json')

module.exports = {
    commands: 'rules',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //handle user coice
        const Types = ["new", "edit"]

        //inisilizing embed
        const rulesChoices = new Discord.EmbedBuilder()
        rulesChoices.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            rulesChoices.setTitle("Please choose what type you want")
            rulesChoices.setDescription(`• 0: New rules message\n• 1: Edit old rules message`)
        }else if(userData.lang === "ar"){
            rulesChoices.setTitle("الرجاء الأختيار اي طريقة تود استعمالها")
            rulesChoices.setDescription(`• 0: رسالة قوانين جديدة\n• 1: تعديل على رسالة قديمة`)
        }

        //filtering
        const filter = m => m.author.id === message.author.id

        //send the reply to the user
        if(userData.lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
        else if(userData.lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

        //send the reply
        await message.reply({content: reply, embeds: [rulesChoices]})
        .then(async listening => {

            //listen for messages
            await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
            .then( async collected => {

                //delete messages
                listening.delete()

                //if the user selected an out of range number
                if(collected.first().content >= 0 && collected.first().content < Types.length){

                    //send a new rules message
                    if(Types[collected.first().content] === "new"){

                        //get rules channel id
                        const rulesMessage = await client.channels.cache.find(channel => channel.id === config.channels.rules)

                        //inislizing embed
                        const rulesEmbed = new Discord.EmbedBuilder()
                        rulesEmbed.setColor(FNBRMENA.Colors("embed"))
                        rulesEmbed.setDescription(text)

                        //send the message
                        await rulesMessage.send({embeds: [rulesEmbed]})
                        .then(() => {

                            //inislizing embed
                            const successfullySent = new Discord.EmbedBuilder()
                            successfullySent.setColor(FNBRMENA.Colors("embedSuccess"))
                            if(userData.lang === "en") successfullySent.setTitle(`Rules has been successfully sent ${emojisObject.checkEmoji}`)
                            else if(userData.lang === "ar") successfullySent.setTitle(`تم نشر القوانين بنجاح ${emojisObject.checkEmoji}`)
                            message.reply({embeds: [successfullySent]})
                            
                        }).catch(() => {

                            //inislizing embed
                            const errSent = new Discord.EmbedBuilder()
                            errSent.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") errSent.setTitle(`There was an error while sending the message please ask the Owner for help ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") errSent.setTitle(`يوجد مشكلة اثناء نشر الأوامر الرجاء التواصل مع الـ Owner لحل المشكلة ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [errSent]})
                        })
                    }

                    //edit a rules message
                    if(Types[collected.first().content] === "edit"){

                        //filtering
                        const filter = m => m.author.id === message.author.id

                        //ask the use to provide messsage id
                        if(userData.lang === "en") reply = "please privide message id, will stop listening in 20 sec"
                        else if(userData.lang === "ar") reply = "الرجاء ارسال معرف الرسالة، سوف ينتهي الامر خلال ٢٠ ثانية"

                        //send the reply
                        await message.reply({content: reply})
                        .then( async notify => {

                            //await messages
                            await message.channel.awaitMessages({filter, max: 1, time: 20000})
                            .then( async collected => {

                                //deleting messages
                                notify.delete()

                                //get all the channels in this guild
                                const channel = await client.channels.fetch(config.channels.rules)

                                //check for messages
                                channel.messages.fetch()
                                .then(async messages => {

                                    //loop throw every message in the channel
                                    for(const message of messages){

                                        //find the message via its id
                                        if(message[0] === collected.first().content){

                                            //inislizing embed
                                            const editedRulesEmbed = new Discord.EmbedBuilder()
                                            editedRulesEmbed.setColor(FNBRMENA.Colors("embed"))
                                            editedRulesEmbed.setDescription(text)

                                            //edit the message
                                            await message[1].edit({embeds: [editedRulesEmbed]})
                                        } 
                                    }   
                                })

                            }).catch(err => {

                                //deleting messages
                                notify.delete()

                                //time has passed
                                const timeError = new Discord.EmbedBuilder()
                                timeError.setColor(FNBRMENA.Colors("embedError"))
                                timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [timeError]})
                            })
                        })
                    }
                }else{

                    //create out of range embed
                    const outOfRangeError = new Discord.EmbedBuilder()
                    outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [outOfRangeError]})
                }

            }).catch(async err => {

                //delete messages
                listening.delete()

                //time has passed
                const timeError = new Discord.EmbedBuilder()
                timeError.setColor(FNBRMENA.Colors("embedError"))
                timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                message.reply({embeds: [timeError]})
            })
        
        }).catch(async err => {
            console.log()
        })
    }
}