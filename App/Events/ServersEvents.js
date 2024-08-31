const Discord = require('discord.js')
const axios = require('axios')
const key = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Servers)

    //result
    var response = []
    var number = 0

    const Server = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("servers").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const token = data.val().Token
            const push = data.val().Push
            const role = data.val().Role

            //if the event is set to be true [ON]
            if(status){

                //request the token
                axios.get(`http://fnbrmena.com/api/auth/get/${token}`)
                .then(async token => {

                    //request data
                    axios.get('http://lightswitch-public-service-prod.ol.epicgames.com/lightswitch/api/service/fortnite/status', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token.data.data.access_token}`
                        }
                    }).then(async res => {

                        if(number === 0){

                            //store data
                            response = await res.data.status

                            //add sets names
                            number++
                        }

                        //push current server status
                        if(push) response = []

                        //check data
                        if(res.data.status !== response){

                            //create embed
                            const serversStatusEmbed = new Discord.EmbedBuilder()
                            serversStatusEmbed.setColor(FNBRMENA.Colors("embed"))
                            serversStatusEmbed.setTitle(`Fortnite servers are \`${res.data.status}\`!`)

                            //description string
                            var string = ""
                            if(res.data.allowedActions.length !== 0){
                                for(let i = 0; i < res.data.allowedActions.length; i++){
                                    string += `\`${res.data.allowedActions[i]}\`\n`
                                }
                            }else string += `\`No data\``

                            //add description
                            serversStatusEmbed.setDescription(res.data.message + '\n\n**Allowed Actions**\n' + string)

                            if(res.data.status.toLowerCase() === "up") serversStatusEmbed.setImage('https://imgur.com/Q6TA03N.png')
                            else if(res.data.status.toLowerCase() === "down") serversStatusEmbed.setImage('https://imgur.com/sm2JZhX.png')
                            else serversStatusEmbed.setImage('https://i.imgur.com/OuV0nHn.jpg')

                            //add footer
                            serversStatusEmbed.setFooter({text: res.data.launcherInfoDTO.appName})
                            
                            //send
                            if(role.Status) await message.send({content: `<@&${role.roleID}>`, embeds: [serversStatusEmbed]})
                            else await message.send({embeds: [serversStatusEmbed]})

                            //trun off push if enabled
                            admin.database().ref("ERA's").child("Events").child("servers").update({
                                Push: false
                            })

                            //store data
                            response = await res.data.status
                        
                        }
                    }).catch(async err => {
                        FNBRMENA.eventsLogs(admin, client, err, 'servers')
            
                    })
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'servers')
        
                })
            }
        })
    }
    setInterval(Server, 1 * 20000)
}