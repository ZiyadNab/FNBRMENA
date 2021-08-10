const axios = require('axios')
const Discord = require('discord.js')
const Canvas = require('canvas')
const probe = require('probe-image-size')
const config = require('../Coinfigs/config.json')
const moment = require('moment')

module.exports = async (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Tournament)

    //result
    var ContentResponse = []
    var NewContentResponse = []
    var number = 0

    //handle the blogs
    const NewTournaments = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("newtournaments").once('value', async function (data) {

            //store aceess
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().Push
            var region = data.val().Region

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    //constant to make woring easy
                    const ContentTournamentsDATA = await res.data.tournamentinformation.tournament_info.tournaments

                    //storing the first start up
                    if(number === 0){

                        //storing tournament informations from the content endpoint
                        for(let i = 0; i < ContentTournamentsDATA.length; i++){
                            ContentResponse[i] = await ContentTournamentsDATA[i].tournament_display_id
                        }

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push) ContentResponse[0] = []

                    //storing tournament informations from the comp calendar endpoint
                    for(let i = 0; i < ContentTournamentsDATA.length; i++){
                        NewContentResponse[i] = await ContentTournamentsDATA[i].tournament_display_id
                    }

                    //if the data was modified 
                    if(JSON.stringify(NewContentResponse) !== JSON.stringify(ContentResponse)){
                        message.send("New tournament added")

                        //a data has been changed
                        for(let i = 0; i < ContentTournamentsDATA.length; i++){

                            //if there is a new torunaments
                            if(!ContentResponse.includes(ContentTournamentsDATA[i].tournament_display_id)){
                                console.log(ContentTournamentsDATA[i].tournament_display_id)

                                //request more detailed data from calendar tournaments
                                await FNBRMENA.CompCalendarEndpoint(lang)
                                .then(async CalendarTournamentsDATA => {

                                    //loop throw ever tournament CalendarTournamentsDATA
                                    for(let j = 0; j < CalendarTournamentsDATA.data.eventsData.length; j++){

                                        //if there is an id match
                                        if(CalendarTournamentsDATA.data.eventsData[j].displayDataId === ContentTournamentsDATA[i].tournament_display_id){
                                            message.send(CalendarTournamentsDATA.data.eventsData[j].displayDataId)
                                            message.send(CalendarTournamentsDATA.data.eventsData[j].regions)

                                            //if its in the same region
                                            if(CalendarTournamentsDATA.data.eventsData[j].regions.includes(region)){
                                                message.send("sending...")
                                                
                                                //creat an embed
                                                const tournamentINFO = new Discord.MessageEmbed()

                                                //set color
                                                tournamentINFO.setColor('#00ffff')

                                                //set title
                                                tournamentINFO.setAuthor(`${ContentTournamentsDATA[i].long_format_title}`, ContentTournamentsDATA[i].loading_screen_image)

                                                //creating description
                                                var description = `${ContentTournamentsDATA[i].flavor_description} ${ContentTournamentsDATA[i].CalendarTournamentsDATA_description}`

                                                //set description
                                                tournamentINFO.setDescription(description)

                                                //set image
                                                tournamentINFO.setImage(ContentTournamentsDATA[i].playlist_tile_image)

                                                //add regions
                                                var regions = ""
                                                for(let x = 0; x < CalendarTournamentsDATA.data.eventsData[j].regions.length; x++){

                                                    //lang checker
                                                    regions += "` " + await CalendarTournamentsDATA.data.eventsData[j].regions[x] + " ` "
                                                }

                                                //add platforms
                                                var platforms = ""
                                                for(let x = 0; x < CalendarTournamentsDATA.data.eventsData[j].platforms.length; x++){

                                                    //lang checker
                                                    platforms += "` " + await CalendarTournamentsDATA.data.eventsData[j].platforms[x] + " ` "
                                                }

                                                //change moment language
                                                moment.locale(lang)

                                                //add fields
                                                if(lang === "en"){
                                                    tournamentINFO.addFields(
                                                        {name: "Regions: ", value: regions},
                                                        {name: "Platforms: ", value: platforms},
                                                        {name: "Date: ", value: ContentTournamentsDATA[i].schedule_info, inline: true},
                                                        {name: "beginTime: ", value: moment(CalendarTournamentsDATA.data.eventsData[j].beginTime).format("dddd, MMMM Do [of] YYYY [at] h A")},
                                                        {name: "endTime: ", value: moment(CalendarTournamentsDATA.data.eventsData[j].endTime).format("dddd, MMMM Do [of] YYYY [at] h A")},
                                                    )

                                                    //if there is a RoundType
                                                    if(CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].metadata.RoundType !== undefined){

                                                        //add round fields
                                                        tournamentINFO.addFields(
                                                            {name: `RoundType: `, value: CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].metadata.RoundType},
                                                        )
                                                    }

                                                    if(CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].requireAnyTokens.length !== 0){
                                                        tournamentINFO.addFields(
                                                            {name: `requireAnyTokens: `, value: CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].requireAnyTokens},
                                                        )
                                                    }
                                                }else if(lang === "ar"){
                                                    tournamentINFO.addFields(
                                                        {name: "المناطق: ", value: regions},
                                                        {name: "المنصات: ", value: platforms},
                                                        {name: "التاريخ: ", value: ContentTournamentsDATA[i].schedule_info, inline: true},
                                                        {name: "بداية البطولة: ", value: moment(CalendarTournamentsDATA.data.eventsData[j].beginTime).format("dddd, MMMM Do [من] YYYY [الساعة] h A")},
                                                        {name: "نهاية البطولة: ", value: moment(CalendarTournamentsDATA.data.eventsData[j].endTime).format("dddd, MMMM Do [من] YYYY [الساعة] h A")},
                                                    )

                                                    //if there is a RoundType
                                                    if(CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].metadata.RoundType !== undefined){

                                                        //add round fields
                                                        tournamentINFO.addFields(
                                                            {name: `نوع الراوند: `, value: CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].metadata.RoundType},
                                                        )
                                                    }

                                                    if(CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].requireAnyTokens.length !== 0){
                                                        tournamentINFO.addFields(
                                                            {name: `متطلبات المشاركة: `, value: CalendarTournamentsDATA.data.eventsData[j].eventWindows[0].requireAnyTokens},
                                                        )
                                                    }
                                                }

                                                await message.send(tournamentINFO)
                                            }
                                        }
                                    }
                                })
                            }
                        }

                        //storing tournament information
                        for(let i = 0; i < ContentTournamentsDATA.length; i++){
                            ContentResponse[i] = await ContentTournamentsDATA[i].tournament_display_id
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("newtournaments").update({
                            Push: false
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