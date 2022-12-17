const moment = require('moment')
require('moment-timezone')
const Canvas = require('canvas')

module.exports = {
    commands: 'section',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Generating animation
        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Loading sections... ${emojisObject.loadingEmoji}`)
        else if(userData.lang === "ar") generating.setTitle(`جاري تحميل الأقسام... ${emojisObject.loadingEmoji}`)
        const msg = await message.reply({embeds: [generating], components: [], files: []})
        try {
            
            // Get the sections data from database
            const SectionsData = await FNBRMENA.Admin(admin, message, "", "ShopSections")

            // Data minpulator
            const JSONresponse = async (Sections) => {

                // Define json response and its requirments
                var Counter = 0
                var JSON = []

                // Get the section tabs and add them to a string
                while(Sections.length !== 0){

                    // Defined tabs and i index
                    var tabs = 0
                    var i = 0
                    
                    // See what is the index 0 is and how many tabs for the same section
                    const firstIndex = await Sections[0]

                    // Loop throw all of the modified section
                    while(i !== Sections.length){

                        // If there is another tab for the section at index 0
                        if(firstIndex.displayName === Sections[i].displayName){

                            //remove the section from the section array
                            const index = Sections.indexOf(Sections[i])
                            if(index > -1) Sections.splice(index, 1)

                            // Add new tab
                            tabs++

                        } else i++
                    }

                    // Add the tabs string
                    if(firstIndex.displayName !== undefined){

                        // Add the data
                        JSON[Counter] = {
                            name: firstIndex.displayName,
                            id: firstIndex.id,
                            quantity: tabs
                        }

                        // Change Counter index
                        Counter++
                    }else{
                        
                        // Add the data
                        JSON[Counter] = {
                            name: firstIndex.id,
                            id: firstIndex.id,
                            quantity: tabs
                        }

                        // Change Counter index
                        Counter++
                    }
                }

                //return JSON array
                return JSON
            }
            
            //request data
            await FNBRMENA.Sections(userData.lang, "Yes")
            .then(async res => {

                // Get the sections as a minpulated data
                if(res.data.list.length === 1) // Get the sections as a minpulated data
                var sections = await JSONresponse(res.data.list[0].sections)
                else if(res.data.list.length === 2) // Get the sections as a minpulated data
                var sections = await JSONresponse(res.data.list[1].sections)

                // Inisilizing values
                var width = 2000
                var height = 1100
                var x = 250
                var y = 550

                // Creating height
                for(let i = 0; i < sections.length; i++){
                    height += 300
                }

                //registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                // Applytext
                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d')
                    let fontSize = 150
                    do {
                        if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                        else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                    } while (ctx.measureText(text).width > 1400)
                    return ctx.font
                }

                // Creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                // Create background grediant
                const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

                // Get the upcoming events if there is one set to be active
                for(let i = 0; i < Object.keys(SectionsData['UpcomingEvents']).length; i++){

                    // Constant to make the work easy
                    const data = SectionsData['UpcomingEvents'][Object.keys(SectionsData['UpcomingEvents'])[i]]

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

                                // Change the opacity from the database
                                ctx.globalAlpha = data.Images[x].Opacity

                                //upload the image to canvas
                                const upcomingEventImage = await Canvas.loadImage(data.Images[x].Image)

                                // If scaling is enabled
                                if(data.Images[x].Scaling){

                                    // Inislizing img width and height
                                    let imgWidth = 0
                                    let imgHeight = 0

                                    // If imgWidth > canvas.width then start decreasing
                                    if(imgWidth < canvas.width){

                                        //try to sixe up the image
                                        let percentage = 1
                                        while(upcomingEventImage.height * (0.01 * percentage) <= canvas.height) percentage++

                                        // If width still low
                                        if(upcomingEventImage.width * (0.01 * percentage) <= canvas.width)
                                        while(upcomingEventImage.width * (0.01 * percentage) <= canvas.width) percentage++

                                        // Change the width and height
                                        imgHeight = upcomingEventImage.height * (0.01 * percentage)
                                        imgWidth = upcomingEventImage.width * (0.01 * percentage)
                                        
                                    }else{

                                        //try to sixe up the image
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

                                    // Drawimage
                                    ctx.drawImage(upcomingEventImage, data.Images[x].X, data.Images[x].Y, data.Images[x].W, data.Images[x].H)
                                }
                                

                                // Change the opacity back to 1
                                ctx.globalAlpha = 1
                            }
                        }
                    }
                }

                // Add FNBRMENA credit
                ctx.fillStyle = '#ffffff'
                ctx.textAlign='left'
                ctx.font = '150px Burbank Big Condensed'
                ctx.fillText("FNBRMENA", 33, 145)

                // Add the date
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

                // Section text
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

                // Add sections
                var string = ``
                for(let i = 0; i < sections.length; i++) {

                    if(sections[i].name !== null) var name = sections[i].name
                    else var name = sections[i].id

                    // Add the section to the embed string
                    if(userData.lang === "en") string += `• ${(i + 1)}: ${name} | ${sections[i].quantity} Tabs\n`
                    else if(userData.lang === "ar") string += `• ${(i + 1)}: ${name} | ${sections[i].quantity} صفحة\n`

                    // Grediant
                    const grd = ctx.createLinearGradient(x, y, x + 1500, y)

                    //response data
                    var data = undefined
                    for(let f = 0; f < Object.keys(SectionsData['Sections']).length; f++){

                        // Finding a match
                        if(sections[i].id.toLowerCase().includes(Object.keys(SectionsData['Sections'])[f])){
                            data = await SectionsData['Sections'][Object.keys(SectionsData['Sections'])[f]]
                        }
                    }

                    // Find a match
                    if(data !== undefined){

                        // Match has been found now register the colors
                        if(data.Image.Status){

                            // Loop throw the colors array
                            for(let x = 0; x < data.Colors.length; x++){

                                // Add the grediant colors
                                grd.addColorStop(x, `#${data.Colors[x]}`)
                            }

                            // Add the color
                            ctx.fillStyle = grd

                            // Display the section
                            ctx.fillRect(x, y, 1500, 200)

                            // Set the opacity from the database
                            ctx.globalAlpha = data.Image.Opacity

                            // Add the image
                            const imageData = await Canvas.loadImage(data.Image.Url)
                            ctx.drawImage(imageData, x, y, 1500, 200)

                            // Change the opacity back
                            ctx.globalAlpha = 1

                        }else{

                            // Loop throw the colors array
                            for(let x = 0; x < data.Colors.length; x++){

                                // Add the grediant colors
                                grd.addColorStop(x, `#${data.Colors[x]}`)
                            }

                            // Add the color
                            ctx.fillStyle = grd

                            // Display the section
                            ctx.fillRect(x, y, 1500, 200)
                        }
                    }else{
                        // Add the grediant colors
                        grd.addColorStop(0, "#000000")
                        grd.addColorStop(1, "#FFFFFF")

                        // Add the color
                        ctx.fillStyle = grd

                        // Display the section
                        ctx.fillRect(x, y, 1500, 200)
                    }

                    // Add the number of the section
                    ctx.fillStyle = grd
                    ctx.textAlign='left'
                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText(i + 1, x - 120, y + 150)

                    // Add the section name
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

                // Create embed
                const SectionsEmbed = new Discord.EmbedBuilder()
                SectionsEmbed.setColor(FNBRMENA.Colors("embed"))
                SectionsEmbed.setDescription(string)

                // Send
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${moment()}.png`})
                msg.edit({embeds: [SectionsEmbed], components: [], files: [att]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })
                
            }).catch((err) => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
    
            })

        }catch(err) {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)

        }
    }
}