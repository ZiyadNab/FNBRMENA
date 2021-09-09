module.exports = {
    commands: 'ping',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        message.channel.send("Pong")
    },
}