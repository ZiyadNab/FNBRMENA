const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const fn = require("fortnite-api-com");
const config = {
    apikey: FNBRMENA.APIKeys("FortniteAPI.com"),
    language: "en",
    debug: true
};
  
var Fortnite = new fn(config);

module.exports = {
    commands: 'map',
    descriptionEN: 'Returns a map image.',
    descriptionAR: 'أمر يسترجع لك صورة الماب.',
    expectedArgsEN: 'ُTo get the current map image use just the command, and if you want to get older map images type the season number from 1 till current season.',
    expectedArgsAR: 'للحصول على صورة الماب فقط اكتب الأمر. للحصول علي صورة مابات قديمة اكتب رقم السيزون من السيزون 1 حتى السيزون الحالي',
    hintEN: 'You can get a specific update map like season 3 chapter 2 you can get every map with seeing the water dries',
    hintAR: 'يمكنك الحصول على ماب لتحديث معين على سبيل المثال الموسم الثالث شابتر تو تقدر تحصل على صور كل تحديث و تشوف الماء يجف مع كل صورة.',
    argsExample: ['', '5', '13'],
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        // if the use did not add any season number
        if(text === ''){

            //generating animation
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Loading... ${loadingEmoji}`)
            else if(lang == "ar") generating.setTitle(`جاري التحميل... ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async gen => {

                //request data
                Fortnite.BRMap(lang)
                .then(async res => {

                    //get the image data
                    if(res.data.images.pois === null) var image = res.data.images.blank
                    else var image = res.data.images.pois

                    //registering font
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                    
                    //creating canvas
                    const canvas = Canvas.createCanvas(2048, 2048);
                    const ctx = canvas.getContext('2d');

                    //map image
                    const map = await Canvas.loadImage(image)
                    ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                    //credits
                    const credit = await Canvas.loadImage('./assets/Credits/FNBR_MENA.png');
                    ctx.drawImage(credit, 50, 1850, 550, 150);

                    //send the fish stats picture
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), 'map.png')
                    await message.channel.send(att)
                    gen.delete()

                })
            })
                
        }else{

            //request data
            fortniteAPI.listPreviousMaps()
            .then(async res => {

                //check if user entered a valid season that has images
                var season = []
                var counter = 0

                //loop throw every map abaliable
                for(let i = 0; i < res.maps.length; i++){

                    //if the season still didn't exists in the season array
                    if(!season.includes(res.maps[i].patchVersion.substring(0, res.maps[i].patchVersion.indexOf(".")))){

                        //store the season in the array
                        season[counter] = await res.maps[i].patchVersion.substring(0, res.maps[i].patchVersion.indexOf("."))

                        //change the index
                        counter++
                    }
                }

                // if the user entered a valid season number
                if(season.includes(text)){

                    //create listing embed
                    const list = new Discord.MessageEmbed()

                    //create the color
                    list.setColor(FNBRMENA.Colors("embed"))

                    //create the title
                    if(lang === "en"){
                        list.setTitle(`Please choose a map verion from the list below`)
                    }else if(lang === "ar"){
                        list.setTitle(`الرجاء اختيار تحديث من القائمة بالاسفل`)
                    }

                    //inisilizing the str to collect all map patches also reseting counter & season
                    season = []
                    var str = ""
                    counter = 0

                    //loop throw every patch
                    for(let i = 0; i < res.maps.length; i++){

                        //if the patch matches the season
                        if(res.maps[i].patchVersion.startsWith(text)){
                            var patch = await res.maps[i].patchVersion.substring(0, res.maps[i].patchVersion.indexOf("."))
                            if(text.length === patch.length){
                                str += "• " + counter + ": " + res.maps[i].patchVersion + "\n"
                                season[counter] = res.maps[i]
                                counter++
                            }
                        }
                    }

                    //add description
                    list.setDescription(str)

                    //send the message
                    await message.channel.send(list)
                    .then( async msg => {

                        //filtering
                        const filter = m => m.author.id === message.author.id

                        //reply message
                        if(lang === "en") var reply = "please choose from above list the command will stop listen in 20 sec"
                        else if(lang === "ar") var reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                        
                        //send the list of maps
                        message.reply(reply)
                        .then( async notify => {

                            //collect messages
                            await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                            .then( async collected => {

                                //if the user input in range
                                if(collected.first().content >= 0 && collected.first().content < counter){

                                    //generating animation
                                    const generating = new Discord.MessageEmbed()
                                    generating.setColor(FNBRMENA.Colors("embed"))
                                    if(lang === "en") generating.setTitle(`Loading... ${loadingEmoji}`)
                                    else if(lang == "ar") generating.setTitle(`جاري التحميل... ${loadingEmoji}`)
                                    message.channel.send(generating)
                                    .then( async gen => {

                                        //delete the list
                                        msg.delete()
                                        notify.delete()
                                        
                                        //get the image data
                                        if(season[collected.first().content].urlPOI === null) var image = season[collected.first().content].url
                                        else var image = season[collected.first().content].urlPOI

                                        //registering font
                                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                                        
                                        //creating canvas
                                        const canvas = Canvas.createCanvas(2048, 2048);
                                        const ctx = canvas.getContext('2d');

                                        //map image
                                        const map = await Canvas.loadImage(image)
                                        ctx.drawImage(map, 0, 0, canvas.width, canvas.height)

                                        //credits
                                        const credit = await Canvas.loadImage('./assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 50, 1850, 550, 150);

                                        //send the fish stats picture
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), res.maps[collected.first().content].patchVersion + '.png')
                                        await message.channel.send(att)
                                        gen.delete()
                                    })

                                }
                            }).catch(err => {

                                //console log the error
                                console.log(err)
                                msg.delete()
                                notify.delete()

                                //send the time error
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                message.reply(error)

                            })
                        })
                    })

                }else{

                    //create embed handleing the season error
                    const err = new Discord.MessageEmbed()
                    err.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") err.setTitle(`Sorry there is no season with that number ${errorEmoji}`)
                    else if(lang === "ar") err.setTitle(`عذرا لا يوجد موسم بنفس هذا الرقم ${errorEmoji}`)
                    message.channel.send(err)

                }
            })
        }
    }
}