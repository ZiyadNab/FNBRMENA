const axios = require('axios')
var querystring = require('querystring');
const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');
const moment = require('moment')

module.exports = {
    commands: 'token',
    expectedArgs: '[ Auth Code ]',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            //cosmetics the user owns
            var owned = [];

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

            const GetCosmetics = async (token, accountID, owned) => {

                //counter
                var counter = 0

                //request the cosmetics list from epic games using account id and token
                await axios.post(`https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/game/v2/profile/${accountID}/client/QueryProfile?profileId=athena`,{},
                {headers: {'Content-Type': 'application/json','Authorization': `Bearer ${token}`,}})
                .then(async data => {

                    //get every cosmetic in the game
                    const cosmetics = await axios.get(`https://fortniteapi.io/items/list?lang=${lang}`, { headers: {'Content-Type': 'application/json','Authorization': key.apis.fortniteio,} })
                    .then((res) => {
                        return res.data.items.outfit;
                    })

                    //add the cosmetics to owned array using fortniteapi.io
                    var items = Object.keys(data.data.profileChanges[0].profile.items)
                    for(let i = 0; i < items.length; i++){
                        var item00 = await data.data.profileChanges[0].profile.items[items[i]];
                        if(await item00.templateId.includes('AthenaCharacter')) {
                            const splitid = await item00.templateId.split(':')[1];
                            const cosmetics2 = await cosmetics.find(it => it.id.toLowerCase() === splitid);
                            const itemn = await cosmetics2;
                            owned[counter] = await itemn;
                            counter++
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
                return owned
            }

            //const ownedCosmetics = await GetCosmetics(Access.access_token, Access.in_app_id, owned)

            //get every cosmetic in the game
            const ownedCosmetics = await axios.get(`https://fortniteapi.io/items/list?lang=${lang}`, { headers: {'Content-Type': 'application/json','Authorization': key.apis.fortniteio,} })
            .then((res) => {
                return res.data.items.outfit;
            })

            //variables
            var width = 0
            var height = 600
            var newline = 0
            var x = 0
            var y = 0

            //creating length
            var length = 380
            if(length <= 2){
                length = length
            }else if(length > 2 && length <= 4){
                length = length / 2
            }else if(length > 4 && length <= 7){
                length = length / 3
            }else if(length > 7 && length <= 50){
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
                length += 1;
                length = length | 0;
            }

            //creating width
            width += (length * 256) + (length * 5) - 5

            //creating height
            for(let i = 0; i < length; i++){
                
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
                let fontSize = 40;
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
            const background = await Canvas.loadImage('./assets/backgroundgray.png')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            //date
            var date
            if(lang === "en"){
                moment.locale("en")
                date = moment().format("dddd, MMMM Do of YYYY")
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = `100px Burbank Big Condensed`
                ctx.fillText(date, (canvas.width / 2), (canvas.height - 100))
            }else if(lang === "ar"){
                moment.locale("ar")
                date = moment().format("dddd, MMMM Do من YYYY")
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = `100px Arabic`
                ctx.fillText(date, (canvas.width / 2), (canvas.height - 100))
            }

            //reseting newline
            newline = 0

            //account name and skins
            var string
            if(lang === "en"){
                ctx.fillStyle = '#ffffff';
                ctx.textAlign='left';
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText("Player Name: ", 100, (canvas.height - 300))
                ctx.fillText("Total Cosmetics: ", 100, (canvas.height - 200))
            }else if(lang === "ar"){
                
            }

            //text lang
            var string
            if(lang === "en"){
                string = `Found ${ownedCosmetics.length} item`
            }else if(lang === "ar"){
                string = `Found ${ownedCosmetics.length} item`
            }

            //generating text
            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`${string} ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

                for(let i = 0; i < 380; i++){
                    //skin informations
                    var name = ownedCosmetics[i].name;
                    var description = ownedCosmetics[i].description;
                    var image = ownedCosmetics[i].images.icon;
                    var rarity = ownedCosmetics[i].rarity;
                    newline = newline + 1;

                    const wait = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`Number ${i + 1} of ${ownedCosmetics.length} ... ${emoji}`)
                    await msg.edit(wait)

                    //searching
                    if(rarity === 'legendary'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))  
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                        
                    }
                    if(rarity === 'epic'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'rare'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'uncommon'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'common'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'marvel'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))  
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'dc'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'dark series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'icon series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'starwars series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))   
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'shadow series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'slurp series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'frozen series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'lava series'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425)) 
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }
                        // const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                        // ctx.drawImage(credit, (15 + x), (y + 15), 146, 40);
                    }
                    if(rarity === 'gaminglegends'){
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
                            ctx.font = '40px Burbank Big Condensed'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = '30px Burbank Big Condensed'
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
                        }else if(lang === "ar"){
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='center';
                            ctx.font = '40px Arabic'
                            ctx.fillText(name, (256 + x), (y + 425))
                            ctx.font = applyText(canvas, description);
                            ctx.textAlign='center';
                            ctx.fillText(description, (256 + x), (y + 480))
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
                const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg'))
                await message.channel.send(att)
                msg.delete()
            })
        })
    }
}
