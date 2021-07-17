const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
var wrap = require('word-wrap')
const Canvas = require('canvas')

module.exports = {
    commands: 'playlist',
    expectedArgs: '',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //handleing indes
        var num = 0

        //error handleing
        var errorHandleing = 0

        //request data
        FNBRMENA.PlayList(lang, "Name", text)
        .then(async res => {

            //if there is more than 1 playlist found
            if(res.data.modes.length > 1){

                //create embed
                const list = new Discord.MessageEmbed()

                //set the color
                list.setColor(FNBRMENA.Colors("embed"))

                //set title
                if(lang === "en") list.setTitle(`Please choose your item from the list below`)
                else if(lang === "ar") list.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

                //loop throw every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.modes.length; i++){

                    //store the name to the string
                    string += `• ${i}: ${res.data.modes[i].name} | ${res.data.modes[i].team}\n`
                }

                //how many items where matchinh the user input?
                if(lang === "en") string += `\nFound ${res.data.modes.length} item matching your search`
                else if(lang === "ar") string += `\nيوجد ${res.data.modes.length} عنصر يطابق عملية البحث`

                //set Description
                list.setDescription(string)

                //send the message and wait for answer
                await message.channel.send(list)
                .then(async list => {

                    //filtering outfits
                    const filter = async m => await m.author.id === message.author.id

                    //add the reply
                    if(lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                    else if(lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                    
                    await message.reply(reply)
                    .then( async notify => {

                        //listen for user input
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //delete messages
                            await notify.delete()
                            await list.delete()

                            //if the user chosen inside range
                            if(collected.first().content >= 0 && collected.first().content < res.data.modes.length){

                                //change the item index
                                num = collected.first().content
                            }else{

                                //add an error
                                errorHandleing++

                                //if user typed a number out of range
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        }).catch(err => {

                            //add an error
                            errorHandleing++
    
                            //if user took to long to excute the command
                            notify.delete()
                            choose.delete()
    
                            const error = new Discord.MessageEmbed()
                            error.setColor(FNBRMENA.Colors("embed"))
                            error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                            message.reply(error)
                        })
                    })
                }).catch(err => {

                    //add an error
                    errorHandleing++

                    //if user typed a number out of range
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Request entry too large ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`تم تخطي الكمية المحدودة من عدد العناصر ${errorEmoji}`)
                    message.reply(errorRequest)

                })
            }

            //if there is no playlist found
            if(res.data.modes.length === 0){

                //add an error
                errorHandleing++

                //if user typed a number out of range
                const errorRequest = new Discord.MessageEmbed()
                errorRequest.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") errorRequest.setTitle(`No playlist has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") errorRequest.setTitle(`لا يمكنني العثور على الطور الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(errorRequest)
                
            }

            if(errorHandleing === 0 && res.data.modes.length !== 0){

                //inisilizing data
                var name = res.data.modes[num].name
                var description = res.data.modes[num].description
                var matchmakingImage = res.data.modes[num].matchmakingIcon
                var image = res.data.modes[num].image

                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Getting data about ${name}... ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`جاري تحميل معلومات طور ${name}... ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    //register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //applytext
                    const applyTextDescription = (canvas, text) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = 20;
                        do {
                            if(lang === "en"){
                                ctx.font = `${fontSize -= 1}px Arial`;
                            }else if(lang === "ar"){
                                ctx.font = `${fontSize -= 1}px Arabic`;
                            }
                        } while (ctx.measureText(text).width > 1800);
                        return ctx.font;
                    }

                    //applytext
                    const applyTextName = (canvas, text) => {
                        const ctx = canvas.getContext('2d')
                        let fontSize = 100;
                        do {
                            if(lang === "en"){
                                ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            }else if(lang === "ar"){
                                ctx.font = `${fontSize -= 1}px Arabic`;
                            }
                        } while (ctx.measureText(text).width > 1800);
                        return ctx.font;
                    }

                    //canvas
                    const canvas = Canvas.createCanvas(1920, 1080);
                    const ctx = canvas.getContext('2d');

                    //background
                    if(image !== null){
                        
                        //add the image
                        const background = await Canvas.loadImage(image)
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                        //add blue fog
                        const fog = await Canvas.loadImage('./assets/News/fog.png')
                        ctx.drawImage(fog,0,0,1920,1080)

                    }else{

                        const background = await Canvas.loadImage('https://i.imgur.com/TN86zLu.png')
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                        //add blue fog
                        const fog = await Canvas.loadImage('./assets/News/fog.png')
                        ctx.drawImage(fog, 0, 0, 1920, 1080)

                        //no img text
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        if(lang === "en"){
                            ctx.font = '200px Burbank Big Condensed'
                            ctx.fillText("No images found!", canvas.width / 2, canvas.height / 2)
                        }
                        else{
                            if(lang === "ar") ctx.font = '200px Arabic'
                            ctx.fillText("لا يوجد صورة", canvas.width / 2, canvas.height / 2)
                        }
                    }

                    //add the border
                    const border = await Canvas.loadImage('./assets/Rarities/Playlists/border.png')
                    ctx.drawImage(border, 0, 0, canvas.width, canvas.height)

                    //add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.font = '75px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 25, 83)

                    //add the matchmaking image
                    if(matchmakingImage !== null){
                        const matchmaking = await Canvas.loadImage(matchmakingImage)
                        ctx.drawImage(matchmaking, canvas.width - 90, 25, 65, 65)
                    }

                    //add the name
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.font = applyTextName(canvas, name);
                    ctx.fillText(name, canvas.width / 2, 900)

                    //split the description into lines
                    description = description.replace("\n", "")
                    description = description.replace("\r", "")
                    description = wrap(description, {width: 150})
                    description = description.split(/\r\n|\r|\n/)

                    //add the description
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.font = applyTextDescription(canvas, description[0])
                    var lines = 960

                    //loop throw every line
                    for(let i = 0; i < description.length; i++){

                        ctx.fillText(description[i], canvas.width / 2, lines)

                        lines += 25
                    }

                    //creating embed
                    const modeInfo = new Discord.MessageEmbed()

                    //set the color
                    modeInfo.setColor(FNBRMENA.Colors("embed"))

                    //inislizing emojis
                    const red = client.emojis.cache.get("855805718779002899")
                    const green = client.emojis.cache.get("855805718363111434")

                    //set title
                    if(res.data.modes[num].enabled) modeInfo.setTitle(`${name} ${res.data.modes[num].team} | ${green}`)
                    else modeInfo.setTitle(`${name} ${res.data.modes[num].team} | ${red}`)
                    
                    //set descroption
                    modeInfo.setDescription(res.data.modes[num].description)

                    //ltm message
                    var ltmMessage = ""
                    if(res.data.modes[num].ltmMessage !== null){

                        //loop throw every ltm message
                        for(let i = 0; i < res.data.modes[num].ltmMessage.length; i++){
                            ltmMessage += `${res.data.modes[num].ltmMessage[i]} \n`
                        }
                        
                        //check languages
                        if(lang === "en"){

                            //add fields
                            modeInfo.addFields(
                                {name: "LTM Message", value: ltmMessage}
                            )
                        }else if(lang === "ar"){

                            //add fields
                            modeInfo.addFields(
                                {name: "وصف الطور", value: ltmMessage}
                            )
                        }
                    }

                    //more info
                    if(res.data.modes[num].gameType === "BR"){
                    if(lang === "en") var gameType = "Battle Royale Mode"
                    else if(lang === "ar") var gameType = "طور باتل رويال اساسي"

                    }else if(res.data.modes[num].gameType === "BRArena"){
                    if(lang === "en") var gameType = "Battle Royale Arena Mode"
                    else if(lang === "ar") var gameType = "طور ارينا باتل رويال"

                    }else if(res.data.modes[num].gameType === "BRLTM"){
                    if(lang === "en") var gameType = "Battle Royale LTM"
                    else if(lang === "ar") var gameType = "طور باتل رويال مؤقت"

                    }else if(res.data.modes[num].gameType === "CreativeLTM"){
                    if(lang === "en") var gameType = "Creative LTM"
                    else if(lang === "ar") var gameType = "طور كريتف مؤقت"

                    }else if(res.data.modes[num].gameType === "BR"){
                    if(lang === "en") var gameType = "Creative Mode"
                    else if(lang === "ar") var gameType = "طور كريتف اساسي"

                    }else if(res.data.modes[num].gameType === "Social"){
                    if(lang === "en") var gameType = "Social Mode"
                    else if(lang === "ar") var gameType = "طور اجتماعي"

                    }else if(lang === "en") var gameType = "Other"
                    else if(lang === "ar") var gameType = "طور اخر"

                    //is large team [true]
                    if(res.data.modes[num].largeTeams === true)
                    if(lang === "en") var largeTeam = "Yes, it is"
                    else if(lang === "ar") var largeTeam = "نعم, طور كبير"

                    //is large team [false]
                    if(res.data.modes[num].largeTeams === false)
                    if(lang === "en") var largeTeam = "No, it is not"
                    else if(lang === "ar") var largeTeam = "لا, ليس طور كبير"

                    //check language
                    if(lang === "en"){

                        //add fields
                        modeInfo.addFields(
                            {name: "Plalist Type", value: gameType},
                            {name: "Max Team Size", value: res.data.modes[num].maxTeamSize},
                            {name: "is Large Team?", value: largeTeam},
                        )
                    }else if(lang === "ar"){

                        //add fields
                        modeInfo.addFields(
                            {name: "نوع الطور", value: gameType},
                            {name: "اعلى عدد مسموح", value: res.data.modes[num].maxTeamSize},
                            {name: "هل هو طور كبير؟", value: largeTeam},
                        )
                    }

                    //send the img
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.modes[num].id}.png`)
                    await message.channel.send(att)
                    message.channel.send(modeInfo)
                    msg.delete()
                })
            }
        })
    }
}