const Data = require('../FNBRMENA')
const FNBRMENA = new Data()

module.exports = async (client, admin, commandsData, emojisObject) => {

    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Blogposts")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Itemshop")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Playlists")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Pak")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Set")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "ShopSection")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "DynamicBackgrounds")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "SubGameInfo")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Crew")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Notice")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "AvailableBundle")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Servers")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Reminders")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Twitch")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "EventFlags")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "rankedRoles")
    // FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "UserJoined")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, emojisObject, "Commands")

}
