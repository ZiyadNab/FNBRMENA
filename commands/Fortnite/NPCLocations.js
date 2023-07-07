const Canvas = require('canvas')

module.exports = {
    commands: 'npc',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        if(args.length === 0){

            //request data
            FNBRMENA.NPC('en', true)
            .then(async res => {

                //generating animation
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading a total ${res.data.npc.length} ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${res.data.npc.length} ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then(async msg => {

                    //create canvas
                    const canvas = Canvas.createCanvas(2048, 2048)
                    const ctx = canvas.getContext('2d')

                    //add the map images
                    const mapImage = await Canvas.loadImage(`https://media.fortniteapi.io/images/map.png?showPOI=false&lang=${userData.lang}`)
                    ctx.drawImage(mapImage, 0, 0 , canvas.width, canvas.height)

                    //fnbrmena border
                    const border = await Canvas.loadImage('./assets/NPC/border.png')
                    ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                    //loop throw every NPC
                    for(let i = 0; i < res.data.npc.length; i++){

                        if(res.data.npc[i].spawnLocations.length != 0){

                            //get the npc data by his outfit name
                            const NPCOutfitData = await FNBRMENA.Search("en", "name", res.data.npc[i].displayName)

                            //define the npc location variable
                            const Location = res.data.npc[i].spawnLocations[res.data.npc[i].spawnLocations.length - 1].locations[0]

                            //add the pin for the npc location
                            try{
                                const npcPIN = await Canvas.loadImage(`./assets/NPC/Rarities/${NPCOutfitData.data.items[0].rarity.id}.png`)
                                ctx.drawImage(npcPIN, Location.x - 100, Location.y - 200, 200, 200)
                            }catch{
                                const npcPIN = await Canvas.loadImage(`./assets/NPC/Rarities/Common.png`)
                                ctx.drawImage(npcPIN, Location.x - 100, Location.y - 200, 200, 200)
                            }

                            //save the ctx
                            ctx.save()

                            //draw a circle and clip it
                            ctx.beginPath()
                            ctx.arc(Location.x, Location.y - 122, 72.5, 0 * Math.PI, 2 * Math.PI);
                            ctx.clip()

                            //draw the npc img
                            const npcIMG = await Canvas.loadImage(res.data.npc[i].images.entryList)
                            ctx.drawImage(npcIMG, Location.x - 75, Location.y - 200, 150, 150)

                            //restoe the clip
                            ctx.restore()
                        }
                    }

                    //send the message
                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `npc.png`)
                    await message.reply({files: [att]})
                    msg.delete()
                    
                }).catch(err => {
                    console.log(err)
                    FNBRMENA.Logs(admin, client, Discord, message, alias, lang, text, err, errorEmoji)
                    
                })

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, lang, text, err, errorEmoji)
                
            })

        }else{

            //request data
            FNBRMENA.NPC("en", false)
            .then(async res => {

                //npc data index
                const NPCFinder = res.data.npc.filter(catched => {
                    if(catched.displayName.toLowerCase() === text.toLowerCase()) return catched.id
                })

                if(NPCFinder.length){
                    const npcData = res.data.npc.filter(catched => {
                        if(NPCFinder[0].id === catched.id) return catched.id
                    })
    
                    //generating animation
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") generating.setTitle(`Get data about ${npcData[0].displayName} ${loadingEmoji}`)
                    else if(lang === "ar") generating.setTitle(`تحميل معلومات ${npcData[0].displayName} ${loadingEmoji}`)
                    message.reply({embeds: [generating]})
                    .then(async msg => {
    
                        
                        
                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, lang, text, err, errorEmoji)
                        
                    })
                }else{

                    //if there is no pois found
                    const noNPCsFoundError = new Discord.EmbedBuilder()
                    noNPCsFoundError.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") noNPCsFoundError.setTitle(`No NPCs has been found ${errorEmoji}.`)
                    else if(lang === "ar") noNPCsFoundError.setTitle(`لا يمكنني العثور على بوتات ${errorEmoji}.`)
                    message.reply({embeds: [noNPCsFoundError]})

                }

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, lang, text, err, errorEmoji)
                
            })
        }
    }
}