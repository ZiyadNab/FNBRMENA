const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const probe = require('probe-image-size')
const Canvas = require('canvas')

module.exports = {
    commands: 'section',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //get the sections data from database
        const SectionsData = await FNBRMENA.Admin(admin, message, "", "ShopSections")

        //define the collection
        const docRef = await admin.firestore().collection("authToken").doc("0").get()

        //data minpulator
        const prettySections = async (Sections) => {

            //define pretty response and its requirments
            var Counter = 0
            var Pretty = []

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
                    if(Sections[i].sectionId.toLowerCase().includes(firstIndex.sectionId.toLowerCase()) ||
                    firstIndex.sectionDisplayName === Sections[i].sectionDisplayName){

                        //remove the section from the section array
                        const index = Sections.indexOf(Sections[i])
                        if(index > -1) Sections.splice(index, 1)

                        //add new tab
                        tabs++

                    } else i++
                }

                //add the tabs string
                if(firstIndex.sectionDisplayName !== undefined){

                    //add the data
                    Pretty[Counter] = {
                        name: firstIndex.sectionDisplayName,
                        id: firstIndex.sectionId,
                        landingPriority: firstIndex.landingPriority,
                        quantity: tabs
                    }

                    //change Counter index
                    Counter++
                }else{
                    
                    //add the data
                    Pretty[Counter] = {
                        name: firstIndex.sectionId,
                        id: firstIndex.sectionId,
                        landingPriority: firstIndex.landingPriority,
                        quantity: tabs
                    }

                    //change Counter index
                    Counter++
                }
            }

            //return JSON array
            return Pretty
        }

        const extractSections = async (sectionIDs) => {

            //store all the object of an active section
            let activeSectionsObj = []
            let Counter = 0

            //request content endpoint
            await FNBRMENA.EpicContentEndpoint(lang)
            .then(async res => {

                //find the active sections
                for(const sectionObj of res.data.shopSections.sectionList.sections){
                    for(let i = 0; i < sectionIDs.length; i++){

                        if(sectionObj.sectionId === sectionIDs[i]) activeSectionsObj[Counter++] = await sectionObj
                    }
                }
            })

            //get the sections as a pretty then return it
            return await prettySections(activeSectionsObj)
        }
        
        //request data
        await FNBRMENA.EpicCalandar(docRef.data().accessToken.access_token)
        .then(async res => {

            //generating animation
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Loading sections... ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`جاري تحميل الأقسام... ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                //get the sections as a minpulated data
                if(res.data.channels['client-events'].states.length === 1) let sections = await extractSections(Object.keys(res.data.channels['client-events'].states[0].state.sectionStoreEnds))
                else if(res.data.channels['client-events'].states.length === 2) let sections = await extractSections(Object.keys(res.data.channels['client-events'].states[1].state.sectionStoreEnds))

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
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //applytext
                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d')
                    let fontSize = 150
                    do {
                        if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                        else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                    } while (ctx.measureText(text).width > 1400)
                    return ctx.font
                }

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //create background grediant
                const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

                //SectionsData index
                var sectionsIndex = 0
                var UpcomingEventsIndex = 0
                for(let i = 0; i < Object.keys(SectionsData).length; i++){
                    if(Object.keys(SectionsData)[i] === 'Sections') sectionsIndex = i
                    if(Object.keys(SectionsData)[i] === 'UpcomingEvents') UpcomingEventsIndex = i
                }

                //get the upcoming events if there is one set to be active
                const UpcomingEventsData = SectionsData[Object.keys(SectionsData)[UpcomingEventsIndex]]
                for(let i = 0; i < Object.keys(SectionsData[Object.keys(SectionsData)[UpcomingEventsIndex]]).length; i++){

                    //constant to make the work easy
                    const data = UpcomingEventsData[Object.keys(SectionsData[Object.keys(SectionsData)[UpcomingEventsIndex]])[i]]

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
                moment.locale(lang)
                ctx.fillStyle = '#ffffff'
                ctx.textAlign='center'
                if(lang === "en"){
                    var date = moment().format("dddd, MMMM Do of YYYY")
                    ctx.font = '100px Burbank Big Condensed'
                }else{
                    var date = moment().format("dddd, MMMM Do من YYYY")
                    ctx.font = '100px Arabic'
                }

                //draw text
                ctx.fillText(date, canvas.width / 2, (canvas.height - 50))

                //section text
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en"){

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
                    if(lang === "en") string += `• ${(i + 1)}: ${name} | ${sections[i].quantity} Tabs\n`
                    else if(lang === "ar") string += `• ${(i + 1)}: ${name} | ${sections[i].quantity} صفحة\n`

                    //grediant
                    const grd = ctx.createLinearGradient(x, y, x + 1500, y)

                    //response data
                    var data = undefined
                    var finder = Object.keys(SectionsData[Object.keys(SectionsData)[sectionsIndex]])
                    for(let f = 0; f < finder.length; f++){

                        //finding a match
                        if(sections[i].id.toLowerCase().includes(finder[f])){
                            data = await SectionsData[Object.keys(SectionsData)[sectionsIndex]][finder[f]]
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
                    ctx.fillStyle = grd;
                    ctx.textAlign='left';
                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText(i + 1, x - 120, y + 150)

                    //add the section name
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    applyText(canvas, `${name} | ${sections[i].quantity} Tabs`)
                    if(lang === "en") ctx.fillText(`${name} | ${sections[i].quantity} Tabs`, x + 750, y + 140)
                    else if(lang === "ar") ctx.fillText(`${name} | ${sections[i].quantity} صفحة`, x + 750, y + 140)
                    

                    //new line
                    y += 300
                }

                //create embed
                const SectionsEmbed = new Discord.MessageEmbed()

                //add the color
                SectionsEmbed.setColor(FNBRMENA.Colors("embed"))

                //add description
                SectionsEmbed.setDescription(string)

                //send
                const att = new Discord.MessageAttachment(canvas.toBuffer(), 'section.png')
                await message.channel.send(att)
                await message.channel.send(SectionsEmbed)
                msg.delete()
            })
        })

        .catch((err) => {
            console.log(err)
        })
    },
}