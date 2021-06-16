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
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")
        
        //request data
        FNBRMENA.Sections(lang, "Yes")
        .then(async (res) => {

            //inisilizing values
            var width = 2000
            var height = 1200
            var x = 250
            var y = 450
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
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    }
                } while (ctx.measureText(text).width > 1400);
                return ctx.font;
            }

            //creating canvas
            const canvas = Canvas.createCanvas(width, height);
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

            //add FNBRMENA credit
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='left';
            ctx.font = '200px Burbank Big Condensed'
            ctx.fillText("FNBRMENA", 50, 200)

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
                ctx.fillText("عناصر الشوب", canvas.width / 2, y)
            }

            //y addition
            y += 150 + 50

            //add sections
            for (let i = 0; i < res.data.data.sections.length; i++) {

                //add the section to the embed string
                if(lang === "en"){
                    string += "• " + (i + 1) + ": " + res.data.data.sections[i].name + " | " + res.data.data.sections[i].quantity + " Tabs" + "\n" 
                }else if(lang === "ar"){
                    string += "• " + (i + 1) + ": " + res.data.data.sections[i].name + " | " + res.data.data.sections[i].quantity + " صفحة" + "\n" 
                }

                //grediant
                const grd = ctx.createLinearGradient(0, (canvas.height / 2), canvas.width, (canvas.height / 2))

                if(await res.data.data.sections[i].id.toLowerCase().includes("dc")){

                    //dc grediant colors
                    grd.addColorStop(0, "#004F99")
                    grd.addColorStop(1, "#0084FF")

                }else if(await res.data.data.sections[i].id.toLowerCase().includes("marvel")){

                    //marvel grediant colors
                    grd.addColorStop(0, "#FF0000")
                    grd.addColorStop(1, "#FFFFFF")

                }else if(await res.data.data.sections[i].id.toLowerCase().includes("icon")){

                    //icon grediant colors
                    grd.addColorStop(0, "#7CFEF1")
                    grd.addColorStop(1, "#00FFE4")

                }else if(await res.data.data.sections[i].id.toLowerCase().includes("starwars")){

                    //startwars grediant colors
                    grd.addColorStop(0, "#FBFF00")
                    grd.addColorStop(1, "#000000")

                }else if(await res.data.data.sections[i].id.toLowerCase().includes("daily")){

                    //startwars grediant colors
                    grd.addColorStop(0, "#FFFFFF")
                    grd.addColorStop(1, "#AAAAAA")

                }else if(await res.data.data.sections[i].id.toLowerCase().includes("featured")){

                    //startwars grediant colors
                    grd.addColorStop(0, "#FFA600")
                    grd.addColorStop(1, "#FF8300")

                }else{

                    //anything else grediant colors
                    grd.addColorStop(0, "#000000")
                    grd.addColorStop(1, "#FFFFFF")

                }

                //add the color
                ctx.fillStyle = grd

                //display the section
                ctx.fillRect(x, y, 1500, 200)

                //add the number of the section
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='left';
                ctx.font = '150px Burbank Big Condensed'
                ctx.fillText(i, x - 120, y + 150)

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
            Sections.setColor('#BB00EE')

            //add description
            Sections.setDescription(string)

            const att = new Discord.MessageAttachment(canvas.toBuffer(), 'section.png')
            await message.channel.send(att)
            await message.channel.send(Sections)
        })
        .catch((err) => {
            console.log(err)
        })
    },
}