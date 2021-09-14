const Canvas = require('canvas')

module.exports = {
    commands: 'details',
    type: 'Fortnite',
    descriptionEN: 'A command gives you access to every single detail about a cosmetic e.g. Info, Styles, Grants',
    descriptionAR: 'أمر يعطيك الصلاحية لجميع التفاصيل لأي عنصر مثل معلومات، ستايلات، تصريحات',
    expectedArgsEN: 'Use the command then right after use any cosmetic in-game',
    expectedArgsAR: 'فقط استعمل الأمر ثم اسم اي عنصر باللعبة',
    hintEN: 'You will get 3 options:\n• Info: returns all the info of the searched cosmetic like shop history...\n• Styles: Returns all the styles of the searched cosmetics (Not all items supported).\n• Grants: Returns what you will get if you purchesed the item.',
    hintAR: 'راح تحصل على ثلاث خيارات: \n• معلومات: يسترجع لك جميع المعلومات للعنصر مثل تاريخ متجر العناصر...\n• الستايلات: يسترجع لك جميع الستايلات للعنصر (ليس جميع العناصر مدعومة)\n• العناصر المعطاه: يسترجع لك جميع العناصر الي راح تحصل عليها في حال شرائك للعنصر',
    argsExample: ['Ninja', 'Wildcat'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //aplyText
        const applyTextName = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 92;
            do {
                if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
            } while (ctx.measureText(text).width > 900);
            return ctx.font;
        };

        //applytext
        const applyTextDescription = (canvas, text) => {
            const ctx = canvas.getContext('2d');
            let fontSize = 35;
            do {
                if(lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                else if(lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
            } while (ctx.measureText(text).width > 840);
            return ctx.font;
        };

        //registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

        //set inizial value
        var SearchType = "name"

        //take over the index
        var num = 0

        //handeling errors
        var errorHandleing = 0

        //if the search type is an id
        if(text.includes("_")) SearchType = "id"

        //details
        const details = [
            "info",
            "styles",
            "grants"
        ]
        var detailsIndex = 0

        //requst data
        FNBRMENA.Search(lang, SearchType, text)
        .then(async res => {

            //if the result is more than one item
            if(res.data.items.length > 1){

                //create embed
                const list = new Discord.MessageEmbed()

                //set the color
                list.setColor(FNBRMENA.Colors("embed"))

                //set title
                if(lang === "en") list.setTitle(`Please choose your item from the list below`)
                else if(lang === "ar") list.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

                //loop throw every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.items.length; i++){

                    //store the name to the string
                    string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                }

                //how many items where matchinh the user input?
                if(lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                else if(lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                //set Description
                list.setDescription(string)

                //send the message and wait for answer
                await message.channel.send(list)
                .then(async list => {

                    //filtering outfits
                    const filter = async m => await m.author.id === message.author.id

                    //add the reply
                    if(lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                    else if(lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                    
                    await message.reply(reply)
                    .then( async notify => {

                        //listen for user input
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //delete messages
                            await notify.delete()
                            await list.delete()

                            //if the user chosen inside range
                            if(collected.first().content >= 0 && collected.first().content < res.data.items.length){

                                //change the item index
                                num = collected.first().content
                            }else{

                                //add an error
                                errorHandleing++

                                //if user typed a number out of range
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        })
                    })
                }).catch(err => {

                    //add an error
                    errorHandleing++

                    //if user typed a number out of range
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Request entry too large ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`تم تخطي الكمية المحدودة من عدد العناصر ${errorEmoji}`)
                    message.reply(errorRequest)

                })
            }

            //if there is no item found
            if(res.data.items.length === 0){

                //add an error
                errorHandleing++

                //if user typed a number out of range
                const errorRequest = new Discord.MessageEmbed()
                errorRequest.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") errorRequest.setTitle(`No cosmetic has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") errorRequest.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(errorRequest)
                
            }

            //if everything is correct
            if(errorHandleing === 0 && res.data.items.length > 0){

                //ask the user what method he needs
                const question = new Discord.MessageEmbed()

                //get the item rarity
                if(res.data.items[num].series === null) var embedColor = res.data.items[num].rarity.id
                else var embedColor = res.data.items[num].series.id

                //set color
                question.setColor(FNBRMENA.Colors(embedColor))

                //set author
                question.setAuthor(`${res.data.items[num].name} | ${res.data.items[num].type.name}`, res.data.items[num].images.icon)

                //set description
                if(lang === "en") question.setDescription(`• 0: Info\n• 1: Styles\n• 2: Grants`)
                else if(lang === "ar") question.setDescription(`• 0: معلومات\n• 1: ستايلات\n• 2: عناصر العنصر`)

                //send the message
                await message.channel.send(question)
                .then(async list => {

                    //filtering outfits
                    const filter = async m => await m.author.id === message.author.id

                    //add the reply
                    if(lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                    else if(lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                    
                    await message.reply(reply)
                    .then( async notify => {

                        //listen for user input
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //delete messages
                            await notify.delete()
                            await list.delete()

                            //if the user chosen inside range
                            if(collected.first().content >= 0 && collected.first().content < details.length){

                                //change the item index
                                detailsIndex = await collected.first().content
                            }else{

                                //add an error
                                errorHandleing++

                                //if user typed a number out of range
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        })
                    })
                })

                //list styles or grants
                if(errorHandleing === 0){

                    //if the user input is info
                    if(details[detailsIndex] === "info" && errorHandleing === 0 && errorHandleing === 0){

                        //create info embed
                        const info = new Discord.MessageEmbed()

                        //set color
                        info.setColor(FNBRMENA.Colors(embedColor))

                        //set author
                        info.setAuthor(`${res.data.items[num].name} | ${res.data.items[num].type.name}`, res.data.items[num].images.icon)

                        //rarity id
                        if(res.data.items[num].series === null) var rarityID = res.data.items[num].rarity.id
                        else var rarityID = res.data.items[num].series.id

                        //rarity name
                        if(res.data.items[num].series === null) var rarityName = res.data.items[num].rarity.name
                        else var rarityName = res.data.items[num].series.name

                        //set
                        if(res.data.items[num].set !== null) var set = `\`${res.data.items[num].set.partOf}\``
                        else if(lang === "en") var set = `There is no set for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``
                        else if(lang === "ar") var set = `لا يوجد مجموعة \`${res.data.items[num].type.name} ${res.data.items[num].name}\``

                        //Introduction
                        if(res.data.items[num].introduction !== null) var introduction = `\`${res.data.items[num].introduction.text}\``
                        else if(lang === "en") var introduction = `There is no introduction for \`${res.data.items[num].name} ${res.data.items[num].type.name}\` yet`
                        else if(lang === "ar") var introduction = `لم يتم تقديم \`${res.data.items[num].type.name} ${res.data.items[num].name}\` بعد`

                        //Description
                        if(res.data.items[num].description !== "") var description = `\`${res.data.items[num].description}\``
                        else if(lang === "en") var description = `There is no description for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``
                        else if(lang === "ar") var description = `لا يوجد وصف \`${res.data.items[num].type.name} ${res.data.items[num].name}\``

                        //releaseDate
                        if(res.data.items[num].releaseDate !== null) var releaseDate = `\`${res.data.items[num].releaseDate}\``
                        else if(lang === "en") var releaseDate = `\`No dates available\``
                        else if(lang === "ar") var releaseDate = `\`لا يوجد تواريخ\``

                        //lastAppearance
                        if(res.data.items[num].lastAppearance !== null) var lastAppearance = `\`${res.data.items[num].lastAppearance}\``
                        else if(lang === "en") var lastAppearance = `\`No dates available\``
                        else if(lang === "ar") var lastAppearance = `\`لا يوجد تواريخ\``

                        if(lang === "en"){
                            
                            //add id, name, description, rarity, introduction and added
                            info.addFields(
                                {name: "ID", value: `\`${res.data.items[num].id}\``, inline: true},
                                {name: "Name", value: `\`${res.data.items[num].name}\``, inline: true},
                                {name: "Description", value: description, inline: true},
                                {name: "Rarity", value: `ID: \`${rarityID}\`\nName: \`${rarityName}\``, inline: true},
                                {name: "Set", value: set, inline: true},
                                {name: "Introduction", value: introduction, inline: true},
                                {name: "Added", value: `Date: \`${res.data.items[num].added.date}\`\nVersion: \`${res.data.items[num].added.version}\``, inline: true},
                                {name: "Dates", value: `Release Date: ${releaseDate}\nLast Appearance: ${lastAppearance}`, inline: true},
                                {name: "Price", value: `\`${res.data.items[num].price}\``, inline: true},
                                {name: "Ractive", value: `\`${res.data.items[num].reactive}\``, inline: true},
                                {name: "Copyrightd", value: `\`${res.data.items[num].copyrightedAudio}\``, inline: true},
                                {name: "Upcoming", value: `\`${res.data.items[num].upcoming}\``, inline: true},
                            )

                            //if the item is from the battlepass
                            if(res.data.items[num].battlepass !== null) info.addFields({name: "Battlepass", value: `\`${res.data.items[num].battlepass.displayText.chapterSeason}\`\nTier: \`${res.data.items[num].battlepass.tier}\`\n\`Type: ${res.data.items[num].battlepass.type}\``, inline: true})

                            //if the item is not from the itemshop
                            else info.addFields({name: "Battlepass", value: `The \`${res.data.items[num].name} ${res.data.items[num].type.name}\` is not from the battlepass`, inline: true})

                            //add styles
                            if(res.data.items[num].styles.length !== 0){
                                for(let i = 0; i < res.data.items[num].styles.length; i++){

                                    //is style default
                                    if(res.data.items[num].styles[i].isDefault) var isDefault = `Yes, it is default`
                                    else var isDefault = `No, it is not default`

                                    //is hideIfNotOwned
                                    if(res.data.items[num].styles[i].hideIfNotOwned) var hideIfNotOwned = `Yes, it is hidden if you don't own the style`
                                    else var hideIfNotOwned = `No, it is not hidden`

                                    info.addFields(
                                        {name: `Style ${i + 1}`, value: `Name: \`${res.data.items[num].styles[i].name}\`\nisDefault: \`${isDefault}\`\nhideIfNotOwned: \`${hideIfNotOwned}\`\nChannel: \`${res.data.items[num].styles[i].channel}\`\nTag: \`${res.data.items[num].styles[i].tag}\``}
                                    )
                                }
                            }else info.addFields({name:`Styles`, value: `\`No styles for ${res.data.items[num].name}\``})

                            //if the item has a shop history
                            if(res.data.items[num].shopHistory !== null) info.addFields({name: "Shop History", value: res.data.items[num].shopHistory, inline: true})

                            //if the item has a shop history but not released yet
                            else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) info.addFields({name: "Shop History", value: `the \`${res.data.items[num].name} ${res.data.items[num].type.name}\` has not released yet`, inline: true})

                            //if the item is not from the item shop
                            else info.addFields({name: "Shop History", value: `the \`${res.data.items[num].name} ${res.data.items[num].type.name}\` is not an itemshop item`, inline: true})

                            //add gameplay tags
                            if(res.data.items[num].gameplayTags.length > 0) info.addFields({name: "Gameplay Tags", value: res.data.items[num].gameplayTags, inline: true})
                            else info.addFields({name: "Gameplay Tags", value: `There is no GameplayTags for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``, inline: true})
                            
                        }else if(lang === "ar"){

                            //add id, name, description, rarity, introduction and added
                            info.addFields(
                                {name: "الأي دي", value: `\`${res.data.items[num].id}\``, inline: true},
                                {name: "الأسم", value: `\`${res.data.items[num].name}\``, inline: true},
                                {name: "الوصف", value: description, inline: true},
                                {name: "الندرة", value: `المعرف:\` ${rarityID}\`\nالأسم: \`${rarityName}\``, inline: true},
                                {name: "المجموعة", value: set, inline: true},
                                {name: "تم تقديمة", value: introduction, inline: true},
                                {name: "تم اضافته", value: `التاريخ: \`${res.data.items[num].added.date}\`\nالتحديث: \`${res.data.items[num].added.version}\``, inline: true},
                                {name: "تواريخ", value: `اول ظهور: ${releaseDate}\nأخر ظهور: ${lastAppearance}`, inline: true},
                                {name: "السعر", value: `\`${res.data.items[num].price}\``, inline: true},
                                {name: "متفاعل", value: `\`${res.data.items[num].reactive}\``, inline: true},
                                {name: "يحتوي على حقوق الطبع و النشر", value: `\`${res.data.items[num].copyrightedAudio}\``, inline: true},
                                {name: "عنصر قادم بالمستقبل", value: `\`${res.data.items[num].upcoming}\``, inline: true},
                            )

                            //if the item is from the battlepass
                            if(res.data.items[num].battlepass !== null) info.addFields({name: "باتل باس", value: `\`${res.data.items[num].battlepass.displayText.chapterSeason}\`\n التاير: \`${res.data.items[num].battlepass.tier}\`\nالنوع: \`${res.data.items[num].battlepass.type}\``, inline: true})

                            //if the item is not from the itemshop
                            else info.addFields({name: "باتل باس", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` ليس من الباتل باس`, inline: true})

                            //add styles
                            if(res.data.items[num].styles.length !== 0){
                                for(let i = 0; i < res.data.items[num].styles.length; i++){

                                    //is style default
                                    if(res.data.items[num].styles[i].isDefault) var isDefault = `نعم الستايل أساسي`
                                    else var isDefault = `لا الستايل ليس أساسي`

                                    //is hideIfNotOwned
                                    if(res.data.items[num].styles[i].hideIfNotOwned) var hideIfNotOwned = `نعم اذا ما تملك الستايل ماراح تقدر تستعملة`
                                    else var hideIfNotOwned = `لا الستايل ليس مخفي`

                                    info.addFields(
                                        {name: `الستايل رقم ${i + 1}`, value: `الأسم: \`${res.data.items[num].styles[i].name}\`\nهل الستايل أساسي: \`${isDefault}\`\nمخفي اذا ما تملك الستايل: \`${hideIfNotOwned}\`\nالقناة: \`${res.data.items[num].styles[i].channel}\`\nالإشعارات: \`${res.data.items[num].styles[i].tag}\``}
                                    )
                                }
                            }else info.addFields({name:`الستايلات`, value: `\`لا يوجد ستايلات لـ ${res.data.items[num].name}\``})

                            //if the item has a shop history
                            if(res.data.items[num].shopHistory !== null) info.addFields({name: "تاريخ الشوب", value: res.data.items[num].shopHistory, inline: true})

                            //if the item has a shop history but not released yet
                            else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) info.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` لم يتم نزوله بعد`, inline: true})

                            //if the item is not from the item shop
                            else info.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` ليس عنصر ايتم شوب`, inline: true})

                            //add gameplay tags
                            if(res.data.items[num].gameplayTags.length > 0) info.addFields({name: "العلامات", value: res.data.items[num].gameplayTags, inline: true})
                            else info.addFields({name: "العلامات", value: `لا يوجد علامات لعنصر \`${res.data.items[num].type.name} ${res.data.items[num].name}\``, inline: true})
                            
                            
                        }

                        info.setFooter('Generated By FNBRMENA Bot')
                        message.channel.send(info)
                    }
                    
                    //if the user input is styles
                    if(details[detailsIndex] === "styles" && errorHandleing === 0){

                        //check if there is a style in the files
                        const cosmeticvariants = await FNBRMENA.List(lang, "cosmeticvariant")

                        //filtering
                        var styles = []

                        //add the searched item first
                        styles[0] = res.data.items[num]

                        //get the styles if there is any
                        var Counter = 1
                        for(let i = 0; i < cosmeticvariants.data.items.length; i++){
                            if(await cosmeticvariants.data.items[i].description.trim().includes(res.data.items[num].name.trim()) &&
                            cosmeticvariants.data.items[i].rarity.id === res.data.items[num].rarity.id){

                                styles[Counter] = await cosmeticvariants.data.items[i]
                                Counter++
                            }
                        }

                        //if there is a style in the files
                        if(styles.length > 1){

                            //getting item data loading
                            const generating = new Discord.MessageEmbed()
                            generating.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                            else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                            message.channel.send(generating)
                            .then( async msg => {

                                //loop throw every style
                                for(let i = 0; i < styles.length; i ++){

                                    //creating canvas
                                    const canvas = Canvas.createCanvas(1024, 1024);
                                    const ctx = canvas.getContext('2d');

                                    //set the item info
                                    var name = styles[i].name
                                    if(styles[i].description !== "") var description = styles[i].description
                                    else if(lang === "en") var description = "There is no description to this item"
                                    else if(lang === "ar") var description = "لا يوجد وصف للعنصر"
                                    var image = styles[i].images.icon
                                    if(styles[i].series !== null) var rarity = styles[i].series.id
                                    else var rarity = styles[i].rarity.id

                                    //remove any lines
                                    let imgDescription = await description
                                    imgDescription = imgDescription.replace("\r\n", "")

                                    //add introduces and set string
                                    if(styles[i].introduction !== null) imgDescription += `\n${styles[i].introduction.text}`
                                    if(styles[i].set !== null) imgDescription += `\n${styles[i].set.partOf}`

                                    //split every line
                                    imgDescription = imgDescription.split(/\r\n|\r|\n/)
    
                                    //searching...
                                    if(rarity === "Legendary"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Epic"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Rare"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Uncommon"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Common"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "MarvelSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "DCUSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "CUBESeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "CreatorCollabSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "ColumbusSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "ShadowSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "SlurpSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "FrozenSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "LavaSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "PlatformSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else{
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }
    
                                    //inilizing tags
                                    var y = 24
                                    var x = 934
    
                                    for(let g = 0; g < styles[i].gameplayTags.length; g++){
    
                                        //if the item is animated
                                        if(styles[i].gameplayTags[g].includes('Animated')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item is reactive
                                        if(styles[i].gameplayTags[g].includes('Reactive')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item is synced emote
                                        if(styles[i].gameplayTags[g].includes('Synced')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item is traversal
                                        if(styles[i].gameplayTags[g].includes('Traversal')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item has styles
                                        if(styles[i].gameplayTags[g].includes('HasVariants') || styles[i].gameplayTags[g].includes('HasUpgradeQuests')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
                                    }
    
                                    //if the item contains copyrited audio
                                    if(styles[i].copyrightedAudio === true){
    
                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)
    
                                        y += 70
                                    }

                                    //send the item picture
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), `${styles[i].id}.png`)
                                    await message.channel.send(att)
                                }

                                //delete generating msg
                                msg.delete()
                            })

                        }else if(res.data.items[num].displayAssets.length !== 0){

                            //getting item data loading
                            const generating = new Discord.MessageEmbed()
                            generating.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                            else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                            message.channel.send(generating)
                            .then( async msg => {
                            
                                //loop throw every style
                                for(let i = 0; i < res.data.items[num].displayAssets.length; i ++){

                                    //creating canvas
                                    const canvas = Canvas.createCanvas(1024, 1024);
                                    const ctx = canvas.getContext('2d');

                                    //set the item info
                                    var name = res.data.items[num].name
                                    if(res.data.items[num].description !== "") var description = res.data.items[num].description
                                    else if(lang === "en") var description = "There is no description to this item"
                                    else if(lang === "ar") var description = "لا يوجد وصف للعنصر"
                                    var image = res.data.items[num].displayAssets[i].url
                                    if(res.data.items[num].series !== null) var rarity = res.data.items[num].series.id
                                    else var rarity = res.data.items[num].rarity.id

                                    //remove lines
                                    let imgDescription = await description
                                    imgDescription = imgDescription.replace("\r\n", "")
    
                                    //add introduces and set string
                                    if(res.data.items[num].introduction !== null) imgDescription += `\n${res.data.items[num].introduction.text}`
                                    if(res.data.items[num].set !== null) imgDescription += `\n${res.data.items[num].set.partOf}`
    
                                    //split every line
                                    imgDescription = imgDescription.split(/\r\n|\r|\n/)
    
                                    //searching...
                                    if(rarity === "Legendary"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Epic"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Rare"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Uncommon"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "Common"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "MarvelSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "DCUSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "CUBESeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "CreatorCollabSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "ColumbusSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "ShadowSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "SlurpSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "FrozenSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "LavaSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else if(rarity === "PlatformSeries"){
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }else{
                                        //creating image
                                        const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                        ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                        const skin = await Canvas.loadImage(image);
                                        ctx.drawImage(skin, 0, 0, 1024, 1024)
                                        const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                        ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                        if(lang === "en"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Burbank Big Condensed'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }else if(lang === "ar"){
                                            ctx.fillStyle = '#ffffff';
                                            ctx.textAlign='center';
                                            ctx.font = applyTextName(canvas, name)
                                            ctx.fillText(name, 512, 850)
                                            ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                            let descriptionY = 930
                                            ctx.fillText(imgDescription[0], 512, descriptionY)
                                            ctx.font = '15px Arabic'
                                            descriptionY += 35
                                            for(let x = 1; x < imgDescription.length; x++){
                                                ctx.fillText(imgDescription[x], 512, descriptionY)
                                                descriptionY += 15
                                            }
                                        }
                                    }
    
                                    //inilizing tags
                                    var y = 24
                                    var x = 934
    
                                    for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){
    
                                        //if the item is animated
                                        if(res.data.items[num].gameplayTags[i].includes('Animated')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item is reactive
                                        if(res.data.items[num].gameplayTags[i].includes('Reactive')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item is synced emote
                                        if(res.data.items[num].gameplayTags[i].includes('Synced')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item is traversal
                                        if(res.data.items[num].gameplayTags[i].includes('Traversal')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
    
                                        //if the item has styles
                                        if(res.data.items[num].gameplayTags[i].includes('HasVariants') || res.data.items[num].gameplayTags[i].includes('HasUpgradeQuests')){
    
                                            //the itm is animated add the animated icon
                                            const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                            ctx.drawImage(skinholder, x, y, 60, 60)
    
                                            y += 70
                                        }
                                    }
    
                                    //if the item contains copyrited audio
                                    if(res.data.items[num].copyrightedAudio === true){
    
                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)
    
                                        y += 70
                                    }

                                    //send the item picture
                                    const att = new Discord.MessageAttachment(canvas.toBuffer(), res.data.items[num].displayAssets[i].displayAsset + '.png')
                                    await message.channel.send(att)

                                }
                                //delete generating msg
                                msg.delete()
                            })
                            
                        }else if(details[detailsIndex] === "styles" && res.data.items[num].displayAssets.length === 0 && errorHandleing === 0){

                            //send an error
                            const Err = new Discord.MessageEmbed()
                            Err.setColor(FNBRMENA.Colors(embedColor))
                            if(lang === "en") Err.setTitle(`No styles has been found for ${res.data.items[num].name} ${res.data.items[num].type.name} ${errorEmoji}`)
                            else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على ستايلات ${res.data.items[num].type.name} ${res.data.items[num].name} ${errorEmoji}`)
                            message.reply(Err)
                        }
                            
                    }

                    //if the user input is grants
                    if(details[detailsIndex] === "grants" && res.data.items[num].grants.length > 0 && errorHandleing === 0){

                        //getting item data loading
                        const generating = new Discord.MessageEmbed()
                        generating.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") generating.setTitle(`Loading item data... ${loadingEmoji}`)
                        else if(lang === "ar") generating.setTitle(`تحميل معلومات العنصر... ${loadingEmoji}`)
                        message.channel.send(generating)
                        .then( async msg => {
                            
                            //create grants variable
                            var grants = []

                            //add the actual searched outfit
                            grants[0] = res.data.items[num]

                            //loop throw every grant
                            var Counter = 1
                            for(let i = 0; i < res.data.items[num].grants.length; i++){

                                //get the item details
                                await FNBRMENA.SearchByType(lang, res.data.items[num].grants[i].id, res.data.items[num].grants[i].type.id, "id")
                                .then(async res => {

                                    grants[Counter++] = await res.data.items[i]
                                })
                            }

                            //loop throw every grant
                            for(let i = 0; i < grants.length; i++){

                                //creating canvas
                                const canvas = Canvas.createCanvas(1024, 1024);
                                const ctx = canvas.getContext('2d');

                                //set the item info
                                var name = grants[i].name
                                if(grants[i].description !== "") var description = grants[i].description
                                else if(lang === "en") var description = "There is no description to this item"
                                else if(lang === "ar") var description = "لا يوجد وصف للعنصر"
                                var image = grants[i].images.icon
                                if(grants[i].series !== null) var rarity = grants[i].series.id
                                else var rarity = grants[i].rarity.id

                                //remove lines
                                let imgDescription = await description
                                imgDescription = imgDescription.replace("\r\n", "")

                                //add introduces and set string
                                if(grants[i].introduction !== null) imgDescription += `\n${grants[i].introduction.text}`
                                if(grants[i].set !== null) imgDescription += `\n${grants[i].set.partOf}`

                                //split every line
                                imgDescription = imgDescription.split(/\r\n|\r|\n/)

                                //searching...
                                if(rarity === "Legendary"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Epic"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Rare"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Uncommon"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "Common"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "MarvelSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "DCUSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "CUBESeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "CreatorCollabSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "ColumbusSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "ShadowSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "SlurpSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "FrozenSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "LavaSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else if(rarity === "PlatformSeries"){
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }else{
                                    //creating image
                                    const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                                    ctx.drawImage(skinholder, 0, 0, 1024, 1024)
                                    const skin = await Canvas.loadImage(image);
                                    ctx.drawImage(skin, 0, 0, 1024, 1024)
                                    const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                                    ctx.drawImage(skinborder, 0, 0, 1024, 1024)
                                    if(lang === "en"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Burbank Big Condensed'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }else if(lang === "ar"){
                                        ctx.fillStyle = '#ffffff';
                                        ctx.textAlign='center';
                                        ctx.font = applyTextName(canvas, name)
                                        ctx.fillText(name, 512, 850)
                                        ctx.font = applyTextDescription(canvas, imgDescription[0]);
                                        let descriptionY = 930
                                        ctx.fillText(imgDescription[0], 512, descriptionY)
                                        ctx.font = '15px Arabic'
                                        descriptionY += 35
                                        for(let x = 1; x < imgDescription.length; x++){
                                            ctx.fillText(imgDescription[x], 512, descriptionY)
                                            descriptionY += 15
                                        }
                                    }
                                }

                                //inilizing tags
                                var y = 24
                                var x = 934

                                for(let g = 0; g < grants[g].gameplayTags.length; g++){

                                    //if the item is animated
                                    if(grants[i].gameplayTags[g].includes('Animated')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item is reactive
                                    if(grants[i].gameplayTags[g].includes('Reactive')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item is synced emote
                                    if(grants[i].gameplayTags[g].includes('Synced')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item is traversal
                                    if(grants[i].gameplayTags[g].includes('Traversal')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }

                                    //if the item has styles
                                    if(grants[i].gameplayTags[g].includes('HasVariants') || grants[i].gameplayTags[g].includes('HasUpgradeQuests')){

                                        //the itm is animated add the animated icon
                                        const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                        ctx.drawImage(skinholder, x, y, 60, 60)

                                        y += 70
                                    }
                                }

                                //if the item contains copyrited audio
                                if(grants[i].copyrightedAudio === true){

                                    //the itm is animated add the animated icon
                                    const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                                    ctx.drawImage(skinholder, x, y, 60, 60)

                                    y += 70
                                }

                                //send the item picture
                                const att = new Discord.MessageAttachment(canvas.toBuffer(), `${grants[i].id}.png`)
                                await message.channel.send(att)

                            } msg.delete()
                        })
                        
                    }else if(details[detailsIndex] === "grants" && res.data.items[num].grants.length === 0 && errorHandleing === 0){

                        //if the item doesn't have any grants
                        const error = new Discord.MessageEmbed()
                        error.setColor(FNBRMENA.Colors(embedColor))
                        if(lang === "en") error.setTitle(`The ${res.data.items[num].name} ${res.data.items[num].type.name} doesn't grants you anything ${errorEmoji}`)
                        else if(lang === "ar") error.setTitle(`${res.data.items[num].type.name} ${res.data.items[num].name} لا يحتوي على اي عناصر اضافية ${errorEmoji}`)
                        message.reply(error)
                    }
                }
            }
        })
    }
}