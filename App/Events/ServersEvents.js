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
            const push = data.val().Push
            const role = data.val().Role

            //if the event is set to be true [ON]
            if(status){

                //request the token
                axios.get(`https://fnbrmena.com/api/v1/auth/get/Android`)
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

                            if(res.data.status.toLowerCase() === "up") serversStatusEmbed.setImage('https://i.ibb.co/qmWWrd6/Q6TA03N.jpg')
                            else if(res.data.status.toLowerCase() === "down") serversStatusEmbed.setImage('https://i.ibb.co/JxYZpj2/sm2JZhX.jpg')
                            else serversStatusEmbed.setImage('https://i.ibb.co/9vLdQtD/OuV0nHn.jpg')

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