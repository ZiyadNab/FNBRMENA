const axios = require('axios')
const Discord = require('discord.js')
const Canvas = require('canvas')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Crew)

    var data = []
    var number = 0

    const Crew = () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("crew").once('value', async function (server) {

            //store access
            var status = server.val().Active;
            var lang = server.val().Lang;
            var push = server.val().Push

            //if the event is set to be true [ON]
            if(status === "true"){

                //request data
                axios.get(`https://fortniteapi.io/v2/game/crew?lang=${lang}`, { headers: {'Content-Type': 'application/json','Authorization': "d4ce1562-839ff66b-3946ccb6-438eb9cf",} })
                .then(async response => {
                    if(number === 0){
                        //data = await response.data[0].date
                        number++
                    }

                    //if the client wants to pust data
                    if(push === "true"){
                        data = []
                    }

                    if(response.data[0].date !== data){

                        //variables
                        var width = 0
                        var height = 512
                        var newline = 0
                        var x = 0
                        var y = 0

                        //res
                        const res = response.data

                        //send the generating message
                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#00ffff')
                        const emoji = client.emojis.cache.get("862704096312819722")
                        if(lang === "en") generating.setTitle(`Loading the crew information ${emoji}`)
                        else if(lang === "ar") generating.setTitle(`جاري تحميل بيانات طاقم فورت نايت ${emoji}`)
                        message.send(generating)
                        .then( async msg => {

                            var year = res[0].date.substring(0, 4)
                            var month = res[0].date.substring(5, 7)
                            var day = res[0].date.substring(8, 10)

                            //the crew data has been found lets cread an embed
                            const crewData = new Discord.MessageEmbed()

                            //add color
                            crewData.setColor('#00ffff')

                            //add title
                            if(lang === "en") crewData.setTitle(`The Fortnite Crew for month ${month} of ${year}`)
                            else if(lang === "ar") crewData.setTitle(`حزمة طاقم فورت نايت لشهر ${month} سنه ${year}`)

                            //add image
                            crewData.setImage(res[0].images.apiRender)

                            //add url
                            crewData.setURL(res[0].video)

                            //creating length
                            var length = res[0].rewards.length
                            if(length <= 2){
                                length = length
                            }else if(length > 2 && length <= 4){
                                length = length / 2
                            }else if(length > 4 && length <= 7){
                                length = length / 3
                            }else if(length > 7 && length <= 50){
                                length = length / 5
                            }else if(length > 50 && length < 70){
                                length = length / 7
                            }else{
                                length = length / 10
                            }

                            if (length % 2 !== 0){
                                length += 1;
                                length = length | 0;
                            }

                            //creating width
                            width += (length * 512) + (length * 5) - 5

                            //creating height
                            for(let i = 0; i < res[0].rewards.length; i++){
                                
                                if(newline === length){
                                    height += 512 + 5
                                    newline = 0
                                }
                                newline++
                            }

                            //registering fonts
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                            //applytext
                            const applyText = (canvas, text) => {
                                const ctx = canvas.getContext('2d');
                                let fontSize = 36;
                                do {
                                    if(lang === "en"){
                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                    }else if(lang === "ar"){
                                        ctx.font = `${fontSize -= 1}px Arabic`;
                                    }
                                } while (ctx.measureText(text).width > 420);
                                return ctx.font;
                            }

                            //creating canvas
                            const canvas = Canvas.createCanvas(width, height);
                            const ctx = canvas.getContext('2d');

                            //background
                            const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                            //reset newline
                            newline = 0

                            //items
                            for(let i = 0; i < res[0].rewards.length; i++){

                                var name = res[0].rewards[i].item.name
                                var description = res[0].rewards[i].item.description
                                if(res[0].rewards[i].item.series !== null){
                                    var rarity = res[0].rewards[i].item.series.id
                                }else{
                                    var rarity = res[0].rewards[i].item.rarity.id
                                }
                                if(res[0].rewards[i].item.images.featured !== null && res[0].rewards[i].item.type.id !== "loadingscreen"){
                                    var image = res[0].rewards[i].item.images.featured
                                }else{
                                    var image = res[0].rewards[i].item.images.icon
                                }

                                newline++

                                //searching...
                                if(rarity === "Legendary"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "Epic"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "Rare"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "Uncommon"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "Common"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "MarvelSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "DCUSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "CUBESeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "CreatorCollabSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "ColumbusSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "ShadowSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "SlurpSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "FrozenSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "LavaSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else if(rarity === "PlatformSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }else{
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, x, y, 512, 512)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, x, y, 512, 512)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, x, y, 512, 512)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Arabic'
                                        ctx.fillText(name, x + 256, y + 430)
                                        ctx.font = applyText(canvas, description);
                                        ctx.fillText(description, x + 256, y + 470)
                                    }
                                }
                                // changing x and y
                                x = x + 5 + 512; 
                                if (length === newline){
                                    y = y + 5 + 512;
                                    x = 0;
                                    newline = 0;
                                }
                            }

                            //send embed
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), res[0].date + '.png')
                            await message.send(att)
                            message.send(crewData)
                            msg.delete()

                            data = await response.data[0].date

                            //trun off push if enabled
                            admin.database().ref("ERA's").child("Events").child("crew").update({
                                Push: "false"
                            })
                        })
                    }
                }).catch(err => {
                    console.log("The issue is in Crew Events ", err)
                })
            }
        })
    }
    setInterval(Crew, 30000)
}