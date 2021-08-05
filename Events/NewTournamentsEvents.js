const axios = require('axios')
const Discord = require('discord.js')
const Canvas = require('canvas')
const probe = require('probe-image-size')
const config = require('../Coinfigs/config.json')
const moment = require('moment')

module.exports = async (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Tournament)

    //result
    var response = []
    var newData = []
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
            if(status === true){

                //request data
                axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=${lang}`)
                .then(async res => {

                    //change moment language
                    moment.locale(lang)

                    //constant to make woring easy
                    const tournamentsDATA = await res.data.tournamentinformation.tournament_info.tournaments

                    //storing the first start up
                    if(number === 0){

                        //storing tournament information
                        for(let i = 0; i < tournamentsDATA.length; i++){
                            response[i] = await tournamentsDATA[i].tournament_display_id
                        }

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push) response[0] = []

                    //storing new tournament information
                    for(let i = 0; i < tournamentsDATA.length; i++){
                        newData[i] = await tournamentsDATA[i].tournament_display_id
                    }

                    //if the data was modified 
                    if(JSON.stringify(newData) !== JSON.stringify(response)){

                        //a data has been changed
                        for(let i = 0; i < tournamentsDATA.length; i++){

                            //if there is a new torunaments
                            if(!response.includes(tournamentsDATA[i].tournament_display_id)){

                                //request more detailed data for the new tournament
                                await axios.post(`https://www.epicgames.com/fortnite/competitive/api/${lang}/calendar`)
                                .then(async details => {

                                    //loop throw ever tournament details
                                    for(let j = 0; j < details.data.eventsData.length; j++){

                                        //if there is an id match
                                        if(details.data.eventsData[j].displayDataId === tournamentsDATA[i].tournament_display_id){

                                            //if its in the same region
                                            if(details.data.eventsData[j].regions.includes(region)){

                                                //creat an embed
                                                const tournamentINFO = new Discord.MessageEmbed()

                                                //set color
                                                tournamentINFO.setColor('#00ffff')

                                                //set title
                                                tournamentINFO.setAuthor(`${tournamentsDATA[i].long_format_title}`, tournamentsDATA[i].loading_screen_image)

                                                //creating description
                                                var description = `${tournamentsDATA[i].flavor_description} ${tournamentsDATA[i].details_description}`

                                                //set description
                                                tournamentINFO.setDescription(description)

                                                //set image
                                                tournamentINFO.setImage(tournamentsDATA[i].playlist_tile_image)

                                                //add regions
                                                var regions = ""
                                                for(let x = 0; x < details.data.eventsData[j].regions.length; x++){

                                                    //lang checker
                                                    regions += "` " + await details.data.eventsData[j].regions[x] + " ` "
                                                }

                                                //add platforms
                                                var platforms = ""
                                                for(let x = 0; x < details.data.eventsData[j].platforms.length; x++){

                                                    //lang checker
                                                    platforms += "` " + await details.data.eventsData[j].platforms[x] + " ` "
                                                }

                                                //add fields
                                                if(lang === "en"){
                                                    tournamentINFO.addFields(
                                                        {name: "Regions: ", value: regions},
                                                        {name: "Platforms: ", value: platforms},
                                                        {name: "Date: ", value: tournamentsDATA[i].schedule_info, inline: true},
                                                        {name: "beginTime: ", value: moment(details.data.eventsData[j].beginTime).format("dddd, MMMM Do [of] YYYY [at] h A")},
                                                        {name: "endTime: ", value: moment(details.data.eventsData[j].endTime).format("dddd, MMMM Do [of] YYYY [at] h A")},
                                                    )

                                                    //if there is a RoundType
                                                    if(details.data.eventsData[j].eventWindows[0].metadata.RoundType !== undefined){

                                                        //add round fields
                                                        tournamentINFO.addFields(
                                                            {name: `RoundType: `, value: details.data.eventsData[j].eventWindows[0].metadata.RoundType},
                                                        )
                                                    }

                                                    if(details.data.eventsData[j].eventWindows[0].requireAnyTokens.length !== 0){
                                                        tournamentINFO.addFields(
                                                            {name: `requireAnyTokens: `, value: details.data.eventsData[j].eventWindows[0].requireAnyTokens},
                                                        )
                                                    }
                                                }else if(lang === "ar"){
                                                    tournamentINFO.addFields(
                                                        {name: "المناطق: ", value: regions},
                                                        {name: "المنصات: ", value: platforms},
                                                        {name: "التاريخ: ", value: tournamentsDATA[i].schedule_info, inline: true},
                                                        {name: "بداية البطولة: ", value: moment(details.data.eventsData[j].beginTime).format("dddd, MMMM Do [من] YYYY [الساعة] h A")},
                                                        {name: "نهاية البطولة: ", value: moment(details.data.eventsData[j].endTime).format("dddd, MMMM Do [من] YYYY [الساعة] h A")},
                                                    )

                                                    //if there is a RoundType
                                                    if(details.data.eventsData[j].eventWindows[0].metadata.RoundType !== undefined){

                                                        //add round fields
                                                        tournamentINFO.addFields(
                                                            {name: `نوع الراوند: `, value: details.data.eventsData[j].eventWindows[0].metadata.RoundType},
                                                        )
                                                    }

                                                    if(details.data.eventsData[j].eventWindows[0].requireAnyTokens.length !== 0){
                                                        tournamentINFO.addFields(
                                                            {name: `متطلبات المشاركة: `, value: details.data.eventsData[j].eventWindows[0].requireAnyTokens},
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
                        for(let i = 0; i < tournamentsDATA.length; i++){
                            response[i] = await tournamentsDATA[i].tournament_display_id
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

    setInterval(NewTournaments, 1 * 30000)
}