const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
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

        //setting up moment js
        const Now = moment()

        //registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

        //creating canvas
        const canvas = Canvas.createCanvas(4000, 2500);
        const ctx = canvas.getContext('2d');

        //create background grediant
        const grediant = ctx.createLinearGradient(0, 3500, 3900, 0)

        //background grediant colors
        grediant.addColorStop(0, "#00FF7C")
        grediant.addColorStop(1, "#00FFF7")

        //add the background color to ctx
        ctx.fillStyle = grediant

        //add the background
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //add FNBRMENA credit
        ctx.fillStyle = '#ffffff';
        ctx.textAlign='left';
        ctx.font = '150px Burbank Big Condensed'
        ctx.fillText("FNBRMENA", 50, 150)

        //starting to work tn the lines and progress inisilizing values
        var x = 500
        var y = 600

        const Season = async (grd) => {

            //add the line color to ctx
            ctx.fillStyle = "white"

            //add the season line
            ctx.fillRect(x, y, 3000, 150)

            //season data
            var Ends = moment("2021-09-12")
            var Starts = moment("2021-06-07")
            var Gone = Now.diff(Starts, "days")
            var Left = Ends.diff(Now, "days")
            const Length = Left + Gone
            var seasonPercent = (Gone / Length) * 3000

            //gone
            ctx.fillRect(x, y + 180, seasonPercent, 25)

            //gone text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='center';
            ctx.font = '60px Burbank Big Condensed'
            ctx.fillText(Gone + " Days Gone", x + (seasonPercent / 2), y + 270)

            //left
            ctx.fillRect(x + seasonPercent, y - 50, 3000 - seasonPercent, 25)

            //left text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='center';
            ctx.font = '60px Burbank Big Condensed'
            ctx.fillText(Left + " Days Left", x + seasonPercent + ((3000 - seasonPercent) / 2), y - 80)

            //season progress grediant colors
            grd.addColorStop(0, "#3A00FF")
            grd.addColorStop(1, "#7400FF")

            //add the season progress grediant to ctx
            ctx.fillStyle = grd

            //add the progress line
            ctx.fillRect(x, y, seasonPercent, 150)

            //return the white color
            ctx.fillStyle = "white"

        }

        const Challenges = async () => {

            //add the next week challenges line
            ctx.fillRect(x, y, 3000, 150)

            //next challenges
            const Ends = moment().day(0 + 4)
            const Starts = moment().day(0 - 4)
            var Gone = Now.diff(Starts, "days")
            var Left = Ends.diff(Now, "days")
            const Length = Gone + Left
            const weekPercent = (Gone / Length) * 3000

            //background grediant colors
            grd.addColorStop(0, "#FF8700")
            grd.addColorStop(1, "#FFD500")

            //add the line color to ctx
            ctx.fillStyle = grd

            //add the progress
            ctx.fillRect(x, y, weekPercent, 150)

            //return the white color
            ctx.fillStyle = "white"

            //gone
            ctx.fillRect(x, y + 180, weekPercent, 25)

            //gone text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='center';
            ctx.font = '60px Burbank Big Condensed'
            ctx.fillText(Gone + " Days Gone", x + (weekPercent / 2), y + 270)

            if(Left !== 0){
                //left
                ctx.fillRect(x + weekPercent, y - 50, 3000 - weekPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText(Left + " Days Left", x + weekPercent + ((3000 - weekPercent) / 2), y - 80)
            }else{
                //left
                ctx.fillRect(x, y - 50, 3000, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText(Left + " Days Left", x + (3000 / 2), y - 80)

                //activates when?
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText("Activates at 5pm in Saudi Arabia time", x + (3000 / 2), y + 95)
            }

        }

        //add the battlepass next opens line
        // y += 350
        // ctx.fillRect(x, y, 3000, 150)

        // //add the next crew line
        // y += 350
        // ctx.fillRect(x, y, 3000, 150)
    
        var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
        await Season(grd)
        y += 420
        grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
        await Challenges(grd)

        const att = new Discord.MessageAttachment(canvas.toBuffer(), 'progress.png')
        await message.channel.send(att)

    }
}