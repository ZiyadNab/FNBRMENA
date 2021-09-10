module.exports = {
    commands: 'addjsonuser',
    type: 'Administrators Only',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {
        admin.database().ref("ERA's").child("Users").child(message.member.id).set({
            id: message.member.user.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            lang: "en",
            
        })
    },
}