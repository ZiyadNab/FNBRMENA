const Discord = require('discord.js')
const Canvas = require('canvas')
const probe = require('probe-image-size')
const config = require('../Coinfigs/config.json')

module.exports = (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Backgrounds)

    //result
    var BattleRoyaleDATA = []
    var SaveTheWorldDATA = []
    var CreativeDATA = []
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

                    //storing the first start up
                    if(number === 0){

                        //storing subgameinfo
                        BattleRoyaleDATA = await res.data.subgameinfo.battleroyale
                        SaveTheWorldDATA = await res.data.subgameinfo.savetheworld
                        CreativeDATA = await res.data.subgameinfo.creative

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push){

                        //if push is enabled for all
                        if(all){
                            BattleRoyaleDATA = []
                            SaveTheWorldDATA = []
                            CreativeDATA = []
                        }
                        //if push is enabled for battle royale
                        if(battleroyale) BattleRoyaleDATA = []

                        //if push is enabled for stw
                        if(savetheworld) SaveTheWorldDATA = []

                        //if push is enabled for creative
                        if(creative) CreativeDATA = []

                    }

                    //check if the mode is br
                    if(JSON.stringify(res.data.subgameinfo.battleroyale) !== JSON.stringify(BattleRoyaleDATA)){

                        //storing subgameinfo
                        BattleRoyaleDATA = await res.data.subgameinfo.battleroyale

                        //image dimensions
                        var dimensions = await probe(res.data.subgameinfo.battleroyale.image)

                        //canvas
                        const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                        const ctx = canvas.getContext('2d')

                        //add the image
                        const backgroundIMG = await Canvas.loadImage(res.data.subgameinfo.battleroyale.image)
                        ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                        //credits
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='left';
                        ctx.font = '40px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 10, 40)

                        //attachments
                        const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.subgameinfo.battleroyale.subgame}.png`)

                        //send the image
                        await message.send(`New ${res.data.subgameinfo.battleroyale.title} gamemode image selector has been added`, att)

                    }

                    //check if the mode is save the world
                    if(JSON.stringify(res.data.subgameinfo.savetheworld) !== JSON.stringify(SaveTheWorldDATA)){

                        //storing subgameinfo
                        SaveTheWorldDATA = await res.data.subgameinfo.savetheworld

                        //image dimensions
                        var dimensions = await probe(res.data.subgameinfo.savetheworld.image)

                        //canvas
                        const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                        const ctx = canvas.getContext('2d')

                        //add the image
                        const backgroundIMG = await Canvas.loadImage(res.data.subgameinfo.savetheworld.image)
                        ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                        //credits
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='left';
                        ctx.font = '40px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 10, 40)

                        //attachments
                        const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.subgameinfo.savetheworld.subgame}.png`)

                        //send the image
                        await message.send(`New ${res.data.subgameinfo.savetheworld.title} gamemode image selector has been added`, att)

                    }
                    

                    //check if the mode is creative
                    if(JSON.stringify(res.data.subgameinfo.creative) !== JSON.stringify(CreativeDATA)){

                        //storing subgameinfo
                        CreativeDATA = await res.data.subgameinfo.creative

                        //image dimensions
                        var dimensions = await probe(res.data.subgameinfo.creative.image)

                        //canvas
                        const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
                        const ctx = canvas.getContext('2d')

                        //add the image
                        const backgroundIMG = await Canvas.loadImage(res.data.subgameinfo.creative.image)
                        ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                        //credits
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='left';
                        ctx.font = '40px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 10, 40)

                        //attachments
                        const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.subgameinfo.creative.subgame}.png`)

                        //send the image
                        await message.send(`New ${res.data.subgameinfo.creative.title} gamemode image selector has been added`, att)

                    }

                    //trun off push if enabled
                    await admin.database().ref("ERA's").child("Events").child("subgameinfo").child("Push").update({
                        Push: false
                    })
                    
                }).catch(err => {
                    console.log("The issue is in SubGameInfo Events ", err)
                })
            }
        })
    }
    setInterval(SubGameInfo, 1 * 20000)
}