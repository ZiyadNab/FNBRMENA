const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas')

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

        //request data by the windowID
        FNBRMENA.tournamentSessions(text)
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

                    //hieght, x, y and numberOfRanks measures
                    let height = 480 + 160;
                    let numberOfRanks = 10;
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
                        } while (ctx.measureText(text).width > 1050)
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
                    if(lang === "en"){

                        //change the x value
                        x += 40

                        //add the color to ctx
                        ctx.fillStyle = `#${searchedContentTournamentObj[0].secondary_color}`;

                        //draw the line
                        ctx.fillRect(x, (y - 40), 90, (canvas.height - y) + 40);

                        //change the x value
                        x += 1050

                        //loop throw 4 indexes
                        for(let i = 0; i < 4; i++){

                            //add the color to ctx
                            ctx.fillStyle = `#${searchedContentTournamentObj[0].secondary_color}`;

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
                            ctx.font = '70px Burbank Big Condensed'

                            //first thing draw the user rank
                            ctx.fillText(i + 1, x + 85, y + 70)

                            //store all the participating players
                            var playersNames = `${res.data.session.results[i].teamAccountNames[0].name}`
                            for(let p = 1; p < res.data.session.results[i].teamAccountNames.length; p++){
                                playersNames += ` - ${res.data.session.results[i].teamAccountNames[p].name}`
                            }

                            //draw the players names
                            await applyText(canvas, playersNames)
                            ctx.fillText(playersNames, x + 130, y + 75)

                            y += 90 + 20

                        }

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