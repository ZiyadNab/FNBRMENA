const Canvas = require('canvas')

module.exports = {
    commands: 'npc',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data
        FNBRMENA.NPC(lang, "true")
        .then(async res => {

            //generating animation
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Loading a total ${res.data.npc.length} ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${res.data.npc.length} ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                //create canvas
                const canvas = Canvas.createCanvas(2048, 2048)
                const ctx = canvas.getContext('2d')

                //add the map image
                FNBRMENA.Map(lang)
                .then(async map => {

                    //add the map image
                    const mapImage = await Canvas.loadImage(map.data.data.images.pois)
                    ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height)

                    //add the border
                    const border = await Canvas.loadImage('./assets/NPC/border.png')
                    ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                    //add the pin to locations
                    for(let i = 0; i < res.data.npc.length; i++){

                        var x = res.data.npc[i].spawnLocations.locations[0].x - (150 / 2)
                        var y = res.data.npc[i].spawnLocations.locations[0].y - 150

                        //if the location is in range
                        if(y > 20){

                            //add the pin based on the npc location
                            const npc = await Canvas.loadImage('./assets/NPC/pin.png')
                            ctx.drawImage(npc, x, y, 150, 150)

                            //add the pin based on the npc location
                            const featured = await Canvas.loadImage(res.data.npc[i].images.sidePanel)
                            ctx.drawImage(featured, x, y - 50, 150, 150)

                            //add the pin based on the npc location
                            const npcBorder = await Canvas.loadImage('./assets/NPC/pinBorder.png')
                            ctx.drawImage(npcBorder, x, y, 150, 150)

                        }else{

                            y += 150

                            //add the pin based on the npc location
                            //const npc = await Canvas.loadImage('./assets/NPC/flipedPIN.png')
                            //ctx.drawImage(npc, x, y, 150, 150)

                            //add the pin based on the npc location
                            //const featured = await Canvas.loadImage(res.data.npc[i].images.sidePanel)
                            //ctx.drawImage(featured, x, y, 150, 150)

                        }
                    }

                    //send the message
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `npc.png`)
                    await message.channel.send(att)
                    msg.delete()
                })
            })
        })
    }
}