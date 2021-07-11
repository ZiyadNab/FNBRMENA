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
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //variables
        var width = 0
        var height = 512
        var newline = 0
        var x = 0
        var y = 0

        //request crew data
        FNBRMENA.Crew(lang)
        .then(async response => {

            //res
            const res = response.data

            if((text - 1) < res.length){

                //filter
                const crew = res[res.length - text]

                //send the generating message
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Loading the crew information ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`جاري تحميل بيانات طاقم فورت نايت ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    var year = crew.date.substring(0, 4)
                    var month = crew.date.substring(5, 7)
                    var day = crew.date.substring(8, 10)

                    //the crew data has been found lets cread an embed
                    const crewData = new Discord.MessageEmbed()

                    //add color
                    crewData.setColor(FNBRMENA.Colors("embed"))

                    //set author
                    if(lang === "en") crewData.setAuthor(`The Fortnite Crew for month ${month} of ${year}`, crew.rewards[0].item.images.icon, crew.video)
                    else if(lang === "ar") crewData.setAuthor(`حزمة طاقم فورت نايت لشهر ${month} سنه ${year}`, crew.rewards[0].item.images.icon, crew.video)

                    message.channel.send(crewData)

                    //add image
                    crewData.setImage(crew.images.apiRender)

                    //creating length
                    var length = crew.rewards.length

                    if(length <= 2) length = length
                    else if(length > 2 && length <= 4) length = length / 2
                    else if(length > 4 && length <= 7) length = length / 3
                    else if(length > 7 && length <= 50) length = length / 5
                    else if(length > 50 && length < 70) length = length / 7
                    else length = length / 10

                    if (length % 2 !== 0){
                        length += 1;
                        length = length | 0
                    }

                    //creating width
                    width += (length * 512) + (length * 5) - 5

                    //creating height
                    for(let i = 0; i < crew.rewards.length; i++){
                        
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

                    //add the background
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    //reset newline
                    newline = 0

                    //items
                    for(let i = 0; i < crew.rewards.length; i++){

                        var name = crew.rewards[i].item.name
                        var description = crew.rewards[i].item.description
                        if(crew.rewards[i].item.series !== null) var rarity = crew.rewards[i].item.series.id
                        else var rarity = crew.rewards[i].item.rarity.id
                        if(crew.rewards[i].item.images.featured !== null && crew.rewards[i].item.type.id !== "loadingscreen")
                        var image = crew.rewards[i].item.images.featured
                        else var image = crew.rewards[i].item.images.icon

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

            }else{

                //no crew pach has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No crew pack has been found${errorEmoji}`)
                else if(lang === "en") Err.setTitle(`لا يمكنني العثور على حزمة طاقم فورت نايت ${errorEmoji}`)
                message.reply(Err)

            }

        }).catch(err => {
            console.log(err)
        })
    }
}