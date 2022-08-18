const moment = require('moment')
require('moment-timezone')
const Canvas = require('canvas')

module.exports = {
    commands: 'section',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //generating animation
        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Loading sections... ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري تحميل الأقسام... ${emojisObject.loadingEmoji}`)
        message.reply({embeds: [generating]})
        .then(async msg => {
            
            //get the sections data from database
            const SectionsData = await FNBRMENA.Admin(admin, message, "", "ShopSections")

            //data minpulator
            const JSONresponse = async (Sections) => {

                //define json response and its requirments
                var Counter = 0
                var JSON = []

                //get the section tabs and add them to a string
                while(Sections.length !== 0){

                    //defined tabs and i index
                    var tabs = 0
                    var i = 0
                    
                    //see what is the index 0 is and how many tabs for the same section
                    const firstIndex = await Sections[0]

                    //loop throw all of the modified section
                    while(i !== Sections.length){

                        //if there is another tab for the section at index 0
                        if(firstIndex.displayName === Sections[i].displayName){

                            //remove the section from the section array
                            const index = Sections.indexOf(Sections[i])
                            if(index > -1) Sections.splice(index, 1)

                            //add new tab
                            tabs++

                        } else i++
                    }

                    //add the tabs string
                    if(firstIndex.displayName !== undefined){

                        //add the data
                        JSON[Counter] = {
                            name: firstIndex.displayName,
                            id: firstIndex.id,
                            quantity: tabs
                        }

                        //change Counter index
                        Counter++
                    }else{
                        
                        //add the data
                        JSON[Counter] = {
                            name: firstIndex.id,
                            id: firstIndex.id,
                            quantity: tabs
                        }

                        //change Counter index
                        Counter++
                    }
                }

                //return JSON array
                return JSON
            }
            
            //request data
            await FNBRMENA.Sections(userData.lang, "Yes")
            .then(async res => {

                //get the sections as a minpulated data
                if(res.data.list.length === 1) //get the sections as a minpulated data
                var sections = await JSONresponse(res.data.list[0].sections)
                else if(res.data.list.length === 2) //get the sections as a minpulated data
                var sections = await JSONresponse(res.data.list[1].sections)

                //inisilizing values
                var width = 2000
                var height = 1100
                var x = 250
                var y = 550

                //creating height
                for(let i = 0; i < sections.length; i++){
                    height += 300
                }

                //registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //applytext
                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d')
                    let fontSize = 150
                    do {
                        if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                        else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                    } while (ctx.measureText(text).width > 1400)
                    return ctx.font
                }

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //create background grediant
                const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

                //get the upcoming events if there is one set to be active
                for(let i = 0; i < Object.keys(SectionsData['UpcomingEvents']).length; i++){

                    //constant to make the work easy
                    const data = SectionsData['UpcomingEvents'][Object.keys(SectionsData['UpcomingEvents'])[i]]

                    //if the object is set to be active
                    if(data.Status){

                        //loop throw every gradiants
                        grediant.addColorStop(0, `#${data.Gradiants[0]}`)
                        grediant.addColorStop(1, `#${data.Gradiants[1]}`)

                        //add the background color to ctx
                        ctx.fillStyle = grediant
                        ctx.fillRect(0, 0, canvas.width, canvas.height)

                        //loop throw every image
                        for(let x = 0; x < data.Images.length; x++){

                            //if the index is set to be active
                            if(data.Images[x].Status){

                                //change the opacity from the database
                                ctx.globalAlpha = data.Images[x].Opacity

                                //upload the image to canvas
                                const upcomingEventImage = await Canvas.loadImage(data.Images[x].Image)

                                //if scaling is enabled
                                if(data.Images[x].Scaling){

                                    //inislizing img width and height
                                    let imgWidth = 0
                                    let imgHeight = 0

                                    //if imgWidth > canvas.width then start decreasing
                                    if(imgWidth < canvas.width){

                                        //try to sixe up the image
                                        let percentage = 1
                                        while(upcomingEventImage.height * (0.01 * percentage) <= canvas.height) percentage++

                                        //if width still low
                                        if(upcomingEventImage.width * (0.01 * percentage) <= canvas.width)
                                        while(upcomingEventImage.width * (0.01 * percentage) <= canvas.width) percentage++

                                        //change the width and height
                                        imgHeight = upcomingEventImage.height * (0.01 * percentage)
                                        imgWidth = upcomingEventImage.width * (0.01 * percentage)
                                        
                                    }else{

                                        //try to sixe up the image
                                        let percentage = 1
                                        while(upcomingEventImage.height * (0.01 * percentage) <= canvas.height) percentage--

                                        //if width still low
                                        if(upcomingEventImage.width * (0.01 * percentage) <= canvas.width)
                                        while(upcomingEventImage.width * (0.01 * percentage) <= canvas.width) percentage--

                                        //change the width and height
                                        imgHeight = upcomingEventImage.height * (0.01 * percentage)
                                        imgWidth = upcomingEventImage.width * (0.01 * percentage)

                                    }

                                    var xaxis = (canvas.width  - imgWidth) * 0.5
                                    var yaxis = (canvas.height - imgHeight) * 0.5

                                    //drawimage
                                    ctx.drawImage(upcomingEventImage, xaxis, yaxis, imgWidth, imgHeight)

                                    //trun off push if enabled
                                    await admin.database().ref("ERA's").child("ShopSections").child("UpcomingEvents").child(`${Object.keys(SectionsData['UpcomingEvents'])[i]}`)
                                    .child("Images").child(x).update({
                                        X: xaxis,
                                        Y: yaxis,
                                        W: imgWidth,
                                        H: imgHeight,
                                        Scaling: false
                                    })

                                }else{

                                    //drawimage
                                    ctx.drawImage(upcomingEventImage, data.Images[x].X, data.Images[x].Y, data.Images[x].W, data.Images[x].H)
                                }
                                

                                //change the opacity back to 1
                                ctx.globalAlpha = 1
                            }
                        }
                    }
                }

                //add FNBRMENA credit
                ctx.fillStyle = '#ffffff'
                ctx.textAlign='left'
                ctx.font = '150px Burbank Big Condensed'
                ctx.fillText("FNBRMENA", 33, 145)

                //add the date
                moment.locale(userData.lang)
                ctx.fillStyle = '#ffffff'
                ctx.textAlign='center'
                if(userData.lang === "en"){
                    var date = moment.tz(moment(), userData.timezone).format("dddd, MMMM Do of YYYY")
                    ctx.font = '100px Burbank Big Condensed'
                }else{
                    var date = moment.tz(moment(), userData.timezone).format("dddd, MMMM Do من YYYY")
                    ctx.font = '100px Arabic'

                } ctx.fillText(date, canvas.width / 2, (canvas.height - 50))

                //section text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(userData.lang === "en"){

                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText("Shop Sections", canvas.width / 2, y)
                }else{
                    
                    ctx.font = '150px Arabic'
                    ctx.fillText("أقسام الشوب", canvas.width / 2, y)
                }

                //y addition
                y += 100

                //add sections
                var string = ``
                for(let i = 0; i < sections.length; i++) {

                    if(sections[i].name !== null) var name = sections[i].name
                    else var name = sections[i].id

                    //add the section to the embed string
                    if(userData.lang === "en") string += `• ${(i + 1)}: ${name} | ${sections[i].quantity} Tabs\n`
                    else if(userData.lang === "ar") string += `• ${(i + 1)}: ${name} | ${sections[i].quantity} صفحة\n`

                    //grediant
                    const grd = ctx.createLinearGradient(x, y, x + 1500, y)

                    //response data
                    var data = undefined
                    for(let f = 0; f < Object.keys(SectionsData['Sections']).length; f++){

                        //finding a match
                        if(sections[i].id.toLowerCase().includes(Object.keys(SectionsData['Sections'])[f])){
                            data = await SectionsData['Sections'][Object.keys(SectionsData['Sections'])[f]]
                        }
                    }

                    //find a match
                    if(data !== undefined){

                        //match has been found now register the colors
                        if(data.Image.Status){

                            //loop throw the colors array
                            for(let x = 0; x < data.Colors.length; x++){

                                //add the grediant colors
                                grd.addColorStop(x, `#${data.Colors[x]}`)
                            }

                            //add the color
                            ctx.fillStyle = grd

                            //display the section
                            ctx.fillRect(x, y, 1500, 200)

                            //set the opacity from the database
                            ctx.globalAlpha = data.Image.Opacity

                            //add the image
                            const imageData = await Canvas.loadImage(data.Image.Url)
                            ctx.drawImage(imageData, x, y, 1500, 200)

                            //change the opacity back
                            ctx.globalAlpha = 1

                        }else{

                            //loop throw the colors array
                            for(let x = 0; x < data.Colors.length; x++){

                                //add the grediant colors
                                grd.addColorStop(x, `#${data.Colors[x]}`)
                            }

                            //add the color
                            ctx.fillStyle = grd

                            //display the section
                            ctx.fillRect(x, y, 1500, 200)
                        }
                    }else{
                        //add the grediant colors
                        grd.addColorStop(0, "#000000")
                        grd.addColorStop(1, "#FFFFFF")

                        //add the color
                        ctx.fillStyle = grd

                        //display the section
                        ctx.fillRect(x, y, 1500, 200)
                    }

                    //add the number of the section
                    ctx.fillStyle = grd
                    ctx.textAlign='left'
                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText(i + 1, x - 120, y + 150)

                    //add the section name
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    if(userData.lang === "en"){
                        applyText(canvas, name + " | " + sections[i].quantity + " Tabs")
                        ctx.fillText(name + " | " + sections[i].quantity + " Tabs", x + 750, y + 140)
                    }else if(userData.lang === "ar"){
                        applyText(canvas, name + " | " + sections[i].quantity + " صفحة")
                        ctx.fillText(name + " | " + sections[i].quantity + " صفحة", x + 750, y + 140)
                    }

                    //new line
                    y += 300
                }

                //create embed
                const SectionsEmbed = new Discord.EmbedBuilder()
                SectionsEmbed.setColor(FNBRMENA.Colors("embed"))
                SectionsEmbed.setDescription(string)

                //send
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${moment()}.png`)
                await message.reply({embeds: [SectionsEmbed], files: [att]})
                msg.delete()
                
            }).catch((err) => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
    
            })

        }).catch((err) => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}