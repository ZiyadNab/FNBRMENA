const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const axios = require('axios')
var querystring = require('querystring');
const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const Canvas = require('canvas');
const moment = require('moment')

module.exports = {
    commands: 'token',
    expectedArgs: '[ Auth Code ]',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        const Token = async (auth) => {

            //request header
            const header = {
                'Content-Type':'application/x-www-form-urlencoded',     
                'Authorization': 'basic MzQ0NmNkNzI2OTRjNGE0NDg1ZDgxYjc3YWRiYjIxNDE6OTIwOWQ0YTVlMjVhNDU3ZmI5YjA3NDg5ZDMxM2I0MWE='   
            }

            //request data
            const data = querystring.stringify({'grant_type':'authorization_code', 'code': auth})

            //request token from epicgames servers
            const response = await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token",data,{headers: header})
            .then(res => {
                return res.data
            })
            .catch(err => {
                return err
            })
            return response
        }

        //const Access = await Token(text)

        const GetCosmetics = async (token, accountID) => {

            //counter
            var counterSkins = 0
            var counterBackbling = 0

            //cosmetics the user owns
            var ownedSkins = [];
            var ownedBackblings = []

            //request the cosmetics list from epic games using account id and token
            await axios.post(`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${accountID}/client/QueryProfile?profileId=athena`,{},
            {headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`,}})
            .then(async data => {

                //get every cosmetic in the game
                const cosmetics = await axios.get(`https://fortniteapi.io/v2/items/list?lang=${lang}`, { headers: {'Content-Type': 'application/json','Authorization': key.apis.fortniteio,} })
                .then((res) => {
                    return res.data.items;
                })

                //add the cosmetics to owned array using fortniteapi.io
                var items = Object.keys(data.data.profileChanges[0].profile.items)
                for(let i = 0; i < items.length; i++){
                    var item00 = await data.data.profileChanges[0].profile.items[items[i]];

                    //AthenaCharacter || AthenaPickaxe || AthenaItemWrap || AthenaBackpack || AthenaLoadingScreen || AthenaSkyDiveContrail || AthenaDance || AthenaGlider || AthenaMusicPack
                    if(await item00.templateId.includes('AthenaCharacter')) {
                        const AthenaCharacterID = await item00.templateId.split(':')[1];
                        const Skins = await cosmetics.find(it => it.id.toLowerCase() === AthenaCharacterID);
                        ownedSkins[counterSkins] = await Skins;
                        counterSkins++
                    }else if(await item00.templateId.includes('AthenaBackpack')) {
                        const AthenaBackpackID = await item00.templateId.split(':')[1];
                        const Backblings = await cosmetics.find(it => it.id.toLowerCase() === AthenaBackpackID);
                        ownedBackblings[counterBackbling] = await Backblings;
                        counterBackbling++
                    }
                }

            }).catch(err => {
                console.log(err)
            })

            const owned = [
                ownedSkins,
                ownedBackblings,
            ]

            return owned
        }

        const ownedCosmetics = await GetCosmetics("5ef45d2f9d1849c987789c6864e77aba", "c1466883a19246e4a5e86bbc43087504")

        const listItems = async (ownedCosmetics, p) => {
            var userItems = []

            await ownedCosmetics[p].filter(item => {
                if(item.series === null){
                    if(item.rarity.id === "Legendary"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series === null){
                    if(item.rarity.id === "Epic"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series === null){
                    if(item.rarity.id === "Rare"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series === null){
                    if(item.rarity.id === "Uncommon"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series === null){
                    if(item.rarity.id === "Common"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "MarvelSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "DCUSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "CUBESeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "CreatorCollabSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "ColumbusSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "FrozenSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "ShadowSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "SlurpSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "LavaSeries"){
                        userItems.push(item)
                    }
                }
            })

            await ownedCosmetics[p].filter(item => {
                if(item.series !== null){
                    if(item.series.id === "PlatformSeries"){
                        userItems.push(item)
                    }
                }
            })

            //creating length
            var length = userItems.length
            if(length <= 10){
                length = length
            }else if(length > 10 && length <= 50){
                length = length / 5
            }else if(length > 50 && length <= 70){
                length = length / 7
            }else if(length > 70 && length < 100){
                length = length / 10
            }else if(length > 100 && length < 200){
                length = length / 13
            }else{
                length = length / 20
            }

            if (length % 2 !== 0){
                length = length | 0;
            }
            
            //variables
            var width = 0
            var height = 256 + ((length * 12) * 2)
            var newline = 0
            var x = 0
            var y = length * 12

            //creating width
            width += (length * 256) + (length * 5) - 5

            //creating height
            for(let i = 0; i < userItems.length; i++){
                
                if(newline === length){
                    height += 256 + 5
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
                let fontSize = 20;
                do {
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    }
                } while (ctx.measureText(text).width > 230);
                return ctx.font;
            }

            //dateApplytext
            const dateApplyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
                let fontSize = 500;
                do {
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    }
                } while (ctx.measureText(text).width > (canvas.width / 2));
                return ctx.font;
            }

            //dateApplytext
            const creditApplyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
                let fontSize = 200;
                do {
                    ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;  
                } while (ctx.measureText(text).width > (canvas.width / 8));
                return ctx.font;
            }

            //creating canvas
            const canvas = Canvas.createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            //background
            const background = await Canvas.loadImage('./assets/backdroung.jpg')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            //credits and player name
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='left';
            ctx.font = creditApplyText(canvas, "FNBRMENA")
            ctx.fillText("FNBRMENA", (ctx.font.substring(0,ctx.font.indexOf("p")) - (7 * length)), (ctx.font.substring(0,ctx.font.indexOf("p"))))
            ctx.textAlign='right';
            ctx.fillText("AntMan V2", (canvas.width - (ctx.font.substring(0,ctx.font.indexOf("p")) - (7 * length))), (ctx.font.substring(0,ctx.font.indexOf("p"))))

            //date
            var date   
            if(lang === "en"){
                moment.locale("en")
                date = moment().format("dddd, MMMM Do of YYYY")
            }else if(lang === "ar"){
                moment.locale("ar")
                date = moment().format("dddd, MMMM Do من YYYY")
            }

            //print data
            if(lang === "en"){
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = dateApplyText(canvas, ownedCosmetics[p].length + " Items | " + date)
                ctx.fillText(ownedCosmetics[p].length + " Items | " + date, (canvas.width / 2), (canvas.height - (ctx.font.substring(0,ctx.font.indexOf("p")) - (5 * length))))
            }else if(lang === "ar"){
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = dateApplyText(canvas, date + " | عدد العناصر: " + ownedCosmetics[p].length)
                ctx.fillText(date + " | عدد العناصر: " + ownedCosmetics[p].length, (canvas.width / 2), (canvas.height - (ctx.font.substring(0,ctx.font.indexOf("p")) - (5 * length))))
            }

            //text lang
            var string
            if(lang === "en"){
                string = `Found ${userItems.length} item`
            }else if(lang === "ar"){
                string = `لقت تم اكتشاف ${userItems.length} عنصر`
            }

            //reseting newline
            newline = 0

            //generating text
            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`${string} ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

                for(let i = 0; i < userItems.length; i++){

                    //skin informations
                    var name = await userItems[i].name;
                    var description = await userItems[i].description;
                    var image = await userItems[i].images.icon;
                    if(userItems[i].series !== null){
                        rarity = await userItems[i].series.id
                    }else{
                        rarity = await userItems[i].rarity.id
                    }
                    newline = newline + 1;

                    const wait = new Discord.MessageEmbed()
                    wait.setColor('#BB00EE')
                    if(lang === "en"){
                        wait.setTitle(`Skin Number ${i + 1} of ${userItems.length} ... ${emoji}`)
                    }else if(lang === "ar"){
                        wait.setTitle(`سكن ${i + 1} من اصل ${userItems.length} ... ${emoji}`)
                    }
                    await msg.edit(wait)

                    //searching
                    if(await rarity === 'Legendary'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))  
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
                    }else
                    if(await rarity === 'Epic'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'Rare'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'Uncommon'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'Common'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'MarvelSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))  
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'DCUSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'CUBESeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'CreatorCollabSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'ColumbusSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))   
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'ShadowSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'SlurpSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'FrozenSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'LavaSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else
                    if(await rarity === 'PlatformSeries'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }else{
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, x, y, 256, 256)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, x, y, 256, 256)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, x, y, 256, 256)
                        if(lang === "en"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Burbank Big Condensed'
                            ctx.fillText(name, (128 + x), (y + 210))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '20px Arabic'
                            ctx.fillText(name, (128 + x), (y + 210)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (128 + x), (y + 240))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    // changing x and y
                    x = x + 5 + 256; 
                    if (length === newline){
                        y = y + 5 + 256;
                        x = 0;
                        newline = 0;
                    }
                }
                const att = await new Discord.MessageAttachment(canvas.toBuffer('image/jpeg'))
                await message.channel.send(att)
                await msg.delete()
                return true
            })
        }

        const S = await listItems(ownedCosmetics, 0)
        if(S === true){
            const B = await listItems(ownedCosmetics, 1)
        }
    }
}
