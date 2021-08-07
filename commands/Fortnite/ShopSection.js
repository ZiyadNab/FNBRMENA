const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const axios = require('axios');
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
        var grediantsIndex = 0
        var customImagesIndex = 0
        var backgroundLayerImageIndex = 0
        for(let i = 0; i < Object.keys(SectionsData).length; i++){
            if(Object.keys(SectionsData)[i] === 'Sections') sectionsIndex = i
            if(Object.keys(SectionsData)[i] === 'Gradiants') grediantsIndex = i
            if(Object.keys(SectionsData)[i] === 'customImages') customImagesIndex = i
            if(Object.keys(SectionsData)[i] === 'backgroundLayerImage') backgroundLayerImageIndex = i
        }
        
        //request data
        FNBRMENA.Sections(lang, "Yes")
        .then(async (res) => {

            //inisilizing values
            var width = 2000
            var height = 1200
            var x = 250
            var y = 550
            var string = ""

            //creating height
            for(let i = 0; i < res.data.data.sections.length; i++){
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

                //background grediant colors
                const backgroundGrediants = SectionsData[Object.keys(SectionsData)[grediantsIndex]]
                if(backgroundGrediants.length === 2){

                    //background grediant colors
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

                //customImages
                const customImagesData = SectionsData[Object.keys(SectionsData)[customImagesIndex]]
                for(let i = 0; i < customImagesData.length; i++){

                    //if there is access to customImagesData
                    if(customImagesData[i].Status){

                        //change the opacity back if i changed it from the database
                        ctx.globalAlpha = customImagesData[i].Opacity

                        //add the image
                        const customImages = await Canvas.loadImage(customImagesData[i].Image)
                        ctx.drawImage(customImages, customImagesData[i].X, customImagesData[i].Y, customImagesData[i].W, customImagesData[i].H)

                        //change the opacity back if i changed it from the database
                        ctx.globalAlpha = 1
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
                for (let i = 0; i < res.data.data.sections.length; i++) {

                    if(res.data.data.sections[i].name !== null) var name = res.data.data.sections[i].name
                    else var name = res.data.data.sections[i].id

                    //add the section to the embed string
                    if(lang === "en") string += "• " + (i + 1) + ": " + name + " | " + res.data.data.sections[i].quantity + " Tabs" + "\n" 
                    else if(lang === "ar") string += "• " + (i + 1) + ": " + name + " | " + res.data.data.sections[i].quantity + " صفحة" + "\n" 

                    //grediant
                    const grd = ctx.createLinearGradient(x, y, x + 1500, y)

                    //response data
                    var data = SectionsData[Object.keys(SectionsData)[sectionsIndex]][res.data.data.sections[i].id.toLowerCase()]

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
                        applyText(canvas, res.data.data.sections[i].name + " | " + res.data.data.sections[i].quantity + " Tabs")
                        ctx.fillText(res.data.data.sections[i].name + " | " + res.data.data.sections[i].quantity + " Tabs", x + 750, y + 140)
                    }else if(lang === "ar"){
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        applyText(canvas, res.data.data.sections[i].name + " | " + res.data.data.sections[i].quantity + " صفحة")
                        ctx.fillText(res.data.data.sections[i].name + " | " + res.data.data.sections[i].quantity + " صفحة", x + 750, y + 140)
                    }

                    //new line
                    y += 300
                }

                //create embed
                const Sections = new Discord.MessageEmbed()

                //add the color
                Sections.setColor(FNBRMENA.Colors("embed"))

                //add description
                Sections.setDescription(string)

                const att = new Discord.MessageAttachment(canvas.toBuffer(), 'section.png')
                await message.channel.send(att)
                await message.channel.send(Sections)
                msg.delete()
            })
        })
        .catch((err) => {
            console.log(err)
        })
    },
}