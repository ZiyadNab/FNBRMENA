const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const axios = require('axios')
const Canvas = require('canvas')
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'npc',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

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

            //get random skin from the api
            const skin = await FNBRMENA.SearchType(lang, "outfit")
            .then( async res => {
                
                //get the length of the items
                const length = await res.data.items.length

                //get random item from the request
                const randomImage = Math.floor(Math.random() * length)

                //return data
                return res.data.items[randomImage].images.featured
            })

            console.log(skin)
            //add the featured left bottom
            const featured = await Canvas.loadImage(skin)
            ctx.drawImage(featured, 0, (canvas.height - 630), 630, 630)

            //send the message
            const att = new Discord.MessageAttachment(canvas.toBuffer(), `npc.png`)
            await message.channel.send(att)
        })
    }
}