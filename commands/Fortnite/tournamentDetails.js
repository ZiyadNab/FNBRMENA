const Data = require('../../FNBRMENA');
const FNBRMENA = new Data();
const moment = require('moment');
const Canvas = require('canvas');

module.exports = {
    commands: 'tournament',
    descriptionEN: 'A command that will return a tier of any season\'s information of a battlepass of your choice from season 2 till current season.',
    descriptionAR: 'أمر راح يسترجع لك معلومات اي تاير من عناصر الباتل باس بإختيارك من الموسم 2 الى الموسم الحالي.',
    expectedArgsEN: 'To use the command you need to specifiy a season number from season 2 to latest season.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد موسم معين من الموسم الثاني الى الموسم الحالي.',
    hintEN: 'You can add + then type any tier to start with. \nFor example: tier 2 + 68 that will give you the black knight from season 2',
    hintAR: 'يمكنك اضافة + ثم رقم المستى للبداية.\nعلى سبيل المثال: tier 2 + 68 راح يعطيك عنصر بلاك نيات من سيزون 2',
    argsExample: ['2', '14'],
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
                const calendarEndpointResponse = await FNBRMENA.CompCalendarEndpoint(lang);

                //get the actual tornament id from Content Endpoint
                const contentEndpointResponse = await FNBRMENA.EpicContentEndpoint(lang);

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

                    //add the tournament name and its data
                    ctx.fillStyle = '#ffffff'
                    ctx.textAlign='left'
                    ctx.font = '150px Burbank Big Condensed'
                    ctx.fillText(`${searchedContentTournamentObj[0].long_format_title} | ${res.data.session.region}`, 30, 155)
                    ctx.font = '48px Burbank Big Condensed'
                    if(res.data.session.finished) var Finished = `Yes, it did`
                    else var Finished = `No, it didn't`
                    ctx.fillText(`Match Cap: ${res.data.session.matchCap}\nStarts: ${moment(res.data.session.beginTime).format("MMMM Do [of] YYYY [at] h A")},\nEnds: ${moment(res.data.session.endTime).format("MMMM Do [of] YYYY [at] h A")}\nFinished: ${Finished}`, 30, 220)
                    
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
                    ctx.fillStyle = '#ffffff'
                    ctx.textAlign='center'
                    ctx.font = '60px Burbank Big Condensed'
                    ctx.fillText(`Matchs`, 1310, 400)
                    ctx.fillText(`Kills`, 1550, 400)
                    ctx.fillText(`Victories`, 1790, 400)
                    ctx.fillText(`Points`, 2035, 400)

                    //add the color to ctx
                    if(searchedContentTournamentObj[0].secondary_color !== searchedContentTournamentObj[0].shadow_color) ctx.fillStyle = `#${searchedContentTournamentObj[0].secondary_color}`;
                    else ctx.fillStyle = `#${searchedContentTournamentObj[0].background_right_color}`;

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

                        //store all the participating players
                        var playersNames = `${res.data.session.results[i].teamAccountNames[0].name}`
                        for(let p = 1; p < res.data.session.results[i].teamAccountNames.length; p++){
                            playersNames += ` - ${res.data.session.results[i].teamAccountNames[p].name}`
                        }

                        //draw the players names
                        await applyText(canvas, playersNames)
                        ctx.fillText(playersNames, x + 600, y + 60)

                        //draw the match played for a team
                        ctx.font = '47px Burbank Big Condensed'
                        ctx.fillText(`${res.data.session.results[i].sessionHistory.length}/${res.data.session.matchCap}`, x + 1157, y + 60)

                        //draw the kiils for a team
                        var teamKills = 0
                        for(let p = 0; p < res.data.session.results[i].sessionHistory.length; p++){
                            teamKills += res.data.session.results[i].sessionHistory[p].trackedStats.TEAM_ELIMS_STAT_INDEX
                        } ctx.fillText(`${teamKills}`, x + 1400, y + 60)

                        //draw the victory royales for a team
                        var victoryRoyale = 0
                        for(let p = 0; p < res.data.session.results[i].sessionHistory.length; p++){
                            victoryRoyale += res.data.session.results[i].sessionHistory[p].trackedStats.VICTORY_ROYALE_STAT
                        } ctx.fillText(`${victoryRoyale}`, x + 1640, y + 60)

                        //draw team points
                        ctx.fillText(`${res.data.session.results[i].pointsEarned}`, x + 1880, y + 60)

                        //get team id (first 5 digit of the id)
                        var teamIDs = ``
                        for(let p = 0; p < res.data.session.results[i].teamAccountNames.length; p++){
                            teamIDs += `${res.data.session.results[i].teamAccountNames[p].id.substring(0, 5)}`
                        }
                        ctx.fillText(teamIDs, x + 2225, y + 60)
                        y += 90 + 20

                    }

                    //send
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.session.windowId}.png`);
                    await message.channel.send(att);
                    msg.delete();
                    
                })
            }
        })
    }
}