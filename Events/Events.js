const Data = require('../FNBRMENA')
const FNBRMENA = new Data()

module.exports = async (client, admin, commandsData) => {

    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Blogposts")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Bundle")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Itemshop")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Playlists")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Pak")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Set")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "ShopSection")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "DynamicBackgrounds")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "SubGameInfo")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Crew")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "NewTournaments")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Notice")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "AvailableBundle")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Servers")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "UserJoined")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Commands")
    FNBRMENA.Events(FNBRMENA, client, admin, commandsData, "Auth")

}
