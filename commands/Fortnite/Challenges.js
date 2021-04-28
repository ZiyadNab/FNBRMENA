const error = require('../Errors')
const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');

module.exports = {
    commands: 'quests',
    expectedArgs: '[ Name of the challenge Week_01 ]',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            fortniteAPI.listChallenges(season = "current", options = {lang: lang})
            .then(async res => {

                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = 130;
                    do {
                        if(lang === "en"){
                            ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                        }else if(lang === "ar"){
                            ctx.font = `${fontSize -= 1}px Arabic`;
                        }
                    } while (ctx.measureText(text).width > 4200);
                    return ctx.font;
                };

                //var
                var canvas;
                var ctx;
                var canvasM;
                var ctxM;
                var number = 2;
                var found = 0

                const generating = new Discord.MessageEmbed()
                generating.setColor('#BB00EE')
                const emoji = client.emojis.cache.get("805690920157970442")
                if(lang === "en"){
                    generating.setTitle(`Searching for a challenges ... ${emoji}`)
                }else if(lang === "ar"){
                    generating.setTitle(`جاري البحث عن تحديات ... ${emoji}`)
                }
                message.channel.send(generating)
                .then( async msg => {

                    //register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //going throw every challenge
                    for(let i = 0; i < res.bundles.length; i++){

                        //searching if there is a challenges
                        if((res.bundles[i].id).includes(text)){
                            //found
                            found = 1

                            //an a challenge has been found creating the picture
                            if(lang === "en"){
                                const got = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`Challenges has been found please wait ${emoji}`)
                                msg.edit(got)
                            }else if(lang === "ar"){
                                const got = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`تم البحث عن التحديات جاري انشاء الصور الرجاء الانتظار ${emoji}`)
                                msg.edit(got)
                                
                            }

                            //variables
                            var width = 5500;
                            var height = 800;
                            var quests = res.bundles[i].quests.length
                            var check = 5

                            //checking if its epic quest or no
                            if((res.bundles[i].quests[0].id).includes("Epic")){

                                //height for
                                for(let j = 0; j < quests; j++){
                                    height += 700
                                }

                                check = 0
                            }

                            //creating map image is there is a locations
                            var count = 0

                            for(let j = 0; j < res.bundles[i].quests.length; j++){
                                if(res.bundles[i].quests[j].locations.length){
                                    count++
                                }
                            }
                            if(count !== 0){
                                canvasM = Canvas.createCanvas(2048, 2048);
                                ctxM = canvasM.getContext('2d');

                                //background
                                const map = await Canvas.loadImage(' https://media.fortniteapi.io/images/map.png')
                                ctxM.drawImage(map, 0, 0, canvasM.width, canvasM.height)
                            }
                        

                            //creating height
                            
                            if(check === 0){
                                canvas = Canvas.createCanvas(width, height);
                                ctx = canvas.getContext('2d');

                                //background
                                const background = await Canvas.loadImage('./assets/Challenges/background.png')
                                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                                //upper
                                const upper = await Canvas.loadImage('./assets/Challenges/upper.png')
                                ctx.drawImage(upper, 0, 0, canvas.width, 400)

                                //legendary
                                const legendary = await Canvas.loadImage('./assets/Challenges/legendary.png')
                                ctx.drawImage(legendary, 150, 700, 5200, 400)

                                //FNBRMENA
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='left';
                                ctx.font = '250px Burbank Big Condensed'
                                ctx.fillText("FNBRMENA", 100, 270)

                                //Week Number
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '250px Burbank Big Condensed'
                                    ctx.fillText(res.bundles[i].name, (canvas.width - 50), 250)
                                } else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '250px Arabic'
                                    ctx.fillText(res.bundles[i].name, (canvas.width - 50), 250)
                                }

                                //rejection to create canvas again
                                check++
                            }

                            //checking if its epic quest or no
                            if((res.bundles[i].quests[0].id).includes("Epic")){
                                var y = 1300
                                for(let j = 0; j < quests; j++){

                                    //epic
                                    const epic = await Canvas.loadImage('./assets/Challenges/epic.png')
                                    ctx.drawImage(epic, 150, y, 5200, 400)

                                    //text
                                    if(lang === "en"){
                                        //locations
                                        if(res.bundles[i].quests[j].locations.length !== 0){
                                            //there is a location
                                            var xandy = res.bundles[i].quests[j].locations
                                            for(let p = 0; p < xandy.length; p++){
                                                if(xandy[p].location !== null){
                                                    const num = await Canvas.loadImage('./assets/Challenges/number' + number +'.png')
                                                    ctxM.drawImage(num, xandy[p].location.x, xandy[p].location.y, 100, 100)
                                                }
                                            }
                                        }

                                        //name
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='left';
                                        applyText(canvas, res.bundles[i].quests[j].name)
                                        ctx.fillText(res.bundles[i].quests[j].name, 350, y + 160)

                                        //number
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='right';
                                        ctx.font = '150px Burbank Big Condensed'
                                        ctx.fillText(number, 255, y + 350)

                                        //layer
                                        const layer = await Canvas.loadImage('./assets/Challenges/layer.png')
                                        ctx.drawImage(layer, 550, y + 320, 3000, 40)

                                        //progressTotal
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='left';
                                        ctx.font = '80px Burbank Big Condensed'
                                        ctx.fillText("0/" + res.bundles[i].quests[j].progressTotal, 3580, y + 360)

                                        //rewards
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='right';
                                        ctx.font = '200px Burbank Big Condensed'
                                        var xp = (res.bundles[i].quests[j].reward.xp)
                                        ctx.fillText(xp + "XP", (canvas.width - 200), y + 280)

                                        //adding number +1
                                        number += 1

                                    } else if(lang === "ar"){
                                        //locations
                                        if(res.bundles[i].quests[j].locations.length !== 0){
                                            //there is a location
                                            var xandy = res.bundles[i].quests[j].locations
                                            for(let p = 0; p < xandy.length; p++){
                                                if(xandy[p].location !== null){
                                                    const num = await Canvas.loadImage('./assets/Challenges/number' + number +'.png')
                                                    ctxM.drawImage(num, xandy[p].location.x, xandy[p].location.y, 100, 100)
                                                }
                                            }
                                        }

                                        //name
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='right';
                                        applyText(canvas, res.bundles[i].quests[j].name)
                                        ctx.fillText(res.bundles[i].quests[j].name, (canvas.width - 350), y + 160)

                                        //number
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='right';
                                        ctx.font = '150px Burbank Big Condensed'
                                        ctx.fillText(number, (canvas.width - 205), y + 350)

                                        //layer
                                        const layer = await Canvas.loadImage('./assets/Challenges/layer.png')
                                        ctx.drawImage(layer, 1600, y + 320, 3200, 40)

                                        //progressTotal
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='right';
                                        ctx.font = '80px Arabic'
                                        ctx.fillText(res.bundles[i].quests[j].progressTotal + "/0", 1550, y + 355)

                                        //rewards
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='right';
                                        ctx.font = '200px Burbank Big Condensed'
                                        var xp = (res.bundles[i].quests[j].reward.xp)
                                        ctx.fillText(xp + "XP", 900, y + 280)

                                        //adding number +1
                                        number += 1
                                    }

                                    y += 600
                                }
                            }else{
                                var y = 700
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '200px Burbank Big Condensed'
                                    ctx.fillText(res.bundles[i].quests[0].name, 350, y + 180)

                                    //number
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '150px Burbank Big Condensed'
                                    ctx.fillText("1", 250, y + 355)

                                    //layer
                                    const layer = await Canvas.loadImage('./assets/Challenges/layer.png')
                                    ctx.drawImage(layer, 550, y + 320, 3000, 40)

                                    //progressTotal
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '80px Burbank Big Condensed'
                                    ctx.fillText("0/" + res.bundles[i].quests[0].progressTotal, 3580, y + 360)

                                    //rewards
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '200px Burbank Big Condensed'
                                    var xp = (res.bundles[i].quests[0].reward.xp)
                                    ctx.fillText(xp + "XP", (canvas.width - 200), y + 280)

                                } else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '200px Arabic'
                                    ctx.fillText(res.bundles[i].quests[0].name, (canvas.width - 350), y + 180)
                                    var textWidth = ctx.measureText(res.bundles[i].quests[0].name).width

                                    //number
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '150px Burbank Big Condensed'
                                    ctx.fillText("1", canvas.width - 200, y + 355)

                                    //layer
                                    const layer = await Canvas.loadImage('./assets/Challenges/layer.png')
                                    ctx.drawImage(layer, 1600, y + 320, 3200, 40)

                                    //progressTotal
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '80px Burbank Big Condensed'
                                    ctx.fillText(res.bundles[i].quests[0].progressTotal + "/0", 1550, y + 355)

                                    //rewards
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='right';
                                    ctx.font = '200px Burbank Big Condensed'
                                    var xp = (res.bundles[i].quests[0].reward.xp)
                                    ctx.fillText(xp + "XP", 900, y + 280)

                                }
                            }
                            
                        }else{
                            if((i + 1) === res.bundles.length){
                                if(found !== 1){

                                    if(lang === "en"){
                                        const err = new Discord.MessageEmbed()
                                        .setColor('#BB00EE')
                                        .setTitle(`There is no challenges with that name ${errorEmoji}`)
                                        msg.edit(err)
                                    }else if(lang === "ar"){
                                        const err = new Discord.MessageEmbed()
                                        .setColor('#BB00EE')
                                        .setTitle(`لا يوجد تحديات بهذا الأسم ${errorEmoji}`)
                                        msg.edit(err)
                                        
                                    }

                                }
                            }
                        }
                    }

                    if(canvas !== undefined){
                        const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg'))
                        await message.channel.send(att)
                        msg.delete()
                    }
                    if(canvasM !== undefined){
                        const attM = new Discord.MessageAttachment(canvasM.toBuffer('image/jpeg'))
                        await message.channel.send(attM)
                    }
                })

            }).catch(err => {

            })

        })

    },
    requiredRoles: []
}