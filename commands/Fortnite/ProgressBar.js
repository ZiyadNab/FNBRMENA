const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const axios = require('axios');
const moment = require('moment')
const Canvas = require('canvas')

module.exports = {
    commands: 'progress',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

        //creating canvas
        const canvas = Canvas.createCanvas(4000, 1800);
        const ctx = canvas.getContext('2d');

        //create background grediant
        const grd = ctx.createLinearGradient(0, 3500, 3900, 0)

        //background grediant colors
        grd.addColorStop(0, "#00FF7C")
        grd.addColorStop(1, "#00FFF7")

        //add the color to ctx
        ctx.fillStyle = grd

        //add the background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //add FNBRMENA credit
        ctx.fillStyle = '#ffffff';
        ctx.textAlign='left';
        ctx.font = '150px Burbank Big Condensed'
        ctx.fillText("FNBRMENA", 50, 150)

        const att = new Discord.MessageAttachment(canvas.toBuffer(), 'progress.png')
        await message.channel.send(att)

    }
}