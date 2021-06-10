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

        //change the opacity
        ctx.globalAlpha = 0.5

        const battlebus = await Canvas.loadImage('./assets/Bar/battlebus.png')
        ctx.drawImage(battlebus, 2000, 300, 900, 1200)

        //change the opacity back
        ctx.globalAlpha = 1

        //add FNBRMENA credit
        ctx.fillStyle = '#ffffff';
        ctx.textAlign='left';
        ctx.font = '150px Burbank Big Condensed'
        ctx.fillText("FNBRMENA", 50, 150)

        //starting to work tn the lines and progress inisilizing values
        var x = 500
        var y = 600

        const Season = async (grd) => {

            //season icon
            const season = await Canvas.loadImage('./assets/Bar/season.png')
            ctx.drawImage(season, x - 220, y - 20, 200, 200)

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
            grd.addColorStop(0, "#F000FF")
            grd.addColorStop(1, "#001BFF")

            //add the season progress grediant to ctx
            ctx.fillStyle = grd

            //add the progress line
            ctx.fillRect(x, y, seasonPercent, 150)

            if((Gone / Length) * 100 > 50){

                //percent
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='right';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + seasonPercent) - 30, y + 110)

            }else{

                //percent
                ctx.fillStyle = '#000000';
                ctx.textAlign='left';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + seasonPercent) + 30, y + 110)

            }

            //return the white color
            ctx.fillStyle = "white"

        }

        const Crew = async (grd) => {

            //crew icon
            const crew = await Canvas.loadImage('./assets/Bar/crewEN.png')
            ctx.drawImage(crew, x - 220, y - 20, 200, 200)

            //add the next crew challenges line
            ctx.fillRect(x, y, 3000, 150)

            //next crew
            if(Number(Now.format("MM")) >= 9){
                var Ends = moment(Now.format("YYYY") + "-" + `${Number(Now.format("MM")) + 1}` + "-01")
            }else{
                var Ends = moment(Now.format("YYYY") + "-" + `0${Number(Now.format("MM")) + 1}` + "-01")
            }
            const Starts = moment(Now.format("YYYY") + "-" + Now.format("MM") + "-01")
            var Gone = Now.diff(Starts, "days")
            var Left = Ends.diff(Now, "days")
            const Length = Left + Gone
            var crewPercent = (Gone / Length) * 3000

            //crew grediant colors
            grd.addColorStop(0, "#FF0064")
            grd.addColorStop(1, "#FF0008")

            //add the line color to ctx
            ctx.fillStyle = grd

            //add the progress
            ctx.fillRect(x, y, crewPercent, 150)

            //return the white color
            ctx.fillStyle = "white"

            //gone
            ctx.fillRect(x, y + 180, crewPercent, 25)

            //gone text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='center';
            ctx.font = '60px Burbank Big Condensed'
            ctx.fillText(Gone + " Days Gone", x + (crewPercent / 2), y + 270)

            if(Left !== 0){
                //left
                ctx.fillRect(x + crewPercent, y - 50, 3000 - crewPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText(Left + " Days Left", x + crewPercent + ((3000 - crewPercent) / 2), y - 80)
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
                ctx.fillText("Will be granted next shop reset", x + (3000 / 2), y + 95)
            }

            //percent
            if((Gone / Length) * 100 > 50){

                //percent
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='right';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + crewPercent) - 30, y + 110)

            }else{

                //percent
                ctx.fillStyle = '#000000';
                ctx.textAlign='left';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + crewPercent) + 30, y + 110)

            }

        }

        const Challenges = async (grd) => {

            //battlepass icon
            const bp = await Canvas.loadImage('./assets/Bar/bp.png')
            ctx.drawImage(bp, x - 220, y - 20, 200, 200)

            //add the next week challenges line
            ctx.fillRect(x, y, 3000, 150)

            //next challenges
            const Ends = moment().day(0 + 4)
            const Starts = moment().day(0 - 4)
            const Gone = Now.diff(Starts, "days")
            const Left = Ends.diff(Now, "days")
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

            //percent
            if((Gone / Length) * 100 > 50){

                //percent
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='right';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + weekPercent) - 30, y + 110)

            }else{

                //percent
                ctx.fillStyle = '#000000';
                ctx.textAlign='left';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + weekPercent) + 30, y + 110)

            }

        }

        const Superman = async (grd) => {

            //superman icon
            const superman = await Canvas.loadImage('./assets/Bar/superman.png')
            ctx.drawImage(superman, x - 220, y - 20, 200, 200)

            //add the next week challenges line
            ctx.fillRect(x, y, 3000, 150)

            //next challenges
            const Ends = moment("2021-08-13")
            const Starts = moment("2021-06-07")
            var Gone = Now.diff(Starts, "days")
            var Left = Ends.diff(Now, "days")
            const Length = Gone + Left
            const secretSkinPercent = (Gone / Length) * 3000

            //background grediant colors
            grd.addColorStop(0, "#0042FF")
            grd.addColorStop(1, "#FF0000")

            //add the line color to ctx
            ctx.fillStyle = grd

            //add the progress
            ctx.fillRect(x, y, secretSkinPercent, 150)

            //return the white color
            ctx.fillStyle = "white"

            //gone
            ctx.fillRect(x, y + 180, secretSkinPercent, 25)

            //gone text
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='center';
            ctx.font = '60px Burbank Big Condensed'
            ctx.fillText(Gone + " Days Gone", x + (secretSkinPercent / 2), y + 270)

            if(Left !== 0){
                //left
                ctx.fillRect(x + secretSkinPercent, y - 50, 3000 - secretSkinPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText(Left + " Days Left", x + secretSkinPercent + ((3000 - secretSkinPercent) / 2), y - 80)
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

            //percent
            if((Gone / Length) * 100 > 50){

                //percent
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='right';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + secretSkinPercent) - 30, y + 110)

            }else{

                //percent
                ctx.fillStyle = '#000000';
                ctx.textAlign='left';
                ctx.font = '100px Burbank Big Condensed'
                ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + secretSkinPercent) + 30, y + 110)

            }

        }
    
        var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
        await Season(grd)
        y += 420

        grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
        await Crew(grd)

        y += 420
        grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
        await Challenges(grd)

        y += 420
        grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
        await Superman(grd)

        const att = new Discord.MessageAttachment(canvas.toBuffer(), 'progress.png')
        await message.channel.send(att)

    }
}