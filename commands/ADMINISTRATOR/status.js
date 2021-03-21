module.exports = {
    commands: 'status',
    expectedArgs: '[ ON or OFF ]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, arguments, text, Discord, client, admin) => {
        if(text === "on" || text === "off"){
            admin.database().ref("ERA's").child("Server").child("Status").set({
                Bot: text,
            })
            const status = new Discord.MessageEmbed()
            status.setColor('#BB00EE')
            status.setTitle("The bot has been turned "+text+" ✅")
            message.channel.send(status)
        }else{
            const err = new Discord.MessageEmbed()
            err.setColor('#BB00EE')
            err.setTitle(":x: You have typed \" "+text+" \" please type ON or OFF correctly")
            message.channel.send(err)
        }
    },
    
    requiredRoles: []
}