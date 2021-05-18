const config = require('../../Coinfigs/config.json')

module.exports = {
    commands: 'command',
    expectedArgs: '[ Nmae of the command, True or False ]',
    minArgs: 2,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;
            admin.database().ref("ERA's").child("Commands").child(args[0]).once('value', async data => {
                if(data.exists()){
                    if(args[1] === "true" || args[1] === "false"){
                        await admin.database().ref("ERA's").child("Commands").child(args[0]).child("Active").update({
                            Status: args[1]
                        })
                        const done = new Discord.MessageEmbed()
                        done.setColor('#BB00EE')
                        admin.database().ref("ERA's").child("Commands").child(args[0]).child("Active").once('value', function (data) {
                            var access = data.val().Status;
                            if(access === "true"){
                                if(lang === "en"){
                                    done.setTitle(`The ${args[0]} command is Enable ${checkEmoji}`)
                                }else if(lang === "ar"){
                                    done.setTitle(`تم تفعيل امر ${args[0]} بنجاح ${checkEmoji}`)
                                }
                            } else if(access === "false"){
                                if(lang === "en"){
                                    done.setTitle(`The ${args[0]} command is Disable ${checkEmoji}`)
                                }else if(lang === "ar"){
                                    done.setTitle(`تم ايقاف امر ${args[0]} بنجاح ${checkEmoji}`)
                                }
                            }
                            message.channel.send(done)
                        })
                    }else{
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