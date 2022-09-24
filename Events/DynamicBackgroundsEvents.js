const Discord = require('discord.js')
const Canvas = require('canvas')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Backgrounds)

    // Results
    var response = []
    var lastModified = []
    var Counter = 0
    var number = 0

    // Handle the blogs
    const DynamicBackgrounds = async () => {

        // Checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("dynamicbackgrounds").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const credit = data.val().Credits
            const role = data.val().Role

            // If the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    // Constant response to make working easy
                    const backgroundsDATA = res.data.dynamicbackgrounds.backgrounds.backgrounds

                    // Storing the first start up
                    if(number === 0){

                        // Storing dynamicbackgrounds
                        Counter = 0
                        lastModified = await res.data.dynamicbackgrounds.lastModified
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            // If there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){
                                response[Counter] = backgroundsDATA[i]
                                Counter++
                            }
                        }

                        // Stop from storing again
                        number++
                    }

                    // If push is enabled
                    if(push.Status){
                        lastModified = ""
                        for(let i = 0; i < response.length; i++) if(response[i].key === push.Key) response[i] = []
                    }

                    // If the data was modified 
                    if(res.data.dynamicbackgrounds.lastModified !== lastModified){

                        // A data has been changed
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            // If there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){

                                //If the image is new
                                if(!JSON.stringify(response).includes(JSON.stringify(backgroundsDATA[i]))){

                                    // Registering fonts
                                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "italic"})

                                    // Create a canvas
                                    const backgroundIMG = await Canvas.loadImage(backgroundsDATA[i].backgroundimage)
                                    const canvas = Canvas.createCanvas(2560, 1440);
                                    const ctx = canvas.getContext('2d')

                                    // Draw the image
                                    ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                    // Add credits
                                    if(credit){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='left';
                                        ctx.font = '50px Burbank Big Condensed';
                                        ctx.fillText("FNBRMENA", 15, 55);
                                    }

                                    // Add attachments
                                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${backgroundsDATA[i].stage}.png`})

                                    // Send the image
                                    if(role.Status) await message.send({content: `<@&${role.roleID}> New ${backgroundsDATA[i].key} background has been added`, files: [att]})
                                    else await message.send({content: `New ${backgroundsDATA[i].key} background has been added`, files: [att]})
                                }
                            }
                        }

                        // Storing dynamicbackgrounds
                        Counter = 0
                        lastModified = await res.data.dynamicbackgrounds.lastModified
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            // If there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){
                                response[Counter] = backgroundsDATA[i]
                                Counter++
                            }
                        }

                        // Trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("dynamicbackgrounds").child("Push").update({
                            Status: false
                        })
                    }

                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'dynamic backgrounds')
        
                })
            }
        })
    }
    setInterval(DynamicBackgrounds, 1 * 20000)
}