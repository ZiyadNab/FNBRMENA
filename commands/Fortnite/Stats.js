const Canvas = require('canvas')
const moment = require('moment')
require('moment-timezone')

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

        //get the user timezone from the database
        const timezone = await FNBRMENA.Admin(admin, message, "", "Timezone")

        //define variables
        var num = 0
        const platforms = [
            'epic',
            'psn',
            'xbl'
        ]

        //list of colors
        const listOfColors = [
            '00e7ff,0006ff',
            'FF00F3,9700FF',
            '23FF00,116F02',
            'FF0000,8C0000',
            '00FFAA,01764F',
            'FF0080,810041',
            'AE00FF,570180',
            '6400FF,330180',
            'A6FF00,588701',
            'F4FF00,818701',
            'FFAA00,895C01',
            '9E00FF,D086FD'
        ]

        //list of types
        const listOfTypes = [
            'All',
            'Solo',
            'Duo',
            'Squads',
            'LTMs',
            'الكل',
            'سولو',
            'دو',
            'سكواد',
            'اطوار'
        ]

        //get random color
        var randomImage = Math.floor(Math.random() * listOfColors.length)

        //backgroundInisilizer function
        const backgroundInisilizer = async (ctx, canvas, res) => {

            const backgroundGRD = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
            backgroundGRD.addColorStop(0, `#${listOfColors[randomImage].substring(0, listOfColors[randomImage].indexOf(','))}`)
            backgroundGRD.addColorStop(1, `#${listOfColors[randomImage].substring(listOfColors[randomImage].indexOf(',') + 1, listOfColors[randomImage].length)}`)
            ctx.fillStyle = backgroundGRD
            ctx.fillRect(0, 0, canvas.width, canvas.height) //background

            const leftHandSideGRD = ctx.createLinearGradient(3300, canvas.height + 200, canvas.width + 1000, 0)
            leftHandSideGRD.addColorStop(0, `#${listOfColors[randomImage].substring(0, listOfColors[randomImage].indexOf(','))}`)
            leftHandSideGRD.addColorStop(1, `#${listOfColors[randomImage].substring(listOfColors[randomImage].indexOf(',') + 1, listOfColors[randomImage].length)}`)
            ctx.fillStyle = leftHandSideGRD
            ctx.save()
            ctx.translate(canvas.width - 190, 0);
            ctx.rotate(Math.PI / 19);
            ctx.translate(-(canvas.width - 190), -0);
            ctx.fillRect(canvas.width - 190, -100, 1000, canvas.height + 200); //left hand side
            ctx.restore()

            //add the credits
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='left';
            ctx.font = '100px Burbank Big Condensed'
            ctx.fillText(`FNBRMENA | ${res.data.data.account.name}`, 30, 110)

            //define xp bar variables
            var w = canvas.width - 1000
            var h = 80
            var x = 0
            var y = canvas.height - h

            //add the xp process
            ctx.fillStyle = '#96fe7e';
            ctx.globalAlpha = 0.5
            ctx.fillRect(x, y, w, h)
            ctx.globalAlpha = 1
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(x, y, (res.data.data.battlePass.progress / 100) * w, h)

            //add the progress percentage
            ctx.fillStyle = '#ffffff';
            ctx.font = '80px Burbank Big Condensed'
            ctx.fillText(`${res.data.data.battlePass.progress}%`, ((res.data.data.battlePass.progress / 100) * w) + 10, y + 68)

            //add the lvl pin
            const lvlPIN = await Canvas.loadImage('https://imgur.com/o0AGlt6.png')
            ctx.drawImage(lvlPIN, ((res.data.data.battlePass.progress / 100) * w) - 40, y - 80, 80, 80)

            //add the xp lvl text
            ctx.textAlign='center';
            if(lang === "en") ctx.fillText(`${res.data.data.battlePass.level} lvl`, ((res.data.data.battlePass.progress / 100) * w), y - 100)
            else{
                ctx.font = '80px Arabic'
                ctx.fillText(`${res.data.data.battlePass.level} لفل`, ((res.data.data.battlePass.progress / 100) * w), y - 100)
            }
        }

        //randomOutfit function
        const randomOutfit = async (ctx, canvas) => {

            //request data
            await FNBRMENA.Search(lang, "custom", "gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
            .then(async listOfOutfits => {

                do {
                    var randomImage = Math.floor(Math.random() * listOfOutfits.data.items.length)

                } while(listOfOutfits.data.items[randomImage].builtInEmote !== null &&
                    listOfOutfits.data.items[randomImage].styles.length > 2)

                //outfit img
                const outfitIMG = await Canvas.loadImage(listOfOutfits.data.items[randomImage].images.featured)
                ctx.drawImage(outfitIMG, canvas.width - 1250, 300, 1860, 1860)
            })
        }

        //boardDrawer function
        const boardDrawer = async (ctx, canvas, res, statsType) => {

            //applytext
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d')
                let fontSize = 75
                do {
                    ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                } while (ctx.measureText(text).width > 185)
                return ctx.font
            }

            //define x, y and data array
            var x = 250
            var y = 500
            const statsData = []

            //push add, solo, duo, squads and LTM's
            if(res.data.data.stats.all.overall !== null) statsData.push(res.data.data.stats.all.overall)
            else statsData.push({ })
            if(res.data.data.stats.all.solo !== null) statsData.push(res.data.data.stats.all.solo)
            else statsData.push({ })
            if(res.data.data.stats.all.duo !== null) statsData.push(res.data.data.stats.all.duo)
            else statsData.push({ })
            if(res.data.data.stats.all.squad !== null) statsData.push(res.data.data.stats.all.squad)
            else statsData.push({ })
            if(res.data.data.stats.all.ltm !== null) statsData.push(res.data.data.stats.all.ltm)
            else statsData.push({ })

            //line boarders
            const lineBoarders = async (x, y) => {

                ctx.fillStyle = `#${listOfColors[randomImage].substring(listOfColors[randomImage].indexOf(',') + 1, listOfColors[randomImage].length)}`
                ctx.globalAlpha = 0.6
                ctx.fillRect(x, y, 90, 150)
                ctx.globalAlpha = 1
                ctx.fillStyle = '#ffffff';

            }

            //loop throw every stat
            for(let i = 0; i < statsData.length; i++){

                //set and draw lines color
                ctx.fillStyle = `#${listOfColors[randomImage].substring(0, listOfColors[randomImage].indexOf(','))}`
                ctx.globalAlpha = 0.6
                ctx.fillRect(x, y, 4000, 150)
                ctx.globalAlpha = 1

                //change x value
                x += 130

                //add the modes
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                if(lang === "en"){
                    ctx.font = '97px Burbank Big Condensed'
                    ctx.fillText(listOfTypes[i], x, y + 97)
                }else if(lang === "ar"){
                    ctx.font = '97px Arabic'
                    ctx.fillText(listOfTypes[i + 5], x, y + 97)

                }
                
                await lineBoarders(x += 150, y)
                if(statsData[i].wins !== undefined){
                    applyText(canvas, statsData[i].wins)
                    ctx.fillText(statsData[i].wins, x += 190, y + 97) //add the wins
                }else ctx.fillText('?', x += 190, y + 97) //add the wins

                await lineBoarders(x += 100, y)
                if(statsData[i].winRate !== undefined){
                    applyText(canvas, statsData[i].winRate)
                    ctx.fillText(statsData[i].winRate, x += 190, y + 97) //add the wins rate
                }else ctx.fillText('?', x += 190, y + 97) //add the wins rate

                await lineBoarders(x += 100, y)
                if(statsData[i].matches !== undefined){
                    applyText(canvas, statsData[i].matches)
                    ctx.fillText(statsData[i].matches, x += 190, y + 97) //add the matches
                }else ctx.fillText('?', x += 190, y + 97) //add the matches

                await lineBoarders(x += 100, y)
                if(statsData[i].kills !== undefined){
                    applyText(canvas, statsData[i].kills)
                    ctx.fillText(statsData[i].kills, x += 190, y + 97) //add the kills
                }else ctx.fillText('?', x += 190, y + 97) //add the kills

                await lineBoarders(x += 100, y)
                if(statsData[i].kd !== undefined){
                    applyText(canvas, statsData[i].kd)
                    ctx.fillText(statsData[i].kd, x += 190, y + 97) //add the kd
                }else ctx.fillText('?', x += 190, y + 97) //add the kd

                await lineBoarders(x += 100, y)
                if(statsData[i].deaths !== undefined){
                    applyText(canvas, statsData[i].deaths)
                    ctx.fillText(statsData[i].deaths, x += 190, y + 97) //add the deaths
                }else ctx.fillText('?', x += 190, y + 97) //add the deaths

                await lineBoarders(x += 100, y)
                if(statsData[i].minutesPlayed !== undefined){
                    var hours = `${statsData[i].minutesPlayed / 60}`
                    if(hours.includes('.')) hours = hours.substring(0, `${(statsData[i].minutesPlayed / 60)}`.indexOf('.'))

                    applyText(canvas, hours)
                    ctx.fillText(`${hours}`, x += 190, y + 97) //add the hours plays
                }else ctx.fillText('?', x += 190, y + 97) //add the hours plays

                await lineBoarders(x += 100, y)
                if(statsData[i].top3 !== undefined){
                    applyText(canvas, statsData[i].top3)
                    ctx.fillText(statsData[i].top3, x += 190, y + 97) //add the top3
                }else ctx.fillText('?', x += 190, y + 97) //add the top3

                await lineBoarders(x += 100, y)
                if(statsData[i].top5 !== undefined){
                    applyText(canvas, statsData[i].top5)
                    ctx.fillText(statsData[i].top5, x += 190, y + 97) //add the top5
                }else ctx.fillText('?', x += 190, y + 97) //add the top5

                await lineBoarders(x += 100, y)
                if(statsData[i].top10 !== undefined){
                    applyText(canvas, statsData[i].top10)
                    ctx.fillText(statsData[i].top10, x += 190, y + 97) //add the top10
                }else ctx.fillText('?', x += 190, y + 97) //add the top10

                await lineBoarders(x += 100, y)
                if(statsData[i].top25 !== undefined){
                    applyText(canvas, statsData[i].top25)
                    ctx.fillText(statsData[i].top25, x += 190, y + 97) //add the top25
                }else ctx.fillText('?', x += 190, y + 97) //add the top25

                await lineBoarders(x += 100, y)
                if(statsData[i].lastModified !== undefined){
                    moment.locale(lang)
                    const lastModified = moment.duration(moment.tz(moment(), timezone).diff(moment.tz(moment(statsData[i].lastModified), timezone)))
                    if(lang === "en"){
                        ctx.font = '80px Burbank Big Condensed'
                        if(lastModified.days() >= 1) ctx.fillText(`${lastModified.days()} days ago`, x += 315, y + 97) //add the lastModified
                        else ctx.fillText(`${lastModified.hours()} hours ago`, x += 315, y + 97) //add the lastModified
                    }else if(lang === "ar"){
                        ctx.font = '80px Arabic'
                        if(lastModified.days() >= 1) ctx.fillText(`${lastModified.days()} يوم مضى`, x += 315, y + 97) //add the lastModified
                        else ctx.fillText(`${lastModified.hours()} ساعة مضت`, x += 315, y + 97) //add the lastModified
                    }
                }
                else ctx.fillText('?', x += 190, y + 97) //add the lastModified

                y += 150 + 113
                x = 500

            }
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
                    const canvas = Canvas.createCanvas(4500, 2160);
                    const ctx = canvas.getContext('2d');

                    //create grediant background
                    await backgroundInisilizer(ctx, canvas, res)
                    
                    await randomOutfit(ctx, canvas)

                    //board drawer
                    await boardDrawer(ctx, canvas, res, "all")

                    //send the stats message
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.data.account.name}.png`)
                    await message.reply(att)
                    msg.delete()

                })
            
            }).catch(async err => {

                if(err.response.data.error === "the requested account does not exist"){
                        
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
                    await message.reply({embeds: [noUserHasBeenFoundError]})

                }else if(err.response.data.error === "the requested profile didnt play any match yet"){

                    const noMatchsPlayedYetError = new Discord.MessageEmbed()
                    noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") noMatchsPlayedYetError.setTitle(`The ${text} account hasn't played any matchs yet ${errorEmoji}`)
                    else if(lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب ${text} لم يلعب اي مباراة حتى الأن ${errorEmoji}`)
                    await message.reply(noMatchsPlayedYetError)

                }else if(err.response.data.status === 403){

                    const theUserAccountIsPrivate = new Discord.MessageEmbed()
                    theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") theUserAccountIsPrivate.setTitle(`Can't get access to ${text} because the user account is private. ${errorEmoji}`)
                    else if(lang === "ar") theUserAccountIsPrivate.setTitle(`لا يمكنني الحصول على صلاحية إحصائيات ${text} بسبب ان الحساب خاص. ${errorEmoji}`)
                    await message.reply(theUserAccountIsPrivate)

                }
            })
        }
    }
}