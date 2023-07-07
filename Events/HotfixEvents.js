const Discord = require('discord.js')
const Canvas = require('canvas')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Backgrounds)

    // Results
    var response = []
    var number = 0

    // Handle the blogs
    const DynamicBackgrounds = async () => {

        // Checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("dynamicbackgrounds").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const role = data.val().Role

            // If the event is set to be true [ON]
            if(status){
                
            }
        })
    }
    setInterval(DynamicBackgrounds, 1 * 20000)
}