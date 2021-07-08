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
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inisilizing variables
        if(lang === "en"){
            var DaysGone = " Days gone"
            var DaysLeft = " Days left"
            var CrewText = " Will be granted next shop reset"
            var weekText = "Activates at 5pm in Saudi Arabia time"
            var loading = "Loading data"
        }else if(lang === "ar"){
            var DaysGone = " يوم مضى"
            var DaysLeft = " يوم متبقي"
            var CrewText = " راح تحصل عليها مع تحديث الشوب القادم"
            var weekText = " راح تتفعل الساعه 5 العصر بتوقيت السعودية"
            var loading = "جاري تحميل البيانات"
        }

        //generating animation
        const generating = new Discord.MessageEmbed()
        generating.setColor(FNBRMENA.Colors("embed"))
        generating.setTitle(`${loading} ${loadingEmoji}`)
        message.channel.send(generating)
        .then( async msg => {

            //setting up moment js
            const Now = moment()

            //registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

            //creating canvas
            const canvas = Canvas.createCanvas(4000, 3600);
            const ctx = canvas.getContext('2d');

            //create background grediant
            const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

            //background grediant colors
            grediant.addColorStop(0, "#001C86")
            grediant.addColorStop(1, "#13FF00")

            //add the background color to ctx
            ctx.fillStyle = grediant

            //add the background
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            //change the opacity
            ctx.globalAlpha = 0.5

            const battlebus = await Canvas.loadImage('./assets/Bar/battlebus.png')
            ctx.drawImage(battlebus, 1500, 300, 1550, 2000)

            //change the opacity back
            ctx.globalAlpha = 1

            //add FNBRMENA credit
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='left';
            ctx.font = '200px Burbank Big Condensed'
            ctx.fillText("FNBRMENA", 50, 200)

            //starting to work tn the lines and progress inisilizing values
            var x = 500
            var y = 450

            const Christmas = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

                //Christmas icon
                const season = await Canvas.loadImage('./assets/Bar/Christmas.png')
                ctx.drawImage(season, x - 220, y - 20, 210, 210)

                //add the line color to ctx
                ctx.fillStyle = "white"

                //add the christmasPercent line
                ctx.fillRect(x, y, 3000, 150)

                //christmasPercent data
                var Ends = moment("2021-12-18")
                var Starts = moment("2020-12-18")
                var Gone = Now.diff(Starts, "days")
                var Left = Ends.diff(Now, "days")
                const Length = Left + Gone
                var christmasPercent = (Gone / Length) * 3000

                //gone
                ctx.fillRect(x, y + 180, christmasPercent, 25)

                //gone text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Gone + DaysGone, x + (christmasPercent / 2), y + 270)

                //left
                ctx.fillRect(x + christmasPercent, y - 50, 3000 - christmasPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Left + DaysLeft, x + christmasPercent + ((3000 - christmasPercent) / 2), y - 80)

                //christmasPercent progress grediant colors
                grd.addColorStop(0, "#89FDFF")
                grd.addColorStop(1, "#00F3FF")

                //add the christmasPercent progress grediant to ctx
                ctx.fillStyle = grd

                //add the progress line
                ctx.fillRect(x, y, christmasPercent, 150)

                if((Gone / Length) * 100 > 50){

                    //percent
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + christmasPercent) - 30, y + 110)

                }else{

                    //percent
                    ctx.fillStyle = '#000000';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + christmasPercent) + 30, y + 110)

                }

                //return the white color
                ctx.fillStyle = "white"

            }

            const Halloween = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

                //Halloween icon
                const season = await Canvas.loadImage('./assets/Bar/Halloween.png')
                ctx.drawImage(season, x - 220, y - 20, 190, 210)

                //add the line color to ctx
                ctx.fillStyle = "white"

                //add the Halloween line
                ctx.fillRect(x, y, 3000, 150)

                //halloweenPercent data
                var Ends = moment("2021-10-29")
                var Starts = moment("2020-10-29")
                var Gone = Now.diff(Starts, "days")
                var Left = Ends.diff(Now, "days")
                const Length = Left + Gone
                var halloweenPercent = (Gone / Length) * 3000

                //gone
                ctx.fillRect(x, y + 180, halloweenPercent, 25)

                //gone text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Gone + DaysGone, x + (halloweenPercent / 2), y + 270)

                //left
                ctx.fillRect(x + halloweenPercent, y - 50, 3000 - halloweenPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Left + DaysLeft, x + halloweenPercent + ((3000 - halloweenPercent) / 2), y - 80)

                //halloweenPercent progress grediant colors
                grd.addColorStop(0, "#5500FF")
                grd.addColorStop(1, "#FF00B9")

                //add the halloweenPercent progress grediant to ctx
                ctx.fillStyle = grd

                //add the progress line
                ctx.fillRect(x, y, halloweenPercent, 150)

                if((Gone / Length) * 100 > 50){

                    //percent
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + halloweenPercent) - 30, y + 110)

                }else{

                    //percent
                    ctx.fillStyle = '#000000';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + halloweenPercent) + 30, y + 110)

                }

                //return the white color
                ctx.fillStyle = "white"

            }

            const BirthdaySTW = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

                //birthday icon
                const season = await Canvas.loadImage('./assets/Bar/HBDSTW.png')
                ctx.drawImage(season, x - 220, y - 20, 210, 210)

                //add the line color to ctx
                ctx.fillStyle = "white"

                //add the birthday line
                ctx.fillRect(x, y, 3000, 150)

                //birthday data
                var Ends = moment("2021-07-25")
                var Starts = moment("2020-07-25")
                var Gone = Now.diff(Starts, "days")
                var Left = Ends.diff(Now, "days")
                const Length = Left + Gone
                var birthdayPercent = (Gone / Length) * 3000

                //gone
                ctx.fillRect(x, y + 180, birthdayPercent, 25)

                //gone text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Gone + DaysGone, x + (birthdayPercent / 2), y + 270)

                //left
                ctx.fillRect(x + birthdayPercent, y - 50, 3000 - birthdayPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Left + DaysLeft, x + birthdayPercent + ((3000 - birthdayPercent) / 2), y - 80)

                //season progress grediant colors
                grd.addColorStop(0, "#000000")
                grd.addColorStop(1, "#F000FF")

                //add the season progress grediant to ctx
                ctx.fillStyle = grd

                //add the progress line
                ctx.fillRect(x, y, birthdayPercent, 150)

                if((Gone / Length) * 100 > 50){

                    //percent
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + birthdayPercent) - 30, y + 110)

                }else{

                    //percent
                    ctx.fillStyle = '#000000';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + birthdayPercent) + 30, y + 110)

                }

                //return the white color
                ctx.fillStyle = "white"

            }

            const BirthdayBR = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

                //birthday icon
                const season = await Canvas.loadImage('./assets/Bar/HBD.png')
                ctx.drawImage(season, x - 220, y - 20, 220, 220)

                //add the line color to ctx
                ctx.fillStyle = "white"

                //add the birthday line
                ctx.fillRect(x, y, 3000, 150)

                //birthday data
                var Ends = moment("2021-09-26")
                var Starts = moment("2020-09-26")
                var Gone = Now.diff(Starts, "days")
                var Left = Ends.diff(Now, "days")
                const Length = Left + Gone
                var birthdayPercent = (Gone / Length) * 3000

                //gone
                ctx.fillRect(x, y + 180, birthdayPercent, 25)

                //gone text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Gone + DaysGone, x + (birthdayPercent / 2), y + 270)

                //left
                ctx.fillRect(x + birthdayPercent, y - 50, 3000 - birthdayPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Left + DaysLeft, x + birthdayPercent + ((3000 - birthdayPercent) / 2), y - 80)

                //season progress grediant colors
                grd.addColorStop(0, "#F000FF")
                grd.addColorStop(1, "#001BFF")

                //add the season progress grediant to ctx
                ctx.fillStyle = grd

                //add the progress line
                ctx.fillRect(x, y, birthdayPercent, 150)

                if((Gone / Length) * 100 > 50){

                    //percent
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + birthdayPercent) - 30, y + 110)

                }else{

                    //percent
                    ctx.fillStyle = '#000000';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((Gone / Length) * 100 | 0) + "%", (x + birthdayPercent) + 30, y + 110)

                }

                //return the white color
                ctx.fillStyle = "white"

            }

            const Season = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

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
                ctx.fillText(Gone + DaysGone, x + (seasonPercent / 2), y + 270)

                //left
                ctx.fillRect(x + seasonPercent, y - 50, 3000 - seasonPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(Left + DaysLeft, x + seasonPercent + ((3000 - seasonPercent) / 2), y - 80)

                //season progress grediant colors
                grd.addColorStop(0, "#0097FF")
                grd.addColorStop(1, "#AA00FF")

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

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

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
                ctx.fillText(Gone + DaysGone, x + (crewPercent / 2), y + 270)

                if(Left !== 0){
                    //left
                    ctx.fillRect(x + crewPercent, y - 50, 3000 - crewPercent, 25)

                    //left text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(Left + DaysLeft, x + crewPercent + ((3000 - crewPercent) / 2), y - 80)
                }else{
                    //left
                    ctx.fillRect(x + 2990, y - 50, 10, 25)

                    //left text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(Left + DaysLeft, x + 2999, y - 80)

                    //activates when?
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(CrewText, x + (3000 / 2), y + 95)
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

                //return the white color
                ctx.fillStyle = "white"

            }

            const Challenges = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

                //battlepass icon
                const bp = await Canvas.loadImage('./assets/Bar/bp.png')
                ctx.drawImage(bp, x - 220, y - 20, 200, 200)

                //add the next week challenges line
                ctx.fillRect(x, y, 3000, 150)

                //next challenges
                const Day = async () => {

                    moment.locale("en")

                    //Friday
                    if(Now.format("dddd") === "Friday"){
                        return [3, 4]
                    }
                    //Saturday
                    if(Now.format("dddd") === "Saturday"){
                        return [4, 3]
                    }
                    //Sunday
                    if(Now.format("dddd") === "Sunday"){
                        return [5, 2]
                    }
                    //Monday
                    if(Now.format("dddd") === "Monday"){
                        return [6, 1]
                    }
                    //Tuesday
                    if(Now.format("dddd") === "Tuesday"){
                        return [7, 0]
                    }
                    //Wednesday
                    if(Now.format("dddd") === "Wednesday"){
                        return [1, 6]
                    }
                    //Thursday
                    if(Now.format("dddd") === "Thursday"){
                        return [2, 5]
                    }
                }
                const Days = await Day()
                const Gone = Days[0]
                const Left = Days[1]
                const Length = Gone + Left
                const weekPercent = (Gone / Length) * 3000
                
                moment.locale(lang)

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
                ctx.fillText(Gone + DaysGone, x + (weekPercent / 2), y + 270)

                if(Left !== 0){
                    //left
                    ctx.fillRect(x + weekPercent, y - 50, 3000 - weekPercent, 25)

                    //left text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(Left + DaysLeft, x + weekPercent + ((3000 - weekPercent) / 2), y - 80)
                }else{
                    //left
                    ctx.fillRect(x + 2990, y - 50, 10, 25)

                    //left text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(Left + DaysLeft, x + 2999, y - 80)

                    //activates when?
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(weekText, x + (3000 / 2), y + 95)
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

                //return the white color
                ctx.fillStyle = "white"

            }

            const Superman = async (grd) => {

                //text
                if(lang === "en"){
                    ctx.font = '60px Burbank Big Condensed'
                }else if(lang === "ar"){
                    ctx.font = '60px Arabic'
                }

                //superman icon
                const superman = await Canvas.loadImage('./assets/Bar/superman.png')
                ctx.drawImage(superman, x - 220, y - 20, 200, 200)

                //add the next week challenges line
                ctx.fillRect(x, y, 3000, 150)

                moment.locale("en")

                //next challenges
                const Ends = moment("2021-08-13")
                const Starts = moment("2021-06-07")
                if(Number(Now.format("MM")) <= Number(Ends.format("MM"))){
                    var Gone = Now.diff(Starts, "days")
                    var Left = Ends.diff(Now, "days")
                }else{
                    var Gone = 65
                    var Left = 0
                }
                const Length = Gone + Left
                const secretSkinPercent = (Gone / Length) * 3000

                moment.locale(lang)

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
                ctx.fillText(Gone + DaysGone, x + (secretSkinPercent / 2), y + 270)

                if(Left !== 0){
                    //left
                    ctx.fillRect(x + secretSkinPercent, y - 50, 3000 - secretSkinPercent, 25)

                    //left text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(Left + DaysLeft, x + secretSkinPercent + ((3000 - secretSkinPercent) / 2), y - 80)
                }else{
                    //left
                    ctx.fillRect(x + 2990, y - 50, 10, 25)

                    //left text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(Left + DaysLeft, x + 2999, y - 80)

                    //activates when?
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.fillText(weekText, x + (3000 / 2), y + 95)
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

                //return the white color
                ctx.fillStyle = "white"

            }

            var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await BirthdaySTW(grd)

            y += 420
            grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await BirthdayBR(grd)

            y += 420
            var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await Christmas(grd)

            y += 420
            var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await Halloween(grd)
        
            y += 420
            grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await Season(grd)
            
            y += 420
            grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await Crew(grd)

            // y += 420
            // grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            // await Challenges(grd)

            y += 420
            grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)
            await Superman(grd)

            const att = new Discord.MessageAttachment(canvas.toBuffer(), 'progress.png')
            await message.channel.send(att)
            msg.delete()
        })
    }
}