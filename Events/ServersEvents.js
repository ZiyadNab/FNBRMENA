const Discord = require('discord.js')
const axios = require('axios')
const key = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Servers)

    //result
    var response = []
    var number = 0

    const Server = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("servers").once('value', async function (data) {

            //store the data
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push

            //if the event is set to be true [ON]
            if(status){

                //request the token
                const token = await axios.get('https://api.nitestats.com/v1/epic/bearer')

                //request data
                await axios.get('http://lightswitch-public-service-prod.ol.epicgames.com/lightswitch/api/service/fortnite/status',
                {headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token.data.accessToken}`}})
                .then(async res => {

                    if(number === 0){

                        //store data
                        response = await res.data.status

                        //add sets names
                        number++
                    }

                    if(push){
                        response = []
                    }

                    //check data
                    if(res.data.status !== response){

                        //create embed
                        const servers = new Discord.MessageEmbed()

                        //add color
                        servers.setColor('#00ffff')
                        
                        //add title
                        servers.setTitle('Fortnite servers are ' + res.data.status + '!')

                        //description string
                        var string = ""
                        if(res.data.allowedActions.length !== 0){
                            for(let i = 0; i < res.data.allowedActions.length; i++){
                                string += `\`${res.data.data.allowedActions[i]}\n\``
                            }
                        }else{
                            string += `\`No data\``
                        }

                        //add description
                        servers.setDescription(res.data.message + '\n\n**Allowed Actions**\n' + string)

                        if(res.data.status.toLowerCase() === "up") servers.setImage('https://imgur.com/Q6TA03N.png')
                        else if(res.data.status.toLowerCase() === "down") servers.setImage('https://imgur.com/sm2JZhX.png')
                        else servers.setImage('https://i.imgur.com/OuV0nHn.jpg')

                        //add footer
                        servers.setFooter(res.data.launcherInfoDTO.appName)

                        //send
                        message.send(servers)

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("servers").update({
                            Push: false
                        })

                        //store data
                        response = await res.data.status
                       
                    }
                }).catch(err => {
                    console.log("The issue is in Servers Events ", err)
                })
            }
        })
    }
    setInterval(Server, 1 * 20000)
}