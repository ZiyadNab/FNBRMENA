const moment = require('moment')

module.exports = {
    commands: 'command',
    type: 'Administrators Only',
    minArgs: 2,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inislizing data
        const Command = args[0]
        if(args[1] === "true") var Status = true
        else if(args[1] === "false") var Status = false
        var reasonEN = null
        var reasonAR = null

        //if reasonEN and AR included
        if(text.includes("-")){
            reasonEN = text.substring(text.indexOf("-") + 1, text.lastIndexOf("-")).trim()
            reasonAR = text.substring(text.lastIndexOf("-") + 1, text.length).trim()
        }

        //seeting up the db firestore
        var db = await admin.firestore()

        //commands collection
        const commandData = await db.collection("Commands").doc(Command).get()

        //check if the command data exists or not
        if(commandData.exists){

            //check if the user typed true and false truly
            if(Status === true || Status === false){

                //check if the user added a reason or not
                if(text.includes("+")){
                    if((text.match(/-/g) || []).length === 2){

                        //setting up the updated data
                        const updatedData = {
                            commandStatus: {
                                Status: Status,
                                by: message.author.id,
                                date: moment().format(),
                                reasonEN: reasonEN,
                                reasonAR: reasonAR,
                            }
                        }

                        //update the data
                        await db.collection("Commands").doc(Command).update(updatedData)

                        
                        //success
                        const success = new Discord.MessageEmbed()
                        success.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") success.setTitle(`The ${Command} status has been changed to ${Status} successfully ${checkEmoji}`)
                        else if(lang === "ar") success.setTitle(`تم تغير حالة أمر ${Command} الى ${Status} بنجاح ${checkEmoji}`)
                        message.channel.send(success)

                    }else{

                        //reason error
                        const err = new Discord.MessageEmbed()
                        err.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") err.setTitle(`Make sure to provide reasons in both languages ${errorEmoji}`)
                        else if(lang === "ar") err.setTitle(`تأكد بأنك لقت كتبت الأسباب في اللغتين ${errorEmoji}`)
                        message.channel.send(err)
                    }
                }else{

                    //setting up the updated data
                    const updatedData = {
                        commandStatus: {
                            Status: Status,
                            by: message.author.id,
                            date: moment().format(),
                            reasonEN: reasonEN,
                            reasonAR: reasonAR,
                        }
                    }

                    //update the data
                    await db.collection("Commands").doc(Command).update(updatedData)

                    
                    //success
                    const success = new Discord.MessageEmbed()
                    success.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") success.setTitle(`The ${Command} status has been changed to ${Status} successfully ${checkEmoji}`)
                    else if(lang === "ar") success.setTitle(`تم تغير حالة أمر ${Command} الى ${Status} بنجاح ${checkEmoji}`)
                    message.channel.send(success)
                    
                }
            }else{

                //status error
                const err = new Discord.MessageEmbed()
                err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE exactly ${errorEmoji}`)
                else if(lang === "ar") err.setTitle(`تأكد بأنك لقد كتبت TRUE او FALSE بشكل صحيح ${errorEmoji}`)
                message.channel.send(err)
            }
        }else{

            //no command has been found
            const err = new Discord.MessageEmbed()
            err.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") err.setTitle(`No such a command named ${Command} has been found! ${errorEmoji}`)
            else if(lang === "ar") err.setTitle(`لا يمكنني العثور على أمر ${Command} ${errorEmoji}`)
            message.channel.send(err)
        }
    }
}