const Data = require('../FNBRMENA')
const FNBRMENA = new Data()

module.exports = async (client, admin, array) => {

    FNBRMENA.Events(client, admin, array, "Blogposts")
    FNBRMENA.Events(client, admin, array, "Bundle")
    FNBRMENA.Events(client, admin, array, "Comp")
    FNBRMENA.Events(client, admin, array, "Itemshop")
    FNBRMENA.Events(client, admin, array, "Playlists")
    FNBRMENA.Events(client, admin, array, "Pak")
    FNBRMENA.Events(client, admin, array, "Set")
    FNBRMENA.Events(client, admin, array, "ShopSection")
    FNBRMENA.Events(client, admin, array, "UserJoined")
    FNBRMENA.Events(client, admin, array, "Commands")

}
