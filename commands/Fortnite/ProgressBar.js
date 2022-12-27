const moment = require('moment')
require('moment-timezone')
const Canvas = require('canvas')

module.exports = {
    commands: 'progress',
    type: 'Fortnite',
    descriptionEN: 'Generates a calendar for Fortnite future events.',
    descriptionAR: 'استخراج تقويمًا لأحداث Fortnite المستقبلية.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 15,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Request progress data
        const progressData = await FNBRMENA.Admin(admin, message, "", "Progress")

        // Generating animation
        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Loading data ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري تحميل البيانات ${emojisObject.loadingEmoji}`)
        const msg = await message.reply({embeds: [generating], components: [], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
        
        try {

            // Inislizing moment
            const Now = moment()

            // Registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

            // Get how many bars r set to true [ACTIVE]
            var active = 0
            for(let i = 0; i < Object.keys(progressData['progressData']).length; i++){

                // Response data
                var data = progressData['progressData'][Object.keys(progressData['progressData'])[i]].Status

                // If the status is true
                if(data) active += 1

            }

            // Creating canvas
            const canvas = Canvas.createCanvas(4000, (active * 420) + 1000);
            const ctx = canvas.getContext('2d');

            // Create background grediant
            const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

            // Get the upcoming events if there is one set to be active
            for(let i = 0; i < Object.keys(progressData['UpcomingEvents']).length; i++){

                // Constant to make the work easy
                const data = progressData['UpcomingEvents'][Object.keys(progressData['UpcomingEvents'])[i]]

                // If the object is set to be active
                if(data.Status){

                    // Loop throw every gradiants
                    grediant.addColorStop(0, `#${data.Gradiants[0]}`)
                    grediant.addColorStop(1, `#${data.Gradiants[1]}`)

                    // Add the background color to ctx
                    ctx.fillStyle = grediant
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // Loop throw every image
                    for(let x = 0; x < data.Images.length; x++){

                        // If the index is set to be active
                        if(data.Images[x].Status){

                            // Change the opacity from the database and check blur if enabled
                            ctx.globalAlpha = data.Images[x].Opacity

                            // Upload the image to canvas
                            const upcomingEventImage = await Canvas.loadImage(data.Images[x].Image)

                            // If scaling is enabled
                            if(data.Images[x].Scaling){

                                // Inislizing img width and height
                                let imgWidth = 0
                                let imgHeight = 0

                                // If imgWidth > canvas.width then start decreasing
                                if(imgWidth < canvas.width){

                                    // Try to sixe up the image
                                    let percentage = 1
                                    while(upcomingEventImage.height * (0.01 * percentage) <= canvas.height) percentage++

                                    // If width still low
                                    if(upcomingEventImage.width * (0.01 * percentage) <= canvas.width)
                                    while(upcomingEventImage.width * (0.01 * percentage) <= canvas.width) percentage++

                                    // Change the width and height
                                    imgHeight = upcomingEventImage.height * (0.01 * percentage)
                                    imgWidth = upcomingEventImage.width * (0.01 * percentage)
                                    
                                }else{

                                    // Try to sixe up the image
                                    let percentage = 1
                                    while(upcomingEventImage.height * (0.01 * percentage) <= canvas.height) percentage--

                                    // If width still low
                                    if(upcomingEventImage.width * (0.01 * percentage) <= canvas.width)
                                    while(upcomingEventImage.width * (0.01 * percentage) <= canvas.width) percentage--

                                    // Change the width and height
                                    imgHeight = upcomingEventImage.height * (0.01 * percentage)
                                    imgWidth = upcomingEventImage.width * (0.01 * percentage)

                                }

                                var xaxis = (canvas.width  - imgWidth) * 0.5
                                var yaxis = (canvas.height - imgHeight) * 0.5

                                // Drawimage
                                ctx.drawImage(upcomingEventImage, xaxis, yaxis, imgWidth, imgHeight)

                                // Trun off push if enabled
                                await admin.database().ref("ERA's").child("Progress").child("UpcomingEvents").child(`${Object.keys(progressData['UpcomingEvents'])[i]}`)
                                .child("Images").child(x).update({
                                    X: xaxis,
                                    Y: yaxis,
                                    W: imgWidth,
                                    H: imgHeight,
                                    Scaling: false
                                })

                            }else{

                                // Drawimage
                                ctx.drawImage(upcomingEventImage, data.Images[x].X, data.Images[x].Y, data.Images[x].W, data.Images[x].H)
                            }
                            

                            // Change the opacity back to 1
                            ctx.globalAlpha = 1
                        }
                    }

                    break
                }
            }

            // Add FNBRMENA credit
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'left';
            ctx.font = '200px Burbank Big Condensed'
            ctx.fillText("FNBRMENA", 50, 200)

            // Starting to work tn the lines and progress inisilizing values
            var x = 500
            var y = 450

            // Creating progress object
            const CreatingObj = async (grd, x, y, gone, goneText, left, leftText, length, objectPercent, 
                colors, image, finishedStringEN, finishedStringAR, previewDay) => {

                // Font
                if(userData.lang === "en") ctx.font = '60px Burbank Big Condensed'
                else if(userData.lang === "ar") ctx.font = '60px Arabic'

                // Add the image
                if(image.Status){
                    if(userData.lang === "en") var objectIcon = await Canvas.loadImage(image.Urls.EN)
                    else if(userData.lang === "ar") var objectIcon = await Canvas.loadImage(image.Urls.AR)
                    
                    // Check scalings
                    if(image.Scales.Status) ctx.drawImage(objectIcon, x - (image.Scales.W + image.Scales.X), (y + 75) - (image.Scales.H / 2), image.Scales.W, image.Scales.H)
                    else ctx.drawImage(objectIcon, x - (210 + image.Scales.X), (y + 75) - (210 / 2), 210, 210)
                }

                // Add the line background color to ctx
                ctx.fillStyle = "white"

                // Add the objectPercent line
                ctx.fillRect(x, y, 3000, 150)

                // Gone
                ctx.fillRect(x, y + 180, objectPercent, 25)

                // Gone & left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.fillText(`${goneText}`, x + (objectPercent / 2), y + 270)
                ctx.fillText(`${leftText}`, x + objectPercent + ((3000 - objectPercent) / 2), y - 80)

                // Left
                ctx.fillRect(x + objectPercent, y - 50, 3000 - objectPercent, 25)

                //objectPercent progress grediant colors
                if(colors.length === 2){

                    // Add the grediands
                    grd.addColorStop(0, `#${colors[0]}`)
                    grd.addColorStop(1, `#${colors[1]}`)
                }else if(backgroundGrediants.length === 3){
    
                    // Add the grediands
                    grd.addColorStop(0, `#${colors[0]}`)
                    grd.addColorStop(0.5, `#${colors[1]}`)
                    grd.addColorStop(1, `#${colors[2]}`)
                }

                // Add the objectPercent progress grediant to ctx
                ctx.fillStyle = grd

                // Add the progress line
                ctx.fillRect(x, y, objectPercent, 150)

                // Add the finishedString if the progress at 100%
                if(left <= previewDay){

                    // Check language
                    if(userData.lang === "en" && finishedStringEN !== null){

                        // Add the string in EN
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '100px Burbank Big Condensed'
                        ctx.fillText(finishedStringEN, x + (objectPercent / 2), y + 110)
                    }else if(userData.lang === "ar" && finishedStringAR !== null){

                        // Add the string in AR
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '100px Arabic'
                        ctx.fillText(finishedStringAR, x + (objectPercent / 2), y + 100)
                    }
                }

                if((gone / length) * 100 > 50){

                    //percent
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((gone / length) * 100 | 0) + "%", (x + objectPercent) - 30, y + 110)

                }else{

                    //percent
                    ctx.fillStyle = '#000000';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(((gone / length) * 100 | 0) + "%", (x + objectPercent) + 30, y + 110)

                }

                // Return the white color
                ctx.fillStyle = "white"

            }

            // Loop throw every progress
            for(let i = 0; i < Object.keys(progressData['progressData']).length; i ++){

                // Response data
                var data = progressData['progressData'][Object.keys(progressData['progressData'])[i]]

                // If the bar is set to active
                if(data.Status){

                    // Adding the gradiant
                    const grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)

                    // Inisilizing starts and ends durations
                    const durationEnds = moment.duration(moment.tz(data.Ends, userData.timezone).diff(moment.tz(Now, userData.timezone)))
                    const durationStarts = moment.duration(moment.tz(Now, userData.timezone).diff(moment.tz(data.Starts, userData.timezone)))

                    // Get days and subtract from duration
                    const leftDays = Number(durationEnds.asDays().toString().substring(0, durationEnds.asDays().toString().indexOf(".")))
                    const goneDays = Number(durationStarts.asDays().toString().substring(0, durationStarts.asDays().toString().indexOf(".")))

                    if(userData.lang === "en") var goneText = `${goneDays} Days gone`
                    else if(userData.lang === "ar") var goneText = `${goneDays} يوم مضى`
                    if(userData.lang === "en") var leftText = `${leftDays} Days left`
                    else if(userData.lang === "ar") var leftText = `${leftDays} يوم متبقي`

                    // Formating left
                    if(leftDays <= 10 && leftDays >= 1){
                        if(userData.lang === "en") leftText = `${leftDays} day(s) and ${durationEnds.hours()} hours left`
                        else if(userData.lang === "ar") leftText = `${leftDays} يوم و ${durationEnds.hours()} ساعة متبقية`

                    }else if(leftDays < 1){

                        // If only hours left
                        if(userData.lang === "en") leftText = `${durationEnds.hours()} hours and ${durationEnds.minutes()} minuets left`
                        else if(userData.lang === "ar") leftText = `${durationEnds.hours()} ساعة و ${durationEnds.minutes()} دقيقة متبيقة`
                    }

                    // Formating gone
                    if(goneDays <= 10 && goneDays >= 1){
                        if(userData.lang === "en") goneText = `${goneDays} day(s) and ${durationStarts.hours()} hours gone`
                        else if(userData.lang === "ar") goneText = `${goneDays} يوم و ${durationStarts.hours()} ساعة مضت`

                    }else if(goneDays < 1){
                        
                        // If only hours gone
                        if(userData.lang === "en") goneText = `${durationStarts.hours()} hours and ${durationStarts.minutes()} minuets gone`
                        else if(userData.lang === "ar") goneText = `${durationStarts.hours()} ساعة و ${durationStarts.minutes()} دقيقة مضت`
                    }

                    // If there is finished string
                    let finishedStringEN = null
                    let finishedStringAR = null
                    let previewDay = 0
                    if(data.finishedString !== undefined){
                        finishedStringEN = data.finishedString.finishedStringEN
                        finishedStringAR = data.finishedString.finishedStringAR
                        if(data.finishedString.DayOfPreview !== undefined) previewDay = data.finishedString.DayOfPreview
                    }

                    // Get object length and percentage
                    const length = goneDays + leftDays
                    const objectPercent = (goneDays / length) * 3000

                    // Calling the object
                    await CreatingObj(grd, x, y, goneDays, goneText, leftDays, leftText, length, objectPercent, 
                       data.Colors, data.Image, finishedStringEN, finishedStringAR, previewDay)

                    y += 420

                }
            }

            // Crew Object
            const Ends = moment.tz(moment(`${Now.format("YYYY")}-${moment().format("MM")}-01T00:00:00.000Z`), userData.timezone).add(1, 'months')
            const Starts = moment.tz(moment(`${Now.format("YYYY")}-${Now.format("MM")}-01T00:00:00.000Z`), userData.timezone)

            // Adding the gradiant
            const grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)

            // Inisilizing starts and ends durations
            const durationEnds = moment.duration(moment.tz(Ends, userData.timezone).diff(moment.tz(Now, userData.timezone)))
            const durationStarts = moment.duration(moment.tz(Now, userData.timezone).diff(moment.tz(Starts, userData.timezone)))

            // Get days and subtract from duration
            const leftDays = Number(durationEnds.asDays().toString().substring(0, durationEnds.asDays().toString().indexOf(".")))
            const goneDays = Number(durationStarts.asDays().toString().substring(0, durationStarts.asDays().toString().indexOf(".")))

            if(userData.lang === "en") var goneText = `${goneDays} Days gone`
            else if(userData.lang === "ar") var goneText = `${goneDays} يوم مضى`
            if(userData.lang === "en") var leftText = `${leftDays} Days left`
            else if(userData.lang === "ar") var leftText = `${leftDays} يوم متبقي`

            // Formating left
            if(leftDays <= 10 && leftDays >= 1){
                if(userData.lang === "en") leftText = `${leftDays} day(s) and ${durationEnds.hours()} hours left`
                else if(userData.lang === "ar") leftText = `${leftDays} يوم و ${durationEnds.hours()} ساعة متبقية`

            }else if(leftDays < 1){

                // If only hours left
                if(userData.lang === "en") leftText = `${durationEnds.hours()} hours and ${durationEnds.minutes()} minuets left`
                else if(userData.lang === "ar") leftText = `${durationEnds.hours()} ساعة و ${durationEnds.minutes()} دقيقة متبيقة`
            }

            // Formating gone
            if(goneDays <= 10 && goneDays >= 1){
                if(userData.lang === "en") goneText = `${goneDays} day(s) and ${durationStarts.hours()} hours gone`
                else if(userData.lang === "ar") goneText = `${goneDays} يوم و ${durationStarts.hours()} ساعة مضت`

            }else if(goneDays < 1){
                
                // If only hours gone
                if(userData.lang === "en") goneText = `${durationStarts.hours()} hours and ${durationStarts.minutes()} minuets gone`
                else if(userData.lang === "ar") goneText = `${durationStarts.hours()} ساعة و ${durationStarts.minutes()} دقيقة مضت`
            }

            // If there is finished string
            let finishedStringEN = `Will be available soon...`
            let finishedStringAR = `سوف تتاح قريبا...`
            let previewDay = 0

            // Get object length and percentage
            const length = leftDays + goneDays
            const crewPercent = (goneDays / length) * 3000

            // Calling the object
            await CreatingObj(grd, x, y, goneDays, goneText, leftDays, leftText, length, crewPercent, 
                ['FF0064', 'FF0008'], {
                Status: true,
                Urls: {
                    EN: 'https://cdn2.unrealengine.com/en-subscriptions-fn-crew-png-wordmark-2200x1400-582022337.png',
                    AR: 'https://cdn2.unrealengine.com/ar-subscriptions-fn-crew-png-wordmark-2200x1400-582022286.png'
                },
                Scales: {
                    Status: true,
                    X: 5,
                    W: 350,
                    H: 260,
                }
            }, finishedStringEN, finishedStringAR, previewDay)

            // Send the image
            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `progress.png`})
            msg.edit({embeds: [], components: [], files: [att]})
            .catch(err => {
                
                // Try sending it on jpg file format [LOWER QUALITY]
                var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: 'progress.jpg'})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })
            })

        }catch (err){
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
        }
    }
}
