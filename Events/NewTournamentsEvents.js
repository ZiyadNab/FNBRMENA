const Discord = require('discord.js')
const Canvas = require('canvas')
const config = require('../Coinfigs/config.json')
const moment = require('moment')
const tz = require('moment-timezone')
const probe = require('probe-image-size')

module.exports = async (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Tournament)
    const logs = client.channels.cache.find(channel => channel.id === '876077567269023754')

    //result
    var CalendarResponse = []
    var NewCalendarResponse = []
    var number = 0

    //handle the blogs
    const NewTournaments = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("newtournaments").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push.Status
            const Id = data.val().Push.Id

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.CompCalendarEndpoint(lang)
                .then(async res => {

                    //constant to make woring easy
                    const CalendarTournamentsDATA = await res.data.eventsData

                    //storing the first start up
                    if(number === 0){

                        //storing tournament informations from the calendar endpoint
                        for(let i = 0; i < CalendarTournamentsDATA.length; i++){
                            CalendarResponse[i] = await CalendarTournamentsDATA[i].displayDataId
                        }

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push){
                        for(let i = 0; i < CalendarTournamentsDATA.length; i++){
                            if(CalendarResponse[i] === Id){
                                CalendarResponse[i] = []
                            }
                        }
                    }

                    //storing tournament informations from the comp calendar endpoint
                    for(let i = 0; i < CalendarTournamentsDATA.length; i++){
                        NewCalendarResponse[i] = await CalendarTournamentsDATA[i].displayDataId
                    }

                    //if the data was modified 
                    if(JSON.stringify(NewCalendarResponse) !== JSON.stringify(CalendarResponse)){

                        //a data has been changed
                        for(let i = 0; i < NewCalendarResponse.length; i++){

                            //if there is a new torunaments
                            if(!CalendarResponse.includes(NewCalendarResponse[i])){

                                //request more detailed data from calendar tournaments
                                await FNBRMENA.EpicContentEndpoint(lang)
                                .then(async ContentTournamentsResponse => {

                                    //constant to make woring easy
                                    const ContentTournamentsDATA = await ContentTournamentsResponse.data.tournamentinformation.tournament_info.tournaments

                                    //loop throw ever tournament CalendarTournamentsDATA
                                    for(let j = 0; j < ContentTournamentsDATA.length; j++){

                                        //if there is an id match
                                        if(await ContentTournamentsDATA[j].tournament_display_id === await NewCalendarResponse[i]){

                                            //registering fonts
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                            //tournament image dimensions
                                            var dimensions = await probe(ContentTournamentsDATA[j].playlist_tile_image)

                                            //create canvas
                                            const canvas = Canvas.createCanvas(dimensions.width, dimensions.height)
                                            const ctx = canvas.getContext('2d')

                                            //define the image
                                            const tournamentImage = await Canvas.loadImage(ContentTournamentsDATA[j].playlist_tile_image)
                                            ctx.drawImage(tournamentImage, 0, 0 , canvas.width, canvas.height)

                                            //credits
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='left';
                                            ctx.font = '50px Burbank Big Condensed'
                                            ctx.fillText("FNBRMENA", 10, 50)
                                                
                                            //creat an embed
                                            const tournamentINFO = new Discord.MessageEmbed()

                                            //set color
                                            tournamentINFO.setColor('#00ffff')

                                            //set title
                                            tournamentINFO.setAuthor(`${ContentTournamentsDATA[j].long_format_title}`, ContentTournamentsDATA[j].loading_screen_image)

                                            //set description
                                            tournamentINFO.setDescription(decodeURI(`${ContentTournamentsDATA[j].flavor_description} ${ContentTournamentsDATA[j].details_description}`))

                                            //set thumbnail
                                            tournamentINFO.setThumbnail(ContentTournamentsDATA[j].poster_front_image)

                                            //regions
                                            var regions = ``
                                            if(CalendarTournamentsDATA[i].regions.length !== 0){
                                                for(let x = 0; x < CalendarTournamentsDATA[i].regions.length; x++){

                                                    //add regions
                                                    regions += `\`${await CalendarTournamentsDATA[i].regions[x]}\``
                                                }
                                            }else if(lang === "en") platforms += `\`No data is available\``
                                            else if(lang === "ar") platforms += `\`لا يوجد معلومات متاحة\``

                                            //platforms
                                            var platforms = ``
                                            if(CalendarTournamentsDATA[i].platforms.length !== 0){
                                                for(let x = 0; x < CalendarTournamentsDATA[i].platforms.length; x++){

                                                    //add platforms
                                                    platforms += `\`${await CalendarTournamentsDATA[i].platforms[x]}\``
                                                }
                                            }else if(lang === "en") platforms += `\`No data is available\``
                                            else if(lang === "ar") platforms += `\`لا يوجد معلومات متاحة\``

                                            //change moment language
                                            moment.locale(lang)

                                            //add fields
                                            if(lang === "en"){
                                                tournamentINFO.addFields(
                                                    {name: "Regions: ", value: regions},
                                                    {name: "Platforms: ", value: platforms},
                                                    {name: "Date: ", value: ContentTournamentsDATA[j].schedule_info, inline: true},
                                                    {name: "beginTime: ", value: moment.tz(CalendarTournamentsDATA[i].beginTime, "America/Los_Angeles").format("dddd, MMMM Do [of] YYYY [at] h A")},
                                                    {name: "endTime: ", value: moment.tz(CalendarTournamentsDATA[i].endTime, "America/Los_Angeles").format("dddd, MMMM Do [of] YYYY [at] h A")},
                                                )

                                                //add rounds
                                                for(let x = 0; x < CalendarTournamentsDATA[i].eventWindows.length; x++){

                                                    //round details
                                                    let roundDetails = `\`Round: ${x + 1}\n`

                                                    //round type
                                                    if(CalendarTournamentsDATA[i].eventWindows[x].metadata.RoundType !== undefined){
                                                        roundDetails += `Round Type: ${CalendarTournamentsDATA[i].eventWindows[x].metadata.RoundType}\n`

                                                    }else roundDetails += `Round Type: Unspecified\n`

                                                    //round starts
                                                    roundDetails += `Round Starts: ${moment.tz(CalendarTournamentsDATA[i].eventWindows[x].beginTime, "America/Los_Angeles").format("dddd, MMMM Do [of] YYYY [at] h A")}\n`

                                                    //round ends
                                                    roundDetails += `Round Ends: ${moment.tz(CalendarTournamentsDATA[i].eventWindows[x].endTime, "America/Los_Angeles").format("dddd, MMMM Do [of] YYYY [at] h A")}\n`

                                                    //window id
                                                    roundDetails += `Window ID: ${CalendarTournamentsDATA[i].eventWindows[x].eventWindowId}\n\``

                                                    //add field for round number x
                                                    tournamentINFO.addFields(
                                                        {name: `Round Number ${x + 1}:`, value: roundDetails}
                                                    )
                                                }
                                            }else if(lang === "ar"){
                                                tournamentINFO.addFields(
                                                    {name: "المناطق: ", value: regions},
                                                    {name: "المنصات: ", value: platforms},
                                                    {name: "التاريخ: ", value: ContentTournamentsDATA[j].schedule_info, inline: true},
                                                    {name: "بداية البطولة: ", value: moment.tz(CalendarTournamentsDATA[i].beginTime, "America/Los_Angeles").format("dddd, MMMM Do [من] YYYY [الساعة] h A")},
                                                    {name: "نهاية البطولة: ", value: moment.tz(CalendarTournamentsDATA[i].endTime, "America/Los_Angeles").format("dddd, MMMM Do [من] YYYY [الساعة] h A")},
                                                )

                                                //add rounds
                                                for(let x = 0; x < CalendarTournamentsDATA[i].eventWindows.length; x++){

                                                    //round details
                                                    let roundDetails = `راوند: ${x + 1}\n`

                                                    //round type
                                                    if(CalendarTournamentsDATA[i].eventWindows[x].metadata.RoundType !== undefined){
                                                        roundDetails += `نوع الراوند: ${CalendarTournamentsDATA[i].eventWindows[x].metadata.RoundType}\n`

                                                    }else roundDetails += `نوع الراوند: غير معلوم\n`

                                                    //round starts
                                                    roundDetails += `بداية الراوند: ${moment.tz(CalendarTournamentsDATA[i].eventWindows[x].beginTime, "America/Los_Angeles").format("dddd, MMMM Do [من] YYYY [الساعة] h A")}\n`

                                                    //round ends
                                                    roundDetails += `نهاية الراوند: ${moment.tz(CalendarTournamentsDATA[i].eventWindows[x].endTime, "America/Los_Angeles").format("dddd, MMMM Do [من] YYYY [الساعة] h A")}\n`

                                                    //window id
                                                    roundDetails += `معرف الصفحة: ${CalendarTournamentsDATA[i].eventWindows[x].eventWindowId}\n\``

                                                    //add field for round number x
                                                    tournamentINFO.addFields(
                                                        {name: `راوند رقم ${x + 1}:`, value: roundDetails}
                                                    )
                                                }
                                            }

                                            //send the message  
                                            const att = new Discord.MessageAttachment(canvas.toBuffer(), `${CalendarTournamentsDATA[i].eventId}.png`)
                                            await message.send(att)
                                            await message.send(tournamentINFO)
                                        }
                                    }
                                })
                            }
                        }

                        //storing tournament informations from the calendar endpoint
                        for(let i = 0; i < CalendarTournamentsDATA.length; i++){
                            CalendarResponse[i] = await CalendarTournamentsDATA[i].displayDataId
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("newtournaments").child("Push").update({
                            Status: false
                        })
                    }

                }).catch(err => {
                    console.log("The issue is in NewTournaments Events ", err)
                })
            }
        })
    }

    setInterval(NewTournaments, 1 * 20000)
}