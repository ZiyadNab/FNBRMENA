const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const probe = require('probe-image-size')
const Canvas = require('canvas')

module.exports = {
    commands: 'section',
    expectedArgs: '<Section>',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //get the sections data from database
        const SectionsData = await FNBRMENA.Admin(admin, message, "", "ShopSections")

        //SectionsData index
        var sectionsIndex = 0
        var UpcomingEventsIndex = 0
        for(let i = 0; i < Object.keys(SectionsData).length; i++){
            if(Object.keys(SectionsData)[i] === 'Sections') sectionsIndex = i
            if(Object.keys(SectionsData)[i] === 'UpcomingEvents') UpcomingEventsIndex = i
        }
        
        //request data
        FNBRMENA.Sections(lang, "Yes")
        .then(async res => {

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
            //get the sections as a minpulated data
            let sections
            if(res.data.list.length === 1) sections = await JSONresponse(res.data.list[0].sections)
            else if(res.data.list.length === 2){

                //loop throw every list
                for(let i = 0; i < res.data.list.length; i++){
                    
                    //if the list has a tag NEXT
                    if(res.data.list[i].apiTag === "next"){

                        //get the sections as a minpulated data
                        sections = await JSONresponse(res.data.list[i].sections)
                    }
                }
            }

            //inisilizing values
            var width = 2000
            var height = 1100
            var x = 250
            var y = 550
            var string = ""

            //creating height
            for(let i = 0; i < sections.length; i++){
                height += 300
            }

            //registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

            //applytext
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
                let fontSize = 150;
                do {
                    if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                    else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                } while (ctx.measureText(text).width > 1400);
                return ctx.font;
            }

            //generating animation
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Loading sections... ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`جاري تحميل الأقسام... ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //create background grediant
                const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)

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

                                    //check the height
                                    while(canvas.height > upcomingEventImage.height){

                                        upcomingEventImage.width += 1
                                        upcomingEventImage.height += 1
                                    }

                                    //check the width
                                    while(canvas.width > upcomingEventImage.width){

                                        upcomingEventImage.width += 1
                                        upcomingEventImage.height += 1
                                    }

                                    //check the height
                                    while(canvas.height < upcomingEventImage.height){

                                        upcomingEventImage.width -= 1
                                        upcomingEventImage.height -= 1
                                    }

                                    //check the width
                                    while(canvas.width < upcomingEventImage.width){

                                        upcomingEventImage.width -= 1
                                        upcomingEventImage.height -= 1
                                    }

                                    //drawimage
                                    ctx.drawImage(upcomingEventImage, data.Images[x].X, data.Images[x].Y, upcomingEventImage.width, upcomingEventImage.height)

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
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='left';
                ctx.font = '150px Burbank Big Condensed'
                ctx.fillText("FNBRMENA", 33, 145)

                //add the date
                if(lang === "en"){
                    moment.locale("en")
                    var date = moment().format("dddd, MMMM Do of YYYY")
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText(date, canvas.width / 2, (canvas.height - 100))
                }else{
                    moment.locale("ar")
                    var date = moment().format("dddd, MMMM Do من YYYY")
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '100px Arabic'
                    ctx.fillText(date, canvas.width / 2, (canvas.height - 100))
                }

                //section text
                if(lang === "en"){
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText("Shop Sections", canvas.width / 2, y)
                }else{
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='center';
                    ctx.font = '150px Arabic'
                    ctx.fillText("أقسام الشوب", canvas.width / 2, y)
                }

                //y addition
                y += 100

                //add sections
                for (let i = 0; i < sections.length; i++) {

                    if(sections[i].name !== null) var name = sections[i].name
                    else var name = sections[i].id

                    //add the section to the embed string
                    if(lang === "en") string += "• " + (i + 1) + ": " + name + " | " + sections[i].quantity + " Tabs" + "\n" 
                    else if(lang === "ar") string += "• " + (i + 1) + ": " + name + " | " + sections[i].quantity + " صفحة" + "\n" 

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
                    if(lang === "en"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        applyText(canvas, name + " | " + sections[i].quantity + " Tabs")
                        ctx.fillText(name + " | " + sections[i].quantity + " Tabs", x + 750, y + 140)
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        applyText(canvas, name + " | " + sections[i].quantity + " صفحة")
                        ctx.fillText(name + " | " + sections[i].quantity + " صفحة", x + 750, y + 140)
                    }

                    //new line
                    y += 300
                }

                //create embed
                const SectionsEmbed = new Discord.MessageEmbed()

                //add the color
                SectionsEmbed.setColor(FNBRMENA.Colors("embed"))

                //add description
                SectionsEmbed.setDescription(string)

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