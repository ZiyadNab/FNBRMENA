const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const Canvas = require('canvas');

module.exports = {
    commands: 'battlepass',
    expectedArgs: '[ Number of the season ]',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //var
        var language;
        var loading;

        if(lang === "en"){
            language = "en"
            loading = "Loading a total"
            send = "Sending the image please wait"
            cosmetics = "cosmetics please wait"
        }
        if(lang === "ar"){
            language = "ar"
            loading = "تحميل جميع العناصر بمجموع"
            send = "جاري ارسال الصورة الرجاء الانتظار"
            cosmetics = "عنصر الرجاء الانتظار"
        }

        fortniteAPI.getBattlepassRewards(season = args, options = {lang: language})
            .then(async res => {
                
                // generating animation
                var length = res.rewards.length;
                const generating = new Discord.MessageEmbed()
                generating.setColor(FNBRMENA.Colors("embed"))
                generating.setTitle(`${loading} ${length} ${cosmetics}... ${loadingEmoji}`)
                message.channel.send(generating)
                .then( async msg => {

                    //variables
                    var width = 250
                    var height = 1500
                    var newline = 0
                    var x = 250
                    var y = 750

                    //width
                    width += (10*430) + (10*150) + 150
                    //height
                    for(let i = 0; i < length; i++){
                        if(10 === newline){
                            height += 430 + 150
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
                    ctx.drawImage(upper, 0, 0, canvas.width, 500)

                    //fnbrmena
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '250px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 150, 350)

                    //season
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    if(lang === "en"){
                        ctx.font = '250px Burbank Big Condensed'
                    }else if (lang === "ar"){
                        ctx.font = '250px Arabic'
                    }
                    ctx.fillText(res.displayInfo.chapterSeason, (canvas.width - 150), 350)

                    newline = 0
                    for(let i = 0; i < length; i++){

                        //x,y
                        newline += 1

                        //variables
                        var tier = res.rewards[i].tier
                        var image = res.rewards[i].item.images.icon
                        if(res.rewards[i].item.series === null){
                            var rarity = res.rewards[i].item.rarity.id
                        }else{
                            var rarity = res.rewards[i].item.series.id
                        }

                        //searching
                        if(rarity === "Legendary"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/legendary.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderLegendary.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "Epic"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/epic.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderEpic.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "Rare"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/rare.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderRare.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "Uncommon"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/uncommon.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderUncommon.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "Common"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/common.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderCommon.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "MarvelSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/marvel.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderMarvel.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "DCUSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/dc.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderDc.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "DarkSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/dark.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderDark.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "CreatorCollabSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/icon.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderIcon.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "ColumbusSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderStarwars.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "ShadowSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/shadow.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderShadow.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "SlurpSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/slurp.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderSlurp.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "FrozenSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/frozen.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderFrozen.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "LavaSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/lava.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderLava.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else
                        if(rarity === "PlatformSeries"){
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/gaming.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderGaming.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }else{
                            const holder = await Canvas.loadImage('./assets/Rarities/battlepass/common.png')
                            ctx.drawImage(holder, x, y, 430, 430)
                            const pic = await Canvas.loadImage(image)
                            ctx.drawImage(pic, x, y, 430, 430)
                            const cover = await Canvas.loadImage('./assets/Rarities/battlepass/borderCommon.png')
                            ctx.drawImage(cover, x, y, 430, 430)
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '150px Burbank Big Condensed'
                            ctx.fillText(tier, (x + 215), (y + 550))
                        }

                        //initilizing
                        x += 150 + 430
                        if(10 === newline){
                            x = 250
                            y += 430 + 150
                            newline = 0
                        }
                    }

                    //send the pic
                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                    await message.channel.send(att)

                    //battlepass info
                    var paid = 0
                    var free = 0
                    for(let i = 0; i < length; i++){
                        if(res.rewards[i].battlepass === 'paid')
                            paid += 1
                        if(res.rewards[i].battlepass === 'free')
                            free += 1
                    }
                    const info = new Discord.MessageEmbed()
                    info.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en"){
                        info.setTitle("Season "+ res.displayInfo.chapterSeason +" Battlepass Details")
                        info.addFields(
                            {name: 'All Cosmetics:', value: length},
                            {name: 'Paid Cosmetics:', value: paid},
                            {name: 'Free Cosmetics:', value: free},
                        )
                        
                    }else if(lang === "ar"){
                        info.setTitle("سيزون "+ res.displayInfo.chapterSeason +" معلومات الباتل باس")
                        info.addFields(
                            {name: 'جميع العناصر:', value: length},
                            {name: 'العناصر المدفوعة:', value: paid},
                            {name: 'العناصر المجانية:', value: free},
                        )
                    }
                    message.channel.send(info)

                    //videos
                    for(let i = 0; i < res.videos.length; i++){
                        const embed = new Discord.MessageEmbed()
                        embed.setColor(FNBRMENA.Colors("embed"))
                        if(res.videos[i].type === "bp"){
                            if(lang === "en"){
                                embed.setTitle("Battlepass Trailer")
                            }else if(lang === "ar"){
                                embed.setTitle("عرض الباتل باس")
                            }
                        }else if(res.videos[i].type === "trailer"){
                            if(lang === "en"){
                                embed.setTitle("Season Trailer")
                            }else if(lang === "ar"){
                                embed.setTitle("عرض السيزون")
                            }
                        }
                        embed.setURL(res.videos[i].url)
                        message.channel.send(embed)
                    }

                    msg.delete()
                            
                }).catch(err => {
                    console.log(err);
                })
            }).catch(err => {
                console.log(err);
                if(lang === "en"){
                    const error = new Discord.MessageEmbed()
                    .setColor(FNBRMENA.Colors("embed"))
                    .setTitle(`There is no battlepass with that number ${errorEmoji}`)
                    message.reply(error)
                }else if(lang === "ar"){
                    const error = new Discord.MessageEmbed()
                    .setColor(FNBRMENA.Colors("embed"))
                    .setTitle(`لا يوجد باتل باس بهذا الرقم ${errorEmoji}`)
                    message.reply(error)
                }
        })
    }
}