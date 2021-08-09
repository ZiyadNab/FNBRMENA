const Discord = require('discord.js')
const Canvas = require('canvas')
const probe = require('probe-image-size')
const config = require('../Coinfigs/config.json')

module.exports = (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Backgrounds)

    //result
    var response = []
    var lastModified = []
    var number = 0

    //handle the blogs
    const SubGameInfo = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("subgameinfo").once('value', async function (data) {

            //store aceess
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push.Push
            const battleroyale = data.val().Push.battleroyale
            const savetheworld = data.val().Push.savetheworld
            const creative = data.val().Push.creative
            const all = data.val().Push.all

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    //constant response to make working easy
                    const subgameinfoDATA = res.data.subgameinfo

                    //storing the first start up
                    if(number === 0){

                        //storing subgameinfo
                        lastModified = await subgameinfoDATA.lastModified
                        response[0] = await subgameinfoDATA.battleroyale
                        response[1] = await subgameinfoDATA.savetheworld
                        response[2] = await subgameinfoDATA.creative

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push){

                        //if push is enabled for all
                        if(all){

                            lastModified = ""

                            //reset br
                            response[0] = {
                                subgame: "battleroyale"
                            }

                            //reset stw
                            response[1] = {
                                subgame: "savetheworld"
                            }

                            //reset creative
                            response[2] = {
                                subgame: "creative"
                            }

                        }else{

                            //if push is enabled for battle royale
                            if(battleroyale){
                                lastModified = ""
                                response[0] = {
                                    subgame: "battleroyale"
                                }
                            }

                            //if push is enabled for stw
                            if(savetheworld){
                                lastModified = ""
                                response[1] = {
                                    subgame: "savetheworld"
                                }
                            }

                            //if push is enabled for creative
                            if(creative){
                                lastModified = ""
                                response[2] = {
                                    subgame: "creative"
                                }
                            }
                        }
                    }

                    //if the data was modified 
                    if(subgameinfoDATA.lastModified !== lastModified){

                        //registering fonts
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700"})

                        //applytext
                        const applyTextTitle = (canvas, text) => {
                            const ctx = canvas.getContext('2d');
                            let fontSize = 75;
                            do {
                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`

                            } while (ctx.measureText(text).width > 450);
                            return ctx.font;
                        }

                        //applytext
                        const applyTextDescription = (canvas, text) => {
                            const ctx = canvas.getContext('2d');
                            let fontSize = 75;
                            do {
                                if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                                else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`

                            } while (ctx.measureText(text).width > 450);
                            return ctx.font;
                        }

                        //a data has been changed
                        for(let i = 0; i < response.length; i++){

                            //check if the mode is battle royale
                            if(response[i].subgame === "battleroyale"){

                                //if the image is new
                                if(subgameinfoDATA.battleroyale.image !== response[i].image){

                                    //image dimensions
                                    var dimensions = await probe(subgameinfoDATA.battleroyale.image)

                                    //canvas
                                    const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                                    const ctx = canvas.getContext('2d')

                                    //add the image
                                    const backgroundIMG = await Canvas.loadImage(subgameinfoDATA.battleroyale.image)
                                    ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                    //credits
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '40px Burbank Big Condensed'
                                    ctx.fillText("FNBRMENA", 10, 40)

                                    //attachments
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${subgameinfoDATA.battleroyale.subgame}.png`)

                                    //send the image
                                    await message.send(`New ${subgameinfoDATA.battleroyale.title} gamemode image selector has been added`, att)
                                }
                            }

                            //check if the mode is save the world
                            if(response[i].subgame === "savetheworld"){

                                //if the image is new
                                if(subgameinfoDATA.savetheworld.image !== response[i].image){

                                    //image dimensions
                                    var dimensions = await probe(subgameinfoDATA.savetheworld.image)

                                    //canvas
                                    const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                                    const ctx = canvas.getContext('2d')

                                    //add the image
                                    const backgroundIMG = await Canvas.loadImage(subgameinfoDATA.savetheworld.image)
                                    ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                    //credits
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '40px Burbank Big Condensed'
                                    ctx.fillText("FNBRMENA", 10, 40)

                                    //attachments
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${subgameinfoDATA.savetheworld.subgame}.png`)

                                    //send the image
                                    await message.send(`New ${subgameinfoDATA.savetheworld.title} gamemode image selector has been added`, att)
                                }
                            }

                            //check if the mode is creative
                            if(response[i].subgame === "creative"){

                                //if the image is new
                                if(subgameinfoDATA.creative.image !== response[i].image){

                                    //image dimensions
                                    var dimensions = await probe(subgameinfoDATA.creative.image)

                                    //canvas
                                    const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                                    const ctx = canvas.getContext('2d')

                                    //add the image
                                    const backgroundIMG = await Canvas.loadImage(subgameinfoDATA.creative.image)
                                    ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                    //credits
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '40px Burbank Big Condensed'
                                    ctx.fillText("FNBRMENA", 10, 40)

                                    //attachments
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${subgameinfoDATA.creative.subgame}.png`)

                                    //send the image
                                    await message.send(`New ${subgameinfoDATA.creative.title} gamemode image selector has been added`, att)
                                }
                            }
                        }

                        //storing subgameinfo
                        lastModified = await subgameinfoDATA.lastModified
                        response[0] = await subgameinfoDATA.battleroyale
                        response[1] = await subgameinfoDATA.savetheworld
                        response[2] = await subgameinfoDATA.creative

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("subgameinfo").child("Push").update({
                            Push: false
                        })
                    }

                }).catch(err => {
                    console.log("The issue is in SubGameInfo Events ", err)
                })
            }
        })
    }
    setInterval(SubGameInfo, 1 * 20000)
}