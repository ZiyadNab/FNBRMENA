const moment = require('moment');
const Canvas = require('canvas');

module.exports = {
    commands: 'fish',
    type: 'Fortnite',
    descriptionEN: 'Use this command to extract the cought fishes this season.',
    descriptionAR: 'أستعمل الأمر لأستخراج جميع السمك المسطاد خلال الموسم الحالي.',
    expectedArgsEN: 'Use this command then type the use EPICGAMES displayname',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم اي حساب شخص على منصة ايبك قيمز',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //season
        var season = "current"

        //if there is + in the message
        if(text.includes("+")){

            //extract the music pack from the text string
            var playerTag = text.substring(0, text.indexOf("+")).trim()
            season = text.substring(text.indexOf("+") + 1, text.length).trim()
 
        } else var playerTag = text

        //get the user id by name
        const playerID = await FNBRMENA.getAccountIdByUsername(playerTag)
            
        //if the user name is valid
        if(playerID.data.result){

            //get player fish stats
            FNBRMENA.getPlayerFishStats(playerID.data.account_id, userData.lang)
            .then(async res => {

                //request all fishes of the given season
                const listFish = await FNBRMENA.listFish(season, userData.lang)

                //if the user entered a season that still yet not started or not valid
                if(listFish.data.fish.length !== 0){

                    //loading message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Getting Player fish info... ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات اللاعب... ${emojisObject.loadingEmoji}`)
                    message.reply({embeds: [generating]})
                    .then(async msg => {

                        //variables
                        var x = 50
                        var y = 300
                        var newline = 0
                        
                        //defined a hit
                        var counter = 0

                        //registering fonts
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700"})

                        //canvas
                        const canvas = Canvas.createCanvas(1920, 1080);
                        const ctx = canvas.getContext('2d')

                        //creating an array on background images
                        var imagesList = [
                            './assets/Fish/backgrounds/1.png',
                            './assets/Fish/backgrounds/2.jpg',
                            './assets/Fish/backgrounds/3.jpg',
                            './assets/Fish/backgrounds/4.jpg',
                            './assets/Fish/backgrounds/5.jpg',
                            './assets/Fish/backgrounds/6.jpg',
                            './assets/Fish/backgrounds/7.jpg',
                        ]

                        //get a random number from imagesList array
                        var randomImage = Math.floor(Math.random() * imagesList.length)

                        //background
                        const background = await Canvas.loadImage(imagesList[randomImage])
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                        //add blue fog
                        const fog = await Canvas.loadImage('./assets/News/fog.png')
                        ctx.drawImage(fog, 0, 0, canvas.width, canvas.height)

                        //credits
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='left';
                        ctx.font = '50px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 15, 55)

                        //get the date and apply it
                        moment.locale(userData.lang)
                        ctx.fillStyle = '#ffffff'
                        ctx.textAlign = 'center'
                        if(userData.lang === "en"){
                            var date = moment().format("dddd, MMMM Do of YYYY")
                            ctx.font = `60px Burbank Big Condensed`
                        }else if(userData.lang === "ar"){
                            var date = moment().format("dddd, MMMM Do من YYYY")
                            ctx.font = `60px Arabic`
                        } ctx.fillText(date, (canvas.width / 2), (canvas.height - 35))

                        //collection text
                        if(userData.lang === "en"){
                            ctx.font = '200px Burbank Big Condensed'
                            ctx.fillText("Fish Collection", canvas.width / 2, 220)
                        }else if(userData.lang === "ar"){
                            ctx.font = '200px Arabic'
                            ctx.fillText("احصائيات السمك", canvas.width / 2, 220)
                        }
                        
                        //loop to every fish in game
                        for(let i = 0; i < listFish.data.fish.length; i++){

                            //add new line
                            newline++

                            //defined CoughtFishs
                            var CoughtFishs = []

                            //loop throw evry fish that the user owns
                            res.data.stats.filter(fishSeason => {
                                if(fishSeason.season === listFish.data.season){
                                    CoughtFishs = fishSeason.fish.filter(Cought => {
                                        return Cought.type.toLowerCase() === listFish.data.fish[i].id.toLowerCase()
                                    })
                                }
                            })

                            //if we found a hit
                            if(CoughtFishs.length !== 0){

                                //counter
                                counter++

                                //change the opacity
                                ctx.globalAlpha = 1

                                var name = CoughtFishs[0].name
                                var descriprion = CoughtFishs[0].description
                                var image = CoughtFishs[0].image
                                var length = (CoughtFishs[0].length / 100) * 90
                                
                                //the slot
                                const slot = await Canvas.loadImage('./assets/Fish/FishSlot.png')
                                ctx.drawImage(slot, x, y, 100, 150)

                                //change the opacity
                                ctx.globalAlpha = 0.5

                                //length background
                                const lengthBlue = await Canvas.loadImage('./assets/Fish/progressFishBule.png')
                                ctx.drawImage(lengthBlue, x + 5, y + 135, 90, 7)

                                //the number of the fish
                                ctx.fillStyle = '#03d3fc'
                                ctx.textAlign = 'right'
                                ctx.font = 'italic 40px Burbank Big Condensed'
                                ctx.fillText(i, x + 95, y + 35)

                                //change the opacity
                                ctx.globalAlpha = 1

                                //check if length is more than 90
                                if(length > 90){
                                    length = 90
                                }

                                //length
                                const lengthYellow = await Canvas.loadImage('./assets/Fish/progressFishYellow.png')
                                ctx.drawImage(lengthYellow, x + 5, y + 135, length, 7)

                                //the fish image
                                const fish = await Canvas.loadImage(image)
                                ctx.drawImage(fish, x, y + 30, 100, 100)

                            }else{

                                var name = listFish.data.fish[i].name
                                var descriprion = listFish.data.fish[i].description
                                var image = listFish.data.fish[i].image

                                //change the opacity
                                ctx.globalAlpha = 0.5

                                //the slot
                                const slot = await Canvas.loadImage('./assets/Fish/FishSlot.png')
                                ctx.drawImage(slot, x, y, 100, 150)

                                //the number of the fish
                                ctx.fillStyle = '#03d3fc';
                                ctx.textAlign='right';
                                ctx.font = 'italic 40px Burbank Big Condensed'
                                ctx.fillText(i, x + 95, y + 35)

                                //the fish image
                                const fish = await Canvas.loadImage(image)
                                ctx.drawImage(fish, x, y + 30, 100, 100)
                            }

                            //changing x and y
                            x += 25 + 100
                            if(15 === newline){
                                y += 25 + 150
                                x = 50
                                newline = 0
                            }
                        }

                        //change the opacity
                        ctx.globalAlpha = 1

                        //font color
                        ctx.fillStyle = '#ffffff';

                        //season number
                        if(userData.lang === "en"){
                            ctx.textAlign = 'left';
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(`Season: ${listFish.data.season}`, 50, canvas.height - 130)
                        }else if(userData.lang === "ar"){
                            ctx.textAlign = 'right';
                            ctx.font = '40px Arabic'
                            ctx.fillText(`الموسم: ${listFish.data.season}`, canvas.width - 50, canvas.height - 130)
                        }

                        //name of the epic games user account
                        if(userData.lang === "en"){
                            ctx.textAlign='left';
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(`Account Name: ${playerTag}`, 50, canvas.height - 90)
                        }else if(userData.lang === "ar"){
                            ctx.textAlign='right';
                            ctx.font = '40px Arabic'
                            ctx.fillText(`اسم الحساب: ${playerTag}`, canvas.width - 50, canvas.height - 90)
                        }
                        
                        //counter
                        if(userData.lang === "en"){
                            ctx.textAlign='left';
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(`Fish Caught: ${counter}/${listFish.data.fish.length}`, 50, canvas.height - 50)
                        }else if(userData.lang === "ar"){
                            ctx.textAlign='right';
                            ctx.font = '40px Arabic'
                            ctx.fillText(`عدد السمك المصطاده: ${counter}/${listFish.data.fish.length}`, canvas.width - 50, canvas.height - 50)
                        }

                        //send the fish stats picture
                        const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${playerID.data.account_id}.png`)
                        await message.reply({files: [att]})
                        msg.delete()

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

                    })
                }else{

                    //not valid season error
                    const notValidSeasonError = new Discord.EmbedBuilder()
                    notValidSeasonError.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") notValidSeasonError.setTitle(`The season ${season} is wrong season please type a valid season number ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") notValidSeasonError.setTitle(`الموسم ${season} غير صحيح الرجاء ادخال رقم موسم صحيح ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [notValidSeasonError]})
                }
            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

            })
        }else{

            //no account has been found
            const accountNotFoundError = new Discord.EmbedBuilder()
            accountNotFoundError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") accountNotFoundError.setTitle(`There is no account with this name check your speling and try again ${emojisObject.errorEmoji}`)
            else if(userData.lang === "ar") accountNotFoundError.setTitle(`لا يمكنني العثور على الحساب الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
            message.reply({embeds: [accountNotFoundError]})
        }
    }
}