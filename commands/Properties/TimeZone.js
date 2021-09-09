const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
require('moment-timezone')

module.exports = {
    commands: 'timezone',
    expectedArgs: '',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //if there is more than one city found
        var num = 0
        var handleErrors = 0

        //filter
        const timezone = moment.tz.names().filter(city => {
            if(city.toLowerCase().includes(text)) return city
        })

        //check if its found or not
        if(timezone.length !== 0){

            //if there is more than one timezone ffound
            if(timezone.length > 1){

                //create embed
                const choose = new Discord.MessageEmbed()

                //add the color
                choose.setColor(FNBRMENA.Colors("embed"))

                //create and fill a string of names
                var str = ``
                for(let i = 0; i < timezone.length; i++){
                    str += `• ${i}: ${timezone[i]}\n`
                }

                //add description
                choose.setDescription(str)

                //send the choices
                await message.channel.send(choose)
                .then( async msg => {

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //send the reply to the user
                    if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                    else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                    //send the reply
                    await message.reply(reply)
                    .then( async notify => {

                        //await messages
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //deleting messages
                            msg.delete()
                            notify.delete()

                            //if the user input in range
                            if(await collected.first().content >= 0 && collected.first().content < timezone.length){

                                //store user input
                                num = await collected.first().content

                            }else{

                                //add error
                                handleErrors++

                                //create embed
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        }).catch(err => {

                            //add error
                            handleErrors++

                            //deleting messages
                            msg.delete()
                            notify.delete()

                            //create embed
                            const error = new Discord.MessageEmbed()
                            error.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") error.setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                            else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                            message.reply(error)
                        })
                    })
                }).catch(err => {

                    //add error
                    handleErrors++

                    //deleting messages
                    msg.delete()
                    notify.delete()

                    //create embed
                    const error = new Discord.MessageEmbed()
                    error.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") error.setTitle(`Request entry too large ${errorEmoji}`)
                    else if(lang === "ar") error.setTitle(`تم تخطي الكمية المحدودة من عدد المناطق ${errorEmoji}`)
                    message.reply(error)
                })
            }

            //add the data if there is no errors
            if(handleErrors === 0){
                await admin.database().ref("ERA's").child("Users").child(message.member.user.id).update({
                    timezone: timezone[num]
                })

                //create sucess embed
                const confirmed = new Discord.MessageEmbed()
                confirmed.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") confirmed.setTitle(`You have successfully changed your timezone to ${timezone[num]} ${checkEmoji}`)
                else if(lang === "ar") confirmed.setTitle(`تم تغير زمن المنطقة الخاص بك بنجاح الي ${timezone[num]} ${checkEmoji}`)
                message.channel.send(confirmed)
            }

        }else{

            //create error embed
            const err = new Discord.MessageEmbed()
            err.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") err.setTitle(`Can't find the requested timezone ${errorEmoji}`)
            else if(lang === "ar") err.setTitle(`لا يمكنني العثور على اسم زمن المنطقة المكتوب ${errorEmoji}`)
            message.channel.send(err)
        }
    }
}