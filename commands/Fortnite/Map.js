const error = require('../Errors')
const Canvas = require('canvas');
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI('d4ce1562-839ff66b-3946ccb6-438eb9cf');
const fn = require("fortnite-api-com");
const config = {
    apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
    language: "en",
    debug: true
};
  
var Fortnite = new fn(config);

module.exports = {
    commands: 'map',
    expectedArgs: '[Blank or season verion]',
    minArgs: 0,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            var str = args[0];
            for (let i = 1; i < args.length; i++){
                str = str +' '+ args[i];
            }

            if (args > 0){

                fortniteAPI.listPreviousMaps()
                    .then ( async (res) => {
                        
                        for (let i = 0; i < res.maps.length; i++){
                            if (res.maps[i].patchVersion === str){
                            console.log(res);

                            const generating = new Discord.MessageEmbed()
                            generating.setColor('#BB00EE')
                            const emoji = client.emojis.cache.get("805690920157970442")
                            generating.setTitle(`Generating ... ${emoji}`)
                            message.channel.send(generating)
                            .then( async msg => {
                                if (res.maps[i].urlPOI !== null){
                                    const canvas = Canvas.createCanvas(2048, 2048);
                                    const ctx = canvas.getContext('2d');
                                    const background = await Canvas.loadImage(res.maps[i].urlPOI);
                                    const border = await Canvas.loadImage('./assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(border, 50, 1850, 550, 150);
                                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                                    await message.channel.send(att)
                                    msg.delete()
                                }else{
                                    const canvas = Canvas.createCanvas(2048, 2048);
                                    const ctx = canvas.getContext('2d');
                                    const background = await Canvas.loadImage(res.maps[i].url);
                                    const border = await Canvas.loadImage('./assets/Credits/FNBR_MENA.png');
                                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                    ctx.drawImage(border, 50, 1850, 550, 150);
                                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                                    await message.channel.send(att)
                                    msg.delete()
                                }
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    }   
                    }).catch(err => {
                        if(lang === "en"){
                            msgReact.delete()
                            const error = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`There is no map with that number ${errorEmoji}`)
                            message.reply(error)
                        }else if(lang === "ar"){
                            msgReact.delete()
                            const error = new Discord.MessageEmbed()
                            .setColor('#BB00EE')
                            .setTitle(`لا يوجد ماب بهذا الرقم ${errorEmoji}`)
                            message.reply(error)
                        }
                });
            }else {
                    if(lang === 'en'){
                        Fortnite.BRMap('en')
                        .then( async res => {
                        console.log(res)
                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#BB00EE')
                        const emoji = client.emojis.cache.get("805690920157970442")
                        generating.setTitle(`Generating ... ${emoji}`)
                        message.channel.send(generating)
                            .then( async msg => {
                                const imagePOI = new Discord.MessageEmbed()
                                imagePOI.setColor('#BB00EE')
                                imagePOI.setTitle('BR Map')
                                imagePOI.setDescription('This is the current BR map')
                                const canvas = Canvas.createCanvas(2048, 2048);
                                const ctx = canvas.getContext('2d');
                                const background = await Canvas.loadImage(res.data.images.pois);
                                const border = await Canvas.loadImage('./assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                ctx.drawImage(border, 50, 1850, 550, 150);
                                const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                                imagePOI.setFooter('Generated By FNBRMENA Bot')
                                imagePOI.setAuthor('FNBRMENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBRMENA')
                                await message.channel.send(att)
                                msg.delete()
                                message.channel.send(imagePOI)

                            }).catch(err => {
                                console.log(err)
                            })
                        }).catch(err => {

                        })
                    }
                    if(lang === 'ar'){
                        Fortnite.BRMap('ar')
                        .then( async res => {
                        console.log(res)
                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#BB00EE')
                        const emoji = client.emojis.cache.get("805690920157970442")
                        generating.setTitle(`جاري التحميل ... ${emoji}`)
                        message.channel.send(generating)
                            .then( async msg => {
                                const imagePOI = new Discord.MessageEmbed()
                                imagePOI.setColor('#BB00EE')
                                imagePOI.setTitle('ماب الباتل رويال')
                                imagePOI.setDescription('هذا هو ماب الباتل رويال الحالي')
                                const canvas = Canvas.createCanvas(2048, 2048);
                                const ctx = canvas.getContext('2d');
                                const background = await Canvas.loadImage(res.data.images.pois);
                                const border = await Canvas.loadImage('./assets/Credits/FNBR_MENA.png');
                                ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                                ctx.drawImage(border, 50, 1850, 550, 150);
                                const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                                imagePOI.setFooter('Generated By FNBRMENA Bot')
                                imagePOI.setAuthor('FNBRMENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBRMENA')
                                await message.channel.send(att)
                                msg.delete()
                                message.channel.send(imagePOI)

                            }).catch(err => {
                                console.log(err)
                            })
                        }).catch(err => {

                        })
                    }      
                }
            })
    },
    
    requiredRoles: []
}