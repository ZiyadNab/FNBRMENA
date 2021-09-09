module.exports = {
    commands: 'replay',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data using the given session id
        FNBRMENA.Sessions(text)
        .then(async res => {
            
        })
    }
}