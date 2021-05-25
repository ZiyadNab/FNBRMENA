const moment = require('moment')
const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');

module.exports = {
    commands: 'fish',
    expectedArgs: '[ Name of the EPICGAMES player ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            //get the user id by name
            fortniteAPI.getAccountIdByUsername(username = text)
            .then(async name => {

                //if the user name is valid
                if(name.result === true){

                    //get player fish stats
                    fortniteAPI.getPlayerFishStats(accountId = name.account_id, options = {lang: lang})
                    .then(async res => {

                        const allFishs = await fortniteAPI.listFish(options = {lang: lang})
                        
                        //variables
                        var x = 50
                        var y = 300
                        var newline = 0

                        //registering fonts
                        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700"})

                        //canvas
                        const canvas = Canvas.createCanvas(1920, 1080);
                        const ctx = canvas.getContext('2d');

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

                        //blur the image
                        ctx.filter = "blur(50px)"

                        //background
                        const background = await Canvas.loadImage(imagesList[randomImage])
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                        //add blue fog
                        const fog = await Canvas.loadImage('./assets/News/fog.png')
                        ctx.drawImage(fog,0,0,1920,1080)

                        //credits
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='left';
                        ctx.font = '50px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 15, 55)

                        //date
                        var date
                        if(lang === "en"){
                            moment.locale("en")
                            date = moment().format("dddd, MMMM Do of YYYY")
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = `60px Burbank Big Condensed`
                            ctx.fillText(date, (canvas.width / 2), (canvas.height - 35))
                        }else if(lang === "ar"){
                            moment.locale("ar")
                            date = moment().format("dddd, MMMM Do من YYYY")
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = `60px Arabic`
                            ctx.fillText(date, (canvas.width / 2), (canvas.height - 35))
                        }

                        //Collection
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '200px Burbank Big Condensed'
                            ctx.fillText("Fish Collection", canvas.width / 2, 180)
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '200px Arabic'
                            ctx.fillText("احصائيات السمك", canvas.width / 2, 180)
                        }
                        
                        //loop to every fish in game
                        for(let j = 0; j < allFishs.fish.length; j++){

                            //add new line
                            newline++

                            //loop throw evry fish that the user owns
                            const catchedFish = res.stats[0].fish.filter(found => {
                                return found.type.toLowerCase() === allFishs.fish[j].id.toLowerCase()
                            })

                            //if we found a hit
                            if(catchedFish.length !== 0){

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

                                var name = allFishs.fish[j].name
                                var descriprion = allFishs.fish[j].description
                                var image = allFishs.fish[j].image

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

                        //send the fish stats picture
                        const att = new Discord.MessageAttachment(canvas.toBuffer(), text+'.png')
                        await message.channel.send(att)

                    })
                }else{
                    if(lang === "en"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`There is no account with this name check your speling and try again ${errorEmoji}`)
                        message.reply(Err)
                    }else if(lang === "ar"){
                        const Err = new Discord.MessageEmbed()
                        .setColor('#BB00EE')
                        .setTitle(`لا يمكنني العثور على حساب الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                        message.reply(Err)
                    }
                }
            })
        })
    }
}