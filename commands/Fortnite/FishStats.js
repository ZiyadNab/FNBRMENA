const Data = require('../../FNBRMENA');
const FNBRMENA = new Data();
const moment = require('moment');
const Canvas = require('canvas');
const axios = require('axios');

module.exports = {
    commands: 'fish',
    descriptionEN: 'Use this command to extract the cought fishes this season.',
    descriptionAR: 'أستعمل الأمر لأستخراج جميع السمك المسطاد خلال الموسم الحالي.',
    expectedArgsEN: 'Use this command then type the use EPICGAMES displayname',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم اي حساب شخص على منصة ايبك قيمز',
    argsExample: ['Ninja', 'SypherPK'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //season
        var season = "current"

        //if there is + in the message
        if(text.includes("+")){

            //extract the music pack from the text string
            var playerTag = text.substring(0, text.indexOf("+")).trim()
            season = text.substring(text.indexOf("+") + 1, text.length).trim()
 
        } else var playerTag = text

        //get the user id by name
        FNBRMENA.getAccountIdByUsername(playerTag)
        .then(async playerID => {

            //if the user name is valid
            if(playerID.data.result === true){
            
                //loading message
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Getting Player fish info... ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`جاري تحميل بيانات اللاعب... ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    //get player fish stats
                    FNBRMENA.getPlayerFishStats(playerID.data.account_id, lang)
                    .then(async res => {

                        //all fishes
                        const listFish = await FNBRMENA.listFish(season, lang)

                        //if the user entered a season that still yet not started
                        if(listFish.data.fish.length !== 0){

                            //account level
                            const level = await axios.get(`https://fortnite-api.com/v2/stats/br/v2?name=${playerTag}&accountType=epic&timeWindow=lifetime`)

                            //variables
                            var x = 50
                            var y = 300
                            var newline = 0
                            
                            //defined a hit
                            var counter = 0

                            //registering fonts
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700"})

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

                            //get a random number
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

                            //date
                            moment.locale(lang)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            if(lang === "en"){
                                var date = moment().format("dddd, MMMM Do of YYYY")
                                ctx.font = `60px Burbank Big Condensed`
                            }else if(lang === "ar"){
                                var date = moment().format("dddd, MMMM Do من YYYY")
                                ctx.font = `60px Arabic`
                            } ctx.fillText(date, (canvas.width / 2), (canvas.height - 35))

                            //collection
                            if(lang === "en"){
                                ctx.font = '200px Burbank Big Condensed'
                                ctx.fillText("Fish Collection", canvas.width / 2, 200)
                            }else if(lang === "ar"){
                                ctx.font = '200px Arabic'
                                ctx.fillText("احصائيات السمك", canvas.width / 2, 200)
                            }

                            //finding his last season stats
                            var statSeasonIndex = 0
                            for(let seasonIndex = 0; seasonIndex < res.data.stats.length; seasonIndex++){
                                if(await listFish.data.season === res.data.stats[seasonIndex].season){
                                    statSeasonIndex = seasonIndex
                                    break
                                }
                            }
                            
                            //loop to every fish in game
                            for(let j = 0; j < listFish.data.fish.length; j++){

                                //add new line
                                newline++

                                //defined catchedFish
                                var catchedFish = []

                                if(listFish.data.season === res.data.stats[statSeasonIndex].season){

                                    //loop throw evry fish that the user owns
                                    catchedFish = res.data.stats[statSeasonIndex].fish.filter(found => {
                                        return found.type.toLowerCase() === listFish.data.fish[j].id.toLowerCase()
                                    })
                                }

                                //if we found a hit
                                if(catchedFish.length !== 0){

                                    //counter
                                    counter++

                                    //change the opacity
                                    ctx.globalAlpha = 1

                                    var name = catchedFish[0].name
                                    var descriprion = catchedFish[0].description
                                    var image = catchedFish[0].image
                                    var length = (catchedFish[0].length / 100) * 90
                                    
                                    //the slot
                                    const slot = await Canvas.loadImage('./assets/Fish/FishSlot.png')
                                    ctx.drawImage(slot, x, y, 100, 150)

                                    //change the opacity
                                    ctx.globalAlpha = 0.5

                                    //length background
                                    const lengthBlue = await Canvas.loadImage('./assets/Fish/progressFishBule.png')
                                    ctx.drawImage(lengthBlue, x + 5, y + 135, 90, 7)

                                    //the number of the fish
                                    ctx.fillStyle = '#03d3fc';
                                    ctx.textAlign='right';
                                    ctx.font = 'italic 40px Burbank Big Condensed'
                                    ctx.fillText(j, x + 95, y + 35)

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

                                    var name = listFish.data.fish[j].name
                                    var descriprion = listFish.data.fish[j].description
                                    var image = listFish.data.fish[j].image

                                    //change the opacity
                                    ctx.globalAlpha = 0.5

                                    //the slot
                                    const slot = await Canvas.loadImage('./assets/Fish/FishSlot.png')
                                    ctx.drawImage(slot, x, y, 100, 150)

                                    //the number of the fish
                                    ctx.fillStyle = '#03d3fc';
                                    ctx.textAlign='right';
                                    ctx.font = 'italic 40px Burbank Big Condensed'
                                    ctx.fillText(j, x + 95, y + 35)

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
                            if(lang === "en"){
                                ctx.textAlign='left';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(`Season: ${listFish.data.season}`, 50, canvas.height - 170)
                            }else if(lang === "ar"){
                                ctx.textAlign='right';
                                ctx.font = '40px Arabic'
                                ctx.fillText(`الموسم: ${listFish.data.season}`, canvas.width - 50, canvas.height - 170)
                            }

                            //name of the epic games user account
                            if(lang === "en"){
                                ctx.textAlign='left';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(`Account Name: ${level.data.data.account.name}`, 50, canvas.height - 130)
                            }else if(lang === "ar"){
                                ctx.textAlign='right';
                                ctx.font = '40px Arabic'
                                ctx.fillText(`اسم الحساب: ${level.data.data.account.name}`, canvas.width - 50, canvas.height - 130)
                            }

                            //account level
                            if(lang === "en"){
                                ctx.textAlign='left';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(`Account Level: ${level.data.data.battlePass.level}`, 50, canvas.height - 90)
                            }else if(lang === "ar"){
                                ctx.textAlign='right';
                                ctx.font = '40px Arabic'
                                ctx.fillText(`لفل الحساب: ${level.data.data.battlePass.level}`, canvas.width - 50, canvas.height - 90)
                            }

                            //counter
                            if(lang === "en"){
                                ctx.textAlign='left';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(`Fish Caught: ${counter}/${listFish.data.fish.length}`, 50, canvas.height - 50)
                            }else if(lang === "ar"){
                                ctx.textAlign='right';
                                ctx.font = '40px Arabic'
                                ctx.fillText(`عدد السمك المصطاده: ${counter}/${listFish.data.fish.length}`, canvas.width - 50, canvas.height - 50)
                            }

                            //send the fish stats picture
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), `${playerID.data.account_id}.png`)
                            await message.channel.send(att)
                            msg.delete()

                        }else{

                            //season error
                            const Err = new Discord.MessageEmbed()
                            Err.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") Err.setTitle(`The season ${season} is wrong season please type a valid season number ${errorEmoji}`)
                            else if(lang === "ar") Err.setTitle(`الموسم ${season} غير صحيح الرجاء ادخال رقم موسم صحيح ${errorEmoji}`)
                            message.reply(Err)
                        }
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
                
            }else{
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`There is no account with this name check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على الحساب الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(Err)
            }
        })
    }
}