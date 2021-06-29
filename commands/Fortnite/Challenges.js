const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));
const Canvas = require('canvas');

module.exports = {
    commands: 'quests',
    expectedArgs: '[ Name of the challenge ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        const quest = await fortniteAPI.listChallenges()
        .then(async res => {

            //inisilizing number
            var num = null

            //get the challenges by name
            const challenge = await res.bundles.filter(collected => {
                return collected.name.toLowerCase().includes(text.toLowerCase())
            })

            //there is no challenges found send err
            if(challenge.length === 0){
                if(lang === "en"){
                    const err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`There is no challenges with that name ${errorEmoji}`)
                    message.channel.send(err)
                }else if(lang === "ar"){
                    const err = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لا يوجد تحديات بهذا الأسم ${errorEmoji}`)
                    message.channel.send(err)
                }
            }

            //found just one challenge
            if(challenge.length === 1){
                return challenge[0].id
            }

            //found more than one challenge
            if(challenge.length > 1){
                
                //create embed
                const challenges = new Discord.MessageEmbed()

                //add the color
                challenges.setColor('#BB00EE')

                //create and fill a string of names
                var str = ""
                for(let i = 0; i < challenge.length; i++){
                    str += '• ' + i + ': ' + challenge[i].name + '\n'
                }

                //add description
                challenges.setDescription(str)

                //send the choices
                await message.channel.send(challenges)
                .then( async msg => {

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //send the reply to the user
                    if(lang === "en"){
                        reply = "please choose from above list the command will stop listen in 20 sec"
                    }else if(lang === "ar"){
                        reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                    }

                    //send the reply
                    await message.reply(reply)
                    .then( async notify => {

                        //await messages
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                            .then( async collected => {

                            if(await collected.first().content >= 0 && collected.first().content < challenge.length){

                                msg.delete()
                                notify.delete()
                                num = await collected.first().content

                            }else{
                                if(lang === "en"){
                                    msg.delete()
                                    notify.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                    message.reply(error)
                                }else if(lang === "ar"){
                                    msg.delete()
                                    notify.delete()
                                    const error = new Discord.MessageEmbed()
                                    .setColor('#BB00EE')
                                    .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                    message.reply(error)
                                }
                            }
                        }).catch(err => {
                            if(lang === "en"){
                                notify.delete()
                                msg.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                                message.reply(error)
                            }else if(lang === "ar"){
                                msg.delete()
                                notify.delete()
                                const error = new Discord.MessageEmbed()
                                .setColor('#BB00EE')
                                .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                                message.reply(error)
                            }
                        })
                    })
                })
                if(num !== null){
                    return challenge[num].id
                }
            }

        }).catch(err => {

        })

        if(quest){

            //search again by user language and use the data to create an image
            const found = await fortniteAPI.listChallenges(season = 'current', options = {lang: lang})
            .then (async res => {

                //filter to get the quests data by user language
                const dataSheet = await res.bundles.filter(collected => {
                    return collected.id === quest
                })

                if(dataSheet.length !== 0){
                    return dataSheet[0]
                }
            })

            //got the quest data now work with it

            //setup variables
            var width = 3500
            var height = 300

            //customize the height
            for(let i = 0; i < found.quests.length; i++){
                height += 450
            }

            //registering fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700"})

            //applytext
            const applyText = (canvas, text) => {
                const ctx = canvas.getContext('2d');
                let fontSize = 100;
                do {
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    }
                } while (ctx.measureText(text).width > width - 225);
                return ctx.font;
            }

            //applytext
            const applyTextRewards = (canvas, text) => {
                const ctx = canvas.getContext('2d');
                let fontSize = 100;
                do {
                    if(lang === "en"){
                        ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                    }else if(lang === "ar"){
                        ctx.font = `${fontSize -= 1}px Arabic`;
                    }
                } while (ctx.measureText(text).width > width - 1700);
                return ctx.font;
            }

            //create canvas
            const canvas = Canvas.createCanvas(width, height);
            const ctx = canvas.getContext('2d');

            //background
            const background = await Canvas.loadImage('./assets/Challenges/background.png')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            //upper whare storing the credits and the challenges name
            const upper = await Canvas.loadImage('./assets/Challenges/upper.png')
            ctx.drawImage(upper, 0, 0, canvas.width, 150)

            //adding credits
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='left';
            ctx.font = '100px Burbank Big Condensed'
            ctx.fillText("FNBRMENA", 25, 107)

            //add the challange name
            ctx.fillStyle = '#ffffff';
            ctx.textAlign='right';
            if(lang === "en") ctx.font = '100px Burbank Big Condensed'
            else if(lang === "ar") ctx.font = '100px Arabic'
            ctx.fillText(found.name, (canvas.width - 25), 100)

            //get access to the y by just changing the value
            var y = 250

            //inisilizing x, w and h
            var x = 100
            var w = (canvas.width - (x * 2))
            var h = 400

            //challenges cards
            for(let i = 0; i < found.quests.length; i++){

                //add the card of the challenge
                const card = await Canvas.loadImage('./assets/Challenges/epic.png')
                ctx.drawImage(card, x, y, w, h)

                //english sheet
                if(lang === "en"){

                    //if there is xp for the quest
                    if(found.quests[i].reward.xp !== 0){

                        if(found.quests[i].reward.xp >= 100000){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpRightCorner, ((canvas.width - 50) - x) - 50, y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp.toString().substring(0, 3) + 'K').width
                            ctx.fillText(found.quests[i].reward.xp.toString().substring(0, 3) + 'K', ((canvas.width - 75) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpLeftCorner, ((canvas.width - (75 + xpWidth)) - x) - 50, y + 177, 80, 200)
                        }
                        
                        if(found.quests[i].reward.xp >= 10000 && found.quests[i].reward.xp <= 99999){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpRightCorner, ((canvas.width - 50) - x) - 50, y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp.toString().substring(0, 2) + 'K').width
                            ctx.fillText(found.quests[i].reward.xp.toString().substring(0, 2) + 'K', ((canvas.width - 75) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpLeftCorner, ((canvas.width - (75 + xpWidth)) - x) - 50, y + 177, 80, 200)

                        }

                        if(found.quests[i].reward.xp >= 1000 && found.quests[i].reward.xp <= 9999){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpRightCorner, ((canvas.width - 50) - x) - 50, y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp.toString().substring(0, 1) + 'K').width
                            ctx.fillText(found.quests[i].reward.xp.toString().substring(0, 1) + 'K', ((canvas.width - 75) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpLeftCorner, ((canvas.width - (75 + xpWidth)) - x) - 50, y + 177, 80, 200)

                        }

                        if(found.quests[i].reward.xp >= 100 && found.quests[i].reward.xp <= 999){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpRightCorner, ((canvas.width - 50) - x) - 50, y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp + 'H').width
                            ctx.fillText(found.quests[i].reward.xp + 'H', ((canvas.width - 75) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpLeftCorner, ((canvas.width - (75 + xpWidth)) - x) - 50, y + 177, 80, 200)

                        }

                        if(found.quests[i].reward.xp <= 99){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpRightCorner, ((canvas.width - 50) - x) - 50, y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='right';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp + 'XP').width
                            ctx.fillText(found.quests[i].reward.xp + 'XP', ((canvas.width - 75) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpLeftCorner, ((canvas.width - (75 + xpWidth)) - x) - 50, y + 177, 80, 200)

                        }

                        //if there is a reward
                        if(found.quests[i].reward.items.length !== 0 || found.bundleRewards.length !== 0){

                            //inisilize the rewards width
                            var rewardsWidth = ((canvas.width - (205 + xpWidth)) - x) - 50

                            //add the reward top right
                            const rewardsRightCorner = await Canvas.loadImage('./assets/Challenges/rightReward.png')
                            ctx.drawImage(rewardsRightCorner, (25 + rewardsWidth), y + 177, 80, 200)

                            //if there is a reward for the quest its self
                            if(found.quests[i].reward.items.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.quests[i].reward.items.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.quests[i].reward.items[x].images.icon)
                                    ctx.drawImage(reward, (45 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //if there is a reward for the challenge its self
                            if(found.bundleRewards.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.bundleRewards.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.bundleRewards[x].images.icon)
                                    ctx.drawImage(reward, (90 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //add the reward left right
                            const rewardsLeftCorner = await Canvas.loadImage('./assets/Challenges/leftReward.png')
                            ctx.drawImage(rewardsLeftCorner, (50 + rewardsWidth), y + 355, 160, 400)

                        }

                    }else{

                        //if there is a reward
                        if(found.quests[i].reward.items.length !== 0 || found.bundleRewards.length !== 0){

                            //inisilize the rewards width
                            var rewardsWidth = ((canvas.width - 50) - x) - 75

                            //add the reward top right
                            const rewardsRightCorner = await Canvas.loadImage('./assets/Challenges/rightReward.png')
                            ctx.drawImage(rewardsRightCorner, (25 + rewardsWidth), y + 177, 80, 200)

                            //if there is a reward for the quest its self
                            if(found.quests[i].reward.items.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.quests[i].reward.items.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.quests[i].reward.items[x].images.icon)
                                    ctx.drawImage(reward, (45 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //if there is a reward for the challenge its self
                            if(found.bundleRewards.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.bundleRewards.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.bundleRewards[x].images.icon)
                                    ctx.drawImage(reward, (90 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //add the reward left right
                            const rewardsLeftCorner = await Canvas.loadImage('./assets/Challenges/leftReward.png')
                            ctx.drawImage(rewardsLeftCorner, (50 + rewardsWidth), y + 177, 80, 200)

                        }
                    }

                    //if there is an image for the quest
                    if(Object.entries(found.quests[i].tandemCharacter).length !== 0){

                        //if the image is not an npc defualt
                        if(!found.quests[i].tandemCharacter.images.sidePanel.includes('T_NPC_Default.T_NPC_Default')){

                            //add the card of the challenge
                            const questManegar = await Canvas.loadImage(found.quests[i].tandemCharacter.images.sidePanel)
                            ctx.drawImage(questManegar, x - 125, y - 50, 450, 450)

                            //change the x value
                            x = 350
                        }
                    }
                        

                    //add the challange quest
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    if(found.quests[i].reward.items.length !== 0) ctx.font = applyTextRewards(canvas, found.quests[i].name)
                    else if(found.quests[i].reward.items.length === 0) ctx.font = applyText(canvas, found.quests[i].name)
                    ctx.fillText(found.quests[i].name, x + 37, y + 115)

                    //add progress bar
                    const progress = await Canvas.loadImage('./assets/Challenges/layer.png')
                    ctx.drawImage(progress, x + 90, y + 175, 1500, 25)

                    //add progress bar text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '50px Burbank Big Condensed'
                    ctx.fillText(found.quests[i].progressTotal + "/0", x + 1600, y + 200)

                    //add xp tags
                    if(found.quests[i].tags.includes('ChallengeCategory.XP')){

                        //changing tags coordinates
                        x += 37

                        //print the party assist
                        const xp = await Canvas.loadImage('./assets/Tags/xp.png')
                        ctx.drawImage(xp, x, y + 175, 450, 300)

                        //changing tags coordinates
                        x += 450

                    }

                    //add party assists tags
                    if(found.quests[i].tags.includes('Quest.Metadata.PartyAssist')){

                        //changing tags coordinates
                        x += 25

                        //print the party assist
                        const partyAssists = await Canvas.loadImage('./assets/Tags/partyAssists.png')
                        ctx.drawImage(partyAssists, x, y + 175, 450, 300)

                        //changing tags coordinates
                        x += 450

                    }

                    //add reward tags
                    if(found.quests[i].reward.items.length !== 0 || found.bundleRewards.length !== 0){

                        //changing tags coordinates
                        x += 25

                        //print the party assist
                        const rewards = await Canvas.loadImage('./assets/Tags/rewards.png')
                        ctx.drawImage(rewards, x, y + 175, 450, 300)

                        //changing tags coordinates
                        x += 450

                    }

                }else if(lang === "ar"){

                    //add tags coordinates
                    x = 3375

                    //if there is xp for the quest
                    if(found.quests[i].reward.xp !== 0){

                        if(found.quests[i].reward.xp >= 100000){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpRightCorner, (canvas.width - x), y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp.toString().substring(0, 3) + 'K').width
                            ctx.fillText(found.quests[i].reward.xp.toString().substring(0, 3) + 'K', ((canvas.width + 50) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpLeftCorner, (canvas.width - (x - (25 + xpWidth))), y + 177, 80, 200)

                        }
                        
                        if(found.quests[i].reward.xp >= 10000 && found.quests[i].reward.xp <= 99999){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpRightCorner, (canvas.width - x), y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp.toString().substring(0, 2) + 'K').width
                            ctx.fillText(found.quests[i].reward.xp.toString().substring(0, 2) + 'K', ((canvas.width + 50) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpLeftCorner, (canvas.width - (x - (25 + xpWidth))), y + 177, 80, 200)

                        }

                        if(found.quests[i].reward.xp >= 1000 && found.quests[i].reward.xp <= 9999){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpRightCorner, (canvas.width - x), y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp.toString().substring(0, 1) + 'K').width
                            ctx.fillText(found.quests[i].reward.xp.toString().substring(0, 1) + 'K', ((canvas.width + 50) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpLeftCorner, (canvas.width - (x - (25 + xpWidth))), y + 177, 80, 200)

                        }

                        if(found.quests[i].reward.xp >= 100 && found.quests[i].reward.xp <= 999){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpRightCorner, (canvas.width - x), y + 177, 80, 200)

                            //add the xp text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp + 'H').width
                            ctx.fillText(found.quests[i].reward.xp + 'H', ((canvas.width + 50) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpLeftCorner, (canvas.width - (x - (25 + xpWidth))), y + 177, 80, 200)

                        }

                        if(found.quests[i].reward.xp <= 99){

                            //add the xp right border
                            const xpRightCorner = await Canvas.loadImage('./assets/Challenges/leftXP.png')
                            ctx.drawImage(xpRightCorner, (canvas.width - x), y + 177, 80, 200)

                            //add the xp textctx.fillText
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign='left';
                            ctx.font = '200px Burbank Big Condensed'
                            var xpWidth = ctx.measureText(found.quests[i].reward.xp + 'XP').width
                            ctx.fillText(found.quests[i].reward.xp + 'XP', ((canvas.width + 50) - x), y + 350)

                            //add the xp left border
                            const xpLeftCorner = await Canvas.loadImage('./assets/Challenges/rightXP.png')
                            ctx.drawImage(xpLeftCorner, (canvas.width - (x - (25 + xpWidth))), y + 177, 80, 200)

                        }

                        //if there is a reward
                        if(found.quests[i].reward.items.length !== 0 || found.bundleRewards.length !== 0){

                            //inisilize the rewards width
                            var rewardsWidth = ((canvas.width - (205 + xpWidth)) - x) - 50

                            //add the reward top right
                            const rewardsRightCorner = await Canvas.loadImage('./assets/Challenges/rightReward.png')
                            ctx.drawImage(rewardsRightCorner, (25 + rewardsWidth), y + 177, 80, 200)

                            //if there is a reward for the quest its self
                            if(found.quests[i].reward.items.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.quests[i].reward.items.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.quests[i].reward.items[x].images.icon)
                                    ctx.drawImage(reward, (45 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //if there is a reward for the challenge its self
                            if(found.bundleRewards.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.bundleRewards.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.bundleRewards[x].images.icon)
                                    ctx.drawImage(reward, (90 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //add the reward left right
                            const rewardsLeftCorner = await Canvas.loadImage('./assets/Challenges/leftReward.png')
                            ctx.drawImage(rewardsLeftCorner, (50 + rewardsWidth), y + 355, 160, 400)

                        }

                    }else{

                        //if there is a reward
                        if(found.quests[i].reward.items.length !== 0 || found.bundleRewards.length !== 0){

                            //inisilize the rewards width
                            var rewardsWidth = ((canvas.width - 50) - x) - 75

                            //add the reward top right
                            const rewardsRightCorner = await Canvas.loadImage('./assets/Challenges/rightReward.png')
                            ctx.drawImage(rewardsRightCorner, (25 + rewardsWidth), y + 177, 80, 200)

                            //if there is a reward for the quest its self
                            if(found.quests[i].reward.items.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.quests[i].reward.items.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.quests[i].reward.items[x].images.icon)
                                    ctx.drawImage(reward, (45 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //if there is a reward for the challenge its self
                            if(found.bundleRewards.length !== 0){

                                //add the reward
                                for(let x = 0; x < found.bundleRewards.length; x++){

                                    rewardsWidth -= 150

                                    //reward x
                                    const reward = await Canvas.loadImage(found.bundleRewards[x].images.icon)
                                    ctx.drawImage(reward, (90 + rewardsWidth), y + 210, 150, 150)

                                    rewardsWidth -= 25
                                    
                                }
                            }

                            //add the reward left right
                            const rewardsLeftCorner = await Canvas.loadImage('./assets/Challenges/leftReward.png')
                            ctx.drawImage(rewardsLeftCorner, (50 + rewardsWidth), y + 177, 80, 200)

                        }
                    }

                    //if there is an image for the quest
                    if(Object.entries(found.quests[i].tandemCharacter).length !== 0){

                        //if the image is not an npc defualt
                        if(!found.quests[i].tandemCharacter.images.sidePanel.includes('T_NPC_Default.T_NPC_Default')){

                            //add the card of the challenge
                            const questManegar = await Canvas.loadImage(found.quests[i].tandemCharacter.images.sidePanel)
                            ctx.drawImage(questManegar, x - 300, y - 50, 450, 450)

                            //change the x value
                            x -= 250
                        }
                    }

                    //add the challange quest
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    if(found.quests[i].reward.items.length !== 0) ctx.font = applyTextRewards(canvas, found.quests[i].name)
                    else if(found.quests[i].reward.items.length === 0) ctx.font = applyText(canvas, found.quests[i].name)
                    ctx.fillText(found.quests[i].name, x - 25, y + 115)

                    //add progress bar
                    const progress = await Canvas.loadImage('./assets/Challenges/layer.png')
                    ctx.drawImage(progress, x - 1577, y + 187, 1500, 25)

                    //add progress bar text
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = '50px Burbank Big Condensed'
                    ctx.fillText(found.quests[i].progressTotal + "/0", (x - 1600), y + 212)

                    //add xp tags
                    if(found.quests[i].tags.includes('ChallengeCategory.XP')){

                        //changing tags coordinates
                        x -= 450

                        //print the party assist
                        const xp = await Canvas.loadImage('./assets/Tags/xpAr.png')
                        ctx.drawImage(xp, x, y + 175, 450, 300)

                        //changing tags coordinates
                        x -= 25

                    }

                    //add party assists tags
                    if(found.quests[i].tags.includes('Quest.Metadata.PartyAssist')){

                        //changing tags coordinates
                        x -= 450

                        //print the party assist
                        const partyAssists = await Canvas.loadImage('./assets/Tags/partyAssistsAR.png')
                        ctx.drawImage(partyAssists, x, y + 175, 450, 300)

                        //changing tags coordinates
                        x -= 25

                    }

                    //add rewards tags
                    if(found.quests[i].reward.items.length > 0){

                        //changing tags coordinates
                        x -= 450

                        //print the party assist
                        const rewards = await Canvas.loadImage('./assets/Tags/rewardsAr.png')
                        ctx.drawImage(rewards, x, y + 175, 450, 300)

                        //changing tags coordinates
                        x -= 25

                    }

                }

                //add the xp
                y += 450
                x = 100
            }

            //send the challenges sheet
            const att = new Discord.MessageAttachment(canvas.toBuffer(), quest + '.png')
            await message.channel.send(att)
        }
    }
}