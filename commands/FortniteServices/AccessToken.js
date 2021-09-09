const axios = require('axios')
var querystring = require('querystring');
const key = require('../../Coinfigs/config.json')
const Canvas = require('canvas');
const moment = require('moment');

module.exports = {
    commands: 'token',
    type: 'Fortnite Srvices',
    minArgs: 1,
    maxArgs: 1,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

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
            const response = await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", data, {headers: header})
            .then(res => {
                return res.data
            })
            .catch(err => {
                return err
            })
            return response
        }

        const Access = await Token(text)

        const GetCosmetics = async (token, accountID) => {

            //counter
            var counterSkins = 0
            var counterBackbling = 0
            var counterPickaxes = 0
            var counterGliders = 0
            var counterContrails = 0
            var counterEmotes = 0
            var counterWraps = 0
            var counterMusicPacks = 0

            //cosmetics the user owns
            var ownedSkins = [];
            var ownedBackblings = []
            var ownedPickaxes = []
            var ownedGliders = []
            var ownedContrails = []
            var ownedEmotes = []
            var ownedWraps = []
            var ownedMusicPacks = []

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
                    }else if(await item00.templateId.includes('AthenaPickaxe')) {
                        const AthenaPickaxeID = await item00.templateId.split(':')[1];
                        const Pickaxes = await cosmetics.find(it => it.id.toLowerCase() === AthenaPickaxeID);
                        ownedPickaxes[counterPickaxes] = await Pickaxes;
                        counterPickaxes++
                    }else if(await item00.templateId.includes('AthenaGlider')) {
                        const AthenaGliderID = await item00.templateId.split(':')[1];
                        const Gliders = await cosmetics.find(it => it.id.toLowerCase() === AthenaGliderID);
                        ownedGliders[counterGliders] = await Gliders;
                        counterGliders++
                    }else if(await item00.templateId.includes('AthenaSkyDiveContrail')) {
                        const AthenaSkyDiveContrailID = await item00.templateId.split(':')[1];
                        const Gliders = await cosmetics.find(it => it.id.toLowerCase() === AthenaSkyDiveContrailID);
                        ownedContrails[counterContrails] = await Gliders;
                        counterContrails++
                    }else if(await item00.templateId.includes('AthenaDance')) {
                        const AthenaDanceID = await item00.templateId.split(':')[1];
                        const Emotes = await cosmetics.find(it => it.id.toLowerCase() === AthenaDanceID);
                        ownedEmotes[counterEmotes] = await Emotes;
                        counterEmotes++
                    }else if(await item00.templateId.includes('AthenaItemWrap')) {
                        const AthenaItemWrapID = await item00.templateId.split(':')[1];
                        const Wraps = await cosmetics.find(it => it.id.toLowerCase() === AthenaItemWrapID);
                        ownedWraps[counterWraps] = await Wraps;
                        counterWraps++
                    }else if(await item00.templateId.includes('AthenaMusicPack')) {
                        const AthenaMusicPackID = await item00.templateId.split(':')[1];
                        const MusicPack = await cosmetics.find(it => it.id.toLowerCase() === AthenaMusicPackID);
                        ownedMusicPacks[counterMusicPacks] = await MusicPack
                        counterMusicPacks++
                    }
                }

            }).catch(err => {
                console.log(err)
            })

            const owned = [
                ownedSkins,
                ownedBackblings,
                ownedPickaxes,
                ownedGliders,
                ownedContrails,
                ownedEmotes,
                ownedWraps,
                ownedMusicPacks,
            ]

            return owned
        }

        const ownedCosmetics = await GetCosmetics(Access.access_token, Access.in_app_id)

        const createImage = async (ownedCosmetics, p) => {
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
            ctx.fillText(Access.displayName, (canvas.width - (ctx.font.substring(0,ctx.font.indexOf("p")) - (7 * length))), (ctx.font.substring(0,ctx.font.indexOf("p"))))

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

            //reseting newline
            newline = 0

            //generating text
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            const emoji = client.emojis.cache.get("805690920157970442")
            if(lang === "en") generating.setTitle(`Found ${userItems.length} item ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`لقت تم اكتشاف ${userItems.length} عنصر ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                const wait = new Discord.MessageEmbed()
                wait.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") wait.setTitle(`Generating iamges this might take longer than usual ... ${loadingEmoji}`)
                else if(lang === "ar") wait.setTitle(`جاري تحميل الصور ممكن تستغرق العملية اكثر من المعتاد ... ${loadingEmoji}`)
                await msg.edit(wait)

                for(let i = 0; i < userItems.length; i++){

                    //skin informations
                    var name = userItems[i].name;
                    var description = userItems[i].description;
                    var image = userItems[i].images.icon;
                    if(userItems[i].series !== null){
                        rarity = userItems[i].series.id
                    }else{
                        rarity = userItems[i].rarity.id
                    }
                    newline = newline + 1;

                    //searching
                    if(rarity === 'Legendary'){
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
                    if(rarity === 'Epic'){
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
                    if(rarity === 'Rare'){
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
                    if(rarity === 'Uncommon'){
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
                    if(rarity === 'Common'){
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
                    if(rarity === 'MarvelSeries'){
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
                    if(rarity === 'DCUSeries'){
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
                    if(rarity === 'CUBESeries'){
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
                    if(rarity === 'CreatorCollabSeries'){
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
                    if(rarity === 'ColumbusSeries'){
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
                    if(rarity === 'ShadowSeries'){
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
                    if(rarity === 'SlurpSeries'){
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
                    if(rarity === 'FrozenSeries'){
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
                    if(rarity === 'LavaSeries'){
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
                    if(rarity === 'PlatformSeries'){
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
            })
        }
        console.log(ownedCosmetics)
        for(let i = 0; i < ownedCosmetics.length; i++){
            await createImage(ownedCosmetics, i)
        }
    }
}
