const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()

module.exports = {
    commands: 'addjsonuser',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {
        admin.database().ref("ERA's").child("Users").child(message.member.id).set({
            id: message.member.user.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            lang: "en",
            
        })
    },
}