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
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data by the windowID
        FNBRMENA.tournamentSessions(text)
        .then(async res => {

            //if the windowID is valid
            if(res.data.result){
                
                //get the actual tornament id from Comp Calendar Endpoint
                const calendarEndpointResponse = await FNBRMENA.CompCalendarEndpoint(lang)

                //get the actual tornament id from Content Endpoint
                const contentEndpointResponse = await FNBRMENA.EpicContentEndpoint(lang)

                //loop and find the object that matches the given eventId to get extended data
                let searchedCalendarTournamentObj = []
                for(let i = 0; i < calendarEndpointResponse.data.eventsData.length; i++){
                    if(await calendarEndpointResponse.data.eventsData[i].eventId === await res.data.session.eventId){
                        searchedCalendarTournamentObj.push(calendarEndpointResponse.data.eventsData[i])
                    }
                }

                //loop and find the object that matches the given eventId to get extended data
                let searchedConntentTournamentObj = []
                for(let i = 0; i < contentEndpointResponse.data.tournamentinformation.tournament_info.tournaments.length; i++){
                    if(await contentEndpointResponse.data.tournamentinformation.tournament_info.tournaments[i].tournament_display_id === await res.data.session.eventDisplayId){
                        searchedConntentTournamentObj.push(contentEndpointResponse.data.tournamentinformation.tournament_info.tournaments[i])
                    }
                }

                    //loading message
                    const generating = new Discord.MessageEmbed()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") generating.setTitle(`Loading ${searchedConntentTournamentObj[0].long_format_title} results... ${loadingEmoji}`)
                    if(lang === "ar") generating.setTitle(`جاري تحميل احصائيات بطولة ${searchedConntentTournamentObj[0].long_format_title}... ${loadingEmoji}`)
                    message.channel.send(generating)
                    .then( async msg => {

                    //start working with the data
                    //...

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //creating canvas
                    const canvas = Canvas.createCanvas(1920, 1080);
                    const ctx = canvas.getContext('2d');

                    //create background grediant
                    const grediant = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);

                    /**
                     * add colors to the background
                     * Type: Grediants
                     * From Content Endpoint
                    **/

                    grediant.addColorStop(0, `#${searchedConntentTournamentObj[0].background_left_color}`)
                    grediant.addColorStop(1, `#${searchedConntentTournamentObj[0].background_right_color}`)

                    //add the background color to ctx
                    ctx.fillStyle = grediant
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    //credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '50px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 15, 55)

                    //send
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${res.data.session.windowId}.png`)
                    await message.channel.send(att)
                    msg.delete()
                    
                })
            }
        })
    }
}