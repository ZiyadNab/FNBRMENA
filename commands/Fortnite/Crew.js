const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');

module.exports = {
    commands: 'crew',
    descriptionEN: 'Get any in-game crew with its data and advertising video.',
    descriptionAR: 'احصل على اي حزمة طاقم فورت نايت مع جميع معلومات الحزمة ايضا مع الفيديو الأعلاني للحزمة.',
    expectedArgsEN: 'Just use the command then after use the crew number of what you want',
    expectedArgsAR: 'فقط أستعمل الأمر ثم اكتب رقم طاقم فورت نايت الي تريد استخراجة',
    argsExample: ['1', '4', '8'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //variables
        var width = 0
        var height = 1024
        var newline = 0
        var x = 0
        var y = 0

        //request crew data
        FNBRMENA.Crew(lang)
        .then(async response => {

            //res
            const res = response.data

            if((Number(text) - 1) < res.length){

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

                    //set title
                    if(lang === "en") crewData.setTitle(`The Fortnite Crew for month ${month} of ${year}`)
                    else if(lang === "ar") crewData.setTitle(`حزمة طاقم فورت نايت لشهر ${month} سنه ${year}`)

                    //add url
                    crewData.setURL(crew.video)

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
                    width += (length * 1024) + (length * 10) - 10

                    //creating height
                    for(let i = 0; i < crew.rewards.length; i++){
                        
                        if(newline === length){
                            height += 1024 + 10
                            newline = 0
                        }
                        newline++
                    }

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //aplyText
                    const applyTextName = (canvas, text) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = 92;
                        do {
                            if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > 900);
                        return ctx.font;
                    };

                    //applytext
                    const applyTextDescription = (canvas, text) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = 35;
                        do {
                            if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > 840);
                        return ctx.font;
                    };

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

                        //remove any lines
                        description = description.replace("\r\n", "")

                        //request more data
                        const data = await FNBRMENA.Search(lang, "id", crew.rewards[i].item.id)

                        //add introduces and set string
                        if(data.data.items[0].introduction !== null) description += `\n${data.data.items[0].introduction.text}`
                        if(data.data.items[0].set !== null) description += `\n${data.data.items[0].set.partOf}`

                        //split every line
                        description = description.split(/\r\n|\r|\n/)

                        //searching...
                        if(rarity === "Legendary"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "Epic"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "Rare"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "Uncommon"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "Common"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "MarvelSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "DCUSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "CUBESeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "CreatorCollabSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "ColumbusSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "ShadowSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "SlurpSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "FrozenSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "LavaSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else if(rarity === "PlatformSeries"){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }else{
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                            ctx.drawImage(skinholder, x, y, 1024, 1024)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 1024, 1024)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                            ctx.drawImage(skinborder, x, y, 1024, 1024)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 860 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Burbank Big Condensed'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = applyTextName(canvas, name);
                                ctx.fillText(name, 512 + x, 850 + y)
                                ctx.font = applyTextDescription(canvas, description[0]);
                                let descriptionY = 930 + y
                                ctx.fillText(description[0], 512 + x, descriptionY)
                                ctx.font = '15px Arabic'
                                descriptionY += 35
                                for(let p = 1; p < description.length; p++){
                                    ctx.fillText(description[p], 512 + x, descriptionY)
                                    descriptionY += 15
                                }
                            }
                        }

                        var yTags = y
                        for(let i = 0; i < data.data.items[0].gameplayTags.length; i++){

                            //if the item is animated
                            if(data.data.items[0].gameplayTags[i].includes('Animated')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item is reactive
                            if(data.data.items[0].gameplayTags[i].includes('Reactive')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item is synced emote
                            if(data.data.items[0].gameplayTags[i].includes('Synced')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item is traversal
                            if(data.data.items[0].gameplayTags[i].includes('Traversal')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }

                            //if the item has styles
                            if(data.data.items[0].gameplayTags[i].includes('HasVariants') || data.data.items[0].gameplayTags[i].includes('HasUpgradeQuests')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                                yTags += 70
                            }
                        }

                        //if the item contains copyrited audio
                        if(data.data.items[0].copyrightedAudio === true){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                            ctx.drawImage(skinholder, x + 934, yTags + 24, 60, 60)

                            yTags += 70
                        }

                        // changing x and y
                        x = x + 10 + 1024; 
                        if (length === newline){
                            y = y + 10 + 1024;
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
                if(lang === "en") Err.setTitle(`No crew pack has been found ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على حزمة طاقم فورت نايت ${errorEmoji}`)
                message.channel.send(Err)

            }

        }).catch(err => {
            console.log(err)
        })
    }
}