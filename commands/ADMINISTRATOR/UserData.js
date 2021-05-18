module.exports = {
    commands: 'addjsonuser',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        admin.database().ref("ERA's").child("Users").child(message.member.id).set({
            id: message.member.user.id,
            name: message.member.user.username,
            discriminator: message.member.user.discriminator,
            lang: "en",
            banned: {
                status: "false",
                command: "",
                reason: "",
            }
        })
    },
}