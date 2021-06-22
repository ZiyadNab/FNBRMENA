const Discord = require('discord.js')
const axios = require('axios')
const key = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Set)

    //result
    var response = []
    var number = 0

    const Server = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("servers").once('value', async function (data) {

            //store the data
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === "true"){

                //request data
                axios.get('https://fn-api.com/api/status')
                .then(async res => {

                    if(number === 0){

                        //store data
                        //response = await res.data.data.status

                        //add sets names
                        number++
                    }

                    if(push === "true"){
                        response = []
                    }

                    //check data
                    if(res.data.data.status !== response){

                        //create embed
                        const servers = new Discord.MessageEmbed()

                        //add color
                        servers.setColor()
                        
                        //add title
                        servers.setTitle('Fortnite servers are ' + res.data.data.status + '!')

                        //description string
                        var string = ""
                        for(let i = 0; i < res.data.data.allowedActions.length; i++){
                            string += res.data.data.allowedActions[i] + '\n'
                        }

                        //add description
                        servers.setDescription(res.data.data.message + '\n\n**Allowed Actions**\n' + string)

                        if(res.data.data.status.toLowerCase() === "up"){
                            servers.setImage('https://i.imgur.com/nUoBZCy.jpeg')
                        }else if(res.data.data.status.toLowerCase() === "down"){
                            servers.setImage('https://i.imgur.com/rutqcEe.jpeg')
                        }else{
                            servers.setImage('https://i.imgur.com/5igHZCt.jpg')
                        }

                        //add footer
                        servers.setFooter(res.data.data.launcherInfo.appName)

                        //send
                        message.send(servers)

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("servers").update({
                            Push: "false"
                        })

                        //store data
                        response = await res.data.data.status
                       
                    }
                }).catch(err => {
                    console.log("The issue is in Set Events ", err)
                })
            }
        })
    }
    setInterval(Server, 1 * 60000)
}