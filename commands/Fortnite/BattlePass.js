const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api")
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"))
const Canvas = require('canvas')

module.exports = {
    commands: 'battlepass',
    descriptionEN: 'A command that will return a picture of a battlepass of your choice from season 2 till current season.',
    descriptionAR: 'أمر راح يسترجع لك صورة تحتوي على عناصر باتل باس بأختيارك من الموسم 2 الى الموسم الحالي.',
    expectedArgsEN: 'To use the command you need to specifiy a season number from season 2 to latest season.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد موسم معين من الموسم الثاني الى الموسم الحالي.',
    argsExample: ['2', '14'],
    minArgs: 1,
    maxArgs: 1,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data
        fortniteAPI.getBattlepassRewards(season = args, options = {lang: lang})
            .then(async res => {
                
                // generating animation
                var length = res.rewards.length;
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") generating.setTitle(`Loading a total ${length} cosmetics please wait... ${loadingEmoji}`)
                else if(lang === "ar") generating.setTitle(`تحميل جميع العناصر بمجموع ${length} عنصر الرجاء الانتظار... ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    //variables
                    var width = 125
                    var height = 600
                    var newline = 0
                    var x = 125
                    var y = 240
                    var paid = 0
                    var free = 0

                    //width
                    width += (10 * 215) + (10 * 75) + 75

                    //height
                    for(let i = 0; i < length; i++){
                        if(10 === newline){
                            height += 215 + 75
                            newline = 0
                        }
                        newline += 1
                    }

                    //register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/battlepass/background.png')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //upper
                    const upper = await Canvas.loadImage('./assets/battlepass/upper.png')
                    ctx.drawImage(upper, 0, 0, canvas.width, 150)

                    //fnbrmena
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '100px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 25, 107)

                    //season
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    if(lang === "en") ctx.font = '100px Burbank Big Condensed'
                    else if (lang === "ar") ctx.font = '100px Arabic'
                    ctx.fillText(res.displayInfo.chapterSeason, (canvas.width - 25), 107)

                    //reseting new line
                    newline = 0

                    //loop throw every item
                    for(let i = 0; i < length; i++){

                        //add new line
                        newline += 1

                        //variables
                        if(res.rewards[i].price === null) var tier = res.rewards[i].tier
                        else var tier = res.rewards[i].price.amount
                        var image = res.rewards[i].item.images.icon
                        if(res.rewards[i].item.series === null) var rarity = res.rewards[i].item.rarity.id
                        else var rarity = res.rewards[i].item.series.id

                        //searching...
                        if(rarity === "Legendary"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/legendary.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderLegendary.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "Epic"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/epic.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderEpic.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "Rare"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/rare.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderRare.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "Uncommon"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/uncommon.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderUncommon.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "Common"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/common.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderCommon.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "MarvelSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/marvel.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderMarvel.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "DCUSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/dc.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderDc.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "DarkSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/dark.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderDark.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "CreatorCollabSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/icon.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderIcon.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "ColumbusSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderStarwars.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "ShadowSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/shadow.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderShadow.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "SlurpSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/slurp.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderSlurp.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "FrozenSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/frozen.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderFrozen.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "LavaSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/lava.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderLava.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else
                        if(rarity === "PlatformSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/gaming.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderGaming.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }else{
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/common.png')
                            ctx.drawImage(holder, x, y, 215, 215)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 215, 215)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderCommon.png')
                            ctx.drawImage(cover, x, y, 215, 215)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '60px Burbank Big Condensed'
                            if(res.rewards[i].price === null) ctx.fillText(tier, (x + 107), (y + 275))
                            else {
                                const holder = await Canvas.loadImage('./assets/battlepass/star.png')
                                ctx.drawImage(holder, x + 100, y + 220, 60, 60)
                                ctx.fillText(tier, (x + 73), (y + 272))
                            }
                        }

                        //x, y
                        x += 75 + 215
                        if(10 === newline){
                            x = 125
                            y += 215 + 75
                            newline = 0
                        }
                    }

                    //send the pic
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `season${res.season}.png`)
                    await message.channel.send(att)

                    //loop throw every item and store the paid and unpaid items
                    for(let i = 0; i < length; i++){

                        //if the item is paid
                        if(res.rewards[i].battlepass === 'paid') paid += 1

                        //if the item is free
                        if(res.rewards[i].battlepass === 'free') free += 1
                    }

                    //create info embed
                    const info = new Discord.MessageEmbed()

                    //add the color
                    info.setColor(FNBRMENA.Colors("embed"))

                    //set title and add fields
                    if(lang === "en"){

                        //set the title
                        info.setTitle(`Season ${res.displayInfo.chapterSeason} battlepass details`)

                        //add the fields
                        info.addFields(
                            {name: 'All Cosmetics:', value: length},
                            {name: 'Paid Cosmetics:', value: paid},
                            {name: 'Free Cosmetics:', value: free},
                        )
                        
                    }else if(lang === "ar"){

                        //set the title
                        info.setTitle(`سيزون ${res.displayInfo.chapterSeason} معلومات الباتل باس`)

                        //add the fields
                        info.addFields(
                            {name: 'جميع العناصر:', value: length},
                            {name: 'العناصر المدفوعة:', value: paid},
                            {name: 'العناصر المجانية:', value: free},
                        )
                    }

                    //send the info embed
                    message.channel.send(info)

                    //get the battlepass videos
                    for(let i = 0; i < res.videos.length; i++){

                        //create the videos embed
                        const embed = new Discord.MessageEmbed()

                        //set the embed color
                        embed.setColor(FNBRMENA.Colors("embed"))

                        //if the video is a battlepass trailer
                        if(res.videos[i].type === "bp"){

                            if(lang === "en") embed.setTitle("Battlepass Trailer")
                            else if(lang === "ar") embed.setTitle("عرض الباتل باس")

                        }else

                        //if the video is a season story trailer
                        if(res.videos[i].type === "trailer"){

                            if(lang === "en") embed.setTitle("Season Trailer")
                            else if(lang === "ar") embed.setTitle("عرض السيزون")

                        }

                        //set the url
                        embed.setURL(res.videos[i].url)

                        //send the message
                        message.channel.send(embed)
                    }

                    //delete msg
                    msg.delete()
                            
                })

            }).catch(err => {

                //log the error
                console.log(err);

                //create error embed
                const error = new Discord.MessageEmbed()

                //set the color
                error.setColor(FNBRMENA.Colors("embed"))

                //add the err to the embed
                if(lang === "en") error.setTitle(`There is no battlepass with that number ${errorEmoji}`)
                else if(lang === "ar") error.setTitle(`لا يوجد باتل باس بهذا الرقم ${errorEmoji}`)

                //send the message
                message.channel.send(error)
                    
                    
        })
    }
}