const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const probe = require('probe-image-size')
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

        //request progress data
        const progressData = await FNBRMENA.Admin(admin, message, "", "Progress")

        //generating animation
        const generating = new Discord.MessageEmbed()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en") generating.setTitle(`Loading data ${loadingEmoji}`)
        else if(lang === "ar") generating.setTitle(`جاري تحميل البيانات ${loadingEmoji}`)
        message.channel.send(generating)
        .then( async msg => {

            //setting up moment js
            const Now = moment()

            //registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

            //progressData index
            var index = 0
            var grediantsIndex = 0
            var customImagesIndex = 0
            for(let i = 0; i < Object.keys(progressData).length; i++){
                if(Object.keys(progressData)[i] === 'progressData') index = i
                if(Object.keys(progressData)[i] === 'Gradiants') grediantsIndex = i
                if(Object.keys(progressData)[i] === 'customImages') customImagesIndex = i
            }

            //get how many bars r set to true [ACTIVE]
            var active = 0
            for(let i = 0; i < Object.keys(progressData[Object.keys(progressData)[index]]).length; i++){

                //response data
                var data = progressData[Object.keys(progressData)[index]][Object.keys(progressData[Object.keys(progressData)[index]])[i]].Status

                //if the status is true
                if(data) active += 1

            }

            //creating canvas
            const canvas = Canvas.createCanvas(4000, (active * 420) + 1000);
            const ctx = canvas.getContext('2d');

            //create background grediant
            const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

            //background grediant colors
            const backgroundGrediants = progressData[Object.keys(progressData)[grediantsIndex]]
            if(backgroundGrediants.length === 2){

                //add the grediands
                grediant.addColorStop(0, `#${backgroundGrediants[0]}`)
                grediant.addColorStop(1, `#${backgroundGrediants[1]}`)
            }else if(backgroundGrediants.length === 3){

                //add the grediands
                grediant.addColorStop(0, `#${backgroundGrediants[0]}`)
                grediant.addColorStop(0.5, `#${backgroundGrediants[1]}`)
                grediant.addColorStop(1, `#${backgroundGrediants[2]}`)
            }

            //add the background color to ctx
            ctx.fillStyle = grediant

            //add the background
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            //change the opacity
            ctx.globalAlpha = 0.5

            //customImages
            const customImagesData = progressData[Object.keys(progressData)[customImagesIndex]]
            for(let i = 0; i < customImagesData.length; i++){

                //if there is access to customImagesData
                if(customImagesData[i].Status){

                    //change the opacity from the database
                    ctx.globalAlpha = customImagesData[i].Opacity

                    //if probe in set to be true
                    if(customImagesData[i].probe){

                        //image dimensions
                        var dimensions = await probe(customImagesData[i].Image)

                        //set the height
                        var dimensionsH = dimensions.height
                        var dimensionsW = dimensions.width

                        //lowering the height
                        if(dimensionsH > canvas.height){
                            while(dimensionsH > canvas.height){

                                //decrease the height
                                dimensionsH -= 1
                                dimensionsW -= 0.75
                            }
                        }

                        //increase the height
                        if(dimensionsH < canvas.height){
                            while(dimensionsH < canvas.height){

                                //increase the height
                                dimensionsH += 1
                                dimensionsW += 0.75
                            }
                        }

                        //add the image
                        const customImages = await Canvas.loadImage(customImagesData[i].Image)
                        ctx.drawImage(customImages, customImagesData[i].X, customImagesData[i].Y, dimensionsW, dimensionsH)

                    }else{

                        //add the image
                        const customImages = await Canvas.loadImage(customImagesData[i].Image)
                        ctx.drawImage(customImages, customImagesData[i].X, customImagesData[i].Y, customImagesData[i].W, customImagesData[i].H)
                    }

                    //change the opacity back
                    ctx.globalAlpha = 1
                }
            }

            //add FNBRMENA credit
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='left';
            ctx.font = '200px Burbank Big Condensed'
            ctx.fillText("FNBRMENA", 50, 200)

            //starting to work tn the lines and progress inisilizing values
            var x = 500
            var y = 450

            //creating progress object
            const CreatingObj = async (grd, x, y, gone, left, length, objectPercent, colors, objectIcon,
                finishedStringEN, finishedStringAR) => {

                //font
                if(lang === "en") ctx.font = '60px Burbank Big Condensed'
                else if(lang === "ar") ctx.font = '60px Arabic'

                //objectIcon
                ctx.drawImage(objectIcon, x - 220, y - 20, 210, 210)

                //add the line background color to ctx
                ctx.fillStyle = "white"

                //add the objectPercent line
                ctx.fillRect(x, y, 3000, 150)

                //gone
                ctx.fillRect(x, y + 180, objectPercent, 25)

                //gone text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en") ctx.fillText(`${gone} Days gone`, x + (objectPercent / 2), y + 270)
                else if(lang === "ar") ctx.fillText(`${gone} يوم مضى`, x + (objectPercent / 2), y + 270)

                //left
                ctx.fillRect(x + objectPercent, y - 50, 3000 - objectPercent, 25)

                //left text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en") ctx.fillText(`${left} Days left`, x + objectPercent + ((3000 - objectPercent) / 2), y - 80)
                else if(lang === "ar") ctx.fillText(`${left} يوم متبقي`, x + objectPercent + ((3000 - objectPercent) / 2), y - 80)

                //objectPercent progress grediant colors
                if(colors.length === 2){

                    //add the grediands
                    grd.addColorStop(0, `#${colors[0]}`)
                    grd.addColorStop(1, `#${colors[1]}`)
                }else if(backgroundGrediants.length === 3){
    
                    //add the grediands
                    grd.addColorStop(0, `#${colors[0]}`)
                    grd.addColorStop(0.5, `#${colors[1]}`)
                    grd.addColorStop(1, `#${colors[2]}`)
                }

                //add the objectPercent progress grediant to ctx
                ctx.fillStyle = grd

                //add the progress line
                ctx.fillRect(x, y, objectPercent, 150)

                //add the finishedString if the progress at 100%
                if(left <= 0){

                    //check language
                    if(lang === "en" && finishedStringEN !== null){

                        //add the string in EN
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '100px Burbank Big Condensed'
                        ctx.fillText(finishedStringEN, x + (objectPercent / 2), y + 110)
                    }else if(lang === "ar" && finishedStringAR !== null){

                        //add the string in AR
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

                //return the white color
                ctx.fillStyle = "white"

            }

            //loop throw every progress
            for(let i = 0; i < Object.keys(progressData[Object.keys(progressData)[index]]).length; i ++){

                //response data
                var data = progressData[Object.keys(progressData)[index]][Object.keys(progressData[Object.keys(progressData)[index]])[i]]

                //if the bar is set to active
                if(data.Status){

                    //adding the gradiant
                    var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)

                    //get the object image
                    const objectIcon = await Canvas.loadImage(`./assets/Bar/${data.Path}.png`)

                    //inisilizing gone, left & objectPercent
                    const gone = Now.diff(moment(data.Starts), "days") 
                    const left = moment(data.Ends).diff(Now, "days")
                    const length = gone + left
                    const objectPercent = (gone / length) * 3000

                    //if there is finished string
                    let finishedStringEN = null
                    let finishedStringAR = null
                    if(data.finishedString !== undefined){
                        finishedStringEN = data.finishedString.EN
                        finishedStringAR = data.finishedString.AR
                    }

                    //calling the object
                    await CreatingObj(grd, x, y, gone, left, length, objectPercent, 
                        data.Colors, objectIcon, finishedStringEN, finishedStringAR)

                    y += 420

                }
            }

            //Crew Object
            const Ends = moment(`${Now.format("YYYY")}-${moment().add(1, 'months').format("MM")}-01`)
            const Starts = moment(Now.format("YYYY") + "-" + Now.format("MM") + "-01")
            var gone = Now.diff(Starts, "days")
            var left = Ends.diff(Now, "days")
            const length = left + gone
            var crewPercent = (gone / length) * 3000
            const crew = await Canvas.loadImage('./assets/Bar/crewEN.png')

            //adding the gradiant
            var grd = ctx.createLinearGradient(x, 1500, x + 1500, 3000)

            //calling the object
            await CreatingObj(grd, x, y, gone, left, length, crewPercent, 
                ['FF0064', 'FF0008'], crew)

            const att = new Discord.MessageAttachment(canvas.toBuffer(), 'progress.png')
            await message.channel.send(att)
            msg.delete()
        })
    }
}