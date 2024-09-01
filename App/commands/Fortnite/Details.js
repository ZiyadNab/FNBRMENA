const Canvas = require('canvas')

module.exports = {
    commands: 'details',
    type: 'Fortnite',
    descriptionEN: 'Get detailed information about any cosmetic.',
    descriptionAR: 'احصل على معلومات مفصلة عن أي عنصر.',
    expectedArgsEN: 'To use the command you need to specify any item name.',
    expectedArgsAR: 'لاستخدام الأمر ، تحتاج إلى تحديد اسم أي عنصر.',
    hintEN: 'You will get three options:\n• Info: returns all the information of the searched cosmetics like shop history...\n• Styles: Returns all the styles of the searched cosmetics.\n• Grants: Returns what you will get if you have purchased the item.',
    hintAR: 'ستحصل على ثلاثة خيارات: \n • معلومات: إرجاع جميع المعلومات الخاصة بالعنصر الذي تم البحث عنه مثل سجل المتجر ... \n • الأنماط: إرجاع جميع أنماط العنصر الذي تم البحث عنه. \n • المنح: إرجاع ما ستحصل عليه إذا اشتريت العنصر.',
    argsExample: ['Poki', 'Wildcat'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic', weight: "700", style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' , {family: 'Burbank Big Condensed', weight: "700", style: "bold"})

        // Set inizial value
        var SearchType = "name"

        // Iake over the index
        var num = 0

        // If the search type is an id
        if(text.includes("_")) SearchType = "id"

        // Requst data
        FNBRMENA.Search(userData.lang, SearchType, text)
        .then(async res => {

            // Handle cosmetics info data
            const cosmeticInfo = async (num, msg) => {

                // Create info embed
                const infoEmbed = new Discord.EmbedBuilder()
                if(res.data.items[num].series === null) infoEmbed.setColor(FNBRMENA.Colors(res.data.items[num].rarity.id))
                else infoEmbed.setColor(FNBRMENA.Colors(res.data.items[num].series.id))
                infoEmbed.setAuthor({name: `${res.data.items[num].name} | ${res.data.items[num].type.name}`, iconURL: res.data.items[num].images.icon})

                // Rarity id
                if(res.data.items[num].series === null) var rarityID = res.data.items[num].rarity.id
                else var rarityID = res.data.items[num].series.id

                // Rarity name
                if(res.data.items[num].series === null) var rarityName = res.data.items[num].rarity.name
                else var rarityName = res.data.items[num].series.name

                // Set
                if(res.data.items[num].set !== null) var set = `\`${res.data.items[num].set.partOf}\``
                else if(userData.lang === "en") var set = `There is no set for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``
                else if(userData.lang === "ar") var set = `لا يوجد مجموعة \`${res.data.items[num].type.name} ${res.data.items[num].name}\``

                // Introduction
                if(res.data.items[num].introduction !== null) var introduction = `\`${res.data.items[num].introduction.text}\``
                else if(userData.lang === "en") var introduction = `There is no introduction for \`${res.data.items[num].name} ${res.data.items[num].type.name}\` yet`
                else if(userData.lang === "ar") var introduction = `لم يتم تقديم \`${res.data.items[num].type.name} ${res.data.items[num].name}\` بعد`

                // Description
                if(res.data.items[num].description !== "") var description = `\`${res.data.items[num].description}\``
                else if(userData.lang === "en") var description = `There is no description for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``
                else if(userData.lang === "ar") var description = `لا يوجد وصف \`${res.data.items[num].type.name} ${res.data.items[num].name}\``

                // ReleaseDate
                if(res.data.items[num].releaseDate !== null) var releaseDate = `\`${res.data.items[num].releaseDate}\``
                else if(userData.lang === "en") var releaseDate = `\`No dates available\``
                else if(userData.lang === "ar") var releaseDate = `\`لا يوجد تواريخ\``

                // LastAppearance
                if(res.data.items[num].lastAppearance !== null) var lastAppearance = `\`${res.data.items[num].lastAppearance}\``
                else if(userData.lang === "en") var lastAppearance = `\`No dates available\``
                else if(userData.lang === "ar") var lastAppearance = `\`لا يوجد تواريخ\``

                // Reactive
                if(res.data.items[num].reactive){
                    if(userData.lang === "en") var reactive = `\`Yes, it is\``
                    else if(userData.lang === "ar") var reactive = `\`نعم انه كذلك\``
                }else{
                    if(userData.lang === "en") var reactive = `\`No, it is not\``
                    else if(userData.lang === "ar") var reactive = `\`لا انه ليس كذلك\``
                }

                // Copyrightd
                if(res.data.items[num].copyrightedAudio){
                    if(userData.lang === "en") var copyrightedAudio = `\`Yes, it is\``
                    else if(userData.lang === "ar") var copyrightedAudio = `\`نعم انه كذلك\``
                }else{
                    if(userData.lang === "en") var copyrightedAudio = `\`No, it is not\``
                    else if(userData.lang === "ar") var copyrightedAudio = `\`لا انه ليس كذلك\``
                }

                // Upcoming
                if(res.data.items[num].upcoming){
                    if(userData.lang === "en") var upcoming = `\`Yes, it is\``
                    else if(userData.lang === "ar") var upcoming = `\`نعم انه كذلك\``
                }else{
                    if(userData.lang === "en") var upcoming = `\`No, it is not\``
                    else if(userData.lang === "ar") var upcoming = `\`لا انه ليس كذلك\``
                }

                if(userData.lang === "en"){
                    
                    // Add id, name, description, rarity, introduction and added
                    infoEmbed.addFields(
                        {name: "ID", value: `\`${res.data.items[num].id}\``, inline: true},
                        {name: "Name", value: `\`${res.data.items[num].name}\``, inline: true},
                        {name: "Description", value: description, inline: true},
                        {name: "Rarity", value: `ID: \`${rarityID}\`\nName: \`${rarityName}\``, inline: true},
                        {name: "Set", value: set, inline: true},
                        {name: "Introduction", value: introduction, inline: true},
                        {name: "Added", value: `Date: \`${res.data.items[num].added.date}\`\nVersion: \`${res.data.items[num].added.version}\``, inline: true},
                        {name: "Dates", value: `Release Date: ${releaseDate}\nLast Appearance: ${lastAppearance}`, inline: true},
                        {name: "Price", value: `\`${res.data.items[num].price}\``, inline: true},
                        {name: "Reactive", value: `\`${reactive}\``, inline: true},
                        {name: "Copyrightd", value: `\`${copyrightedAudio}\``, inline: true},
                        {name: "Upcoming", value: `\`${upcoming}\``, inline: true},
                    )

                    // If the item is from the battlepass
                    if(res.data.items[num].battlepass !== null) infoEmbed.addFields({name: "Battlepass", value: `\`${res.data.items[num].battlepass.displayText.chapterSeason}\`\nTier: \`${res.data.items[num].battlepass.tier}\`\n\`Type: ${res.data.items[num].battlepass.type}\``, inline: true})

                    // If the item is not from the itemshop
                    else infoEmbed.addFields({name: "Battlepass", value: `The \`${res.data.items[num].name} ${res.data.items[num].type.name}\` is not from the battlepass`, inline: true})

                    // If the item has a shop history
                    if(res.data.items[num].shopHistory !== null) infoEmbed.addFields({name: "Shop History", value: `\`${res.data.items[num].shopHistory.join("\n")}\``, inline: true})

                    // If the item has a shop history but not released yet
                    else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) infoEmbed.addFields({name: "Shop History", value: `the \`${res.data.items[num].name} ${res.data.items[num].type.name}\` has not released yet`, inline: true})

                    // If the item is not from the item shop
                    else infoEmbed.addFields({name: "Shop History", value: `the \`${res.data.items[num].name} ${res.data.items[num].type.name}\` is not an itemshop item`, inline: true})

                    // Add gameplay tags
                    if(res.data.items[num].gameplayTags.length > 0) infoEmbed.addFields({name: "Gameplay Tags", value: `\`${res.data.items[num].gameplayTags.join("\n")}\``, inline: true})
                    else infoEmbed.addFields({name: "Gameplay Tags", value: `There is no GameplayTags for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``, inline: true})
                    
                }else if(userData.lang === "ar"){

                    // Add id, name, description, rarity, introduction and added
                    infoEmbed.addFields(
                        {name: "الأي دي", value: `\`${res.data.items[num].id}\``, inline: true},
                        {name: "الأسم", value: `\`${res.data.items[num].name}\``, inline: true},
                        {name: "الوصف", value: description, inline: true},
                        {name: "الندرة", value: `المعرف:\` ${rarityID}\`\nالأسم: \`${rarityName}\``, inline: true},
                        {name: "المجموعة", value: set, inline: true},
                        {name: "تم تقديمة", value: introduction, inline: true},
                        {name: "تم اضافته", value: `التاريخ: \`${res.data.items[num].added.date}\`\nالتحديث: \`${res.data.items[num].added.version}\``, inline: true},
                        {name: "تواريخ", value: `اول ظهور: ${releaseDate}\nأخر ظهور: ${lastAppearance}`, inline: true},
                        {name: "السعر", value: `\`${res.data.items[num].price}\``, inline: true},
                        {name: "متفاعل", value: `\`${reactive}\``, inline: true},
                        {name: "يحتوي على حقوق الطبع و النشر", value: `\`${copyrightedAudio}\``, inline: true},
                        {name: "عنصر قادم بالمستقبل", value: `\`${upcoming}\``, inline: true},
                    )

                    // If the item is from the battlepass
                    if(res.data.items[num].battlepass !== null) infoEmbed.addFields({name: "باتل باس", value: `\`${res.data.items[num].battlepass.displayText.chapterSeason}\`\n التاير: \`${res.data.items[num].battlepass.tier}\`\nالنوع: \`${res.data.items[num].battlepass.type}\``, inline: true})

                    // If the item is not from the itemshop
                    else infoEmbed.addFields({name: "باتل باس", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` ليس من الباتل باس`, inline: true})

                    // If the item has a shop history
                    if(res.data.items[num].shopHistory !== null) infoEmbed.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].shopHistory.join("\n")}\``, inline: true})

                    // If the item has a shop history but not released yet
                    else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) infoEmbed.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` لم يتم نزوله بعد`, inline: true})

                    // If the item is not from the item shop
                    else infoEmbed.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` ليس عنصر ايتم شوب`, inline: true})

                    // Add gameplay tags
                    if(res.data.items[num].gameplayTags.length > 0) infoEmbed.addFields({name: "العلامات", value: `\`${res.data.items[num].gameplayTags.join("\n")}\``, inline: true})
                    else infoEmbed.addFields({name: "العلامات", value: `لا يوجد علامات لعنصر \`${res.data.items[num].type.name} ${res.data.items[num].name}\``, inline: true})
                    
                    
                }

                infoEmbed.setFooter({text: 'Generated By FNBRMENA Bot'})
                msg.edit({embeds: [infoEmbed], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                })
            }

            // Handle cosmetics styles image
            const cosmeticStyles = async (num, msg) => {

                // Filtering
                var styles = []

                if(res.data.items[num].displayAssets.length > 1){
                    for(let i = 0; i < res.data.items[num].displayAssets.length; i++) styles[i] = {
                        name: res.data.items[num].name,
                        type: res.data.items[num].type,
                        images: {
                            icon: res.data.items[num].displayAssets[i].url
                        },
                        rarity: res.data.items[num].rarity,
                        series: res.data.items[num].series,
                        added: res.data.items[num].added,
                        introduction: res.data.items[num].introduction,
                        gameplayTags: res.data.items[num].gameplayTags,
                        apiTags: res.data.items[num].apiTags,

                    }
                }else{

                    // Check if there is a style in the files
                    const cosmeticvariants = await FNBRMENA.Search(userData.lang, "custom", `&apiTags=cosmeticItem:${res.data.items[num].id}`)

                    // Add the searched item first
                    styles = cosmeticvariants.data.items
                    styles.splice(0, 0, res.data.items[num])

                }

                if(styles.length > 1){

                    // Canvas length
                    var length = styles.length

                    // Variables
                    var width = 0
                    var height = 1024
                    var newline = 0
                    var x = 0
                    var y = 0

                    if(length <= 2) length = length
                    else if(length > 2 && length <= 4) length = length / 2
                    else if(length > 4 && length <= 9) length = length / 3
                    else if(length > 7 && length <= 50) length = length / 5
                    else if(length > 50 && length < 70) length = length / 7
                    else length = length / 10

                    if(length % 2 !== 0 && length != 1){
                        length += 1;
                        length = length | 0
                    }

                    // Creating width
                    width += (length * 1024) + (length * 10) - 10

                    // Creating height
                    for(let i = 0; i < styles.length; i++){
                        
                        if(newline === length){
                            height += 1024 + 10
                            newline = 0
                        }
                        newline++
                    }

                    // Registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                        family: 'Arabic',
                        style: "bold"
                    });
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                        family: 'Burbank Big Condensed',
                        style: "bold"
                    })

                    // AplyText
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > width);
                        return ctx.font;
                    };

                    // Creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    // Background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    // Edit newline
                    newline = 0

                    // Send the generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Getting all ${styles.length} styles for ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل جميع الستايلات الـ ${styles.length} الخاصة بـ ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    msg.edit({embeds: [generating], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })

                    try {

                        // Items
                        for(let i = 0; i < styles.length; i++){
                            ctx.fillStyle = '#ffffff';

                            // Skin informations
                            if(styles[i].introduction != null){
                                var chapter = styles[i].introduction.chapter.substring(styles[i].introduction.chapter.indexOf(" "), styles[i].introduction.chapter.length).trim()

                                if(userData.lang === "en"){
                                    var season = styles[i].introduction.season.substring(styles[i].introduction.season.indexOf(" "), styles[i].introduction.season.length).trim()
                                    if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`

                                }else if(userData.lang == "ar"){
                                    if(styles[i].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                                    else{
                                        var season = styles[i].introduction.season.substring(styles[i].introduction.season.indexOf(" "), styles[i].introduction.season.length).trim()
                                        var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                                    }
                                }

                            }else{

                                if(userData.lang === "en") var seasonChapter = `${styles[i].added.version}v`
                                else if(userData.lang == "ar")var seasonChapter = `تحديث ${styles[i].added.version}`
                                
                            }

                            if(styles[i].gameplayTags.length != 0){
                                for(let j = 0; j < styles[i].gameplayTags.length; j++){
                                    if(styles[i].gameplayTags[j].includes('Source')){

                                        if(styles[i].gameplayTags[j].toLowerCase().includes("itemshop")){

                                            if(userData.lang === "en") var Source = "ITEMSHOP"
                                            else if(userData.lang === "ar") var Source = "متجر العناصر"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                            if(userData.lang === "en") var Source = "SEASON SHOP"
                                            else if(userData.lang === "ar") var Source = "متجر الموسم"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                            if(userData.lang === "en") var Source = "BATTLEPASS"
                                            else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("firstwin")){

                                            if(userData.lang === "en") var Source = "FIRST WIN"
                                            else if(userData.lang === "ar") var Source = "اول انتصار"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("event")){

                                            if(userData.lang === "en") var Source = "EVENT"
                                            else if(userData.lang === "ar") var Source = "حدث"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("platform") || (styles[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                            if(userData.lang === "en") var Source = "EXCLUSIVE"
                                            else if(userData.lang === "ar") var Source = "حصري"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("starterpack")){

                                            if(userData.lang === "en") var Source = "Starter Pack"
                                            else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                                        }

                                        break
                                    }else var Source = styles[i].type.name.toUpperCase()
                                }

                            }else var Source = styles[i].type.name.toUpperCase()

                            var name = styles[i].name;
                            if(styles[i].images.icon === null) var image = 'https://i.ibb.co/XCDwKHh/HVH5sqV.png'
                            else var image = styles[i].images.icon
                            if(styles[i].series === null) var rarity = styles[i].rarity.id
                            else var rarity = styles[i].series.id
                            newline = newline + 1;

                            // Searching...
                            if(rarity === "Legendary"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Epic"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Rare"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Uncommon"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Common"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "MarvelSeries"){
                                
                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "DCUSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CUBESeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CreatorCollabSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ColumbusSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ShadowSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "SlurpSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "FrozenSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "LavaSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "PlatformSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else{

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }

                            // Add the item name
                            ctx.textAlign = 'center';
                            ctx.font = applyText(canvas, name, 900, 72)

                            if(userData.lang === "en"){
                                ctx.fillText(name, 512 + x, (1024 - 30) + y)

                                // Add the item season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                                // Add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                            }else if(userData.lang === "ar"){
                                ctx.fillText(name, 512 + x, (1024 - 60) + y)

                                // Add season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                                // Add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 12.5) + y)

                            }

                            // Inilizing tags
                            var wTags = (1024 / 512) * 15
                            var hTags = (1024 / 512) * 15
                            var yTags = 7 + y
                            var xTags = ((1024 - wTags) - 7) + x

                            for(let t = 0; t < styles[i].gameplayTags.length; t++){

                                // If the item is animated
                                if(styles[i].gameplayTags[t].includes('Animated')){

                                    // Add the animated icon
                                    const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                    ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                // If the item is reactive
                                if(styles[i].gameplayTags[t].includes('Reactive')){

                                    // Add the reactive icon
                                    const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                    ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                // If the item is synced emote
                                if(styles[i].gameplayTags[t].includes('Synced')){

                                    // Add the Synced icon
                                    const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                    ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                // If the item is traversal
                                if(styles[i].gameplayTags[t].includes('Traversal')){

                                    // Add the Traversal icon
                                    const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                    ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                // If the item has styles
                                if(styles[i].gameplayTags[t].includes('HasVariants') || styles[i].gameplayTags[t].includes('HasUpgradeQuests')){

                                    // Add the HasVariants icon
                                    const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                    ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }
                            }

                            // If the item contains copyrited audio
                            if(styles[i].copyrightedAudio){

                                // Add the copyrightedAudio icon
                                const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                                ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            // If the item contains built in emote
                            if(styles[i].builtInEmote != null){

                                // Add the builtInEmote icon
                                const builtInEmote = await Canvas.loadImage(styles[i].builtInEmote.images.icon)
                                ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                            }

                            // Changing x and y
                            x = x + 10 + 1024; 
                            if(length === newline){
                                y = y + 10 + 1024;
                                x = 0;
                                newline = 0;
                            }
                        }

                        // Send the image
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                        msg.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {

                            // Try sending it on jpg file format [LOWER QUALITY]
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[num].id}.jpg`})
                            msg.edit({embeds: [], components: [], files: [att]})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                            })
                        })

                    } catch(err) {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    }

                }else{

                    // Send an error
                    const noStylesHasBeenFound = new Discord.EmbedBuilder()
                    noStylesHasBeenFound.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noStylesHasBeenFound.setTitle(`No styles has been found for ${res.data.items[num].name} ${res.data.items[num].type.name} ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noStylesHasBeenFound.setTitle(`لا يمكنني العثور على ازياء ${res.data.items[num].type.name} ${res.data.items[num].name} ${emojisObject.errorEmoji}`)
                    msg.edit({embeds: [noStylesHasBeenFound], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }
            }

            // Handle cosmetics styles image
            const cosmeticGrants = async (num, msg) => {

                // Canvas length
                var length = res.data.items[num].grants.length
                if(length != 0){

                    // Filtering
                    var grants = []
                    
                    // Add the searched item first
                    grants[0] = res.data.items[num]

                    //get the styles if there is any
                    var Counter = 1
                    for(let i = 0; i < res.data.items[num].grants.length; i++){
                        await FNBRMENA.Search(userData.lang, "id", res.data.items[num].grants[i].id)
                        .then(async grantedItemData => {
                            grants[Counter++] = await grantedItemData.data.items[0]

                        })
                    }

                    // Variables
                    var width = 0
                    var height = 1024
                    var newline = 0
                    var x = 0
                    var y = 0

                    if(length <= 2) length = length
                    else if(length > 2 && length <= 4) length = length / 2
                    else if(length > 4 && length <= 9) length = length / 3
                    else if(length > 7 && length <= 50) length = length / 5
                    else if(length > 50 && length < 70) length = length / 7
                    else length = length / 10

                    if(length % 2 !== 0){
                        length += 1;
                        length = length | 0
                    }

                    // Creating width
                    width += (length * 1024) + (length * 10) - 10

                    // Creating height
                    for(let i = 0; i < grants.length; i++){
                        
                        if(newline === length){
                            height += 1024 + 10
                            newline = 0
                        }
                        newline++
                    }

                    // Registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                        family: 'Arabic',
                        style: "bold"
                    });
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                        family: 'Burbank Big Condensed',
                        style: "bold"
                    })

                    // AplyText
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > width);
                        return ctx.font;
                    };

                    // Creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    // Background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    // Res.data.historyet newline
                    newline = 0

                    // Send the generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Getting all ${grants.length} grants for ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل جميع المرفقات الـ ${grants.length} الخاصة بـ ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    msg.edit({embeds: [generating], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })

                    try {

                        // Items
                        for(let i = 0; i < grants.length; i++){
                            ctx.fillStyle = '#ffffff';

                            // Skin informations
                            if(grants[i].introduction != null){
                                var chapter = grants[i].introduction.chapter.substring(grants[i].introduction.chapter.indexOf(" "), grants[i].introduction.chapter.length).trim()

                            if(userData.lang === "en"){
                                var season = grants[i].introduction.season.substring(grants[i].introduction.season.indexOf(" "), grants[i].introduction.season.length).trim()
                                if(userData.lang === "en") var seasonChapter = `C${chapter}S${season}`

                            }else if(userData.lang == "ar"){
                                if(grants[i].introduction.season.includes("X")) var seasonChapter = `الفصل ${chapter} الموسم X`
                                else{
                                    var season = grants[i].introduction.season.substring(grants[i].introduction.season.indexOf(" "), grants[i].introduction.season.length).trim()
                                    var seasonChapter = `الفصل ${chapter} الموسم ${season}`
                                }
                            }

                            }else{

                                if(userData.lang === "en") var seasonChapter = `${grants[i].added.version}v`
                                else if(userData.lang == "ar")var seasonChapter = `تحديث ${grants[i].added.version}`
                                
                            }

                            if(grants[i].gameplayTags.length != 0){
                                for(let j = 0; j < grants[i].gameplayTags.length; j++){
                                    if(grants[i].gameplayTags[j].includes('Source')){

                                        if(grants[i].gameplayTags[j].toLowerCase().includes("itemshop")){

                                            if(userData.lang === "en") var Source = "ITEMSHOP"
                                            else if(userData.lang === "ar") var Source = "متجر العناصر"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("seasonshop")){

                                            if(userData.lang === "en") var Source = "SEASON SHOP"
                                            else if(userData.lang === "ar") var Source = "متجر الموسم"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("battlepass")){

                                            if(userData.lang === "en") var Source = "BATTLEPASS"
                                            else if(userData.lang === "ar") var Source = "بطاقة المعركة"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("firstwin")){

                                            if(userData.lang === "en") var Source = "FIRST WIN"
                                            else if(userData.lang === "ar") var Source = "اول انتصار"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("event")){

                                            if(userData.lang === "en") var Source = "EVENT"
                                            else if(userData.lang === "ar") var Source = "حدث"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("platform") || (grants[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                            if(userData.lang === "en") var Source = "EXCLUSIVE"
                                            else if(userData.lang === "ar") var Source = "حصري"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("starterpack")){

                                            if(userData.lang === "en") var Source = "Starter Pack"
                                            else if(userData.lang === "ar") var Source = "حزمة المبتدئين"
                                        }

                                        break
                                    }else var Source = grants[i].type.name.toUpperCase()
                                }

                            }else var Source = grants[i].type.name.toUpperCase()

                            var name = grants[i].name;
                            if(grants[i].images.icon === null) var image = 'https://i.ibb.co/XCDwKHh/HVH5sqV.png'
                            else var image = grants[i].images.icon
                            if(grants[i].series === null) var rarity = grants[i].rarity.id
                            else var rarity = grants[i].series.id
                            newline = newline + 1;

                            // Searching...
                            if(rarity === "Legendary"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Epic"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Rare"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Uncommon"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Common"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "MarvelSeries"){
                                
                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "DCUSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CUBESeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CreatorCollabSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ColumbusSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ShadowSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "SlurpSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "FrozenSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "LavaSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "PlatformSeries"){

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else{

                                // Creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }

                            // Add the item name
                            ctx.textAlign = 'center';
                            ctx.font = applyText(canvas, name, 900, 72)

                            if(userData.lang === "en"){
                                ctx.fillText(name, 512 + x, (1024 - 30) + y)

                                // Add the item season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                                // Add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                            }else if(userData.lang === "ar"){
                                ctx.fillText(name, 512 + x, (1024 - 60) + y)

                                // Add season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                                // Add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 12.5) + y)

                            }

                            // Inilizing tags
                            var wTags = (1024 / 512) * 15
                            var hTags = (1024 / 512) * 15
                            var yTags = 7 + y
                            var xTags = ((1024 - wTags) - 7) + x

                            for(let t = 0; t < grants[i].gameplayTags.length; t++){

                                // If the item is animated
                                if(grants[i].gameplayTags[t].includes('Animated')){

                                    // Add the animated icon
                                    const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                    ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                // If the item is reactive
                                if(grants[i].gameplayTags[t].includes('Reactive')){

                                    // Add the reactive icon
                                    const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                    ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                // If the item is synced emote
                                if(grants[i].gameplayTags[t].includes('Synced')){

                                    // Add the Synced icon
                                    const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                    ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                // If the item is traversal
                                if(grants[i].gameplayTags[t].includes('Traversal')){

                                    // Add the Traversal icon
                                    const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                    ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                // If the item has styles
                                if(grants[i].gameplayTags[t].includes('HasVariants') || grants[i].gameplayTags[t].includes('HasUpgradeQuests')){

                                    // Add the HasVariants icon
                                    const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                    ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }
                            }

                            // If the item contains copyrited audio
                            if(grants[i].copyrightedAudio){

                                // Add the copyrightedAudio icon
                                const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                                ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            // If the item contains built in emote
                            if(grants[i].builtInEmote != null){

                                // Add the builtInEmote icon
                                const builtInEmote = await Canvas.loadImage(grants[i].builtInEmote.images.icon)
                                ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                            }

                            // Changing x and y
                            x = x + 10 + 1024; 
                            if(length === newline){
                                y = y + 10 + 1024;
                                x = 0;
                                newline = 0;
                            }
                        }

                        // Send the image
                        var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                        msg.edit({embeds: [], components: [], files: [att]})
                        .catch(err => {

                            // Try sending it on jpg file format [LOWER QUALITY]
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[num].id}.jpg`})
                            msg.edit({embeds: [], components: [], files: [att]})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                            })
                        })

                    }catch(err) {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    }

                }else{

                    // If the item doesn't have any grants
                    const noGrantsHasBeenFound = new Discord.EmbedBuilder()
                    noGrantsHasBeenFound.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noGrantsHasBeenFound.setTitle(`The ${res.data.items[num].name} ${res.data.items[num].type.name} doesn't grants you anything ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noGrantsHasBeenFound.setTitle(`${res.data.items[num].type.name} ${res.data.items[num].name} لا يحتوي على اي عناصر اضافية ${emojisObject.errorEmoji}`)
                    msg.edit({embeds: [noGrantsHasBeenFound], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }
            }

            // If the result is more than one item
            if(res.data.items.length > 1){

                // Create embed
                const list = new Discord.EmbedBuilder()
                list.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") list.setTitle(`Please choose your item from the list below`)
                else if(userData.lang === "ar") list.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

                // Loop throw every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.items.length; i++) string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                list.setDescription(string)

                // How many items where matchinh the user input?
                if(userData.lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                else if(userData.lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                // Filtering outfits
                const filter = async m => await m.author.id === message.author.id

                // Add the reply
                if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                else if(userData.lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                const notify = await message.reply({content: reply, embeds: [list]})
                .catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                // Listen for user input
                const collected = await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, { message: "Time" }, emojisObject, notify)
                })

                // Check for collected messages
                if(!collected) return

                // Delete messages
                notify.delete()

                // If the user chosen inside range
                if(collected.first().content >= 0 && collected.first().content < res.data.items.length) num = collected.first().content
                else return FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, { message: "outOfRange" }, emojisObject, null)
            }

            // If there is no item found
            if(res.data.items.length === 0){

                // If user typed a number out of range
                const noCosmeticsFoundError = new Discord.EmbedBuilder()
                noCosmeticsFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noCosmeticsFoundError.setTitle(`No cosmetic has been found check your speling and try again ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noCosmeticsFoundError.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
                return message.reply({embeds: [noCosmeticsFoundError], components: [], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })
            }

            // If everything is correct
            if(res.data.items.length > 0){

                // Create an embed
                const dropDownMenuEmbed = new Discord.EmbedBuilder()
                if(userData.lang === "en") dropDownMenuEmbed.setDescription('Please click on the Drop-Down menu and choose a category.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                else if(userData.lang === "ar") dropDownMenuEmbed.setDescription('الرجاء الضغط على السهم لاختيار فئة.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')

                //get the item rarity
                if(res.data.items[num].series === null) dropDownMenuEmbed.setColor(FNBRMENA.Colors(res.data.items[num].rarity.id))
                else dropDownMenuEmbed.setColor(FNBRMENA.Colors(res.data.items[num].series.id))
                dropDownMenuEmbed.setAuthor({name: `${res.data.items[num].name} | ${res.data.items[num].type.name}`, iconURL: res.data.items[num].images.icon})

                // Create a row for Cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()

                // Create the cancel button
                const cancelButton = new Discord.ButtonBuilder()
                cancelButton.setCustomId('Cancel')
                cancelButton.setStyle(Discord.ButtonStyle.Danger)
                if(userData.lang === "en") cancelButton.setLabel("Cancel")
                else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
                
                // Add the cancel button to the buttonDataRow
                buttonDataRow.addComponents(cancelButton)

                // Create a row for drop down menu for categories
                const categoriesRow = new Discord.ActionRowBuilder()

                const categoryDropMenu = new Discord.StringSelectMenuBuilder()
                categoryDropMenu.setCustomId('categories')
                if(userData.lang === "en") categoryDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") categoryDropMenu.setPlaceholder('الرجاء الأختيار!')
                if(userData.lang === "en") categoryDropMenu.addOptions(
                    {
                        label: `${res.data.items[num].name}'s Information`,
                        value: `info`,
                        emoji: `${emojisObject.info.name}:${emojisObject.info.id}`
                    },
                    {
                        label: `${res.data.items[num].name}'s Styles`,
                        value: `styles`,
                        emoji: `${emojisObject.style.name}:${emojisObject.style.id}`
                    },
                    {
                        label: `${res.data.items[num].name}'s Grants`,
                        value: `grants`,
                        emoji: `${emojisObject.grant.name}:${emojisObject.grant.id}`
                    }
                )
                else if(userData.lang === "ar") categoryDropMenu.addOptions(
                    {
                        label: `معلومات ${res.data.items[num].type.name} ${res.data.items[num].name}`,
                        value: `info`,
                        emoji: `${emojisObject.info.name}:${emojisObject.info.id}`
                    },
                    {
                        label: `ازياء ${res.data.items[num].type.name} ${res.data.items[num].name}`,
                        value: `styles`,
                        emoji: `${emojisObject.style.name}:${emojisObject.style.id}`
                    },
                    {
                        label: `مرفقات ${res.data.items[num].type.name} ${res.data.items[num].name}`,
                        value: `grants`,
                        emoji: `${emojisObject.grant.name}:${emojisObject.grant.id}`
                    }
                )

                // Add the drop menu to the categoryDropMenu
                categoriesRow.addComponents(categoryDropMenu)

                // Send the message
                const dropMenuMessage = await message.reply({embeds: [dropDownMenuEmbed], components: [categoriesRow, buttonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                // Filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                })

                // Await the user click
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate()

                    // If cancel button has been clicked
                    if(collected.customId === "Cancel") dropMenuMessage.delete()
                    
                    if(collected.customId === "categories"){
                        
                        // If the user clicked of info
                        if(collected.values[0] == "info") cosmeticInfo(num, dropMenuMessage)

                        // If the user clicked on styles
                        if(collected.values[0] == "styles") cosmeticStyles(num, dropMenuMessage)

                        // If the user clicked on grants
                        if(collected.values[0] == "grants") cosmeticGrants(num, dropMenuMessage)
                    }

                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}
