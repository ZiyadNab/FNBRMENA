const Data = require('../FNBRMENA')
const FNBRMENA = new Data()

module.exports = async (client, admin, array) => {

    FNBRMENA.Events(client, admin, array, "Blogposts")
    FNBRMENA.Events(client, admin, array, "Bundle")
    FNBRMENA.Events(client, admin, array, "Itemshop")
    FNBRMENA.Events(client, admin, array, "Playlists")
    FNBRMENA.Events(client, admin, array, "Pak")
    FNBRMENA.Events(client, admin, array, "Set")
    FNBRMENA.Events(client, admin, array, "ShopSection")
    FNBRMENA.Events(client, admin, array, "DynamicBackgrounds")
    FNBRMENA.Events(client, admin, array, "Crew")
    FNBRMENA.Events(client, admin, array, "Notice")
    FNBRMENA.Events(client, admin, array, "AvailableBundle")
    FNBRMENA.Events(client, admin, array, "Servers")
    FNBRMENA.Events(client, admin, array, "UserJoined")
    FNBRMENA.Events(client, admin, array, "Commands")

}
