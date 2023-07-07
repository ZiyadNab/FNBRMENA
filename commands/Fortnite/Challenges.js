const Canvas = require('canvas');

module.exports = {
    commands: 'quests',
    type: 'Fortnite',
    descriptionEN: 'Generates an image for any quest.',
    descriptionAR: 'استخراج صورة لأي مهمة.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 15,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Values
        let categoriesIndex = null

        FNBRMENA.listChallenges("current", userData.lang)
        .then(async res => {

            // QuestSheet
            const printQuests = async (questsIndex) => {
                const targetQuest = res.data.bundles[categoriesIndex].bundles[questsIndex]

                // Got the quest data now work with it
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading ${targetQuest.name}... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`تحميل ${targetQuest.name}... ${emojisObject.loadingEmoji}`)
                const msg = await message.reply({embeds: [generating], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                try {

                    // Setup variables
                    var width = 3500
                    var height = (targetQuest.quests.length * 450) + 300
                    var x = 100
                    var y = 250
                    var w = (width - (x * 2))
                    var h = 400

                    // Register fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    // Applytext
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d')
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
                        } while (ctx.measureText(text).width > width)
                        return ctx.font;
                    }

                    // Create canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    if(res.data.bundles[categoriesIndex].colorData != null){
                        var bgColor = res.data.bundles[categoriesIndex].colorData.RGB2.substring(3, 9)
                        var cardsColor = res.data.bundles[categoriesIndex].colorData.RGB1.substring(3, 9)
                    }else{
                        var bgColor = '7C128C'
                        var cardsColor = '590566'
                    }

                    // Adding the background
                    ctx.fillStyle = `#${bgColor}`
                    ctx.fillRect(0, 0, canvas.width, canvas.height)

                    // Upper img side
                    ctx.fillStyle = `#${cardsColor}`
                    ctx.fillRect(0, 0, canvas.width, 150)

                    // Adding credits
                    ctx.fillStyle = `#ffffff`
                    ctx.textAlign='left';
                    ctx.font = '120px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 25, 115)

                    //category image and its name
                    if(res.data.bundles[categoriesIndex].image != null){
                        const categoryImg = await Canvas.loadImage(res.data.bundles[categoriesIndex].image)
                        ctx.drawImage(categoryImg, canvas.width - 150, 0, 150, 150)

                        // Add the category name
                        ctx.fillStyle = `#ffffff`
                        ctx.textAlign = 'right';
                        ctx.font = applyText(canvas, targetQuest.name, canvas.width / 2, 120)
                        ctx.fillText(targetQuest.name, canvas.width - 175, 115)
                    }else{

                        // Add the category name
                        ctx.fillStyle = `#ffffff`
                        ctx.textAlign = 'right';
                        ctx.font = applyText(canvas, targetQuest.name, canvas.width / 2, 120)
                        ctx.fillText(targetQuest.name, canvas.width - 25, 115)
                    }

                    // Loop through every quest
                    for(let i = 0; i < targetQuest.quests.length; i++){

                        // Add the quest cards
                        ctx.fillStyle = `#${cardsColor}`

                        // Add the quest card
                        ctx.beginPath();
                        ctx.moveTo(x + 8, y);
                        ctx.arcTo(x + w, y, x + w, y + h, 8);
                        ctx.arcTo(x + w, y + h, x, y + h, 8);
                        ctx.arcTo(x, y + h, x, y, 8);
                        ctx.arcTo(x, y, x + w, y, 8);
                        ctx.closePath();
                        ctx.fill();

                        // Change image layout only if arabic
                        if(userData.lang === "ar") x = canvas.width - x

                        var rewardX = canvas.width - x
                        var rewardY = y 

                        // Add the quest rewards
                        if(targetQuest.quests[i].reward.items.length != 0){

                            // Loop thrw every reward
                            if(targetQuest.quests[i].reward.items.length > 2) ctx.globalAlpha = 0.5
                            for(let r = 0; r < targetQuest.quests[i].reward.items.length; r++){

                                // Load quest img
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

                        // Add the xp if there is xp for the quest
                        if(targetQuest.quests[i].reward.xp !== 0){

                            // More than 100K
                            if(targetQuest.quests[i].reward.xp >= 100000) var xp = targetQuest.quests[i].reward.xp.toString().substring(0, 3)

                            // Between 10K and 100K
                            if(targetQuest.quests[i].reward.xp >= 10000 && targetQuest.quests[i].reward.xp <= 99999) var xp = targetQuest.quests[i].reward.xp.toString().substring(0, 2)

                            // Between 1K and 10K
                            if(targetQuest.quests[i].reward.xp >= 1000 && targetQuest.quests[i].reward.xp <= 9999) var xp = targetQuest.quests[i].reward.xp.toString().substring(0, 1)

                            // Between 100 and 1K
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

                        // Check if the quest has an img
                        if(targetQuest.images != null){

                            // Load quest img
                            const questRewardImg = await Canvas.loadImage(targetQuest.images.DisplayImage)

                            // Change the x value and print the img
                            if(userData.lang === "en"){
                                ctx.drawImage(questRewardImg, x, y, h, h)
                                x += h + 25
                            }else if(userData.lang === "ar"){
                                ctx.drawImage(questRewardImg, x - h, y, h, h)
                                x -= h + 25
                            }
                        }

                        // Add the challange quest
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

                        // Add progress bar
                        ctx.fillStyle = `#${bgColor}`
                        if(userData.lang === "en") ctx.fillRect(x + 90, y + 175, 1500, 25)
                        else if(userData.lang === "ar") ctx.fillRect(x - 1577, y + 187, 1500, 25)

                        // Add progress bar text
                        ctx.fillStyle = `#ffffff`
                        ctx.font = '50px Burbank Big Condensed'
                        if(userData.lang === "en"){
                            ctx.textAlign = 'left';
                            ctx.fillText(targetQuest.quests[i].progressTotal + "/0", x + 1600, y + 200)
                        }else if(userData.lang === "ar"){
                            ctx.textAlign = 'right';
                            ctx.fillText(targetQuest.quests[i].progressTotal + "/0", (x - 1600), y + 212)
                        }

                        // Add xp tags
                        if(targetQuest.quests[i].tags.includes('ChallengeCategory.XP')){

                            // Changing tags coordinates
                            if(userData.lang === "en") x += 37
                            else if(userData.lang === "ar") x -= 475

                            // Print the party assist
                            if(userData.lang === "en") var xp = await Canvas.loadImage('./assets/Tags/xp.png')
                            else if(userData.lang === "ar") var xp = await Canvas.loadImage('./assets/Tags/xpAr.png')
                            ctx.drawImage(xp, x, y + 175, 450, 300)

                            // Changing tags coordinates
                            if(userData.lang === "en") x += 450
                            else if(userData.lang === "ar") x -= 25

                        }

                        // Add party assists tags
                        if(targetQuest.quests[i].tags.includes('Quest.Metadata.PartyAssist')){

                            // Changing tags coordinates
                            if(userData.lang === "en") x += 25
                            else if(userData.lang === "ar") x -= 475

                            // Print the party assist
                            if(userData.lang === "en") var partyAssists = await Canvas.loadImage('./assets/Tags/partyAssists.png')
                            else if(userData.lang === "ar") var partyAssists = await Canvas.loadImage('./assets/Tags/partyAssistsAr.png')
                            ctx.drawImage(partyAssists, x, y + 175, 450, 300)

                            // Changing tags coordinates
                            if(userData.lang === "en") x += 450
                            else if(userData.lang === "ar") x -= 25

                        }

                        // Add reward tags
                        if(targetQuest.quests[i].reward.items.length !== 0){

                            // Changing tags coordinates
                            if(userData.lang === "en") x += 25
                            else if(userData.lang === "ar") x -= 475

                            // Print the party assist
                            if(userData.lang === "en") var rewards = await Canvas.loadImage('./assets/Tags/rewards.png')
                            else if(userData.lang === "ar") var rewards = await Canvas.loadImage('./assets/Tags/rewardsAr.png')
                            ctx.drawImage(rewards, x, y + 175, 450, 300)

                            // Changing tags coordinates
                            if(userData.lang === "en") x += 450
                            else if(userData.lang === "ar") x -= 25

                        }

                        y += 450
                        x = 100

                    }
                    
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${targetQuest.id}.png`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {

                        // Try sending it on jpg file format [LOWER QUALITY]
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${targetQuest.id}.jpg`})
                        msg.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    })

                }catch(err) {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                }
            }

            // Create an embed for choosing a category
            const dropDownMenuEmbed = new Discord.EmbedBuilder()
            dropDownMenuEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") dropDownMenuEmbed.setDescription('Please click on the Drop-Down menu and choose a category.\n`You have only 1 minute until this operation ends, Make it quick`!')
            else if(userData.lang === "ar") dropDownMenuEmbed.setDescription('الرجاء الضغط على السهم لاختيار فئة.\n`لديك فقط دقيقة حتى تنتهي العملية, استعجل`!')

            // Create a row for Cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()

            // Add buttons
            if(userData.lang === "en") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
            )
            
            else if(userData.lang === "ar") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
            )

            var size = (res.data.bundles.length / 25), components = [], limit = 0
            if(size % 2 !== 0 && size != 1){
                size += 1
                size = size | 0
            }

            // Loop through every category
            for(let i = 1; i <= size; i++){

                var categoriesOptions = []
                for(let x = limit; x < 25 * i; x++){

                    // Nullptr checker
                    if(res.data.bundles[x] != undefined){

                        // Add the category name
                        if(res.data.bundles[x].name.length !== 0) var name = res.data.bundles[x].name
                        else if(userData.lang === "en") var name = "TBD"
                        else if(userData.lang === "ar") var name = "لم يتم تحديد الاسم بعد"

                        // Check if the category name is longer than 99 letters
                        if(name.length > 99){
                            if(userData.lang === "en") name = "Sorry, we can't show the quest's name"
                            else if(userData.lang === "ar") name = "عذرا لا يمكن عرض اسم المهمة"
                        }

                        // Add the category description
                        if(userData.lang === "en") var description = `Click here to view all '${name}' quests`
                        else if(userData.lang === "ar") var description = `اضغط هنا لعرض جميع التحديات '${name}'`

                        // Check if the category description is longer than 99 letters
                        if(description.length > 99){
                            if(userData.lang === "en") description = "Sorry, description isnt available"
                            else if(userData.lang === "ar") description = "عذرا الوصف ليس متاح"
                        }

                        categoriesOptions.push({
                            label: name,
                            description: description,
                            default: false,
                            value: `${x}`,
                        })
                    }
                }

                // Add an option for each category
                var categoryDropMenu = new Discord.StringSelectMenuBuilder()
                categoryDropMenu.setCustomId(`categories${i}`)
                if(userData.lang === "en") categoryDropMenu.setPlaceholder('Select a categorie!')
                else if(userData.lang === "ar") categoryDropMenu.setPlaceholder('اختر فئة!')
                categoryDropMenu.addOptions(categoriesOptions)

                // Add the drop menu to the categoryDropMenu
                components.push(new Discord.ActionRowBuilder().addComponents(categoryDropMenu))
                limit = 25 * i

            } components.push(buttonDataRow)

            // Send the message
            const challengeCategoryMessage = await message.reply({embeds: [dropDownMenuEmbed], components: components, files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === challengeCategoryMessage.id && i.guild.id === message.guild.id)
            })

            // Await the user click
            const colllector = await message.channel.createMessageComponentCollector({filter, time: 60000, errors: ['time']})
            colllector.on('collect', async collected => {
                collected.deferUpdate()

                // If canel button has been clicked
                if(collected.customId === "Cancel") colllector.stop()

                // If a category has been chosen then list all its quests
                if(collected.customId.includes('categories')){

                    // Update categoriesIndex value
                    categoriesIndex = collected.values[0]

                    // Loop through all the components backwords
                    for(let i = components.length - 1; i >= 0; i--) {

                        // Check if the id contains categories
                        if(components[i].components[0].data.custom_id.includes('categories')){

                            // Only update matching ids otherwise reset default
                            if(components[i].components[0].data.custom_id === collected.customId){
                                
                                // Update default user choice
                                components[i].components[0].options.map(o => {
                                    if(o.data.value === categoriesIndex) o.default = true, o.data.default = true
                                    else o.default = false, o.data.default = false
                                })

                                // Update component options
                                components[i].components[0].setOptions(components[i].components[0].options)

                            }else components[i].components[0].options.map(o => {
                                o.default = false
                                o.data.default = false
                            })

                        // Remove any component that is not a category
                        }else components.splice(i, 1)
                    }

                    var size = (res.data.bundles[categoriesIndex].bundles.length / 25), limit = 0
                    if(size % 2 !== 0 && size != 1){
                        size += 1;
                        size = size | 0
                    }

                    for(let i = 1; i <= size; i++){

                        // Loop thrw every category
                        var questsOptions = []
                        for(let x = limit; x < 25 * i; x++){

                            // Nullptr checker
                            if(res.data.bundles[categoriesIndex].bundles[x] != undefined){

                                // Add the quest name
                                if(res.data.bundles[categoriesIndex].bundles[x].name.length !== 0) var name = res.data.bundles[categoriesIndex].bundles[x].name
                                else if(userData.lang === "en") var name = "TBD"
                                else if(userData.lang === "ar") var name = "لم يتم تحديد الاسم بعد"

                                // Check if the quest name is longer than 99 letters
                                if(name.length > 99){
                                    if(userData.lang === "en") name = "Sorry, we can't show the quest's name"
                                    else if(userData.lang === "ar") name = "عذرا لا يمكن عرض اسم المهمة"
                                }

                                // Add the quest description
                                if(userData.lang === "en") var description = `Click here to view all '${name}' quests`
                                else if(userData.lang === "ar") var description = `اضغط هنا لعرض جميع التحديات '${name}'`

                                // Check if the quest description is longer than 99 letters
                                if(description.length > 99){
                                    if(userData.lang === "en") description = "Sorry, description isnt available"
                                    else if(userData.lang === "ar") description = "عذرا الوصف ليس متاح"
                                }

                                // Get the quest status
                                if(res.data.bundles[categoriesIndex].bundles[x].quests[0].enabled) var status = emojisObject.Uncommon //emojisObject.greenStatus
                                else var status = emojisObject.MarvelSeries //emojisObject.redStatus

                                // Add the choice option
                                questsOptions.push({
                                    label: name,
                                    description: description,
                                    emoji: `${status.name}:${status.id}`,
                                    value: `${x}`,
                                })
                            }
                        }

                        // Add an option for each quest
                        var questsDropMenu = new Discord.StringSelectMenuBuilder()
                        questsDropMenu.setCustomId(`quests${i}`)
                        if(userData.lang === "en") questsDropMenu.setPlaceholder(`Click here to view all ${res.data.bundles[categoriesIndex].name}'s quests!`)
                        else if(userData.lang === "ar") questsDropMenu.setPlaceholder(`اضغط هنا لعرض جميع مهام ${res.data.bundles[categoriesIndex].name}!`)
                        questsDropMenu.addOptions(questsOptions)

                        // Add the drop menu to the questsDropMenu
                        components.push(new Discord.ActionRowBuilder().addComponents(questsDropMenu))
                        limit = 25 * i

                    } components.push(buttonDataRow)

                    // Edit the message
                    challengeCategoryMessage.edit({embeds: [dropDownMenuEmbed], components: components, files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, challengeCategoryMessage)
                    })
                    
                }

                if(collected.customId.includes("quests")){
                    colllector.stop()
                    printQuests(Number(collected.values[0]))
                    
                }
            })

            // When time has ended
            colllector.on('end', async () => {
                try {
                    challengeCategoryMessage.delete()
                } catch {
                    
                }
            })
            
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}