const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Playlists)

    //result
    var response = []
    var enabled = []
    var number = 0

    //handle new active playlists
    const Playlists = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("playlists").once('value', async function (data) {
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().push
            
        })
    }
    setInterval(Playlists, 2 * 60000)
}