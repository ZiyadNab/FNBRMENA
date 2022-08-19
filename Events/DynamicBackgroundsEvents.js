const Discord = require('discord.js')
const Canvas = require('canvas')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Backgrounds)

    //result
    var response = []
    var lastModified = []
    var Counter = 0
    var number = 0

    //handle the blogs
    const DynamicBackgrounds = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("dynamicbackgrounds").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const credit = data.val().Credits

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    //constant response to make working easy
                    const backgroundsDATA = res.data.dynamicbackgrounds.backgrounds.backgrounds

                    //storing the first start up
                    if(number === 0){

                        //storing dynamicbackgrounds
                        Counter = 0
                        lastModified = await res.data.dynamicbackgrounds.lastModified
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            //if there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){
                                response[Counter] = backgroundsDATA[i]
                                Counter++
                            }
                        }

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push.Status){
                        lastModified = ""
                        for(let i = 0; i < response.length; i++) if(response[i].key === push.Key) response[i] = []
                    }

                    //if the data was modified 
                    if(res.data.dynamicbackgrounds.lastModified !== lastModified){

                        //a data has been changed
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            //if there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){

                                //if the image is new
                                if(!JSON.stringify(response).includes(JSON.stringify(backgroundsDATA[i]))){

                                    //registering fonts
                                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "italic"})

                                    //canvas
                                    const backgroundIMG = await Canvas.loadImage(backgroundsDATA[i].backgroundimage)
                                    const canvas = Canvas.createCanvas(backgroundIMG.width, backgroundIMG.height);
                                    const ctx = canvas.getContext('2d')

                                    //draw the image
                                    ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                    //credits
                                    if(credit){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='left';
                                        ctx.font = '50px Burbank Big Condensed';
                                        ctx.fillText("FNBRMENA", 15, 55);
                                    }

                                    //attachments
                                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${backgroundsDATA[i].stage}.png`})

                                    //send the image
                                    await message.send({content: `New ${backgroundsDATA[i].key} background has been added`, files: [att]})
                                }
                            }
                        }

                        //storing dynamicbackgrounds
                        Counter = 0
                        lastModified = await res.data.dynamicbackgrounds.lastModified
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            //if there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){
                                response[Counter] = backgroundsDATA[i]
                                Counter++
                            }
                        }

                        //trun off push if enabled
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