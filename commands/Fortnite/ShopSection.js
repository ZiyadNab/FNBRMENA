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
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    }
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
                grediant.addColorStop(0, "#001C86")
                grediant.addColorStop(1, "#13FF00")

                //add the background color to ctx
                ctx.fillStyle = grediant

                //add the background
                ctx.fillRect(0, 0, canvas.width, canvas.height)

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

                    if(await res.data.data.sections[i].id.toLowerCase().includes("dc")){

                        //dc grediant colors
                        grd.addColorStop(0, "#004F99")
                        grd.addColorStop(1, "#0084FF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("racing")){

                        //racing grediant colors
                        grd.addColorStop(0, "#4FFF30")
                        grd.addColorStop(0.5, "#FFD030")
                        grd.addColorStop(1, "#FF3030")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("bugha")){

                        //bugha grediant colors
                        grd.addColorStop(0, "#00FFFB")
                        grd.addColorStop(1, "#010F93")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("special")){

                        //special grediant colors
                        grd.addColorStop(0, "#FF30FC")
                        grd.addColorStop(1, "#30F6FF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("wrap")){
            
                        //wraps grediant colors
                        grd.addColorStop(0, "#7800FF")
                        grd.addColorStop(0.5, "#00FF61")
                        grd.addColorStop(1, "#00ECFF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("shortnite")){

                        //ferrari grediant colors
                        grd.addColorStop(0, "#FF0000")
                        grd.addColorStop(1, "#FFF300")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("ferrari")){

                        //ferrari grediant colors
                        grd.addColorStop(0, "#FF0000")
                        grd.addColorStop(1, "#000000")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("rainbow")){

                        //shortnite grediant colors
                        grd.addColorStop(0, "#B96800")
                        grd.addColorStop(1, "#B96800")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("lebron")){

                        //lebron grediant colors
                        grd.addColorStop(0, "#F7FF47")
                        grd.addColorStop(0.5, "#E047FF")
                        grd.addColorStop(1, "#F947FF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("marvel")){

                        //marvel grediant colors
                        grd.addColorStop(0, "#FF0000")
                        grd.addColorStop(1, "#FFFFFF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("blackwidow")){

                        //icon grediant colors
                        grd.addColorStop(0, "#FF0000")
                        grd.addColorStop(1, "#FFFFFF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("armbatzero")){

                        //icon grediant colors
                        grd.addColorStop(0, "#004E8E")
                        grd.addColorStop(1, "#000000")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("icon")){

                        //icon grediant colors
                        grd.addColorStop(0, "#7CFEF1")
                        grd.addColorStop(1, "#00FFE4")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("starwars")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#FBFF00")
                        grd.addColorStop(1, "#000000")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("bannerbrigade")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#00F3FF")
                        grd.addColorStop(1, "#FF00CD")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("tron")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#000000")
                        grd.addColorStop(1, "#00FBFF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("customizehero") || await res.data.data.sections[i].id.toLowerCase().includes("herogear")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#FF8000")
                        grd.addColorStop(1, "#00FFF3")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("inthepaint")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#000275")
                        grd.addColorStop(1, "#D70000")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("repyourclub") || await res.data.data.sections[i].id.toLowerCase().includes("goalbound")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#00D703")
                        grd.addColorStop(1, "#FFFFFF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("locker")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#D800FF")
                        grd.addColorStop(1, "#1300FF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("vaultshop")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#FFDC00")
                        grd.addColorStop(1, "#FEE755")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("shadowstrike")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#000000")
                        grd.addColorStop(1, "#FFFFFF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("horizonzerodawn")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#AA00FF")
                        grd.addColorStop(1, "#315AE4")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("partygear") || await res.data.data.sections[i].id.toLowerCase().includes("startparty")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#FF00FF")
                        grd.addColorStop(1, "#FFF700")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("mello")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#FB00FF")
                        grd.addColorStop(1, "#00FFFB")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("majorlazer")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#000000")
                        grd.addColorStop(1, "#FF0000")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("turnmusicup")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#00FFF3")
                        grd.addColorStop(1, "#FF00FF")

                    }else if(await res.data.data.sections[i].id.toLowerCase().includes("fishyoffers")){

                        //startwars grediant colors
                        grd.addColorStop(0, "#00FBFF")
                        grd.addColorStop(1, "#FFFFFF")

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