module.exports = {
    commands: 'addjsonuser',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Create a doc for a user
        admin.firestore().collection("Users").doc(text).set({
            id: text,
            lang: "en",
            timezone: "America/Los_Angeles",
            premium: false,
            quickAccess: false,
            linkedAccount: null
        })
    }
}