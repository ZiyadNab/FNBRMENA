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
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //list of colors
        const listOfColors = [
            '00e7ff,0006ff',
            'FF00F3,9700FF',
            '23FF00,116F02',
            'FF0000,8C0000',
            'E1FEFE,66FFFF',
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
        const statsPlatformEmbed = new Discord.EmbedBuilder()
        statsPlatformEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            statsPlatformEmbed.setTitle(`Select a Platform`)
            statsPlatformEmbed.setDescription('Please click on the Drop-Down menu and select a platform.\n`You have only 30 seconds until this operation ends, Make it quick`!')
        }else if(userData.lang === "ar"){
            statsPlatformEmbed.setTitle(`اختر منصه`)
            statsPlatformEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع المنصه.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
        }

        //create a row for cancel button
        const buttonDataRow = new Discord.ActionRowBuilder()
        
        //add EN cancel button
        if(userData.lang === "en") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )

        else if(userData.lang === "ar") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )

        //create a row for drop down menu for categories
        const statsPlatformRow = new Discord.ActionRowBuilder()

        const statsPlatformDropMenu = new Discord.SelectMenuBuilder()
        statsPlatformDropMenu.setCustomId('platform')
        if(userData.lang === "en") statsPlatformDropMenu.setPlaceholder('Nothing selected!')
        else if(userData.lang === "ar") statsPlatformDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for en
        if(userData.lang === "en") statsPlatformDropMenu.addOptions(
            {
                label: `Epic Games`,
                value: `epic`,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `Playstation`,
                value: `psn`,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `Xbox`,
                value: `xbl`,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        //add options for ar
        else if(userData.lang === "ar") statsPlatformDropMenu.addOptions(
            {
                label: `ايبك قيمز`,
                value: `epic`,
                emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
            },
            {
                label: `بلايستيشن`,
                value: `psn`,
                emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
            },
            {
                label: `اكسبوكس`,
                value: `xbl`,
                emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
            }
        )

        //add the drop menu to the categoryDropMenu
        statsPlatformRow.addComponents(statsPlatformDropMenu)

        //send the message
        const dropMenuMessage = await message.reply({embeds: [statsPlatformEmbed], components: [statsPlatformRow, buttonDataRow]})

        //filtering the user clicker
        const filter = i => i.user.id === message.author.id

        //await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel") dropMenuMessage.delete()

            //if the user selected a platform
            if(collected.customId === "platform"){
                dropMenuMessage.delete()

                //request data
                await FNBRMENA.Stats(text, collected.values[0], "lifetime")
                .then(async res =>{

                    //generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Loading item data... ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${emojisObject.loadingEmoji}`)
                    message.reply({embeds: [generating]})
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
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                        
                        //applytext
                        const applyText = (canvas, text, font, width, langCheck) => {
                            const ctx = canvas.getContext('2d')
                            let fontSize = font
                            do {
                                if(langCheck){
                                    if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                                    else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                                    
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
                            const listOfLoadingscreans = await FNBRMENA.Search(userData.lang, "custom", "&type=loadingscreen")
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
                            if(userData.lang === "en") ctx.fillText(`${res.data.data.battlePass.level} lvl`, ((res.data.data.battlePass.progress / 100) * w) + 70, y - 100)
                            else{
                                ctx.font = '80px Arabic'
                                ctx.fillText(`${res.data.data.battlePass.level} لفل`, ((res.data.data.battlePass.progress / 100) * w) + 70, y - 100)
                            }
                        }

                        //randomOutfit function
                        const randomOutfit = async () => {

                            //request data
                            await FNBRMENA.Search(userData.lang, "custom", "&gameplayTags=Cosmetics.Source.ItemShop&type=outfit&images.featured=*png")
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
                                    if(userData.lang === "en") Tags(ColumnNameEN, 275)
                                    if(userData.lang === "ar") Tags(ColumnNameAR, 275)
                                }
                                
                                //add the line
                                await rowLine(x += 100, y, randomColor)

                            }else if(ColumnNameEN === "Last Time Played"){

                                if(Path !== undefined){
                                    moment.locale(userData.lang)
                                    const lastModified = moment.duration(moment.tz(moment(), userData.timezone).diff(moment.tz(moment(Path), userData.timezone)))
                                    const days = lastModified.asDays().toString().substring(0, lastModified.asDays().toString().indexOf("."))

                                    if(userData.lang === "en"){
                                        ctx.font = '80px Burbank Big Condensed'

                                        //if days r more than 1
                                        if(days >= 1) ctx.fillText(`${days} days ago`, x += xAxis, y + yAxis) //add the lastModified

                                        //if hours more than 1
                                        else if(lastModified.hours() >= 1) ctx.fillText(`${lastModified.hours()} hours ago`, x += xAxis, y + yAxis) //add the lastModified

                                        //else add minutes
                                        else ctx.fillText(`${lastModified.minutes()} minutes ago`, x += xAxis, y + yAxis) //add the lastModified

                                    }else if(userData.lang === "ar"){
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
                                    if(userData.lang === "en") Tags(ColumnNameEN, 400)
                                    if(userData.lang === "ar") Tags(ColumnNameAR, 400)
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
                            if(userData.lang === "en"){
                                ctx.font = '97px Burbank Big Condensed'
                                ctx.fillText(listOfTypes[i], x, y + 97)
                            }else if(userData.lang === "ar"){
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
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.data.account.name}.png`})
                        await message.reply({files: [att]})
                        msg.delete()

                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

                    })
                
                }).catch(async err => {
                    if(err.response.data.status === 404){

                        if(err.response.data.error === "the requested account does not exist"){

                            //epic games string
                            if(collected.values[0] === "epic" && userData.lang === "en") var usedPlatform = 'Epicgames'
                            else if(collected.values[0] === "epic" && userData.lang === "ar") var usedPlatform = 'ايبك قيمز'

                            //psn string
                            if(collected.values[0] === "psn" && userData.lang === "en") var usedPlatform = 'Playstation'
                            else if(collected.values[0] === "psn" && userData.lang === "ar") var usedPlatform = 'بلايستيشن'

                            //xbl string
                            if(collected.values[0] === "xbl" && userData.lang === "en") var usedPlatform = 'XBOX'
                            else if(collected.values[0] === "xbl" && userData.lang === "ar") var usedPlatform = 'اكسبوكس'

                            const noUserHasBeenFoundError = new Discord.EmbedBuilder()
                            noUserHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noUserHasBeenFoundError.setTitle(`Can't find ${text} in ${usedPlatform} platform. Please try again ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") noUserHasBeenFoundError.setTitle(`لا يمكنني العثور على حساب ${text} في منصه ${usedPlatform}. حاول مجددا ${emojisObject.errorEmoji}`)
                            await message.reply({embeds: [noUserHasBeenFoundError]})

                        }else if(err.response.data.error === "the requested profile didnt play any match yet"){

                            const noMatchsPlayedYetError = new Discord.EmbedBuilder()
                            noMatchsPlayedYetError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noMatchsPlayedYetError.setTitle(`The ${text} account hasn't played any matchs yet ${emojisObject.errorEmoji}`)
                            else if(userData.lang === "ar") noMatchsPlayedYetError.setTitle(`صاحب حساب ${text} لم يلعب اي مباراة حتى الأن ${emojisObject.errorEmoji}`)
                            await message.reply({embeds: [noMatchsPlayedYetError]})

                        }

                    }else if(err.response.data.status === 403){

                        const theUserAccountIsPrivate = new Discord.EmbedBuilder()
                        theUserAccountIsPrivate.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") theUserAccountIsPrivate.setTitle(`Can't get access to ${text} because the user account is private. ${emojisObject.errorEmoji}`)
                        else if(userData.lang === "ar") theUserAccountIsPrivate.setTitle(`لا يمكنني الحصول على صلاحية إحصائيات ${text} بسبب ان الحساب خاص. ${emojisObject.errorEmoji}`)
                        await message.reply(theUserAccountIsPrivate)

                    }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }
        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}