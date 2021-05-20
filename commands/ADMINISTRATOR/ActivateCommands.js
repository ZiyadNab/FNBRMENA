const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'command',
    expectedArgs: '[ Nmae of the command, True or False ]',
    minArgs: 2,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //command
        var command = args[0]
        //removing the command from the agrs elements
        args.shift()

        //TRUE or FALSE
        var boolean = args[0]
        //removing the boolean from the agrs elements
        args.shift()

        //checking for user language
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            //storing his language
            var lang = data.val().lang;

            //check if the command exists
            admin.database().ref("ERA's").child("Commands").child(command).once('value', async data => {

                //if statment
                if(await data.exists()){

                    //check if the user enterd a true or false 
                    if(boolean === "true" || boolean === "false"){

                        //changing the status of the command
                        await admin.database().ref("ERA's").child("Commands").child(command).child("Active").update({
                            Status: boolean
                        })

                        //creating success embed
                        const status = new Discord.MessageEmbed()
                        status.setColor('#BB00EE')
                        if(boolean === "true"){
                            if(lang === "en"){
                                status.setTitle(`The ${command} command is Enabled ${checkEmoji}`)
                            }else if(lang === "ar"){
                                status.setTitle(`تم تفعيل امر ${command} بنجاح ${checkEmoji}`)
                            }
                        } else if(boolean === "false"){
                            if(lang === "en"){
                                status.setTitle(`The ${command} command is Disabled ${checkEmoji}`)
                            }else if(lang === "ar"){
                                status.setTitle(`تم ايقاف امر ${command} بنجاح ${checkEmoji}`)
                            }
                        }
                        //sending the embed
                        message.channel.send(status)
                    }else{

                        //there is a typo in TRUE or FALSE
                        const err = new Discord.MessageEmbed()
                        err.setColor('#BB00EE')
                        if(lang === "en"){
                            err.setTitle(`Make sure that you enter TRUE to enable the command or FALSE to disable it etherwise it will throw an error ${errorEmoji}`)
                        }else if(lang === "ar"){
                            err.setTitle(`الرجاء التأكد من كتابة TRUE ام FALSE بشكل صحيح ${errorEmoji}`)
                        }
                        message.channel.send(err)
                    }
                }else{
                    //there is a typo in the command
                    const error = new Discord.MessageEmbed()
                    error.setColor('#BB00EE')
                    if(lang === "en"){
                        error.setTitle(`Make sure that you have entered a valid command ${errorEmoji}`)
                    }else if(lang === "ar"){
                        error.setTitle(`الرجاء التأكد من كتابة الامر بشكل صحيح ${errorEmoji}`)
                    }
                        message.channel.send(error)
                }
            })
        })
    },
}