const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');

module.exports = {
    commands: 'crew',
    expectedArgs: '[ The crew year and month number ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        var mess

        if(lang === "en"){
            mess = "Loading the crew information"
        }else if(lang === "ar"){
            mess = "جاري تحميل بيانات طاقم فورت نايت"
        }

        //request crew data
        FNBRMENA.Crew(lang)
        .then(async response => {

            //res
            const res = response.data

            //filter
            const crew = res.filter(catched => {
                return catched.date.includes(text)
            })

            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`${mess} ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

                var year = crew[0].date.substring(0, 4)
                var month = crew[0].date.substring(5, 7)
                var day = crew[0].date.substring(8, 10)

                //the crew data has been found lets cread an embed
                const crewData = new Discord.MessageEmbed()

                //add color
                crewData.setColor('#BB00EE')

                //add title
                if(lang === "en"){
                    crewData.setTitle(`The Fortnite Crew for month ${month} of ${year}`)
                }else if(lang === "ar"){
                    crewData.setTitle(`حزمة طاقم فورت نايت لشهر ${month} سنه ${year}`)
                }

                //add image
                crewData.setImage(crew[0].images.apiRender)

                //add url
                crewData.setURL(crew[0].video)

                //creating length
                var length = crew[0].rewards.length
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

                //variables
                var width = 0
                var height = 512
                var newline = 0
                var x = 0
                var y = 0

                //creating width
                width += (length * 512) + (length * 5) - 5

                //creating height
                for(let i = 0; i < crew[0].rewards.length; i++){
                    
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

                //reset newline
                newline = 0

                //items
                for(let i = 0; i < crew[0].rewards.length; i++){

                    var name = crew[0].rewards[i].item.name
                    var description = crew[0].rewards[i].item.description
                    if(crew[0].rewards[i].item.series !== null){
                        var rarity = crew[0].rewards[i].item.series.id
                    }else{
                        var rarity = crew[0].rewards[i].item.rarity.id
                    }
                    if(crew[0].rewards[i].item.images.featured !== null && crew[0].rewards[i].item.type.id !== "loadingscreen"){
                        var image = crew[0].rewards[i].item.images.featured
                    }else{
                        var image = crew[0].rewards[i].item.images.icon
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
                const att = new Discord.MessageAttachment(canvas.toBuffer(), month+'.png')
                await message.channel.send(att)
                message.channel.send(crewData)
                msg.delete()
                
            }).catch(err => {
                console.log(err)
            })
        })
    }
}