const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Coinfigs/config.json')
const querystring = require('querystring')

module.exports = async (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Logs)

    //handle auth generating
    const Auth = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("auth").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().push

            //if generating access_token is enabled
            if(status){

                //setting up the db firestore
                var db = admin.firestore()

                //define a collection and extract its data
                const authData = await db.collection("authToken").doc("0").get()

                //check if the token has been expired
                if(moment(authData.data().accessToken.expires_at).diff(moment()) <= 0){

                    //request header
                    const header = {
                        'Content-Type':'application/x-www-form-urlencoded',     
                        'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='   
                    }

                    //request data
                    const body = querystring.stringify({
                        'grant_type':'device_auth',
                        'account_id': authData.data().deviceAuth.account_id,
                        'device_id': authData.data().deviceAuth.device_id,
                        'secret': authData.data().deviceAuth.secret,
                    })

                    //request access_token key
                    await FNBRMENA.Auth(header, body)
                    .then(async tokenData => {

                        //update the accessToken
                        const updateData = await db.collection("authToken").doc("0")
                        await updateData.update({
                            accessToken: {
                                access_token: tokenData.data.access_token,
                                expires_at: tokenData.data.expires_at
                            }

                        }).then(async () => {

                            let string = "\`\`\`yaml\n"
                            for(let i = 0; i < Object.keys(tokenData.data).length; i++){
                                string += `${Object.keys(tokenData.data)[i]}: ${Object.entries(tokenData.data)[i][1]}\n`
                            }
                            string += "\`\`\`"
                            
                            //new access token has been generated successfully
                            const success = new Discord.MessageEmbed()

                            //set color
                            success.setColor(FNBRMENA.Colors("embed"))

                            //set description
                            success.setDescription(`New access token has been generated:\n\n${string}`)

                            //send
                            message.send(success)

                        }).catch(async err => {
                            
                            let string = "\`\`\`yaml\n"
                            for(let i = 0; i < Object.keys(err.response.data).length; i++){
                                string += `${Object.keys(err.response.data)[i]}: ${Object.entries(err.response.data)[i][1]}\n`
                            }
                            string += "\`\`\`"

                            //faild to create new access token
                            const faild = new Discord.MessageEmbed()

                            //set color
                            faild.setColor(FNBRMENA.Colors("embed"))

                            //set description
                            faild.setDescription(`An error has occurred while creating a new access token:\n\n${string}`)

                            //send
                            message.send(faild)
                        })

                    }).catch(async err => {

                        let string = "\`\`\`yaml\n"
                        for(let i = 0; i < Object.keys(err.response.data).length; i++){
                            string += `${Object.keys(err.response.data)[i]}: ${Object.entries(err.response.data)[i][1]}\n`
                        }
                        string += "\`\`\`"

                        //faild to create new access token
                        const faild = new Discord.MessageEmbed()

                        //set color
                        faild.setColor(FNBRMENA.Colors("embed"))

                        //set description
                        faild.setDescription(`An error has occurred while creating a new access token:\n\n${string}`)

                        //send
                        message.send(faild)

                    })
                }
            }
        })
    }
    setInterval(Auth, 1 * 60000)
}