const FortniteAPI = require("fortniteapi.io-api");
const key = require('../../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');

module.exports = {
    commands: 'weapon',
    expectedArgs: '[ Weapon ID ]',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            //reaction and num
            var num = 0
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

            //search for WIDS
            fortniteAPI.lisloot(options = {lang: "en"})
            .then(async res => {
                const WIDs = await res.weapons.filter(function(value) {
                    return value.name.includes(text)
                })
                if(WIDs.length !== 0){
                    //if there is more that a weapon
                    if(WIDs.length > 1){
                        const Choosing = new Discord.MessageEmbed()
                        Choosing.setColor('#BB00EE')
                        if(lang === "en"){
                            Choosing.setTitle('There are ' + WIDs.length + ' weapons please choose one of them: ') 
                        }else if(lang === "ar"){
                            Choosing.setTitle('يوجد ' + WIDs.length + ' سلاح بنفس الأسم الرجاء الأختيار: ') 
                        }
                        for (let i = 0; i < WIDs.length; i++){
                            if(lang === "en"){
                                Choosing.addFields(
                                    {name: WIDs[i].name + " ["+WIDs[i].rarity+"]", value: `react with number ${numbers[i]}`}
                                    )
                            }else if(lang === "ar"){
                                Choosing.addFields(
                                    {name: WIDs[i].name + " ["+WIDs[i].rarity+"]", value: `الرجاء الضغط على رقم ${numbers[i]}`}
                                    )
                            }
                        }
                        let msgID = await message.channel.send(Choosing)
                        for (let i = 0; i < WIDs.length; i++){
                            msgID.react(numbers[i])
                        }

                        const filter = (reaction, user) => {
                            return [numbers[0], numbers[1],numbers[3], numbers[4],numbers[5], 
                                    numbers[6],numbers[7], numbers[8],numbers[9], numbers[10]]
                                    .includes(reaction.emoji.name) && user.id === message.author.id;
                        };

                        await msgID.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                            .then( async collected => {
                                const reaction = collected.first();
                                for (let i = 0; i < WIDs.length; i++){
                                if (reaction.emoji.name === numbers[i]) {
                                    num = i
                                    msgID.delete()
                                }
                            }
                        }).catch(err => {
                            if(lang === "en"){
                                msgReact.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                                message.reply(error)
                            }else if(lang === "ar"){
                                msgReact.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                                message.reply(error)
                            }
                        })
                    }
                
                    fortniteAPI.lisloot(options = {lang: lang})
                    .then(async res => {
                        const weapon = await res.weapons.filter(function(value) {
                            return value.id === WIDs[num].id
                        })

                        const generating = new Discord.MessageEmbed()
                        generating.setColor('#BB00EE')
                        const emoji = client.emojis.cache.get("805690920157970442")
                        generating.setTitle(`Generating ${emoji}`)
                        message.channel.send(generating)
                        .then( async msg => {

                            //aplyText
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '50px Burbank Big Condensed'
                                    ctx.fillText(name, 256, 425)
                                    ctx.font = applyText(canvas, description);
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
                                    ctx.font = '40px Arabic'
                                    ctx.fillText(name, 256, 425)   
                                    ctx.font = applyText(canvas, description);
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
                        const err = new Discord.MessageEmbed()
                        err.setColor('#BB00EE')
                        err.setTitle(`There is no weapon with that name ${errorEmoji}`)
                        message.channel.send(err)
                    }else if(lang === "ar"){
                        const err = new Discord.MessageEmbed()
                        err.setColor('#BB00EE')
                        err.setTitle(`لا يوجد سلاح بهذا الاسم ${errorEmoji}`)
                        message.channel.send(err)
                    }
                }
            })
        })
    },
    requiredRoles: []
}    