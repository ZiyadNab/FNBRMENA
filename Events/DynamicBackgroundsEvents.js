const axios = require('axios')
const Discord = require('discord.js')
const Canvas = require('canvas')
const probe = require('probe-image-size')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
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

            //store aceess
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === true){

                //request data
                axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game`)
                .then(async res => {

                    //constant to make woring easy
                    const backgroundsDATA = res.data.dynamicbackgrounds.backgrounds.backgrounds

                    //storing the first start up
                    if(number === 0){

                        //storing dynamicbackgrounds
                        Counter = 0
                        lastModified = await res.data.dynamicbackgrounds.lastModified
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            //if there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){
                                response[Counter] = backgroundsDATA[i].backgroundimage
                                Counter++
                            }
                        }

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push){
                        lastModified = ""
                        response[0] = []
                    }

                    //if the data was modified 
                    if(res.data.dynamicbackgrounds.lastModified !== lastModified){

                        //a data has been changed
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            //if there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){

                                //if the image is new
                                if(!response.includes(backgroundsDATA[i].backgroundimage)){

                                    //registering fonts
                                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700"})

                                    //image dimensions
                                    var dimensions = await probe(backgroundsDATA[i].backgroundimage)

                                    //canvas
                                    const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                                    const ctx = canvas.getContext('2d')

                                    //add the image
                                    const backgroundIMG = await Canvas.loadImage(backgroundsDATA[i].backgroundimage)
                                    ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                    //credits
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText("FNBRMENA", 15, 55)

                                    //attachments
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${backgroundsDATA[i].stage}.png`)

                                    //send the image
                                    await message.send(`New ${backgroundsDATA[i].key} background has been added`, att)
                                }
                            }
                        }

                        //storing dynamicbackgrounds
                        Counter = 0
                        lastModified = await res.data.dynamicbackgrounds.lastModified
                        for(let i = 0; i < backgroundsDATA.length; i++){

                            //if there is an image
                            if(backgroundsDATA[i].backgroundimage !== undefined){
                                response[Counter] = backgroundsDATA[i].backgroundimage
                                Counter++
                            }
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("dynamicbackgrounds").update({
                            Push: false
                        })
                    }

                }).catch(err => {
                    console.log("The issue is in DynamicBackgrounds Events ", err)
                })
            }
        })
    }
    setInterval(DynamicBackgrounds, 1 * 20000)
}