const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const Canvas = require('canvas');

module.exports = {
    commands: 'weapon',
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")
        
        //num
        var num = 0
        var reply

        //search for WIDS
        fortniteAPI.lisloot(options = {lang: "en"})
        .then(async res => {
            const WIDs = await res.weapons.filter(function(value) {
                return value.name.toLowerCase().includes(text.toLowerCase())
            })
            if(WIDs.length !== 0){
                //if there is more that a weapon
                if(WIDs.length > 1){
                    //string
                    const WIDs_Info = new Discord.MessageEmbed()
                    WIDs_Info.setColor(FNBRMENA.Colors("embed"))
                    for(let i = 0; i < WIDs.length; i++){
                        WIDs_Info.addFields(
                            {name: "• " + i + ": " + WIDs[i].name, value: WIDs[i].id + " ["+WIDs[i].rarity+"]"}
                        )
                    }
                    WIDs_Info.setTitle("WIDs for " + text + " " + checkEmoji)
                    await message.channel.send(WIDs_Info)
                    .then( async msg => {
                        //filtering
                        const filter = m => m.author.id === message.author.id
                        if(lang === "en"){
                            reply = "please choose from above list the command will stop listen in 20 sec"
                        }else if(lang === "ar"){
                            reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                        }
                        message.reply(reply)
                            .then( async notify => {
                                notify.delete({timeout: 20000})
                                await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                                .then( async collected => {

                                if(collected.first().content >= 0 && collected.first().content < WIDs.length){
                                    num = collected.first().content
                                    msg.delete()
                                    notify.delete()
                    
                                    fortniteAPI.lisloot(options = {lang: lang})
                                    .then(async res => {
                                        const weapon = await res.weapons.filter(function(value) {
                                            return value.id === WIDs[num].id
                                        })

                                        const generating = new Discord.MessageEmbed()
                                        generating.setColor(FNBRMENA.Colors("embed"))
                                        generating.setTitle(`Generating ${loadingEmoji}`)
                                        message.channel.send(generating)
                                        .then( async msg => {

                                            //aplyText
                                            const applyTextDescription = (canvas, text) => {
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
                                            };

                                            //aplyText
                                            const applyTextName = (canvas, text) => {
                                                const ctx = canvas.getContext('2d');
                                                let fontSize = 50;
                                                do {
                                                    if(lang === "en"){
                                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                                    }else if(lang === "ar"){
                                                        ctx.font = `${fontSize -= 1}px Arabic`;
                                                    }
                                                } while (ctx.measureText(text).width > 420);
                                                return ctx.font;
                                            };

                                            //registering fonts
                                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                            //creating canvas
                                            const canvas = Canvas.createCanvas(512, 700);
                                            const ctx = canvas.getContext('2d');

                                            //initializing values
                                            var name = weapon[0].name;
                                            var description = weapon[0].description
                                            var image = weapon[0].images.icon
                                            var rarity = weapon[0].rarity
                                            var magezin = weapon[0].mainStats.ClipSize
                                            var reload = weapon[0].mainStats.ReloadTime
                                            var damage = weapon[0].mainStats.DmgPB
                                            var firerate = weapon[0].mainStats.FiringRate

                                            if(rarity === "mythic"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/mythic.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderMythic.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }else
                                            if(rarity === "legendary"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/legendary.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderLegendary.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }else
                                            if(rarity === "transcendent"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/exotic.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderExotic.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }else
                                            if(rarity === "epic"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/epic.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderEpic.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }else
                                            if(rarity === "rare"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/rare.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderRare.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }else
                                            if(rarity === "uncommon"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/uncommon.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderUncommon.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }else
                                            if(rarity === "common"){
                                                //creating image
                                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/common.png')
                                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                                const skin = await Canvas.loadImage(image);
                                                ctx.drawImage(skin, 0, 0, 512, 512)
                                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderCommon.png')
                                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                                if(lang === "en"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Burbank Big Condensed'
                                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                                    ctx.fillText("Damage: " + damage, 256, 683)
                                                }else if(lang === "ar"){
                                                    ctx.fillStyle = '#ffffff';
                                                    ctx.textAlign='center';
                                                    ctx.font = applyTextName(canvas, name);
                                                    ctx.fillText(name, 256, 425)   
                                                    ctx.font = applyTextDescription(canvas, description);
                                                    ctx.textAlign='center';
                                                    ctx.fillText(description, 256, 480)
                                                    ctx.font = '30px Arabic'
                                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                                }
                                            }

                                            const att = new Discord.MessageAttachment(canvas.toBuffer(), weapon[0].name+'.png')
                                            await message.channel.send(att)
                                            msg.delete()
                                        })
                                    })
                                }else{
                                    if(lang === "en"){
                                        msg.delete()
                                        notify.delete()
                                        const error = new Discord.MessageEmbed()
                                        .setColor(FNBRMENA.Colors("embed"))
                                        .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                        message.reply(error)
                                    }else if(lang === "ar"){
                                        msg.delete()
                                        notify.delete()
                                        const error = new Discord.MessageEmbed()
                                        .setColor(FNBRMENA.Colors("embed"))
                                        .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                        message.reply(error)
                                    }
                                }
                            }).catch(err => {
                                if(lang === "en"){
                                    notify.delete()
                                    msg.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor(FNBRMENA.Colors("embed"))
                                    .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                                    message.reply(error)
                                }else if(lang === "ar"){
                                    msg.delete()
                                    notify.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor(FNBRMENA.Colors("embed"))
                                    .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                                    message.reply(error)
                                }
                            })
                        })
                    })
                }else{
                    fortniteAPI.lisloot(options = {lang: lang})
                    .then(async res => {
                        const weapon = await res.weapons.filter(function(value) {
                            return value.id === WIDs[num].id
                        })

                        const generating = new Discord.MessageEmbed()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        generating.setTitle(`Generating ${loadingEmoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            //aplyText
                            const applyTextDescription = (canvas, text) => {
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
                            };

                            //aplyText
                            const applyTextName = (canvas, text) => {
                                const ctx = canvas.getContext('2d');
                                let fontSize = 50;
                                do {
                                    if(lang === "en"){
                                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                                    }else if(lang === "ar"){
                                        ctx.font = `${fontSize -= 1}px Arabic`;
                                    }
                                } while (ctx.measureText(text).width > 420);
                                return ctx.font;
                            };

                            //registering fonts
                            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                            //creating canvas
                            const canvas = Canvas.createCanvas(512, 700);
                            const ctx = canvas.getContext('2d');

                            //initializing values
                            var name = weapon[0].name;
                            var description = weapon[0].description
                            var image = weapon[0].images.icon
                            var rarity = weapon[0].rarity
                            var magezin = weapon[0].mainStats.ClipSize
                            var reload = weapon[0].mainStats.ReloadTime
                            var damage = weapon[0].mainStats.DmgPB
                            var firerate = weapon[0].mainStats.FiringRate

                            if(rarity === "mythic"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/mythic.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderMythic.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }else
                            if(rarity === "legendary"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/legendary.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderLegendary.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }else
                            if(rarity === "transcendent"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/exotic.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderExotic.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }else
                            if(rarity === "epic"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/epic.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderEpic.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }else
                            if(rarity === "rare"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/rare.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderRare.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }else
                            if(rarity === "uncommon"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/uncommon.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderUncommon.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }else
                            if(rarity === "common"){
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/weapons/common.png')
                                ctx.drawImage(skinholder, 0, 0, 512, 700)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, 0, 0, 512, 512)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/weapons/borderCommon.png')
                                ctx.drawImage(skinborder, 0, 0, 512, 700)
                                if(lang === "en"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Burbank Big Condensed'
                                    ctx.fillText("Fire Rate: " + firerate, 256, 540)
                                    ctx.fillText("Reload Time: " + reload, 256, 586)
                                    ctx.fillText("Magazine: " + magezin, 256, 633)
                                    ctx.fillText("Damage: " + damage, 256, 683)
                                }else if(lang === "ar"){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='center';
                                    ctx.font = applyTextName(canvas, name);
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyTextDescription(canvas, description);
                                    ctx.textAlign='center';
                                    ctx.fillText(description, 256, 480)
                                    ctx.font = '30px Arabic'
                                    ctx.fillText("معدل الطلقات: " + firerate, 256, 535)
                                    ctx.fillText("وقت اعادة الطلقات: " + reload, 256, 585)
                                    ctx.fillText("عدد الطلقات: " + magezin, 256, 633)
                                    ctx.fillText("الضرر: " + damage, 256, 680)
                                }
                            }

                            const att = new Discord.MessageAttachment(canvas.toBuffer(), weapon[0].name+'.png')
                            await message.channel.send(att)
                            msg.delete()
                        })
                    })
                }
            }else{
                if(lang === "en"){
                    const err = new Discord.MessageEmbed()
                    err.setColor(FNBRMENA.Colors("embed"))
                    err.setTitle(`There is no weapon with that name ${errorEmoji}`)
                    message.channel.send(err)
                }else if(lang === "ar"){
                    const err = new Discord.MessageEmbed()
                    err.setColor(FNBRMENA.Colors("embed"))
                    err.setTitle(`لا يوجد سلاح بهذا الاسم ${errorEmoji}`)
                    message.channel.send(err)
                }
            }
        })
    }
}    