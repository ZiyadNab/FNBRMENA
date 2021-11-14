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

            //request data
            await FNBRMENA.Stats(text, platforms[num], "lifetime")
            .then(async res =>{

                //generating message
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                message.reply(generating)
                .then(async msg => {

                    //push add, solo, duo, squads and LTM's
                    const statsData = []
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

                    //loop throw every stats feild
                    const tableWidth = 13
                    var rowData = []
                    for(let i = 0; i < statsData.length; i++){

                        //define hours played variable
                        var minutesPlayed = `${statsData[i].minutesPlayed / 60}`
                        if(minutesPlayed.includes('.')) minutesPlayed = minutesPlayed.substring(0, minutesPlayed.indexOf('.'))

                        //list of Coulmn names
                        rowData.push([
                            {NameEN: 'Matches', NameAR: 'المواجهات', Data: statsData[i].matches, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Wins', NameAR: 'الإنصارات', Data: statsData[i].wins, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Wins Rate', NameAR: 'م/الإنتصارات', Data: statsData[i].winRate, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Deaths', NameAR: 'الخسارات', Data: statsData[i].deaths, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Kills', NameAR: 'الذبحات', Data: statsData[i].kills, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'K.P.M', NameAR: 'ذ.ك.م', Data: statsData[i].killsPerMatch, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'K/D', NameAR: 'ك/د', Data: statsData[i].kd, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Hours Played', NameAR: 'ساعات اللعب', Data: minutesPlayed, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Top 3', NameAR: 'توب 3', Data: statsData[i].top3, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Top 5', NameAR: 'توب 5', Data: statsData[i].top5, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Top 10', NameAR: 'توب 10', Data: statsData[i].top10, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Top 25', NameAR: 'توب 25', Data: statsData[i].top25, xAxis: 190, yAxis: 97, index: i},
                            {NameEN: 'Last Time Played', NameAR: 'اخر لعب قبل', Data: statsData[i].lastModified, xAxis: 315, yAxis: 97, index: i},
                        ])
                    }
                    
                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                    
                    //applytext
                    const applyText = (canvas, text, font, width, langCheck) => {
                        const ctx = canvas.getContext('2d')
                        let fontSize = font
                        do {
                            if(langCheck){
                                if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                                else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                                
                            }else ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                        } while (ctx.measureText(text).width > width)
                        return ctx.font
                    }

                    //creating canvas
                    const canvas = Canvas.createCanvas(625 + tableWidth * 300, 2160);
                    const ctx = canvas.getContext('2d');

                    //get random color
                    const randomNumber = async (list) => {
                        return Math.floor(Math.random() * list)
                    }

                    //backgroundInisilizer function
                    const backgroundInisilizer = async (randomColor) => {

                        const backgroundGRD = ctx.createLinearGradient(0, canvas.height, canvas.width, 0)
                        backgroundGRD.addColorStop(0, `#${listOfColors[randomColor].substring(0, listOfColors[randomColor].indexOf(','))}`)
                        backgroundGRD.addColorStop(1, `#${listOfColors[randomColor].substring(listOfColors[randomColor].indexOf(',') + 1, listOfColors[randomColor].length)}`)
                        ctx.fillStyle = backgroundGRD
                        ctx.fillRect(0, 0, canvas.width, canvas.height) //background

                        //get a random loadingscreen
                        const listOfLoadingscreans = await FNBRMENA.Search(lang, "custom", "&type=loadingscreen")
                        ctx.globalAlpha = 0.5;
                        const randomImage = await randomNumber(listOfLoadingscreans.data.items.length)
                        const loadingscreanIMG = await Canvas.loadImage(listOfLoadingscreans.data.items[randomImage].images.featured)
                        ctx.drawImage(loadingscreanIMG, 0, 0, canvas.width, canvas.height)
                        ctx.globalAlpha = 1;

                        const leftHandSideGRD = ctx.createLinearGradient(3300, canvas.height + 200, canvas.width + 1000, 0)
                        leftHandSideGRD.addColorStop(0, `#${listOfColors[randomColor].substring(0, listOfColors[randomColor].indexOf(','))}`)
                        leftHandSideGRD.addColorStop(1, `#${listOfColors[randomColor].substring(listOfColors[randomColor].indexOf(',') + 1, listOfColors[randomColor].length)}`)
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
                        ctx.fillRect(x, y, w + 70, h)
                        ctx.globalAlpha = 1
                        ctx.fillStyle = '#00ff00';
                        ctx.fillRect(x, y, ((res.data.data.battlePass.progress / 100) * w) + 70, h)

                        //add the progress percentage
                        ctx.fillStyle = '#ffffff';
                        ctx.font = '80px Burbank Big Condensed'
                        ctx.fillText(`${res.data.data.battlePass.progress}%`, ((res.data.data.battlePass.progress / 100) * w) + 80, y + 68)

                        //add the lvl pin
                        const lvlPIN = await Canvas.loadImage('https://imgur.com/o0AGlt6.png')
                        ctx.drawImage(lvlPIN, ((res.data.data.battlePass.progress / 100) * w) + 30, y - 80, 80, 80)

                        //add the xp lvl text
                        ctx.textAlign='center';
                        if(lang === "en") ctx.fillText(`${res.data.data.battlePass.level} lvl`, ((res.data.data.battlePass.progress / 100) * w) + 70, y - 100)
                        else{
                            ctx.font = '80px Arabic'
                            ctx.fillText(`${res.data.data.battlePass.level} لفل`, ((res.data.data.battlePass.progress / 100) * w) + 70, y - 100)
                        }
                    }

                    //randomOutfit function
                    const randomOutfit = async () => {

                        //request data
                        await FNBRMENA.Search(lang, "custom", "gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
                        .then(async listOfOutfits => {

                            do {
                                var randomImage = await randomNumber(listOfOutfits.data.items.length)

                            } while(listOfOutfits.data.items[randomImage].builtInEmote !== null &&
                                listOfOutfits.data.items[randomImage].styles.length > 2)

                            //outfit img
                            const outfitIMG = await Canvas.loadImage(listOfOutfits.data.items[randomImage].images.featured)
                            ctx.drawImage(outfitIMG, canvas.width - 1250, 300, 1860, 1860)
                        })
                    }

                    //line boarders
                    const rowLine = async (x, y, randomColor) => {
                        ctx.fillStyle = `#${listOfColors[randomColor].substring(listOfColors[randomColor].indexOf(',') + 1, listOfColors[randomColor].length)}`
                        ctx.globalAlpha = 0.5
                        ctx.fillRect(x, y, 90, 150)
                        ctx.globalAlpha = 1
                        ctx.fillStyle = '#ffffff';

                    }

                    //tags
                    const Tags = async (text, size) => {
                        ctx.textAlign = 'center';
                        applyText(canvas, text, 75, size, true)
                        ctx.fillText(text, x, y - 40)
                    }

                    //add new column to the board
                    const newColumn = async (Path ,ColumnNameEN, ColumnNameAR, xAxis, yAxis, i, randomColor) => {

                        if(ColumnNameEN !== "Hours Played" && ColumnNameEN !== "Last Time Played"){
                            if(Path !== undefined){
                                applyText(canvas, Path, 75, 185, false)
                                ctx.fillText(Path, x += xAxis, y + yAxis) //add the wins
                            }else ctx.fillText('?', x += xAxis, y + yAxis) //add the wins

                            //add the line value name
                            if(i === 0){
                                if(lang === "en") Tags(ColumnNameEN, 275)
                                if(lang === "ar") Tags(ColumnNameAR, 275)
                            }
                            
                            //add the line
                            await rowLine(x += 100, y, randomColor)

                        }else if(ColumnNameEN === "Last Time Played"){

                            if(Path !== undefined){
                                moment.locale(lang)
                                const lastModified = moment.duration(moment.tz(moment(), timezone).diff(moment.tz(moment(Path), timezone)))
                                const days = lastModified.asDays().toString().substring(0, lastModified.asDays().toString().indexOf("."))

                                if(lang === "en"){
                                    ctx.font = '80px Burbank Big Condensed'

                                    //if days r more than 1
                                    if(days >= 1) ctx.fillText(`${days} days ago`, x += xAxis, y + yAxis) //add the lastModified

                                    //if hours more than 1
                                    else if(lastModified.hours() >= 1) ctx.fillText(`${lastModified.hours()} hours ago`, x += xAxis, y + yAxis) //add the lastModified

                                    //else add minutes
                                    else ctx.fillText(`${lastModified.minutes()} minutes ago`, x += xAxis, y + yAxis) //add the lastModified

                                }else if(lang === "ar"){
                                    ctx.font = '80px Arabic'

                                    //if days r more than 1
                                    if(days >= 1) ctx.fillText(`${days} يوم مضى`, x += xAxis, y + yAxis) //add the lastModified
                                    
                                    //if hours more than 1
                                    else if(lastModified.hours() >= 1) ctx.fillText(`${lastModified.hours()} ساعة مضت`, x += xAxis, y + yAxis) //add the lastModified

                                    //else add minutes
                                    else ctx.fillText(`${lastModified.minutes()} دقائق مضت`, x += xAxis, y + yAxis) //add the lastModified
                                }
                            }
                            else ctx.fillText('?', x += xAxis, y + yAxis) //add the lastModified

                            //add the line value name
                            if(i === 0){
                                if(lang === "en") Tags(ColumnNameEN, 400)
                                if(lang === "ar") Tags(ColumnNameAR, 400)
                            }

                        }
                    }

                    //get a random color
                    const randomColor = await randomNumber(listOfColors.length)

                    //create grediant background
                    await backgroundInisilizer(randomColor)

                    //get random outfit and draw it
                    await randomOutfit()

                    //define x, y and data array
                    var x = 250
                    var y = 500

                    //loop throw every stat
                    for(let i = 0; i < rowData.length; i++){

                        //set and draw lines color
                        ctx.fillStyle = `#${listOfColors[randomColor].substring(0, listOfColors[randomColor].indexOf(','))}`
                        ctx.globalAlpha = 0.5
                        ctx.fillRect(x, y, canvas.width - (x * 2), 150)
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
                        
                        //loop throw the statsDrawer length
                        await rowLine(x += 150, y, randomColor)

                        //loop throw every column
                        for(const lineData of rowData[i])
                        await newColumn(lineData.Data, lineData.NameEN, lineData.NameAR, lineData.xAxis, lineData.yAxis, lineData.index, randomColor)

                        //get to the next row
                        y += 150 + 113
                        x = 250

                    }

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
                    await message.reply(noUserHasBeenFoundError)

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