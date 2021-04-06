const moment = require('moment');
const Canvas = require('canvas');
const fnbrjs = require('fnbr.js');
const axios = require("axios");
const FortniteAPI = require("fortnite-api-com");
const key = require('../../Coinfigs/config.json')
const fnbrco = new fnbrjs(key.apis.fnbrjs);
const config = {
  apikey: key.apis.fortniteapi,
  language: "en",
  debug: true
};

var Fortnite = new FortniteAPI(config);
var skinImage;
var num = 0;
var skinRarity;
var skinName;
var skinDes;
var history

module.exports = {
    commands: 'search',
    expectedArgs: '<Cosmetics Name>',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;
            var str = args[0];
            for (let i = 1; i < args.length; i++){
                str = str +' '+ args[i];
            }
            if(lang === "en"){

            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
            
            fnbrco.getItem(str, 2, '')
            .then( async (res) => {
                

                const numbers = {
                    0: '0️⃣',
                    1: '1️⃣',
                    2: '2️⃣',
                    3: '3️⃣',
                    4: '4️⃣',
                    5: '5️⃣',
                    6: '6️⃣',
                    7: '7️⃣',
                    8: '8️⃣',
                    9: '9️⃣',
                    10: '🔟',
                }
                
                if (res.length === 0){
                    const Err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle('Errr :robot: sorry i could not find any cosmetics please check your spelling if you still getting this error contact the support in `#Help` chat')
                    message.reply(Err)
                    
                }

                //more than one cosmetics found
                if (res.length >= 2){
                    const Choosing = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle('There are ' + res.length + ' cosmetics please choose one of them: ') 
                    for (let i = 0; i < res.length; i++){
                        Choosing.addFields(
                        {name: res[i].name + ' ' + res[i].type, value: `react with number ${numbers[i]}`}
                        )
                    }
                    let msgID = await message.channel.send(Choosing)
                    for (let i = 0; i < res.length; i++){
                        msgID.react(numbers[i])
                    }

                    const filter = (reaction, user) => {
                        return [numbers[0], numbers[1],numbers[3], numbers[4],numbers[5], 
                                numbers[6],numbers[7], numbers[8],numbers[9], numbers[10]]
                                .includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    msgID.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then( async collected => {
                            const reaction = collected.first();
                            for (let i = 0; i < res.length; i++){
                            if (reaction.emoji.name === numbers[i]) {
                                msgID.delete({timeout: 500})
                                const generating = new Discord.MessageEmbed()
                                generating.setColor('#BB00EE')
                                const emoji = client.emojis.cache.get("805690920157970442")
                                generating.setTitle(`Generating ... ${emoji}`)
                                message.channel.send(generating)
                                .then( async msg => {

                                num = i;
                                const DateF = moment(res[num].history.firstSeen);
                                const Now = moment();
                                const FirstSeenDays = Now.diff(DateF, 'days');
                                const FirstSeenDate = moment(res[num].history.firstSeen).format("ddd, hA");
                                const DateL = moment(res[num].history.lastSeen);
                                const LastSeenDate = moment(res[num].history.lastSeen).format("ddd, hA");
                                const LastSeenDays = Now.diff(DateL, 'days');
                                skinImage = res[num].images.icon;

                                for (let i = 0; i < res.length; i++){
                                }
                                
                                    if (res[num].rarity === 'legendary'){

                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                                const canvas = Canvas.createCanvas(512, 512);
                                                const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/legendary.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att);

                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Legendary'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Legendary'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Legendary'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }

                                    if (res[num].rarity === 'epic'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                                const canvas = Canvas.createCanvas(512, 512);
                                                const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/epic.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Epic'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Epic'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Epic'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'rare'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                                const canvas = Canvas.createCanvas(512, 512);
                                                const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/rare.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Rare'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Rare'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Rare'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'uncommon'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                                const canvas = Canvas.createCanvas(512, 512);
                                                const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Uncommon'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Uncommon'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Uncommon'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'common'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/common.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Common'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Common'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Common'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'marvel'){
                            
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                                const canvas = Canvas.createCanvas(512, 512);
                                                const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/marvel.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Marvel Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Marvel Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Marvel Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'dc'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/dc.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'DC Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'DC Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'DC Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'dark'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/dark.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Dark Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Dark Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Dark Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'icon_series'){
                            
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/icon.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Icon Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Icon Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Icon Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'star_wars'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/starwars.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Star Wars Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Star Wars Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Star Wars Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'shadow'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/shadow.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Shadow Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Shadow Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Shadow Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'slurp'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/slurp.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Slurp Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Slurp Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Slurp Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'frozen'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/frozen.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Frozen Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Slurp Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Slurp Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'lava'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/lava.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Lava Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Lava Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Lava Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                    }
                                    if (res[num].rarity === 'gaming_legends'){
                        
                                        const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                                        const canvas = Canvas.createCanvas(512, 512);
                                        const ctx = canvas.getContext('2d');

                                        const background = await Canvas.loadImage('./assets/Rarities/standard/gaming.png');
                                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                        const skin = await Canvas.loadImage(skinImage);
                                        ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                                        const border = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png');
                                        ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                                        const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                                        ctx.drawImage(credit, 15, 15, 146, 40);
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                                        const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                                        await message.channel.send(att)
                                    
                                        if(res[num].history.never === true){
                                            CosmeticsSearch.addFields(
                                            {name: 'Name', value: res[num].name},
                                            {name: 'Description', value: res[num].description},
                                            {name: 'Rarity', value: 'Gaming Legends Series'},
                                            {name: 'Price', value: res[num].price},
                                            {name: 'Occurrences', value: '0'},
                                            {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                            {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                            )
                                        }else if(res[num].history === false){
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Gaming Legends Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                                )
                                        }else{
                                                CosmeticsSearch.addFields(
                                                {name: 'Name', value: res[num].name},
                                                {name: 'Description', value: res[num].description},
                                                {name: 'Rarity', value: 'Gaming Legends Series'},
                                                {name: 'Price', value: res[num].price},
                                                {name: 'Occurrences', value: res[num].history.occurrences},
                                                {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                                {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                                )
                                            }

                                            CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                            CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                            msg.delete()
                                            message.reply(CosmeticsSearch);
                                        }
                                    })
                                }    
                            }
                    }).catch(collected => {
                            message.reply('you didnt chose a number');
                        });
                    }
                
                    var CosmeticsSearch = new Discord.MessageEmbed()
                    CosmeticsSearch.setColor('#BB00EE')
                    CosmeticsSearch.setTitle('Cosmetics By Search')
                    CosmeticsSearch.setDescription('FNBR_MENA Bot has found your cosmetic')

                if(res.length === 1){

                    const generating = new Discord.MessageEmbed()
                    generating.setColor('#BB00EE')
                    const emoji = client.emojis.cache.get("805690920157970442")
                    generating.setTitle(`Generating ... ${emoji}`)
                    message.channel.send(generating)
                    .then( async msg => {

                    const DateF = moment(res[num].history.firstSeen);
                    const Now = moment();
                    const FirstSeenDays = Now.diff(DateF, 'days');
                    const FirstSeenDate = moment(res[num].history.firstSeen).format("ddd, hA");
                    const DateL = moment(res[num].history.lastSeen);
                    const LastSeenDate = moment(res[num].history.lastSeen).format("ddd, hA");
                    const LastSeenDays = Now.diff(DateL, 'days');
                    skinImage = res[num].images.icon;

                    for (let i = 0; i < res.length; i++){
                    }
                    
                        if (res[num].rarity === 'legendary'){

                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                                
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/legendary.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att);

                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Legendary'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Legendary'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Legendary'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }

                        if (res[num].rarity === 'epic'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                            
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/epic.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Epic'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Epic'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Epic'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'rare'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                                            
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/rare.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Rare'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Rare'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Rare'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'uncommon'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Uncommon'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Uncommon'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Uncommon'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'common'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/common.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Common'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Common'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Common'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'marvel'){
                
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/marvel.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Marvel Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Marvel Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Marvel Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'dc'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/dc.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'DC Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'DC Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'DC Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'dark'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/dark.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Dark Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Dark Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Dark Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'icon_series'){
                
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/icon.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Icon Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Icon Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Icon Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'star_wars'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/starwars.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Star Wars Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Star Wars Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Star Wars Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'shadow'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/shadow.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Shadow Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Shadow Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Shadow Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'slurp'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/slurp.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Slurp Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Slurp Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Slurp Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'frozen'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/frozen.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Frozen Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Slurp Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Slurp Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'lava'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/lava.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Lava Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Lava Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Lava Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                        if (res[num].rarity === 'gaming_legends'){
            
                            const applyText = (canvas, text) => {
                                                    const ctx = canvas.getContext('2d');
                                                    let fontSize = 36;
                                                    do {
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    } while (ctx.measureText(text).width > 420);
                                                    return ctx.font;
                                                };
                        
                            const canvas = Canvas.createCanvas(512, 512);
                            const ctx = canvas.getContext('2d');

                            const background = await Canvas.loadImage('./assets/Rarities/standard/gaming.png');
                            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                            const skin = await Canvas.loadImage(skinImage);
                            ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
                            const border = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png');
                            ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
                            const credit = await Canvas.loadImage('assets/Credits/FNBR_MENA.png');
                            ctx.drawImage(credit, 15, 15, 146, 40);
                            ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = '46px Burbank Big Condensed'
                                        ctx.fillText(res[num].name, 256, 430)
                                        ctx.font = applyText(canvas, res[num].description);
                                        ctx.fillText(res[num].description, 256, 470)
                            const att = new Discord.MessageAttachment(canvas.toBuffer(), str+'.png');
                            await message.channel.send(att)
                        
                            if(res[num].history.never === true){
                                CosmeticsSearch.addFields(
                                {name: 'Name', value: res[num].name},
                                {name: 'Description', value: res[num].description},
                                {name: 'Rarity', value: 'Gaming Legends Series'},
                                {name: 'Price', value: res[num].price},
                                {name: 'Occurrences', value: '0'},
                                {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                )
                            }else if(res[num].history === false){
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Gaming Legends Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: 'not out yet or the sorce is not an itemshop'},
                                    {name: 'Last Seen', value: 'not out yet or the sorce is not an itemshop'}
                                    )
                            }else{
                                    CosmeticsSearch.addFields(
                                    {name: 'Name', value: res[num].name},
                                    {name: 'Description', value: res[num].description},
                                    {name: 'Rarity', value: 'Gaming Legends Series'},
                                    {name: 'Price', value: res[num].price},
                                    {name: 'Occurrences', value: res[num].history.occurrences},
                                    {name: 'First Seen', value: FirstSeenDays + " days ago at " + FirstSeenDate},
                                    {name: 'Last Seen', value: LastSeenDays + ' days ago at ' + LastSeenDate}
                                    )
                                }

                                CosmeticsSearch.setFooter('Generated By FNBR_MENA Bot')
                                CosmeticsSearch.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                                msg.delete()
                                message.reply(CosmeticsSearch);
                                
                        }
                    })
                }

            })
            .catch((err) => {
                console.log(err)
            })
            }else if(lang === "ar"){
                axios.get('https://benbotfn.tk/api/v1/cosmetics/br/search?lang=ar&searchLang=en&matchMethod=full&name='+str)
                .then(async res => {

                    //font
                    const applyText = (canvas, text) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = 36;
                        do {
                            ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > 420);
                        return ctx.font;
                    };

                    //lang
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                    //creating canvas
                    const canvas = Canvas.createCanvas(512, 512);
                    const ctx = canvas.getContext('2d');

                    //skin informations
                    var name = res.data.name;
                    var description = res.data.description;
                    var image = res.data.icons.icon
                    if(res.data.series === null){
                        var rarity = res.data.rarity;
                    }else{
                        var rarity = res.data.series.name;
                    }

                    //searching
                    if(rarity === 'أسطوري'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'ملحمي'){
                        //creating image
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'نادر'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'غير شائع'){
                        //creating image                    
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'شائع'){
                        //creating image                    
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'سلسلة MARVEL'){
                        //creating image                    
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'سلسلة DC'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'سلسلة DARK'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'سلسلة المشاهير'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                    
                    }
                    if(rarity === 'سلسلة Star Wars'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'Shadow Series'){
                        //creating image                  
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                    
                    }
                    if(rarity === 'سلسلة الشراب Series'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                        
                    }
                    if(rarity === 'سلسلة التجمد'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
            
                    }
                    if(rarity === 'سلسلة الحمم'){
                        //creating image                 
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                    }
                    if(rarity === 'سلسلة أساطير الألعاب'){
                        //creating image                   
                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                        ctx.drawImage(skinholder, 0,0, 512, 512)
                        const skin = await Canvas.loadImage(image);
                        ctx.drawImage(skin, 0,0, 512, 512)
                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.drawImage(skinborder, 0,0, 512, 512)
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = '46px Arabic'
                        ctx.fillText(name, 256, 425)
                        ctx.textAlign='center';
                        ctx.font = applyText(canvas, description);
                        ctx.fillText(description, 256, 470)
                        
                    }

                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}), text+'.jpg')
                    await message.channel.send(att)

            })
            .catch((err) => {
                console.log(err)
            })
            }
        })

    },
    
    requiredRoles: []
}