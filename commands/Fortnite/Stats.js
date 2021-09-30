const Canvas = require('canvas')

module.exports = {
    commands: 'stats',
    type: 'Fortnite',
    descriptionEN: 'Use this command to extract the account stats.',
    descriptionAR: 'أستعمل الأمر لأستخراج جميع احصائيات الحساب.',
    expectedArgsEN: 'Use this command then type the use EPICGAMES displayname',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم اي حساب شخص على منصة ايبك قيمز',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //define variables
        var num = 0
        const platforms = [
            'epic',
            'psn',
            'xbl'
        ]

        //backgroundInisilizer function
        const backgroundInisilizer = async (ctx, canvas) => {

            //list of colors
            const listOfColors = [
                '00e7ff,0006ff',
            ]

            //get random color
            var randomImage = Math.floor(Math.random() * listOfColors.length)

            const backgroundGRD = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
            backgroundGRD.addColorStop(0, `#${listOfColors[randomImage].substring(0, listOfColors[randomImage].indexOf(','))}`)
            backgroundGRD.addColorStop(1, `#${listOfColors[randomImage].substring(listOfColors[randomImage].indexOf(',') + 1, listOfColors[randomImage].length)}`)
            ctx.fillStyle = backgroundGRD
            ctx.fillRect(0, 0, canvas.width, canvas.height) //background

            const leftHandSideGRD = ctx.createLinearGradient(3300, canvas.height + 200, 5000, 0)
            leftHandSideGRD.addColorStop(0, `#${listOfColors[randomImage].substring(0, listOfColors[randomImage].indexOf(','))}`)
            leftHandSideGRD.addColorStop(1, `#${listOfColors[randomImage].substring(listOfColors[randomImage].indexOf(',') + 1, listOfColors[randomImage].length)}`)
            ctx.fillStyle = leftHandSideGRD
            ctx.save()
            ctx.translate(3650, 0);
            ctx.rotate(Math.PI / 19);
            ctx.translate(-3650, -0);
            ctx.fillRect(3650, -100, 1000, canvas.height + 200); //left hand side
            ctx.restore()
        }

        //create an embed
        const choosePlatform = new Discord.MessageEmbed()
        choosePlatform.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            choosePlatform.setTitle(`Please specify your search types`)
            choosePlatform.setDescription(`0: Epicgames\n1: Playstation\n2: XBOX`)
        }else if(lang === "ar"){
            choosePlatform.setTitle(`الرجاء اختيار نوع عملية البحث`)
            choosePlatform.setDescription(`0: ايبك قيمز\n1: بلايستيشن\n2: اكسبوكس`)
        }

        //filtering
        const filter = async m => await m.author.id === message.author.id

        //add the reply
        if(lang === "en") var reply = "please choose from above list the command will stop listen in 20 sec"
        else if(lang === "ar") var reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

        //send the message
        const access = await message.reply(reply,choosePlatform)
        .then(async notify => {

            //await messages
            return await message.channel.awaitMessages(filter, {max: 1, time: 20000})
            .then(async collected => {

                //delete messages
                notify.delete()

                if(collected.first().content >= 0 && collected.first().content < platforms.length){
                    num = collected.first().content
                    return true
                }else{

                    //create out of range embed
                    const outOfRangeError = new Discord.MessageEmbed()
                    outOfRangeError.setColor(FNBRMENA.Colors("embed"))
                    outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", lang)} ${errorEmoji}`)
                    await message.reply(outOfRangeError)
                    return false
                }

            }).catch(async err => {

                //error hapeened
                notify.delete()

                //time has passed
                const timeError = new Discord.MessageEmbed()
                timeError.setColor(FNBRMENA.Colors("embed"))
                timeError.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                await message.reply(timeError)

                return false
            })
        }).catch(async err => {

            //request entry too large error
            if(err instanceof DiscordAPIError){
                const requestEntryTooLargeError = new Discord.MessageEmbed()
                requestEntryTooLargeError.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") requestEntryTooLargeError.setTitle(`Request entry too large ${errorEmoji}`)
                else if(lang === "ar") requestEntryTooLargeError.setTitle(`تم تخطي الكميه المحدودة ${errorEmoji}`)
                await message.reply(requestEntryTooLargeError)

            }
            return false

        })

        //if the access is true
        if(access){

            await FNBRMENA.Stats(text, platforms[num], "lifetime")
            .then(async res =>{

                //generating message
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                message.reply(generating)
                .then(async msg => {

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //creating canvas
                    const canvas = Canvas.createCanvas(3840, 2160);
                    const ctx = canvas.getContext('2d');

                    //create grediant background
                    await backgroundInisilizer(ctx, canvas)

                    //add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '50px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 15, 55)

                    //add the xp process
                    ctx.fillStyle = '#96fe7e';
                    ctx.globalAlpha = 0.5
                    ctx.fillRect(0, 926, 60, 1234)
                    ctx.globalAlpha = 1
                    ctx.fillStyle = '#00ff00';
                    ctx.fillRect(0, canvas.height - (res.data.data.battlePass.progress / 100) * 1234, 60, (res.data.data.battlePass.progress / 100) * 1234)

                    //add the xp bar
                    const pin = await Canvas.loadImage('https://imgur.com/LNmg342.png')
                    ctx.drawImage(pin, 65, (canvas.height - (res.data.data.battlePass.progress / 100) * 1234) + 25, 50, 50)

                    //send the stats message
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.data.account.name}.png`)
                    await message.reply(att)
                    msg.delete()

                })
            
            }).catch(async err => {
                if(err.response.data.status === 404){

                    //epic games string
                    if(platforms[num] === "epic" && lang === "en") var usedPlatform = 'Epicgames'
                    else if(platforms[num] === "epic" && lang === "ar") var usedPlatform = 'ايبك قيمز'

                    //psn string
                    if(platforms[num] === "psn" && lang === "en") var usedPlatform = 'Playstation'
                    else if(platforms[num] === "psn" && lang === "ar") var usedPlatform = 'بلايستيشن'

                    //xbl string
                    if(platforms[num] === "xbl" && lang === "en") var usedPlatform = 'XBOX'
                    else if(platforms[num] === "xbl" && lang === "ar") var usedPlatform = 'اكسبوكس'

                    const noUserHasBeenFoundError = new Discord.MessageEmbed()
                    noUserHasBeenFoundError.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") noUserHasBeenFoundError.setTitle(`Can't find ${text} in ${usedPlatform} platform. Please try again ${errorEmoji}`)
                    else if(lang === "ar") noUserHasBeenFoundError.setTitle(`لا يمكنني العثور على حساب ${text} في منصه ${usedPlatform}. حاول مجددا ${errorEmoji}`)
                    await message.reply(noUserHasBeenFoundError)

                }
            })
        }
    }
}