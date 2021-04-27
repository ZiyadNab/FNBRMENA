module.exports = {
    commands: 'status',
    expectedArgs: '[ ON or OFF ]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;
            if(text === "on" || text === "off"){
                admin.database().ref("ERA's").child("Server").child("Status").set({
                    Bot: text,
                })
                if(lang === "en"){
                    const status = new Discord.MessageEmbed()
                    status.setColor('#BB00EE')
                    status.setTitle(`The bot has been turned ${text} ${checkEmoji}`)
                    message.channel.send(status)
                }else if(lang === "ar"){
                    const status = new Discord.MessageEmbed()
                    status.setColor('#BB00EE')
                    status.setTitle(`تم تغير حالة البوت الى ${text} ${checkEmoji}`)
                    message.channel.send(status)
                }
            }else{
                if(lang === "en"){
                    const err = new Discord.MessageEmbed()
                    err.setColor('#BB00EE')
                    err.setTitle(`You have typed ${text} please type ON or OFF correctly ${errorEmoji}`)
                    message.channel.send(err)
                }else if(lang === "ar"){
                    const err = new Discord.MessageEmbed()
                    err.setColor('#BB00EE')
                    err.setTitle(`لقت كتبت ${text} الرجاء كتابة ON ام OFF يشكل صحيح ${errorEmoji}`)
                    message.channel.send(err)
                }
            }
        })
    },
    
    requiredRoles: []
}