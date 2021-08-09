const Data = require('../FNBRMENA')
const FNBRMENA = new Data()

module.exports = async (client, admin, array) => {

    FNBRMENA.Events(FNBRMENA, client, admin, array, "Blogposts")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Bundle")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Itemshop")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Playlists")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Pak")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Set")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "ShopSection")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "DynamicBackgrounds")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "SubGameInfo")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "NewTournaments")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Crew")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Notice")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "AvailableBundle")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Servers")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "UserJoined")
    FNBRMENA.Events(FNBRMENA, client, admin, array, "Commands")

}
