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
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic', weight: "700", style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' , {family: 'Burbank Big Condensed', weight: "700", style: "bold"})

        //set inizial value
        var SearchType = "name"

        //take over the index
        var num = 0

        //handeling errors
        var errorHandleing = 0

        //if the search type is an id
        if(text.includes("_")) SearchType = "id"

        //requst data
        FNBRMENA.Search(userData.lang, SearchType, text)
        .then(async res => {

            //handle cosmetics info data
            const cosmeticInfo = async (num) => {

                //create info embed
                const infoEmbed = new Discord.EmbedBuilder()
                if(res.data.items[num].series === null) infoEmbed.setColor(FNBRMENA.Colors(res.data.items[num].rarity.id))
                else infoEmbed.setColor(FNBRMENA.Colors(res.data.items[num].series.id))
                infoEmbed.setAuthor({name: `${res.data.items[num].name} | ${res.data.items[num].type.name}`, iconURL: res.data.items[num].images.icon})

                //rarity id
                if(res.data.items[num].series === null) var rarityID = res.data.items[num].rarity.id
                else var rarityID = res.data.items[num].series.id

                //rarity name
                if(res.data.items[num].series === null) var rarityName = res.data.items[num].rarity.name
                else var rarityName = res.data.items[num].series.name

                //set
                if(res.data.items[num].set !== null) var set = `\`${res.data.items[num].set.partOf}\``
                else if(userData.lang === "en") var set = `There is no set for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``
                else if(userData.lang === "ar") var set = `لا يوجد مجموعة \`${res.data.items[num].type.name} ${res.data.items[num].name}\``

                //Introduction
                if(res.data.items[num].introduction !== null) var introduction = `\`${res.data.items[num].introduction.text}\``
                else if(userData.lang === "en") var introduction = `There is no introduction for \`${res.data.items[num].name} ${res.data.items[num].type.name}\` yet`
                else if(userData.lang === "ar") var introduction = `لم يتم تقديم \`${res.data.items[num].type.name} ${res.data.items[num].name}\` بعد`

                //Description
                if(res.data.items[num].description !== "") var description = `\`${res.data.items[num].description}\``
                else if(userData.lang === "en") var description = `There is no description for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``
                else if(userData.lang === "ar") var description = `لا يوجد وصف \`${res.data.items[num].type.name} ${res.data.items[num].name}\``

                //releaseDate
                if(res.data.items[num].releaseDate !== null) var releaseDate = `\`${res.data.items[num].releaseDate}\``
                else if(userData.lang === "en") var releaseDate = `\`No dates available\``
                else if(userData.lang === "ar") var releaseDate = `\`لا يوجد تواريخ\``

                //lastAppearance
                if(res.data.items[num].lastAppearance !== null) var lastAppearance = `\`${res.data.items[num].lastAppearance}\``
                else if(userData.lang === "en") var lastAppearance = `\`No dates available\``
                else if(userData.lang === "ar") var lastAppearance = `\`لا يوجد تواريخ\``

                //Reactive
                if(res.data.items[num].reactive){
                    if(userData.lang === "en") var reactive = `\`Yss, it is\``
                    else if(userData.lang === "ar") var reactive = `\`نعم انه كذلك\``
                }else{
                    if(userData.lang === "en") var reactive = `\`No, it is not\``
                    else if(userData.lang === "ar") var reactive = `\`لا انه ليس كذلك\``
                }

                //Copyrightd
                if(res.data.items[num].copyrightedAudio){
                    if(userData.lang === "en") var copyrightedAudio = `\`Yss, it is\``
                    else if(userData.lang === "ar") var copyrightedAudio = `\`نعم انه كذلك\``
                }else{
                    if(userData.lang === "en") var copyrightedAudio = `\`No, it is not\``
                    else if(userData.lang === "ar") var copyrightedAudio = `\`لا انه ليس كذلك\``
                }

                //Upcoming
                if(res.data.items[num].upcoming){
                    if(userData.lang === "en") var upcoming = `\`Yss, it is\``
                    else if(userData.lang === "ar") var upcoming = `\`نعم انه كذلك\``
                }else{
                    if(userData.lang === "en") var upcoming = `\`No, it is not\``
                    else if(userData.lang === "ar") var upcoming = `\`لا انه ليس كذلك\``
                }

                if(userData.lang === "en"){
                    
                    //add id, name, description, rarity, introduction and added
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

                    //if the item is from the battlepass
                    if(res.data.items[num].battlepass !== null) infoEmbed.addFields({name: "Battlepass", value: `\`${res.data.items[num].battlepass.displayText.chapterSeason}\`\nTier: \`${res.data.items[num].battlepass.tier}\`\n\`Type: ${res.data.items[num].battlepass.type}\``, inline: true})

                    //if the item is not from the itemshop
                    else infoEmbed.addFields({name: "Battlepass", value: `The \`${res.data.items[num].name} ${res.data.items[num].type.name}\` is not from the battlepass`, inline: true})

                    //add styles
                    if(res.data.items[num].styles.length > 0 && res.data.items[num].styles.length <= 25){
                        for(let i = 0; i < res.data.items[num].styles.length; i++){

                            //is style default
                            if(res.data.items[num].styles[i].isDefault) var isDefault = `Yes, it is default`
                            else var isDefault = `No, it is not default`

                            //is hideIfNotOwned
                            if(res.data.items[num].styles[i].hideIfNotOwned) var hideIfNotOwned = `Yes, it is hidden if you don't own the style`
                            else var hideIfNotOwned = `No, it is not hidden`

                            infoEmbed.addFields(
                                {name: `Style ${i + 1}`, value: `Name: \`${res.data.items[num].styles[i].name}\`\nisDefault: \`${isDefault}\`\nhideIfNotOwned: \`${hideIfNotOwned}\``}
                            )
                        }
                    }else infoEmbed.addFields({name:`Styles`, value: `\`No styles for ${res.data.items[num].name}\``})

                    //if the item has a shop history
                    if(res.data.items[num].shopHistory !== null) infoEmbed.addFields({name: "Shop History", value: `\`${res.data.items[num].shopHistory.join("\n")}\``, inline: true})

                    //if the item has a shop history but not released yet
                    else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) infoEmbed.addFields({name: "Shop History", value: `the \`${res.data.items[num].name} ${res.data.items[num].type.name}\` has not released yet`, inline: true})

                    //if the item is not from the item shop
                    else infoEmbed.addFields({name: "Shop History", value: `the \`${res.data.items[num].name} ${res.data.items[num].type.name}\` is not an itemshop item`, inline: true})

                    //add gameplay tags
                    if(res.data.items[num].gameplayTags.length > 0) infoEmbed.addFields({name: "Gameplay Tags", value: `\`${res.data.items[num].gameplayTags.join("\n")}\``, inline: true})
                    else infoEmbed.addFields({name: "Gameplay Tags", value: `There is no GameplayTags for \`${res.data.items[num].name} ${res.data.items[num].type.name}\``, inline: true})
                    
                }else if(userData.lang === "ar"){

                    //add id, name, description, rarity, introduction and added
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

                    //if the item is from the battlepass
                    if(res.data.items[num].battlepass !== null) infoEmbed.addFields({name: "باتل باس", value: `\`${res.data.items[num].battlepass.displayText.chapterSeason}\`\n التاير: \`${res.data.items[num].battlepass.tier}\`\nالنوع: \`${res.data.items[num].battlepass.type}\``, inline: true})

                    //if the item is not from the itemshop
                    else infoEmbed.addFields({name: "باتل باس", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` ليس من الباتل باس`, inline: true})

                    //add styles
                    if(res.data.items[num].styles.length > 0 && res.data.items[num].styles.length <= 25){
                        for(let i = 0; i < res.data.items[num].styles.length; i++){

                            //is style default
                            if(res.data.items[num].styles[i].isDefault) var isDefault = `نعم الستايل أساسي`
                            else var isDefault = `لا الستايل ليس أساسي`

                            //is hideIfNotOwned
                            if(res.data.items[num].styles[i].hideIfNotOwned) var hideIfNotOwned = `نعم اذا ما تملك الستايل ماراح تقدر تستعملة`
                            else var hideIfNotOwned = `لا الستايل ليس مخفي`

                            infoEmbed.addFields(
                                {name: `الستايل رقم ${i + 1}`, value: `الأسم: \`${res.data.items[num].styles[i].name}\`\nهل الستايل أساسي: \`${isDefault}\`\nمخفي اذا ما تملك الستايل: \`${hideIfNotOwned}\``}
                            )
                        }
                    }else infoEmbed.addFields({name:`الستايلات`, value: `\`لا يوجد ستايلات لـ ${res.data.items[num].name}\``})

                    //if the item has a shop history
                    if(res.data.items[num].shopHistory !== null) infoEmbed.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].shopHistory.join("\n")}\``, inline: true})

                    //if the item has a shop history but not released yet
                    else if(res.data.items[num].gameplayTags.includes("Cosmetics.Source.ItemShop")) infoEmbed.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` لم يتم نزوله بعد`, inline: true})

                    //if the item is not from the item shop
                    else infoEmbed.addFields({name: "تاريخ الشوب", value: `\`${res.data.items[num].type.name} ${res.data.items[num].name}\` ليس عنصر ايتم شوب`, inline: true})

                    //add gameplay tags
                    if(res.data.items[num].gameplayTags.length > 0) infoEmbed.addFields({name: "العلامات", value: `\`${res.data.items[num].gameplayTags.join("\n")}\``, inline: true})
                    else infoEmbed.addFields({name: "العلامات", value: `لا يوجد علامات لعنصر \`${res.data.items[num].type.name} ${res.data.items[num].name}\``, inline: true})
                    
                    
                }

                infoEmbed.setFooter({text: 'Generated By FNBRMENA Bot'})
                message.reply({embeds: [infoEmbed]})
            }

            //handle cosmetics styles image
            const cosmeticStyles = async (num) => {

                //check if there is a style in the files
                const cosmeticvariants = await FNBRMENA.List(userData.lang, "cosmeticvariant")

                //filtering
                var styles = []

                if(res.data.items[num].displayAssets.length > 1){
                    for(let i = 0; i < res.data.items[num].displayAssets.length; i++) styles[i] ={
                        name: res.data.items[num].name,
                        type: res.data.items[num].type,
                        images: {
                            icon: res.data.items[num].displayAssets[i].url
                        },
                        rarity: res.data.items[num].rarity,
                        series: res.data.items[num].series,
                        introduction: res.data.items[num].introduction,
                        gameplayTags: res.data.items[num].gameplayTags,
                        apiTags: res.data.items[num].apiTags,

                    }
                }else{

                    //add the searched item first
                    styles[0] = res.data.items[num]

                    //get the styles if there is any
                    var Counter = 1
                    for(let i = 0; i < cosmeticvariants.data.items.length; i++){
                        if(await cosmeticvariants.data.items[i].description.trim().includes(res.data.items[num].name.trim()) &&
                        cosmeticvariants.data.items[i].rarity.id === res.data.items[num].rarity.id) styles[Counter++] = await cosmeticvariants.data.items[i]
                        
                    }
                }

                if(styles.length > 1){

                    //canvas length
                    var length = styles.length

                    //variables
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

                    //creating width
                    width += (length * 1024) + (length * 10) - 10

                    //creating height
                    for(let i = 0; i < styles.length; i++){
                        
                        if(newline === length){
                            height += 1024 + 10
                            newline = 0
                        }
                        newline++
                    }

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                        family: 'Arabic',
                        style: "bold"
                    });
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                        family: 'Burbank Big Condensed',
                        style: "bold"
                    })

                    //aplyText
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > width);
                        return ctx.font;
                    };

                    //creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //res.data.historyet newline
                    newline = 0

                    //send the generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Getting all ${styles.length} styles for ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل جميع الستايلات الـ ${styles.length} الخاصة بـ ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    message.reply({embeds: [generating]})
                    .then( async msg => {

                        //items
                        for(let i = 0; i < styles.length; i++){
                            ctx.fillStyle = '#ffffff';

                            //skin informations
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
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("event")){

                                            if(userData.lang === "en") var Source = "EVENT"
                                            else if(userData.lang === "ar") var Source = "حدث"
                                        }else if(styles[i].gameplayTags[j].toLowerCase().includes("platform") || (styles[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                            if(userData.lang === "en") var Source = "EXCLUSIVE"
                                            else if(userData.lang === "ar") var Source = "حصري"
                                        }

                                        break
                                    }else var Source = styles[i].type.name.toUpperCase()
                                }

                            }else var Source = styles[i].type.name.toUpperCase()

                            var name = styles[i].name;
                            var image = styles[i].images.icon
                            if(styles[i].series === null) var rarity = styles[i].rarity.id
                            else var rarity = styles[i].series.id
                            newline = newline + 1;

                            //searching...
                            if(rarity === "Legendary"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Epic"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Rare"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Uncommon"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Common"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "MarvelSeries"){
                                
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "DCUSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CUBESeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CreatorCollabSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ColumbusSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ShadowSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "SlurpSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "FrozenSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "LavaSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "PlatformSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else{

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }

                            //add the item name
                            ctx.textAlign = 'center';
                            ctx.font = applyText(canvas, name, 900, 72)

                            if(userData.lang === "en"){
                                ctx.fillText(name, 512 + x, (1024 - 30) + y)

                                //add the item season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                                //add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                            }else if(userData.lang === "ar"){
                                ctx.fillText(name, 512 + x, (1024 - 60) + y)

                                //add season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                                //add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 12.5) + y)

                            }

                            //inilizing tags
                            var wTags = (1024 / 512) * 15
                            var hTags = (1024 / 512) * 15
                            var yTags = 7 + y
                            var xTags = ((1024 - wTags) - 7) + x

                            for(let t = 0; t < styles[i].gameplayTags.length; t++){

                                //if the item is animated
                                if(styles[i].gameplayTags[t].includes('Animated')){

                                    //add the animated icon
                                    const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                    ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item is reactive
                                if(styles[i].gameplayTags[t].includes('Reactive')){

                                    //add the reactive icon
                                    const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                    ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                //if the item is synced emote
                                if(styles[i].gameplayTags[t].includes('Synced')){

                                    //add the Synced icon
                                    const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                    ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                //if the item is traversal
                                if(styles[i].gameplayTags[t].includes('Traversal')){

                                    //add the Traversal icon
                                    const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                    ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item has styles
                                if(styles[i].gameplayTags[t].includes('HasVariants') || styles[i].gameplayTags[t].includes('HasUpgradeQuests')){

                                    //add the HasVariants icon
                                    const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                    ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }
                            }

                            //if the item contains copyrited audio
                            if(styles[i].copyrightedAudio){

                                //add the copyrightedAudio icon
                                const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                                ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item contains built in emote
                            if(styles[i].builtInEmote != null){

                                //add the builtInEmote icon
                                const builtInEmote = await Canvas.loadImage(styles[i].builtInEmote.images.icon)
                                ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                            }

                            //changing x and y
                            x = x + 10 + 1024; 
                            if(length === newline){
                                y = y + 10 + 1024;
                                x = 0;
                                newline = 0;
                            }
                        }

                        //send embed
                        try{
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                            await message.reply({files: [att]})
                            msg.delete()
                            
                        }catch{
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[num].id}.jpg`})
                            await message.reply({files: [att]})
                            msg.delete()
                        }

                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })

                }else{

                    //send an error
                    const noStylesHasBeenFound = new Discord.EmbedBuilder()
                    noStylesHasBeenFound.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noStylesHasBeenFound.setTitle(`No styles has been found for ${res.data.items[num].name} ${res.data.items[num].type.name} ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noStylesHasBeenFound.setTitle(`لا يمكنني العثور على ازياء ${res.data.items[num].type.name} ${res.data.items[num].name} ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noStylesHasBeenFound]})
                }
            }

            //handle cosmetics styles image
            const cosmeticGrants = async (num) => {

                //canvas length
                var length = res.data.items[num].grants.length
                if(length != 0){

                    //filtering
                    var grants = []
                    
                    //add the searched item first
                    grants[0] = res.data.items[num]

                    //get the styles if there is any
                    var Counter = 1
                    for(let i = 0; i < res.data.items[num].grants.length; i++){
                        await FNBRMENA.Search(userData.lang, "id", res.data.items[num].grants[i].id)
                        .then(async grantedItemData => {
                            grants[Counter++] = await grantedItemData.data.items[0]

                        })
                    }

                    //variables
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

                    //creating width
                    width += (length * 1024) + (length * 10) - 10

                    //creating height
                    for(let i = 0; i < grants.length; i++){
                        
                        if(newline === length){
                            height += 1024 + 10
                            newline = 0
                        }
                        newline++
                    }

                    //registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
                        family: 'Arabic',
                        style: "bold"
                    });
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
                        family: 'Burbank Big Condensed',
                        style: "bold"
                    })

                    //aplyText
                    const applyText = (canvas, text, width, font) => {
                        const ctx = canvas.getContext('2d');
                        let fontSize = font;
                        do {
                            if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                            else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
                        } while (ctx.measureText(text).width > width);
                        return ctx.font;
                    };

                    //creating canvas
                    const canvas = Canvas.createCanvas(width, height);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //res.data.historyet newline
                    newline = 0

                    //send the generating message
                    const generating = new Discord.EmbedBuilder()
                    generating.setColor(FNBRMENA.Colors("embed"))
                    if(userData.lang === "en") generating.setTitle(`Getting all ${grants.length} grants for ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    else if(userData.lang === "ar") generating.setTitle(`جاري تحميل جميع المرفقات الـ ${grants.length} الخاصة بـ ${res.data.items[num].name} ${emojisObject.loadingEmoji}`)
                    message.reply({embeds: [generating]})
                    .then( async msg => {

                        //items
                        for(let i = 0; i < grants.length; i++){
                            ctx.fillStyle = '#ffffff';

                            //skin informations
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
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("event")){

                                            if(userData.lang === "en") var Source = "EVENT"
                                            else if(userData.lang === "ar") var Source = "حدث"
                                        }else if(grants[i].gameplayTags[j].toLowerCase().includes("platform") || (grants[i].gameplayTags[j].toLowerCase().includes("promo"))){

                                            if(userData.lang === "en") var Source = "EXCLUSIVE"
                                            else if(userData.lang === "ar") var Source = "حصري"
                                        }

                                        break
                                    }else var Source = grants[i].type.name.toUpperCase()
                                }

                            }else var Source = grants[i].type.name.toUpperCase()

                            var name = grants[i].name;
                            var image = grants[i].images.icon
                            if(grants[i].series === null) var rarity = grants[i].rarity.id
                            else var rarity = grants[i].series.id
                            newline = newline + 1;

                            //searching...
                            if(rarity === "Legendary"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/legendary.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLegendary.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Epic"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/epic.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderEpic.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Rare"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/rare.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderRare.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Uncommon"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/uncommon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderUncommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "Common"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "MarvelSeries"){
                                
                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/marvel.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderMarvel.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "DCUSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dc.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDc.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CUBESeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/dark.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderDark.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "CreatorCollabSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/icon.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderIcon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ColumbusSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/starwars.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderStarwars.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "ShadowSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/shadow.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderShadow.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "SlurpSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/slurp.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderSlurp.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "FrozenSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/frozen.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderFrozen.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "LavaSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/lava.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderLava.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else if(rarity === "PlatformSeries"){

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/gaming.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderGaming.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }else{

                                //creating image
                                const skinholder = await Canvas.loadImage('./assets/Rarities/newStyle/common.png')
                                ctx.drawImage(skinholder, x, y, 1024, 1024)
                                const skin = await Canvas.loadImage(image);
                                ctx.drawImage(skin, x, y, 1024, 1024)
                                const skinborder = await Canvas.loadImage('./assets/Rarities/newStyle/borderCommon.png')
                                ctx.drawImage(skinborder, x, y, 1024, 1024)

                            }

                            //add the item name
                            ctx.textAlign = 'center';
                            ctx.font = applyText(canvas, name, 900, 72)

                            if(userData.lang === "en"){
                                ctx.fillText(name, 512 + x, (1024 - 30) + y)

                                //add the item season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 7.5) + y)

                                //add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 7.5) + y)

                            }else if(userData.lang === "ar"){
                                ctx.fillText(name, 512 + x, (1024 - 60) + y)

                                //add season chapter text
                                ctx.textAlign = "left"
                                ctx.font = applyText(canvas, seasonChapter, 900, 40)
                                ctx.fillText(seasonChapter, 5 + x, (1024 - 12.5) + y)

                                //add the item source
                                ctx.textAlign = "right"
                                ctx.font = applyText(canvas, Source, 900, 40)
                                ctx.fillText(Source, (1024 - 5) + x, (1024 - 12.5) + y)

                            }

                            //inilizing tags
                            var wTags = (1024 / 512) * 15
                            var hTags = (1024 / 512) * 15
                            var yTags = 7 + y
                            var xTags = ((1024 - wTags) - 7) + x

                            for(let t = 0; t < grants[i].gameplayTags.length; t++){

                                //if the item is animated
                                if(grants[i].gameplayTags[t].includes('Animated')){

                                    //add the animated icon
                                    const Animated = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                    ctx.drawImage(Animated, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item is reactive
                                if(grants[i].gameplayTags[t].includes('Reactive')){

                                    //add the reactive icon
                                    const Reactive = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                    ctx.drawImage(Reactive, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                //if the item is synced emote
                                if(grants[i].gameplayTags[t].includes('Synced')){

                                    //add the Synced icon
                                    const Synced = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                    ctx.drawImage(Synced, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                    
                                }

                                //if the item is traversal
                                if(grants[i].gameplayTags[t].includes('Traversal')){

                                    //add the Traversal icon
                                    const Traversal = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                    ctx.drawImage(Traversal, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }

                                //if the item has styles
                                if(grants[i].gameplayTags[t].includes('HasVariants') || grants[i].gameplayTags[t].includes('HasUpgradeQuests')){

                                    //add the HasVariants icon
                                    const HasVariants = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                    ctx.drawImage(HasVariants, xTags, yTags, wTags, hTags)

                                    yTags += hTags + 10
                                }
                            }

                            //if the item contains copyrited audio
                            if(grants[i].copyrightedAudio){

                                //add the copyrightedAudio icon
                                const copyrightedAudio = await Canvas.loadImage('./assets/Tags/mute.png')
                                ctx.drawImage(copyrightedAudio, xTags, yTags, wTags, hTags)

                                yTags += hTags + 10
                            }

                            //if the item contains built in emote
                            if(grants[i].builtInEmote != null){

                                //add the builtInEmote icon
                                const builtInEmote = await Canvas.loadImage(grants[i].builtInEmote.images.icon)
                                ctx.drawImage(builtInEmote, xTags - 15, yTags, ((1024 / 512) * 30) + x, ((1024 / 512) * 30) + y)
                            }

                            //changing x and y
                            x = x + 10 + 1024; 
                            if(length === newline){
                                y = y + 10 + 1024;
                                x = 0;
                                newline = 0;
                            }
                        }

                        //send embed
                        try{
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.items[num].id}.png`})
                            await message.reply({files: [att]})
                            msg.delete()
                            
                        }catch{
                            var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${res.data.items[num].id}.jpg`})
                            await message.reply({files: [att]})
                            msg.delete()
                        }

                    }).catch(async err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })

                }else{

                    //if the item doesn't have any grants
                    const noGrantsHasBeenFound = new Discord.EmbedBuilder()
                    noGrantsHasBeenFound.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noGrantsHasBeenFound.setTitle(`The ${res.data.items[num].name} ${res.data.items[num].type.name} doesn't grants you anything ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noGrantsHasBeenFound.setTitle(`${res.data.items[num].type.name} ${res.data.items[num].name} لا يحتوي على اي عناصر اضافية ${emojisObject.errorEmoji}`)
                    message.reply({embeds: [noGrantsHasBeenFound]})
                }
            }

            //if the result is more than one item
            if(res.data.items.length > 1){

                //create embed
                const list = new Discord.EmbedBuilder()
                list.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") list.setTitle(`Please choose your item from the list below`)
                else if(userData.lang === "ar") list.setTitle(`الرجاء اختيار من القائمه بالاسفل`)

                //loop throw every item matching the user input
                var string = ""
                for(let i = 0; i < res.data.items.length; i++) string += `• ${i}: ${res.data.items[i].name} (${res.data.items[i].type.name}) \n`
                list.setDescription(string)

                //how many items where matchinh the user input?
                if(userData.lang === "en") string += `\nFound ${res.data.items.length} item matching your search`
                else if(userData.lang === "ar") string += `\nيوجد ${res.data.items.length} عنصر يطابق عملية البحث`

                //filtering outfits
                const filter = async m => await m.author.id === message.author.id

                //add the reply
                if(userData.lang === "en") var reply = `please choose your item, listening will be stopped after 20 seconds`
                else if(userData.lang === "ar") var reply = `الرجاء كتابة اسم العنصر، راح يتوقف الامر بعد ٢٠ ثانية`
                
                await message.reply({content: reply, embeds: [list]})
                .then(async notify => {

                    //listen for user input
                    await message.channel.awaitMessages({filter, max: 1, time: 20000, errors: ['time']})
                    .then( async collected => {

                        //delete messages
                        await notify.delete()

                        //if the user chosen inside range
                        if(collected.first().content >= 0 && collected.first().content < res.data.items.length) num = collected.first().content
                        else{

                            //add an error
                            errorHandleing++

                            //create out of range embed
                            const outOfRangeError = new Discord.EmbedBuilder()
                            outOfRangeError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") outOfRangeError.setTitle(`${FNBRMENA.Errors("outOfRange", userData.lang)} ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [outOfRangeError]})
                            
                        }
                    }).catch(err => {

                        //add error
                        handleErrors++

                        //deleting messages
                        notify.delete()

                        //time has passed
                        const timeError = new Discord.EmbedBuilder()
                        timeError.setColor(FNBRMENA.Colors("embedError"))
                        timeError.setTitle(`${FNBRMENA.Errors("Time", userData.lang)} ${emojisObject.errorEmoji}`)
                        message.reply({embeds: [timeError]})
                    })

                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }

            //if there is no item found
            if(res.data.items.length === 0){

                //add an error
                errorHandleing++

                //if user typed a number out of range
                const noCosmeticsFoundError = new Discord.EmbedBuilder()
                noCosmeticsFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noCosmeticsFoundError.setTitle(`No cosmetic has been found check your speling and try again ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noCosmeticsFoundError.setTitle(`لا يمكنني العثور على العنصر الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noCosmeticsFoundError]})
                
            }

            //if everything is correct
            if(res.data.items.length > 0 && errorHandleing == 0){

                //create an embed
                const dropDownMenuEmbed = new Discord.EmbedBuilder()
                if(userData.lang === "en") dropDownMenuEmbed.setDescription('Please click on the Drop-Down menu and choose a category.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                else if(userData.lang === "ar") dropDownMenuEmbed.setDescription('الرجاء الضغط على السهم لاختيار فئة.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')

                //get the item rarity
                if(res.data.items[num].series === null) dropDownMenuEmbed.setColor(FNBRMENA.Colors(res.data.items[num].rarity.id))
                else dropDownMenuEmbed.setColor(FNBRMENA.Colors(res.data.items[num].series.id))
                dropDownMenuEmbed.setAuthor({name: `${res.data.items[num].name} | ${res.data.items[num].type.name}`, iconURL: res.data.items[num].images.icon})

                //create a row for Cancel button
                const buttonDataRow = new Discord.ActionRowBuilder()

                //create the cancel button
                const cancelButton = new Discord.ButtonBuilder()
                cancelButton.setCustomId('Cancel')
                cancelButton.setStyle(Discord.ButtonStyle.Danger)
                if(userData.lang === "en") cancelButton.setLabel("Cancel")
                else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
                
                //add the cancel button to the buttonDataRow
                buttonDataRow.addComponents(cancelButton)

                //create a row for drop down menu for categories
                const categoriesRow = new Discord.ActionRowBuilder()

                const categoryDropMenu = new Discord.SelectMenuBuilder()
                categoryDropMenu.setCustomId('categories')
                if(userData.lang === "en") categoryDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") categoryDropMenu.setPlaceholder('الرجاء الأختيار!')
                if(userData.lang === "en") categoryDropMenu.addOptions(
                    {
                        label: `${res.data.items[num].name}'s Information`,
                        description: `Returns you a list full of all possible data about the ${res.data.items[num].name} ${res.data.items[num].type.name}.`,
                        value: `info`,
                    },
                    {
                        label: `${res.data.items[num].name}'s Styles`,
                        description: `Returns you an image contains all ${res.data.items[num].name} ${res.data.items[num].type.name} styles.`,
                        value: `styles`,
                    },
                    {
                        label: `${res.data.items[num].name}'s Grants`,
                        description: `Returns you an image of what the ${res.data.items[num].name} ${res.data.items[num].type.name} grants you when purchasing.`,
                        value: `grants`,
                    }
                )
                else if(userData.lang === "ar") categoryDropMenu.addOptions(
                    {
                        label: `معلومات ${res.data.items[num].type.name} ${res.data.items[num].name}`,
                        description: `استرجاع جميع المعلومات الممكنة حول ${res.data.items[num].type.name} ${res.data.items[num].name}.`,
                        value: `info`,
                    },
                    {
                        label: `ازياء ${res.data.items[num].type.name} ${res.data.items[num].name}`,
                        description: `استرجاع صورة تحتوي على جميع ازياء ${res.data.items[num].type.name} ${res.data.items[num].name}.`,
                        value: `styles`,
                    },
                    {
                        label: `مرفقات ${res.data.items[num].type.name} ${res.data.items[num].name}`,
                        description: `استرجاع صورد تحتوي على جميع العناصر المرفقه الخاصة بـ ${res.data.items[num].type.name} ${res.data.items[num].name} اثناء الشراء.`,
                        value: `grants`,
                    }
                )

                //add the drop menu to the categoryDropMenu
                categoriesRow.addComponents(categoryDropMenu)

                //send the message
                const detailsDropDownMessage = await message.reply({embeds: [dropDownMenuEmbed], components: [categoriesRow, buttonDataRow]})

                //filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === detailsDropDownMessage.id && i.guild.id === message.guild.id)
                })

                //await the user click
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate()

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel") detailsDropDownMessage.delete()
                    
                    if(collected.customId === "categories"){
                        await detailsDropDownMessage.delete()
                        
                        //if the user clicked of info
                        if(collected.values[0] == "info") cosmeticInfo(num)

                        //if the user clicked on styles
                        if(collected.values[0] == "styles") cosmeticStyles(num)

                        //if the user clicked on grants
                        if(collected.values[0] == "grants") cosmeticGrants(num)
                    }

                }).catch(async err => {
                    detailsDropDownMessage.delete()
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}