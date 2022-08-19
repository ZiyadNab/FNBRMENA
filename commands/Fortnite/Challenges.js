const Canvas = require('canvas');

module.exports = {
    commands: 'quests',
    type: 'Fortnite',
    descriptionEN: 'This command will extract any challengas from the files (even if its leaked).',
    descriptionAR: 'الأمر هذا راح يستخرج لك اي تحدي من الملفات (حتى اذا كانت مسربة).',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //values
        let categoriesIndex = null

        FNBRMENA.listChallenges("current", userData.lang)
        .then(async res => {

            //questSheet
            const printQuests = async (questsIndex) => {
                const targetQuest = res.data.bundles[categoriesIndex].bundles[questsIndex]

                //got the quest data now work with it
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading ${targetQuest.name}... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`تحميل ${targetQuest.name}... ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then(async msg => {

                    //setup variables
                    var width = 3500
                    var height = (targetQuest.quests.length * 450) + 300
                    var x = 100
                    var y = 250
                    var w = (width - (x * 2))
                    var h = 400

                    //register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    //applytext
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d')
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                        } while (ctx.measureText(text).width > width)
                        return ctx.font;
                    }

                    //create canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    if(res.data.bundles[categoriesIndex].colorData != null){
                        var bgColor = res.data.bundles[categoriesIndex].colorData.RGB2.substring(3, 9)
                        var cardsColor = res.data.bundles[categoriesIndex].colorData.RGB1.substring(3, 9)
                    }else{
                        var bgColor = '7C128C'
                        var cardsColor = '590566'
                    }

                    //background
                    ctx.fillStyle = `#${bgColor}`
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    //upper
                    ctx.fillStyle = `#${cardsColor}`
                    ctx.fillRect(0, 0, canvas.width, 150)

                    //adding credits
                    ctx.fillStyle = `#ffffff`
                    ctx.textAlign='left';
                    ctx.font = '120px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 25, 115)

                    //category image and its name
                    if(res.data.bundles[categoriesIndex].image != null){
                        const categoryImg = await Canvas.loadImage(res.data.bundles[categoriesIndex].image)
                        ctx.drawImage(categoryImg, canvas.width - 150, 0, 150, 150)

                        //category name
                        ctx.fillStyle = `#ffffff`
                        ctx.textAlign = 'right';
                        ctx.font = applyText(canvas, targetQuest.name, canvas.width / 2, 120)
                        ctx.fillText(targetQuest.name, canvas.width - 175, 115)
                    }else{

                        //category name
                        ctx.fillStyle = `#ffffff`
                        ctx.textAlign = 'right';
                        ctx.font = applyText(canvas, targetQuest.name, canvas.width / 2, 120)
                        ctx.fillText(targetQuest.name, canvas.width - 25, 115)
                    }

                    //loop throw every quest
                    for(let i = 0; i < targetQuest.quests.length; i++){

                        //cards
                        ctx.fillStyle = `#${cardsColor}`

                        //add the quest card
                        ctx.beginPath();
                        ctx.moveTo(x + 8, y);
                        ctx.arcTo(x + w, y, x + w, y + h, 8);
                        ctx.arcTo(x + w, y + h, x, y + h, 8);
                        ctx.arcTo(x, y + h, x, y, 8);
                        ctx.arcTo(x, y, x + w, y, 8);
                        ctx.closePath();
                        ctx.fill();

                        //change image layout only if arabic
                        if(userData.lang === "ar") x = canvas.width - x

                        var rewardX = canvas.width - x
                        var rewardY = y 

                        //add the quest rewards
                        if(targetQuest.quests[i].reward.items.length != 0){

                            //loop thrw every reward
                            if(targetQuest.quests[i].reward.items.length > 2) ctx.globalAlpha = 0.5
                            for(let r = 0; r < targetQuest.quests[i].reward.items.length; r++){

                                //load quest img
                                const questRewardImg = await Canvas.loadImage(targetQuest.quests[i].reward.items[r].images.icon)
                                if(userData.lang === "en"){
                                    rewardX -= h
                                    ctx.drawImage(questRewardImg, rewardX, rewardY, h, h)
                                    rewardX -= 25
                                }else if(userData.lang === "ar"){
                                    ctx.drawImage(questRewardImg, rewardX, rewardY, h, h)
                                    rewardX += h + 25
                                }
                                
                            }
                            ctx.globalAlpha = 1
                        }

                        //add the xp if there is xp for the quest
                        if(targetQuest.quests[i].reward.xp !== 0){

                            //more than 100K
                            if(targetQuest.quests[i].reward.xp >= 100000) var xp = targetQuest.quests[i].reward.xp.toString().substring(0, 3)

                            //between 10K and 100K
                            if(targetQuest.quests[i].reward.xp >= 10000 && targetQuest.quests[i].reward.xp <= 99999) var xp = targetQuest.quests[i].reward.xp.toString().substring(0, 2)

                            //between 1K and 10K
                            if(targetQuest.quests[i].reward.xp >= 1000 && targetQuest.quests[i].reward.xp <= 9999) var xp = targetQuest.quests[i].reward.xp.toString().substring(0, 1)

                            //between 100 and 1K
                            if(targetQuest.quests[i].reward.xp >= 100 && targetQuest.quests[i].reward.xp <= 999) var xp = targetQuest.quests[i].reward.xp

                            ctx.fillStyle = `#ffffff`
                            ctx.font = '250px Burbank Big Condensed'
                            if(userData.lang === "en"){
                                ctx.textAlign = 'right';
                                ctx.fillText(xp + 'K', rewardX - 30, y + 360)
                            }else if(userData.lang === "ar"){
                                ctx.textAlign = 'left';
                                ctx.fillText(xp + 'K', rewardX + 30 , y + 360)
                            }
                        }

                        //check if the quest has an img
                        if(targetQuest.images != null){

                            //load quest img
                            const questRewardImg = await Canvas.loadImage(targetQuest.images.DisplayImage)

                            //change the x value and print the img
                            if(userData.lang === "en"){
                                ctx.drawImage(questRewardImg, x, y, h, h)
                                x += h + 25
                            }else if(userData.lang === "ar"){
                                ctx.drawImage(questRewardImg, x - h, y, h, h)
                                x -= h + 25
                            }
                        }

                        //add the challange quest
                        ctx.fillStyle = `#ffffff`
                        ctx.font = applyText(canvas, targetQuest.quests[i].name, w - 800, 100)
                        if(userData.lang === "en"){
                            ctx.textAlign = 'left';
                            ctx.fillText(targetQuest.quests[i].name, x + 37, y + 115)
                        }
                        else if(userData.lang === "ar"){
                            ctx.textAlign = 'right';
                            ctx.fillText(targetQuest.quests[i].name, x - 25, y + 115)
                        }

                        //add progress bar
                        ctx.fillStyle = `#${bgColor}`
                        if(userData.lang === "en") ctx.fillRect(x + 90, y + 175, 1500, 25)
                        else if(userData.lang === "ar") ctx.fillRect(x - 1577, y + 187, 1500, 25)

                        //add progress bar text
                        ctx.fillStyle = `#ffffff`
                        ctx.font = '50px Burbank Big Condensed'
                        if(userData.lang === "en"){
                            ctx.textAlign = 'left';
                            ctx.fillText(targetQuest.quests[i].progressTotal + "/0", x + 1600, y + 200)
                        }else if(userData.lang === "ar"){
                            ctx.textAlign = 'right';
                            ctx.fillText(targetQuest.quests[i].progressTotal + "/0", (x - 1600), y + 212)
                        }

                        //add xp tags
                        if(targetQuest.quests[i].tags.includes('ChallengeCategory.XP')){

                            //changing tags coordinates
                            if(userData.lang === "en") x += 37
                            else if(userData.lang === "ar") x -= 475

                            //print the party assist
                            if(userData.lang === "en") var xp = await Canvas.loadImage('./assets/Tags/xp.png')
                            else if(userData.lang === "ar") var xp = await Canvas.loadImage('./assets/Tags/xpAr.png')
                            ctx.drawImage(xp, x, y + 175, 450, 300)

                            //changing tags coordinates
                            if(userData.lang === "en") x += 450
                            else if(userData.lang === "ar") x -= 25

                        }

                        //add party assists tags
                        if(targetQuest.quests[i].tags.includes('Quest.Metadata.PartyAssist')){

                            //changing tags coordinates
                            if(userData.lang === "en") x += 25
                            else if(userData.lang === "ar") x -= 475

                            //print the party assist
                            if(userData.lang === "en") var partyAssists = await Canvas.loadImage('./assets/Tags/partyAssists.png')
                            else if(userData.lang === "ar") var partyAssists = await Canvas.loadImage('./assets/Tags/partyAssistsAr.png')
                            ctx.drawImage(partyAssists, x, y + 175, 450, 300)

                            //changing tags coordinates
                            if(userData.lang === "en") x += 450
                            else if(userData.lang === "ar") x -= 25

                        }

                        //add reward tags
                        if(targetQuest.quests[i].reward.items.length !== 0){

                            //changing tags coordinates
                            if(userData.lang === "en") x += 25
                            else if(userData.lang === "ar") x -= 475

                            //print the party assist
                            if(userData.lang === "en") var rewards = await Canvas.loadImage('./assets/Tags/rewards.png')
                            else if(userData.lang === "ar") var rewards = await Canvas.loadImage('./assets/Tags/rewardsAr.png')
                            ctx.drawImage(rewards, x, y + 175, 450, 300)

                            //changing tags coordinates
                            if(userData.lang === "en") x += 450
                            else if(userData.lang === "ar") x -= 25

                        }

                        y += 450
                        x = 100

                    }
                    
                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${targetQuest.id}.png`})
                    await message.reply({files: [att]})
                    msg.delete()

                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }

            //create an embed for choosing a category
            const dropDownMenuEmbed = new Discord.EmbedBuilder()
            dropDownMenuEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") dropDownMenuEmbed.setDescription('Please click on the Drop-Down menu and choose a category.\n`You have only 1 minute until this operation ends, Make it quick`!')
            else if(userData.lang === "ar") dropDownMenuEmbed.setDescription('الرجاء الضغط على السهم لاختيار فئة.\n`لديك فقط دقيقة حتى تنتهي العملية, استعجل`!')

            //create a row for Cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()

            const cancelButton = new Discord.ButtonBuilder()
            cancelButton.setCustomId('Cancel')
            cancelButton.setStyle(Discord.ButtonStyle.Danger)
            if(userData.lang === "en") cancelButton.setLabel("Cancel")
            else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
            
            //add the cancel button to the buttonDataRow
            buttonDataRow.addComponents(cancelButton)

            //create a row for drop down menu for categories
            const categoriesRow = new Discord.ActionRowBuilder()

            //loop thrw every category
            var categoriesOptions = []
            for(let i = 0; i < res.data.bundles.length; i++){

                //add the category name
                if(res.data.bundles[i].name.length !== 0) var name = res.data.bundles[i].name
                else if(userData.lang === "en") var name = "TBD"
                else if(userData.lang === "ar") var name = "لم يتم تحديد الاسم بعد"

                if(userData.lang === "en") var description = `Click here to view all '${name}' quests`
                else if(userData.lang === "ar") var description = `اضغط هنا لعرض جميع التحديات '${name}'`

                categoriesOptions[i] = {
                    label: name,
                    description: description,
                    value: `${i}`,
                }
            }

            //add an option for each category
            const categoryDropMenu = new Discord.SelectMenuBuilder()
            categoryDropMenu.setCustomId('categories')
            if(userData.lang === "en") categoryDropMenu.setPlaceholder('Nothing selected!')
            else if(userData.lang === "ar") categoryDropMenu.setPlaceholder('الرجاء الأختيار!')
            categoryDropMenu.addOptions(categoriesOptions)

            //add the drop menu to the categoryDropMenu
            categoriesRow.addComponents(categoryDropMenu)

            //send the message
            const challengeCategoryMessage = await message.reply({embeds: [dropDownMenuEmbed], components: [categoriesRow, buttonDataRow]})

            //filtering the user clicker
            const filter = i => i.user.id === message.author.id

            //await the user click
            const colllector = await message.channel.createMessageComponentCollector({filter, time: 60000, errors: ['time'] })
            colllector.on('collect', async collected => {
                collected.deferUpdate()

                //if canel button has been clicked
                if(collected.customId === "Cancel") colllector.stop()

                //if a category has been chosen then list all its quests
                if(collected.customId == "categories"){

                    //update categoriesIndex value
                    categoriesIndex = Number(collected.values[0])

                    var size = (res.data.bundles[categoriesIndex].bundles.length / 25), components = [categoriesRow], limit = 0
                    if(size % 2 !== 0 && size != 1){
                        size += 1;
                        size = size | 0
                    }

                    for(let i = 1; i <= size; i++){

                        //loop thrw every category
                        var questsOptions = []
                        for(let x = limit; x < 25 * i; x++){

                            //nullptr checker
                            if(res.data.bundles[categoriesIndex].bundles[x] != undefined){

                                //add the category name
                                if(res.data.bundles[categoriesIndex].bundles[x].name.length !== 0) var name = res.data.bundles[categoriesIndex].bundles[x].name
                                else if(userData.lang === "en") var name = "TBD"
                                else if(userData.lang === "ar") var name = "لم يتم تحديد الاسم بعد"

                                if(name.length > 99){
                                    if(userData.lang === "en") name = "Sorry, we can't show the quest's name"
                                    else if(userData.lang === "ar") name = "عذرا لا يمكن عرض اسم المهمة"
                                }

                                if(userData.lang === "en") var description = `Click here to view all '${name}' quests`
                                else if(userData.lang === "ar") var description = `اضغط هنا لعرض جميع التحديات '${name}'`

                                if(description.length > 99){
                                    if(userData.lang === "en") description = "Sorry, description isnt available"
                                    else if(userData.lang === "ar") description = "عذرا الوصف ليس متاح"
                                }

                                questsOptions.push({
                                    label: name,
                                    description: description,
                                    value: `${x}`,
                                })
                            }
                        }

                        //add an option for each quest
                        var questsDropMenu = new Discord.SelectMenuBuilder()
                        questsDropMenu.setCustomId(`quests${i}`)
                        if(userData.lang === "en") questsDropMenu.setPlaceholder(`Click here to view every ${res.data.bundles[categoriesIndex].name} quests!`)
                        else if(userData.lang === "ar") questsDropMenu.setPlaceholder(`اضغط هنا لعرض جميع مهام ${res.data.bundles[categoriesIndex].name}!`)
                        questsDropMenu.addOptions(questsOptions)

                        //add the drop menu to the questsDropMenu
                        components.push(new Discord.ActionRowBuilder().addComponents(questsDropMenu))
                        limit = 25 * i

                    } components.push(buttonDataRow)

                    //edit the message
                    await challengeCategoryMessage.edit({embeds: [dropDownMenuEmbed], components: components})
                    
                }

                if(collected.customId.includes("quests")){
                    colllector.stop()
                    printQuests(Number(collected.values[0]))
                    
                }

            })

            //when time has ended
            colllector.on('end', async () => {
                try {
                    await challengeCategoryMessage.delete()
                } catch {
                    
                }
            })
            
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}