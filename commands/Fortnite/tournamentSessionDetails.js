const Data = require('../../FNBRMENA');
const FNBRMENA = new Data();
const moment = require('moment');
const tz = require('moment-timezone');
const Canvas = require('canvas');

module.exports = {
    commands: ['result', 'res'],
    descriptionEN: 'A command that will return a top 10 or more in any tournament of your choice',
    descriptionAR: 'أمر راح يسترجع لك معلومات الأوائل لأي بطولة بأختيارك.',
    expectedArgsEN: 'To use the command you need to specifiy a tournament window id (you can find it in tournament channel or ask the mods to give you any window id u need).',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد معرف البطولة لجولة معينة (يمكنك الحصول عليها في شات tournament او اطلب من اي مشرف المعرف الي تحتاجه).',
    hintEN: 'You can add + then type how many ranks you need. \nFor example: result WorldCup_Duos_Finals + 68 that will give you top 68',
    hintAR: 'يمكنك اضافة + ثم عدد الأوائل.\nعلى سبيل المثال: result WorldCup_Duos_Finals + 68 راح يعطيك صوره تحتوي على توب 68',
    argsExample: ['WorldCup_Duos_Finals', 'S17_GalaxyCup_ME_Event1 + 25'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang");

        //if the user added a numberOfRanks
        let numberOfRanks = 10;
        if(text.includes("+")){

            //extract the season from the text string
            var windowID = text.substring(0, text.indexOf("+"))
            numberOfRanks = text.substring(text.indexOf("+") + 1, text.length).trim()

        }else var windowID = text

        //request data by the windowID
        FNBRMENA.tournamentSessions(windowID)
        .then(async res => {

            //if the windowID is valid
            if(res.data.result){
                
                //get the actual tornament id from Comp Calendar Endpoint
                const calendarEndpointResponse = await FNBRMENA.CompCalendarEndpoint("en");

                //get the actual tornament id from Content Endpoint
                const contentEndpointResponse = await FNBRMENA.EpicContentEndpoint("en");

                //loop and find the object that matches the given eventId to get extended data
                let searchedCalendarTournamentObj = []
                for(let i = 0; i < calendarEndpointResponse.data.eventsData.length; i++){
                    if(await calendarEndpointResponse.data.eventsData[i].eventId === await res.data.session.eventId){
                        searchedCalendarTournamentObj.push(calendarEndpointResponse.data.eventsData[i]);
                    };
                };

                //loop and find the object that matches the given eventId to get extended data
                let searchedContentTournamentObj = []
                for(let i = 0; i < contentEndpointResponse.data.tournamentinformation.tournament_info.tournaments.length; i++){
                    if(await contentEndpointResponse.data.tournamentinformation.tournament_info.tournaments[i].tournament_display_id === await res.data.session.eventDisplayId){
                        searchedContentTournamentObj.push(contentEndpointResponse.data.tournamentinformation.tournament_info.tournaments[i]);
                    };
                };

                //loading message
                const generating = new Discord.MessageEmbed();
                generating.setColor(FNBRMENA.Colors("embed"));
                if(lang === "en") generating.setTitle(`Loading ${searchedContentTournamentObj[0].long_format_title} results... ${loadingEmoji}`);
                if(lang === "ar") generating.setTitle(`جاري تحميل احصائيات بطولة ${searchedContentTournamentObj[0].long_format_title}... ${loadingEmoji}`);
                message.channel.send(generating)
                .then( async msg => {

                    //start working with the data
                    //...

                    //hieght, x and y measures
                    let height = 480 + 160;
                    var x = 150;
                    var y = 480;

                    //loop throw every rank
                    for(let i = 0; i < numberOfRanks; i++){
                        height += 90 + 20;
                    }

                    //applytext
                    const applyText = (canvas, text) => {
                        const ctx = canvas.getContext('2d')
                        let fontSize = 70
                        do {
                            if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                            else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                        } while (ctx.measureText(text).width > 900)
                        return ctx.font
                    }

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"});

                    //creating canvas
                    const canvas = Canvas.createCanvas(2800, height);
                    const ctx = canvas.getContext('2d');

                    //create background grediant
                    const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);

                    /**
                     * add colors to the background
                     * Type: Grediants
                     * From Content Endpoint
                    **/

                    grediant.addColorStop(0, `#${searchedContentTournamentObj[0].background_left_color}`);
                    grediant.addColorStop(1, `#${searchedContentTournamentObj[0].background_right_color}`);

                    //add the background color to ctx
                    ctx.fillStyle = grediant;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    //add the credits
                    ctx.fillStyle = '#ffffff'
                    ctx.textAlign='right'
                    ctx.font = '75px Burbank Big Condensed'
                    ctx.fillText(`FNBRMENA`, canvas.width - 30, 80)

                    //if the tournament is live or not
                    var finished = ``
                    const red = client.emojis.cache.get("855805718779002899")
                    if(moment(res.data.session.beginTime).diff(moment()) <= 0 && moment(res.data.session.endTime).diff(moment()) >= 0){

                        const diff = moment(res.data.session.endTime).diff(moment())
                        const diffDuration = moment.duration(diff)
                        finished += `The current data is live at the moment (updates 10 minutes) ${red}\nTime Remaining: ${diffDuration.hours()}:${diffDuration.minutes()} hours`
                    }else if(moment(res.data.session.beginTime).diff(moment()) <= 0 && moment(res.data.session.endTime).diff(moment()) <= 0){

                        const diff = moment(moment()).diff(res.data.session.endTime)
                        const diffDuration = moment.duration(diff)
                        if(diffDuration.years() !== 0) finished += `Tournament has finished ${diffDuration.years()} year(s) and ${diffDuration.days()} day(s) ago`
                        else if(diffDuration.days() !== 0) finished += `Tournament has finished ${diffDuration.days()} day(s) and ${diffDuration.hours()} hour(s) ago`
                        else finished += `Tournament has finished ${diffDuration.hours()} hours ago`
                    }else if(moment(res.data.session.beginTime).diff(moment()) >= 0 && moment(res.data.session.endTime).diff(moment()) >= 0){

                        const diff = moment(res.data.session.beginTime).diff(moment())
                        const diffDuration = moment.duration(diff)
                        if(diffDuration.days() === 0) finished += `Tournament will start after ${diffDuration.hours()}:${diffDuration.minutes()} hours`
                        else finished += `Tournament will start after ${diffDuration.days()} day(s) and ${diffDuration.hours()} hour(s)`
                    }

                    //add the tournament name and its data
                    ctx.fillStyle = '#ffffff'
                    ctx.textAlign='left'
                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText(`${searchedContentTournamentObj[0].long_format_title} | ${res.data.session.region}`, 30, 155)
                    ctx.font = '48px Burbank Big Condensed'
                    ctx.fillText(`Match Cap: ${res.data.session.matchCap}\nStarts: ${moment.tz(res.data.session.beginTime, "America/Los_Angeles").format("MMMM Do [of] YYYY [at] h A")} PST,\nEnds: ${moment.tz(res.data.session.endTime, "America/Los_Angeles").format("MMMM Do [of] YYYY [at] h A")} PST\nStatus: ${finished}`, 30, 220)

                    //loop throw every top ${numberOfRanks} number
                    for(let i = 0; i < numberOfRanks; i++){

                        //add the color to ctx
                        ctx.fillStyle = `#${searchedContentTournamentObj[0].shadow_color}`;

                        //draw the line
                        ctx.fillRect(x, y, canvas.width - 300, 90);

                        //change the y value
                        y += 90 + 20

                    } y = 480

                    //add the sideways lines for the stats [language matters]
                    x += 40

                    //add the line tags
                    if(lang === "en"){

                        ctx.fillStyle = '#ffffff'
                        ctx.textAlign='center'
                        ctx.font = '60px Burbank Big Condensed'
                        ctx.fillText(`Matchs`, 1310, 400)
                        ctx.fillText(`Kills`, 1550, 400)
                        ctx.fillText(`Victories`, 1790, 400)
                        ctx.fillText(`Points`, 2035, 400)
                    }else if(lang === "ar"){

                        ctx.fillStyle = '#ffffff'
                        ctx.textAlign='center'
                        ctx.font = '60px Arabic'
                        ctx.fillText(`المباريات`, 1310, 400)
                        ctx.fillText(`الذبحات`, 1550, 400)
                        ctx.fillText(`الإنتصارات`, 1790, 400)
                        ctx.fillText(`النقاط`, 2035, 400)
                    }

                    //add the color to ctx
                    if(searchedContentTournamentObj[0].secondary_color !== searchedContentTournamentObj[0].shadow_color) ctx.fillStyle = `#${searchedContentTournamentObj[0].secondary_color}`;
                    else ctx.fillStyle = `#${searchedContentTournamentObj[0].background_right_color}`;

                    //change the opacity to 0.5
                    ctx.globalAlpha = 0.5

                    //draw the line
                    ctx.fillRect(x, (y - 40), 90, (canvas.height - y) + 40);

                    //change the x value
                    x += 1050

                    //loop throw 4 indexes
                    for(let i = 0; i < 4; i++){

                        //draw the line
                        ctx.fillRect(x, (y - 40), 140, (canvas.height - y) + 40);

                        //change the x value
                        x += 100 + 140

                    } x = 150

                    //change the opacity back to 1
                    ctx.globalAlpha = 1

                    //add the ppl data
                    for(let i = 0; i < numberOfRanks; i++){

                        //chenge the color to white
                        ctx.fillStyle = '#ffffff'
                        ctx.textAlign='center'
                        ctx.font = '45px Burbank Big Condensed'

                        //first thing draw the user rank
                        var rankNumber = i + 1
                        if(rankNumber.toString().split('').pop() === "1") rankNumber += `st`
                        else if(rankNumber.toString().split('').pop() === "2") rankNumber += `nd`
                        else if(rankNumber.toString().split('').pop() === "3") rankNumber += `rd`
                        else rankNumber += `th`
                        ctx.fillText(rankNumber, x + 85, y + 60)

                        //team names
                        if(res.data.session.results !== null){
                            //store all the participating players
                            var playersNames = `${res.data.session.results[i].teamAccountNames[0].name}`
                            for(let p = 1; p < res.data.session.results[i].teamAccountNames.length; p++){
                                playersNames += ` - ${res.data.session.results[i].teamAccountNames[p].name}`
                            }

                            //draw the players names
                            await applyText(canvas, playersNames)
                            ctx.fillText(playersNames, x + 600, y + 60)

                        }else if(lang === "en"){

                            //no data available
                            var playersNames = `No data added yet...`

                            //draw the players names
                            ctx.font = '45px Burbank Big Condensed'
                            await applyText(canvas, playersNames)
                            ctx.fillText(playersNames, x + 600, y + 60)

                        }else if(lang === "ar"){

                            //no data available
                            var playersNames = `لم تتم اضافة المعلومات حتى الأن...`

                            //draw the players names
                            ctx.font = '45px Arabic'
                            await applyText(canvas, playersNames)
                            ctx.fillText(playersNames, x + 600, y + 60)
                        }

                        //team game played
                        if(res.data.session.results !== null){
                            //draw the match played for a team
                            ctx.font = '47px Burbank Big Condensed'
                            ctx.fillText(`${res.data.session.results[i].sessionHistory.length}/${res.data.session.matchCap}`, x + 1157, y + 60)
                        }else ctx.fillText(`0/${res.data.session.matchCap}`, x + 1157, y + 60)

                        //team kills
                        var teamKills = 0
                        if(res.data.session.results !== null){

                            //draw the kiils for a team
                            for(let p = 0; p < res.data.session.results[i].sessionHistory.length; p++){
                                teamKills += res.data.session.results[i].sessionHistory[p].trackedStats.TEAM_ELIMS_STAT_INDEX
                            }
                        } ctx.fillText(`${teamKills}`, x + 1400, y + 60)

                        //victory royales
                        var victoryRoyale = 0
                        if(res.data.session.results !== null){

                            //draw the victory royales for a team
                            for(let p = 0; p < res.data.session.results[i].sessionHistory.length; p++){
                                victoryRoyale += res.data.session.results[i].sessionHistory[p].trackedStats.VICTORY_ROYALE_STAT
                            } 
                        } ctx.fillText(`${victoryRoyale}`, x + 1640, y + 60)

                        //team points
                        if(res.data.session.results !== null){

                            //draw team points
                            ctx.fillText(`${res.data.session.results[i].pointsEarned}`, x + 1880, y + 60)
                        } else ctx.fillText(`0`, x + 1880, y + 60)

                        //team ids
                        if(res.data.session.results !== null){

                            //get team id (first 5 digit of the id)
                            var teamIDs = ``
                            for(let p = 0; p < res.data.session.results[i].teamAccountNames.length; p++){
                                teamIDs += `${res.data.session.results[i].teamAccountNames[p].id.substring(0, 5)}`
                            } ctx.fillText(teamIDs, x + 2225, y + 60)
                            
                        }else if(lang === "en"){

                            //no data available
                            var teamIDs = `No data...`

                            //draw the players names
                            ctx.font = '45px Burbank Big Condensed'
                            ctx.fillText(teamIDs, x + 2225, y + 60)

                        }else if(lang === "ar"){

                            //no data available
                            var teamIDs = `لا يوجد معلومات...`

                            //draw the players names
                            ctx.font = '45px Arabic'
                            ctx.fillText(teamIDs, x + 2225, y + 60)

                        } y += 90 + 20

                    }

                    // //inislizing embed
                    const sessionInfo = new Discord.MessageEmbed()
                    sessionInfo.setColor(searchedContentTournamentObj[0].background_left_color)

                    //if there is payout
                    if(res.data.session.payout !== null){

                        //loop threw payouts
                        for(let p = 0; p < res.data.session.payout.length; p++){

                            //loop throw ranks
                            for(let r = 0; r < res.data.session.payout[p].ranks.length; r++){

                                //loop throw payouts
                                var Payouts = ``
                                for(let s = 0; s < res.data.session.payout[p].ranks[r].payouts.length; s++){
                                    if(lang === "en") Payouts += `\`Reward Number: ${s + 1}\nReward Type: ${res.data.session.payout[p].ranks[r].payouts[s].rewardType}\nReward: ${res.data.session.payout[p].ranks[r].payouts[s].quantity}x ${res.data.session.payout[p].ranks[r].payouts[s].value}\`\n\n`
                                    else if(lang === "ar") Payouts += `\`رقم الجائزة: ${s + 1}\nنوع الجائزة: ${res.data.session.payout[p].ranks[r].payouts[s].rewardType}\الجائزة: ${res.data.session.payout[p].ranks[r].payouts[s].quantity}x ${res.data.session.payout[p].ranks[r].payouts[s].value}\`\n\n`
                                }

                                //add field
                                Payouts += `\n`
                                if(lang === "en"){
                                    sessionInfo.addFields(
                                        {name: `Top ${res.data.session.payout[p].ranks[r].threshold} will get:\n`, value: Payouts}
                                    )
                                }else if(lang === "ar"){
                                    sessionInfo.addFields(
                                        {name: `أول ${res.data.session.payout[p].ranks[r].threshold} راح يحصلون على:\n`, value: Payouts}
                                    )
                                }
                            }
                        }
                    }

                    //send
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.session.windowId}.png`);
                    await message.channel.send(att);
                    await message.channel.send(sessionInfo);
                    msg.delete();
                    
                })

            }else{

                //no session has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No session has been found check your window id and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على جلسة الرجاء التأكد من كتابة معرف البطولة بشكل صحيح ${errorEmoji}`)
                message.channel.send(Err)
            }
        })
    }
}