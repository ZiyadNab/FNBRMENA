const Data = require('../FNBRMENA.js')
const BackBling = require('../XMPPReceiver/Commands/Backbling.js')
const Emote = require('./Commands/Emote.js')
const Outfit = require('./Commands/Outfit.js')
const clearEmote = require('./Commands/clearEmote.js')
const hidePartyMembers = require('./Commands/hidePartyMembers.js')
const Level = require('./Commands/Level.js')
const Pickaxe = require('./Commands/Pickaxe.js')
const SittingOut = require('./Commands/SittingOut.js')
const FNBRMENA = new Data()

module.exports = async (service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji) => {

    //listen for commands
    client.on('message', async (message) => {
        const { member, content, guild } = message

        //get the prefix
        const prefix = await FNBRMENA.Admin(admin, message, "", "Prefix")

        if(content.startsWith(prefix)){

            const args = content.split(/[ ]+/)
            const command = args.shift().toLowerCase()
            const alias = command.replace(prefix, '')

            //get the user language from the database
            const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

            //call the outfit js file
            if(alias === 'setoutfit') await Outfit(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

            //call the emote js file
            if(alias === 'setemote') await Emote(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

            //call the backbling js file
            if(alias === 'setbackbling') await BackBling(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

             //call the Pickaxe js file
             if(alias === 'setpickaxe') await Pickaxe(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

            //call the clearEmote js file
            if(alias === 'clearemote') await clearEmote(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

            //call the hidePartyMembers js file
            if(alias === 'hide') await hidePartyMembers(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

            //call the Level js file
            if(alias === 'setlvl') await Level(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)

            //call the SittingOut js file
            if(alias === 'setstatus') await SittingOut(message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji)
        }
    })
}
