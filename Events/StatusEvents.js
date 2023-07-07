const Discord = require('discord.js')
const axios = require('axios')
const key = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Servers)

    // Results
    const supportedStatus = [
        'wf1ys2kx4pxc',
        'khtrdkxhxjd9',
        'zwclljjbtmfs',
        'd4t23tydt16z',
        '29w1zbmgr3rm',
        'r8q22tdgns05',
        'ty2cblbfgt04',
        'dht2phs32530'
    ]
    var response = []
    var saved = []
    var temp = []
    var number = 0

    const Status = async () => {

        // Get the event's data
        admin.database().ref("ERA's").child("Events").child("status").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const token = data.val().Token
            const push = data.val().Push
            const role = data.val().Role

            // Check if the vents in enabled
            if(status){

                // Request data
                await axios.get('https://ft308v428dv3.statuspage.io/api/v2/summary.json')
                .then(async res => {
                    
                    if(number === 0){

                        res.data.components.map(async e => {
                            if(e.id === 'wf1ys2kx4pxc'){
                                saved = e
                                for(const child of e.components){
                                    saved.components[child] = await res.data.components.filter(c => {
                                        return (c.id === child)
                                    })
                                }
                            }
                        })
                    }

                    console.log(saved)

                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'status')
        
                })
            }
        })
    }
    setInterval(Status, 1 * 60000)
}