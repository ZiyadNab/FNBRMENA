const Discord = require('discord.js')
const moment = require('moment')

module.exports = async (FNBRMENA, message, client, lang, emojisObject) => {
    var url = `` //the url request
    var limit = 2 * 60000 // the limit time for each question
    var values = ['Start'] //stores the chosen types
    var itemFinderMessage; //store the message as public atter
    var buttonDataRow
    const filter = (i) => i.user.id === message.author.id //filtering the user clicker
    moment.locale(lang)

    //request all seasons
    const seasonsData = []
    FNBRMENA.Seasons(lang)
    .then(async res => {

        //loop through every season
        for(const history of res.data.seasons){
            if(history.chapter === 1 && history.season === 10) var season = `X`
            else var season = history.seasonInChapter
            
            seasonsData.push({
                displayName: history.displayName,
                season: season,
                chapter: history.chapter,
                patchs: history.patchList
            })
        }
    })

    //the start point
    if(values.includes("Start")){

        //create an embed
        const itemFinderEmbed = new Discord.EmbedBuilder()
        itemFinderEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            itemFinderEmbed.setAuthor({name: `Item Lookup`, iconURL: `https://imgur.com/irY22oA.png`})
            itemFinderEmbed.setDescription('Please click on the Drop-Down menu and choose a type.\n`You have only 30 seconds until this operation ends, Make it quick`!')
        }else if(lang === "ar"){
            itemFinderEmbed.setAuthor({name: `الكشف عن العنصر`, iconURL: `https://imgur.com/irY22oA.png`})
            itemFinderEmbed.setDescription('الرجاء الضغط على السهم لاختيار تحديث.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
        }

        //create a row for buttons
        buttonDataRow = new Discord.ActionRowBuilder()

        //add EN cancel button
        if(lang === "en") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("Cancel")
        )
        
        //add AR cancel button
        else if(lang === "ar") buttonDataRow.addComponents(
            new Discord.ButtonBuilder()
            .setCustomId('Cancel')
            .setStyle(Discord.ButtonStyle.Danger)
            .setLabel("اغلاق")
        )

        //create a row for drop down menu for categories
        const typeOfItemsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const typeOfItemsDropMenu = new Discord.SelectMenuBuilder()
        typeOfItemsDropMenu.setCustomId('Types')
        typeOfItemsDropMenu.setMinValues(1)
        typeOfItemsDropMenu.setMaxValues(10)
        if(lang === "en") typeOfItemsDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") typeOfItemsDropMenu.setPlaceholder('الرجاء الأختيار!')
        
        //add options for EN
        if(lang === "en") typeOfItemsDropMenu.addOptions(
            {
                label: 'Type',
                description: 'Used to specify the item type ~ e.g. Outfits, Emotes...',
                value: 'type',
            },
            {
                label: 'Price',
                description: 'Used to specify the item price ~ e.g. 1500, 1200...',
                value: 'price',
            },
            {
                label: 'Series',
                description: 'Used to specify the item series ~ e.g. Icon Series, DC Series...',
                value: 'series',
            },
            {
                label: 'Rarity',
                description: 'Used to specify the item rarity ~ e.g. Legendary, Rare...',
                value: 'rarity',
            },
            {
                label: 'searchTags',
                description: 'Used to specify the item design ~ e.g. Yellow, Food...',
                value: 'searchtags',
            },
            {
                label: 'Introduction',
                description: 'Used to specify the item introduction ~ e.g. Chatper 2 Season 3...',
                value: 'introduction',
            },
            {
                label: 'Tags',
                description: 'Used to specify the item gameplay tags ~ e.g. Itemshop, Reactive, Styles...',
                value: 'tags',
            },
            {
                label: 'Sets',
                description: 'Used to specify the item set ~ e.g. Storm Scavenger',
                value: 'sets',
            },
            {
                label: 'Shop History',
                description: 'Used to specify the itemshop date',
                value: 'history',
            },
            {
                label: 'Battlepass',
                description: 'Used to specify the item battlepass ~ e.g. Chatper 2 Season 3...',
                value: 'battlepass',
            },
            {
                label: 'Added',
                description: 'Used to specify the update version of the item ~ e.g. 21.30...',
                value: 'version',
            },
            {
                label: 'Copyrighted',
                description: 'Used to specify if the item containg copyrighted audio or not ~ e.g. Yes, No',
                value: 'copyrighted',
            },
            {
                label: 'Upcoming',
                description: 'Used to specify if the item is upcoming or not ~ e.g. Yes, No',
                value: 'upcoming',
            },
        )

        //add options for AR
        if(lang === "ar") typeOfItemsDropMenu.addOptions(
            {
                label: 'النوع',
                description: 'يستعمل في تحديد نوع العنصر ~ مثل سكنات, رقصات...',
                value: 'type',
            },
            {
                label: 'السعر',
                description: 'يستعمل في تحديد نوع السعر ~ مثل 1500, 1200...',
                value: 'price',
            },
            {
                label: 'السلسلة',
                description: 'يستعمل في تحديد سلسلة العنصر ~ مثل ايكون, دي سي...',
                value: 'series',
            },
            {
                label: 'الندرة',
                description: 'يستعمل في تحديد نوع الندرة ~ مثل اسطوري, نادر...',
                value: 'rarity',
            },
            {
                label: 'ادوات البحث',
                description: 'يستعمل في تحديد تصميم العنصر ~ مثل اصفر, اكل...',
                value: 'searchtags',
            },
            {
                label: 'تقديم العنصر',
                description: 'يستعمل في تحديد متى تم تقديم العنصر ~ مثل شابتر ٢ سيزون ٣...',
                value: 'introduction',
            },
            {
                label: 'شعارات',
                description: 'يستعمل في تحديد شعارات العنصر ~ مثل ايتم شوب, متفاعل، ستايلات!...',
                value: 'tags',
            },
            {
                label: 'المجموعات',
                description: 'يستعمل في تحديد مجموعة العنصر ~ مثل Storm Scavenger',
                value: 'sets',
            },
            {
                label: 'تاريخ الشوب',
                description: 'يستعمل في تحديد تاريخ الشوب',
                value: 'history',
            },
            {
                label: 'باتل باس',
                description: 'يستعمل في تحديد الباتل باس للعنصر ~ مثل شابتر ٢ سيزون ٣...',
                value: 'battlepass',
            },
            {
                label: 'تم اضافته',
                description: 'يستعمل في تحديد رقم تحديث العنصر ~ مثل 21.30...',
                value: 'version',
            },
            {
                label: 'حقوق الطبع و النشر',
                description: 'يستعمل في تحديد اذا العنصر يحتوي على حقوق الطبع و النشر ام لا ~ مثال نعم او لا',
                value: 'copyrighted',
            },
            {
                label: 'قادم قريبا',
                description: 'يستعمل في تحديد اذا العنصر قادم قريبا ام لا ~ مثال نعم او لا',
                value: 'upcoming',
            },
        )

        //add the drop menu to its row
        typeOfItemsRow.addComponents(typeOfItemsDropMenu)

        itemFinderMessage = await message.reply({embeds: [itemFinderEmbed], components: [typeOfItemsRow, buttonDataRow], fetchReply: true})

        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                    itemFinderMessage.delete() //delete the main message
                    values = [] //empty values
                    url = null //return a null url as the request has been canceled
                }

            //if a type has been chosen
            if(collected.customId === "Types") values = collected.values
            
        })
    }

    //if the user chose type
    if(values.includes('type')){

        //create an embed
        const typeOfCosmeticsEmbed = new Discord.EmbedBuilder()
        typeOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            typeOfCosmeticsEmbed.setAuthor({name: `Cosmetic Type`, iconURL: 'https://imgur.com/X8eMJUN.png'})
            typeOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose a cosmetic type.`)
        }else if(lang === "ar"){
            typeOfCosmeticsEmbed.setAuthor({name: `نوع العنصر`, iconURL: 'https://imgur.com/X8eMJUN.png'})
            typeOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع عنصر.')
        }

        //create a row for drop down menu for categories
        const typeOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const typeOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        typeOfCosmeticsDropMenu.setCustomId('cosmetic_type')
        if(lang === "en") typeOfCosmeticsDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") typeOfCosmeticsDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for EN
        if(lang === "en") typeOfCosmeticsDropMenu.addOptions(
            {
                label: 'Outfit',
                value: 'outfit',
                emoji: `${emojisObject.outfit}`
            },
            {
                label: 'Style',
                value: 'cosmeticvariant',
            },
            {
                label: 'BackBling',
                value: 'backpack',
                emoji: `${emojisObject.backpack}`
            },
            {
                label: 'Harvesting Tool',
                value: 'pickaxe',
                emoji: `${emojisObject.pickaxe}`
            },
            {
                label: 'Glider',
                value: 'glider',
                emoji: `${emojisObject.glider}`
            },
            {
                label: 'Contrail',
                value: 'contrail',
                emoji: `${emojisObject.contrail}`
            },
            {
                label: 'Emote',
                value: 'emote',
                emoji: `${emojisObject.emote}`
            },
            {
                label: 'Spray',
                value: 'spray',
                emoji: `${emojisObject.spray}`
            },
            {
                label: 'Emoticon',
                value: 'emoji',
                emoji: `${emojisObject.emoji}`
            },
            {
                label: 'Toy',
                value: 'toy',
                emoji: `${emojisObject.toy}`
            },
            {
                label: 'Pet',
                value: 'pet',
                emoji: `${emojisObject.pet}`
            },
            {
                label: 'Wrap',
                value: 'wrap',
                emoji: `${emojisObject.wrap}`
            },
            {
                label: 'Music',
                value: 'music',
                emoji: `${emojisObject.music}`
            },
            {
                label: 'Loading Screen',
                value: 'loadingscreen',
                emoji: `${emojisObject.loadingscreen}`
            },
            {
                label: 'Banner',
                value: 'bannertoken',
                emoji: `${emojisObject.banner}`
            },
        )

        //add options for AR
        if(lang === "ar") typeOfCosmeticsDropMenu.addOptions(
            {
                label: 'الزي',
                value: 'outfit',
                emoji: `${emojisObject.outfit}`
            },
            {
                label: 'النمط',
                value: 'cosmeticvariant',
            },
            {
                label: 'زينة الظهر',
                value: 'backpack',
                emoji: `${emojisObject.backpack}`
            },
            {
                label: 'أداة الحصاد',
                value: 'pickaxe',
                emoji: `${emojisObject.pickaxe}`
            },
            {
                label: 'الطائرة الشراعية',
                value: 'glider',
                emoji: `${emojisObject.glider}`
            },
            {
                label: 'الخط النفاثي',
                value: 'contrail',
                emoji: `${emojisObject.contrail}`
            },
            {
                label: 'رقصة',
                value: 'emote',
                emoji: `${emojisObject.emote}`
            },
            {
                label: 'صورة الرش',
                value: 'spray',
                emoji: `${emojisObject.spray}`
            },
            {
                label: 'رمز تعبيري',
                value: 'emoji',
                emoji: `${emojisObject.emoji}`
            },
            {
                label: 'الدمية',
                value: 'toy',
                emoji: `${emojisObject.toy}`
            },
            {
                label: 'حيوان أليف',
                value: 'pet',
                emoji: `${emojisObject.pet}`
            },
            {
                label: 'الغلاف',
                value: 'wrap',
                emoji: `${emojisObject.wrap}`
            },
            {
                label: 'الموسيقى',
                value: 'music',
                emoji: `${emojisObject.music}`
            },
            {
                label: 'شاشة التحميل',
                value: 'loadingscreen',
                emoji: `${emojisObject.loadingscreen}`
            },
            {
                label: 'الراية',
                value: 'bannertoken',
                emoji: `${emojisObject.banner}`
            },
        )

        //add the drop menu to its row
        typeOfCosmeticsRow.addComponents(typeOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [typeOfCosmeticsEmbed], components: [typeOfCosmeticsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a type has been chosen
            if(collected.customId === "cosmetic_type") url += `&type=${collected.values[0]}`
            
        })
    }

    //if the user chose price
    if(values.includes('price')){

        //create an embed
        const priceOfCosmeticsEmbed = new Discord.EmbedBuilder()
        priceOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            priceOfCosmeticsEmbed.setAuthor({name: `Cosmetic Price`, iconURL: 'https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png'})
            priceOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose a cosmetic type.`)
        }else if(lang === "ar"){
            priceOfCosmeticsEmbed.setAuthor({name: `سعر العنصر`, iconURL: 'https://media.fortniteapi.io/images/652b99f7863db4ba398c40c326ac15a9/transparent.png'})
            priceOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار سعر عنصر.')
        }

        //create a row for drop down menu for categories
        const priceOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const priceOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        priceOfCosmeticsDropMenu.setCustomId('cosmetic_price')
        if(lang === "en") priceOfCosmeticsDropMenu.setPlaceholder('Select a vbucks!')
        else if(lang === "ar") priceOfCosmeticsDropMenu.setPlaceholder('اختار فيبوكس!')

        //add options for EN
        if(lang === "en") priceOfCosmeticsDropMenu.addOptions(
            {
                label: 'Free',
                value: '0',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '100 V-Bucks',
                value: '100',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '200 V-Bucks',
                value: '200',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '300 V-Bucks',
                value: '300',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '400 V-Bucks',
                value: '400',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '500 V-Bucks',
                value: '500',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '600 V-Bucks',
                value: '600',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '800 V-Bucks',
                value: '800',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1200 V-Bucks',
                value: '1200',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1400 V-Bucks',
                value: '1400',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1500 V-Bucks',
                value: '1500',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1600 V-Bucks',
                value: '1600',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1800 V-Bucks',
                value: '1800',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2000 V-Bucks',
                value: '2000',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2100 V-Bucks',
                value: '2100',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2200 V-Bucks',
                value: '2200',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2300 V-Bucks',
                value: '2300',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2400 V-Bucks',
                value: '2400',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2500 V-Bucks',
                value: '2500',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2600 V-Bucks',
                value: '2600',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2800 V-Bucks',
                value: '2800',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '3000 V-Bucks',
                value: '3000',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '3500 V-Bucks',
                value: '3500',
                emoji: `${emojisObject.vbucks}`
            }
        )

        //add options for AR
        if(lang === "ar") priceOfCosmeticsDropMenu.addOptions(
            {
                label: 'مجاني',
                value: '0',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '100 فيبوكس',
                value: '100',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '200 فيبوكس',
                value: '200',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '300 فيبوكس',
                value: '300',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '400 فيبوكس',
                value: '400',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '500 فيبوكس',
                value: '500',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '600 فيبوكس',
                value: '600',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '800 فيبوكس',
                value: '800',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1200 فيبوكس',
                value: '1200',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1400 فيبوكس',
                value: '1400',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1500 فيبوكس',
                value: '1500',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1600 فيبوكس',
                value: '1600',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '1800 فيبوكس',
                value: '1800',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2000 فيبوكس',
                value: '2000',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2100 فيبوكس',
                value: '2100',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2200 فيبوكس',
                value: '2200',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2300 فيبوكس',
                value: '2300',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2400 فيبوكس',
                value: '2400',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2500 فيبوكس',
                value: '2500',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2600 فيبوكس',
                value: '2600',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '2800 فيبوكس',
                value: '2800',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '3000 فيبوكس',
                value: '3000',
                emoji: `${emojisObject.vbucks}`
            },
            {
                label: '3500 فيبوكس',
                value: '3500',
                emoji: `${emojisObject.vbucks}`
            }
        )

        //add the drop menu to its row
        priceOfCosmeticsRow.addComponents(priceOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [priceOfCosmeticsEmbed], components: [priceOfCosmeticsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a type has been chosen
            if(collected.customId === "cosmetic_price") url += `&price=${collected.values[0]}`
            
        })
        
    }

    //if the user chose series
    if(values.includes('series')){

        //create an embed
        const seriesOfCosmeticsEmbed = new Discord.EmbedBuilder()
        seriesOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            seriesOfCosmeticsEmbed.setTitle(`Cosmetic Series`)
            seriesOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose a cosmetic series.`)
        }else if(lang === "ar"){
            seriesOfCosmeticsEmbed.setTitle(`سلسلة العنصر`)
            seriesOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار سلسلة عنصر.')
        }

        //create a row for drop down menu for categories
        const seriesOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const seriesOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        seriesOfCosmeticsDropMenu.setCustomId('cosmetic_series')
        if(lang === "en") seriesOfCosmeticsDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") seriesOfCosmeticsDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for EN
        if(lang === "en") seriesOfCosmeticsDropMenu.addOptions(
            {
                label: 'Marvel Series',
                value: 'MarvelSeries',
                emoji: `${emojisObject.marvel}`
            },
            {
                label: 'DC Series',
                value: 'DCUSeries',
                emoji: `${emojisObject.dc}`
            },
            {
                label: 'Starwars Series',
                value: 'ColumbusSeries',
                emoji: `${emojisObject.starwars}`
            },
            {
                label: 'Dark Series',
                value: 'CUBESeries',
                emoji: `${emojisObject.dark}`
            },
            {
                label: 'Icon Series',
                value: 'CreatorCollabSeries',
                emoji: `${emojisObject.icon}`
            },
            {
                label: 'Shadow Series',
                value: 'ShadowSeries',
                emoji: `${emojisObject.shadow}`
            },
            {
                label: 'Slurp Series',
                value: 'SlurpSeries',
                emoji: `${emojisObject.slurp}`
            },
            {
                label: 'Frozen Series',
                value: 'FrozenSeries',
                emoji: `${emojisObject.frozen}`
            },
            {
                label: 'Lava Series',
                value: 'LavaSeries',
                emoji: `${emojisObject.lava}`
            },
            {
                label: 'Gaming Legends Series',
                value: 'PlatformSeries',
                emoji: `${emojisObject.gaming}`
            }
        )

        //add options for AR
        if(lang === "ar") seriesOfCosmeticsDropMenu.addOptions(
            {
                label: 'سلسلة مارفل',
                value: 'MarvelSeries',
                emoji: `${emojisObject.marvel}`
            },
            {
                label: 'سلسلة دي سي',
                value: 'DCUSeries',
                emoji: `${emojisObject.dc}`
            },
            {
                label: 'سلسلة ستار وارز',
                value: 'ColumbusSeries',
                emoji: `${emojisObject.starwars}`
            },
            {
                label: 'سلسلة دارك',
                value: 'CUBESeries',
                emoji: `${emojisObject.dark}`
            },
            {
                label: 'سلسلة المشاهير',
                value: 'CreatorCollabSeries',
                emoji: `${emojisObject.icon}`
            },
            {
                label: 'سلسلة الظلال',
                value: 'ShadowSeries',
                emoji: `${emojisObject.shadow}`
            },
            {
                label: 'سلسلة الشراب',
                value: 'SlurpSeries',
                emoji: `${emojisObject.slurp}`
            },
            {
                label: 'سلسلة التجمد',
                value: 'FrozenSeries',
                emoji: `${emojisObject.frozen}`
            },
            {
                label: 'سلسلة الحمم',
                value: 'LavaSeries',
                emoji: `${emojisObject.lava}`
            },
            {
                label: 'سلسلة أساطير الألعاب',
                value: 'PlatformSeries',
                emoji: `${emojisObject.gaming}`
            }
        )

        //add the drop menu to its row
        seriesOfCosmeticsRow.addComponents(seriesOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [seriesOfCosmeticsEmbed], components: [seriesOfCosmeticsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a cosmetic series option has been chosen
            if(collected.customId === "cosmetic_series") url += `&series=${collected.values[0]}`
            
        })
    }

    //if the user chose rarity
    if(values.includes('rarity')){
        
        //create an embed
        const rarityOfCosmeticsEmbed = new Discord.EmbedBuilder()
        rarityOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            rarityOfCosmeticsEmbed.setTitle(`Cosmetic Rarity`)
            rarityOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose a cosmetic rarity.`)
        }else if(lang === "ar"){
            rarityOfCosmeticsEmbed.setTitle(`ندرة العنصر`)
            rarityOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار ندرة عنصر.')
        }

        //create a row for drop down menu for categories
        const rarityOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const rarityOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        rarityOfCosmeticsDropMenu.setCustomId('cosmetic_rarity')
        if(lang === "en") rarityOfCosmeticsDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") rarityOfCosmeticsDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for EN
        if(lang === "en") rarityOfCosmeticsDropMenu.addOptions(
            {
                label: 'Legendary',
                value: 'Legendary',
                emoji: `${emojisObject.legendary}`
            },
            {
                label: 'Epic',
                value: 'Epic',
                emoji: `${emojisObject.epic}`
            },
            {
                label: 'Rare',
                value: 'Rare',
                emoji: `${emojisObject.rare}`
            },
            {
                label: 'Uncommon',
                value: 'Uncommon',
                emoji: `${emojisObject.uncommon}`
            },
            {
                label: 'Common',
                value: 'Common',
                emoji: `${emojisObject.common}`
            }
        )

        //add options for AR
        if(lang === "ar") rarityOfCosmeticsDropMenu.addOptions(
            {
                label: 'أسطوري',
                value: 'Legendary',
                emoji: `${emojisObject.legendary}`
            },
            {
                label: 'ملحمي',
                value: 'Epic',
                emoji: `${emojisObject.epic}`
            },
            {
                label: 'نادر',
                value: 'Rare',
                emoji: `${emojisObject.rare}`
            },
            {
                label: 'غير شائع',
                value: 'Uncommon',
                emoji: `${emojisObject.uncommon}`
            },
            {
                label: 'شائع',
                value: 'Common',
                emoji: `${emojisObject.common}`
            }
        )

        //add the drop menu to its row
        rarityOfCosmeticsRow.addComponents(rarityOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [rarityOfCosmeticsEmbed], components: [rarityOfCosmeticsRow, buttonDataRow]})

        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a cosmetic rarity option has been chosen
            if(collected.customId === "cosmetic_rarity") url += `&rarity=${collected.values[0]}`
            
        })
    }

    //if the user chose searchtags
    if(values.includes('searchtags')){

        //create an embed
        const searchTagsEmbed = new Discord.EmbedBuilder()
        searchTagsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            searchTagsEmbed.setAuthor({name: `Search Tags`, iconURL: `https://imgur.com/qz99gAl.png`})
            searchTagsEmbed.setDescription(`Please click on the Drop-Down menu and choose the search tags`)
        }else if(lang === "ar"){
            searchTagsEmbed.setAuthor({name: `عبارات البحث`, iconURL: `https://imgur.com/qz99gAl.png`})
            searchTagsEmbed.setDescription('الرجاء الضغط على السهم لاختيار عبارات البحث`')
        }

        //create a row for drop down menu for categories
        const searchTagsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const searchTagsDropMenu = new Discord.SelectMenuBuilder()
        searchTagsDropMenu.setCustomId('search_tags')
        if(lang === "en") searchTagsDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") searchTagsDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for EN
        if(lang === "en") searchTagsDropMenu.addOptions(
            {
                label: 'Yellow',
                value: 'yellow',
                emoji: `🟨`
            },
            {
                label: 'Food',
                value: 'food',
                emoji: `🍔`
            }
        )

        //add options for AR
        if(lang === "ar") searchTagsDropMenu.addOptions(
            {
                label: 'اصفر',
                value: 'yellow',
                emoji: `🟨`
            },
            {
                label: 'اكل',
                value: 'food',
                emoji: `🍔`
            }
        )

        //add the drop menu to its row
        searchTagsRow.addComponents(searchTagsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [searchTagsEmbed], components: [searchTagsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a search tag option has been chosen
            if(collected.customId === "search_tags") url += `&searchTags=${collected.values[0]}`
            
        })
    }

    //if the user chose introduction
    if(values.includes('introduction')){
        
        //create an embed
        const chapterOfCosmeticsEmbed = new Discord.EmbedBuilder()
        chapterOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            chapterOfCosmeticsEmbed.setTitle(`Introduction, Chapter`)
            chapterOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the item's chapter.`)
        }else if(lang === "ar"){
            chapterOfCosmeticsEmbed.setTitle(`التقديم, الفصل`)
            chapterOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار الفصل الخاص للعنصر')
        }

        //loop through seasons
        const allChapters = [], foundChapters = []
        for(const chapters of seasonsData){

            if(!foundChapters.includes(chapters.chapter)){
                foundChapters.push(chapters.chapter)
                if(lang === "en") allChapters.push(
                    {
                        label: `Chapter ${chapters.chapter}`,
                        value: `${chapters.chapter}`
                    }
                )

                else if(lang === "ar") allChapters.push(
                    {
                        label: `الفصل ${chapters.chapter}`,
                        value: `${chapters.chapter}`
                    }
                )
            }
        }

        //create a row for drop down menu for categories
        const chapterOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const chapterOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        chapterOfCosmeticsDropMenu.setCustomId('cosmetic_chapter')
        if(lang === "en") chapterOfCosmeticsDropMenu.setPlaceholder('Select a chapter!')
        else if(lang === "ar") chapterOfCosmeticsDropMenu.setPlaceholder('اختار فصل!')
        chapterOfCosmeticsDropMenu.addOptions(allChapters)

        //add the drop menu to its row
        chapterOfCosmeticsRow.addComponents(chapterOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [chapterOfCosmeticsEmbed], components: [chapterOfCosmeticsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a search tag option has been chosen
            if(collected.customId === "cosmetic_chapter"){

                //create an embed
                const seasonOfCosmeticsEmbed = new Discord.EmbedBuilder()
                seasonOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en"){
                    seasonOfCosmeticsEmbed.setTitle(`Introduction, Season`)
                    seasonOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the item's season.`)
                }else if(lang === "ar"){
                    seasonOfCosmeticsEmbed.setTitle(`التقديم, الموسم`)
                    seasonOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار الموسم الخاص للعنصر')
                }

                //loop through seasons
                const allSeasons = []
                for(const seasons of seasonsData){

                    if(seasons.chapter === Number(collected.values[0])) allSeasons.push({
                            label: seasons.displayName,
                            value: `&introduction.chapter=Chapter ${collected.values[0]}&introduction.season=Season ${seasons.season}`
                        })
                }

                //create a row for drop down menu for categories
                const seasonOfCosmeticsRow = new Discord.ActionRowBuilder()

                //create the drop menu
                const seasonOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
                seasonOfCosmeticsDropMenu.setCustomId('cosmetic_season')
                if(lang === "en") seasonOfCosmeticsDropMenu.setPlaceholder('Select a season!')
                else if(lang === "ar") seasonOfCosmeticsDropMenu.setPlaceholder('اختار موسم!')
                seasonOfCosmeticsDropMenu.addOptions(allSeasons)

                //add the drop menu to its row
                seasonOfCosmeticsRow.addComponents(seasonOfCosmeticsDropMenu)

                //edit the orignal image
                itemFinderMessage.edit({embeds: [seasonOfCosmeticsEmbed], components: [seasonOfCosmeticsRow, buttonDataRow]})
                
                //await for the user
                await message.channel.awaitMessageComponent({filter, time: limit})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel"){
                        itemFinderMessage.delete() //delete the main message
                        values = [] //empty values
                        url = null //return a null url as the request has been canceled
                    }

                    //if a search tag option has been chosen
                    if(collected.customId === "cosmetic_season") url += `${collected.values[0]}`
                    
                })
            }
        })
    }

    //if the user chose tags
    if(values.includes('tags')){
        
        //create an embed
        const tagsEmbed = new Discord.EmbedBuilder()
        tagsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            tagsEmbed.setAuthor({name: `Cosmetic's Tags`, iconURL: `https://imgur.com/zW1G9kt.png`})
            tagsEmbed.setDescription(`Please click on the Drop-Down menu and choose the cosmetic tags`)
        }else if(lang === "ar"){
            tagsEmbed.setAuthor({name: `شعارات العنصر`, iconURL: `https://imgur.com/zW1G9kt.png`})
            tagsEmbed.setDescription('الرجاء الضغط على السهم لاختيار شعارات العنصر`')
        }

        //create a row for drop down menu for categories
        const tagsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const tagsDropMenu = new Discord.SelectMenuBuilder()
        tagsDropMenu.setCustomId('cosmetic_tags')
        tagsDropMenu.setMinValues(1)
        tagsDropMenu.setMaxValues(11)
        if(lang === "en") tagsDropMenu.setPlaceholder('Select tags!')
        else if(lang === "ar") tagsDropMenu.setPlaceholder('اختر شعارات')

        //add options for EN
        if(lang === "en") tagsDropMenu.addOptions(
            {
                label: 'Itemshop',
                value: 'Cosmetics.Source.ItemShop',
                emoji: `🛒`
            },
            {
                label: 'Event',
                value: 'Cosmetics.Source.Event.*',
                emoji: `${emojisObject.event}`
            },
            {
                label: 'Has Styles',
                value: 'Cosmetics.UserFacingFlags.HasVariants',
                emoji: `${emojisObject.variants}`
            },
            {
                label: 'FNCS',
                value: 'Cosmetics.Source.FNCS',
                emoji: `${emojisObject.fncs}`
            },
            {
                label: 'Exclusive',
                value: 'Cosmetics.Source.Promo',
                emoji: `${emojisObject.exclusive}`
            },
            {
                label: 'Reactive',
                value: 'Cosmetics.UserFacingFlags.Reactive',
                emoji: `${emojisObject.reactive}`
            },
            {
                label: 'Traversal',
                value: 'Cosmetics.UserFacingFlags.Emote.Traversal',
                emoji: `${emojisObject.traversal}`
            },
            {
                label: 'Animated',
                value: '*Animated',
                emoji: `${emojisObject.animated}`
            },
            {
                label: 'Synced',
                value: 'Cosmetics.UserFacingFlags.Synced',
                emoji: `${emojisObject.synced}`
            },
            {
                label: 'Birthday Celebrations',
                value: 'Cosmetics.Source.Event.Birthday*',
                emoji: `${emojisObject.birthday}`
            },
            {
                label: 'Win Umbrellas',
                value: '*FirstWin*',
                emoji: `${emojisObject.umbrella}`
            }
        )

        //add options for AR
        if(lang === "ar") tagsDropMenu.addOptions(
            {
                label: 'متجر العناصر',
                value: 'Cosmetics.Source.ItemShop',
                emoji: `🛒`
            },
            {
                label: 'حدث',
                value: 'Cosmetics.Source.Event.*',
                emoji: `${emojisObject.event}`
            },
            {
                label: 'لديه ستايلات',
                value: 'Cosmetics.UserFacingFlags.HasVariants',
                emoji: `${emojisObject.variants}`
            },
            {
                label: 'بطولة FNCS',
                value: 'Cosmetics.Source.FNCS',
                emoji: `${emojisObject.fncs}`
            },
            {
                label: 'حصري',
                value: 'Cosmetics.Source.Promo',
                emoji: `${emojisObject.exclusive}`
            },
            {
                label: 'متفاعل',
                value: 'Cosmetics.UserFacingFlags.Reactive',
                emoji: `${emojisObject.reactive}`
            },
            {
                label: 'قابل للمشي',
                value: 'Cosmetics.UserFacingFlags.Emote.Traversal',
                emoji: `${emojisObject.traversal}`
            },
            {
                label: 'متحرك',
                value: '*Animated',
                emoji: `${emojisObject.animated}`
            },
            {
                label: 'متزامن',
                value: 'Cosmetics.UserFacingFlags.Synced',
                emoji: `${emojisObject.synced}`
            },
            {
                label: 'الذكرى السنوية',
                value: 'Cosmetics.Source.Event.Birthday*',
                emoji: `${emojisObject.birthday}`
            },
            {
                label: 'مظلات الفوز',
                value: '*FirstWin*',
                emoji: `${emojisObject.umbrella}`
            }
        )

        //add the drop menu to its row
        tagsRow.addComponents(tagsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [tagsEmbed], components: [tagsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a search tag option has been chosen
            if(collected.customId === "cosmetic_tags"){

                url += `&gameplayTags=${collected.values[0]}`
                for(let i = 1; i < collected.values.length; i++) url += `,${collected.values[i]}`
            }
            
        })
    }

    //if the user chose sets
    if(values.includes('sets')){

        //create an embed
        const setOfCosmeticsEmbed = new Discord.EmbedBuilder()
        setOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            setOfCosmeticsEmbed.setTitle(`Cosmetic Set`)
            setOfCosmeticsEmbed.setDescription(`Please click on the start button to add a cosmetic set.`)
        }else if(lang === "ar"){
            setOfCosmeticsEmbed.setTitle(`مجموعة العنصر`)
            setOfCosmeticsEmbed.setDescription('الرجاء الضغط على زر البدء لتحديد مجموعة العنصر.')
        }

        //create a row for buttons
        const buttonDataForModalRow = new Discord.ActionRowBuilder()

        //add EN buttons
        if(lang === "en"){
            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Start')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("Start")
            ) 

            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel")
            )
        }

        //add AR buttons
        else if(lang === "ar"){
            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Start')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("البدء")
            )

            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("اغلاق")
            )
        }

        // Create the modal and add text fields
        const setsModal = new Discord.ModalBuilder()
        setsModal.setCustomId('sets')
        if(lang === "en"){
            setsModal.setTitle('Cosmetic Set') //set modal title
            setsModal.addComponents( // add fields
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('setInput')
                    .setLabel("Please type the cosmetic set name.")
                    .setStyle(Discord.TextInputStyle.Short)
                )
            )
        }else if(lang === "ar"){
            setsModal.setTitle('مجموعة العنصر') //set modal title
            setsModal.addComponents( // add fields
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('setInput')
                    .setLabel("من فضلك اكتب اسم المجموعة.")
                    .setStyle(Discord.TextInputStyle.Short)
                )
            )
        }

        //edit the orignal image
        itemFinderMessage.edit({embeds: [setOfCosmeticsEmbed], components: [buttonDataForModalRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if the user clicked on start
            if(collected.customId === "Start"){
                await collected.showModal(setsModal)

                //listen for modal submission
                const modalFilter = (interaction) => interaction.customId === 'sets';
                await collected.awaitModalSubmit({modalFilter, time: limit})
                .then(async modalCollect => {
                    modalCollect.deferUpdate();

                    //register the submited input value
                    url += `&set.name=${modalCollect.fields.getTextInputValue('setInput')}`
                    
                })
            }
        })
    }

    //if the user chose history
    if(values.includes('history')){

        //create an embed
        const shopHistoryYearOfCosmeticsEmbed = new Discord.EmbedBuilder()
        shopHistoryYearOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            shopHistoryYearOfCosmeticsEmbed.setAuthor({name: `Shop History, Year`, iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/shopping-cart_1f6d2.png'})
            shopHistoryYearOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the shot history year.`)
        }else if(lang === "ar"){
            shopHistoryYearOfCosmeticsEmbed.setAuthor({name: `تاريخ الشوب, السنه`, iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/shopping-cart_1f6d2.png'})
            shopHistoryYearOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار سنه تاريخ الشوب')
        }

        //loop through seasons
        const start = moment('2017-01-01')
        const end = moment().add(1, 'year')
        if(lang === "en") var yearsOfShopHistory = [{
            label: `Skip Year`,
            value: `skipYear`
        }]

        if(lang === "ar") var yearsOfShopHistory = [{
            label: `تخطي السنه`,
            value: `skipYear`
        }]

        while(start.year() != end.year()){

            yearsOfShopHistory.push({
                label: `${start.year()}`,
                value: `${start.year()}`
            })

            start.add(1, 'year');
        }

        //create a row for drop down menu for categories
        const shopHistoryYearOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const shopHistoryYearOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        shopHistoryYearOfCosmeticsDropMenu.setCustomId('historyYear')
        if(lang === "en") shopHistoryYearOfCosmeticsDropMenu.setPlaceholder('Select a year!')
        else if(lang === "ar") shopHistoryYearOfCosmeticsDropMenu.setPlaceholder('اختار سنه!')
        shopHistoryYearOfCosmeticsDropMenu.addOptions(yearsOfShopHistory)

        //add the drop menu to its row
        shopHistoryYearOfCosmeticsRow.addComponents(shopHistoryYearOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [shopHistoryYearOfCosmeticsEmbed], components: [shopHistoryYearOfCosmeticsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if user chose a year
            if(collected.customId === "historyYear"){
                if(collected.values[0] !== "skipYear") url += `&shopHistory=${collected.values[0]}-`
                else url += `&shopHistory=*-`

                //create an embed 
                const shopHistoryMonthOfCosmeticsEmbed = new Discord.EmbedBuilder()
                shopHistoryMonthOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en"){
                    shopHistoryMonthOfCosmeticsEmbed.setAuthor({name: `Shop History, Month`, iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/shopping-cart_1f6d2.png'})
                    shopHistoryMonthOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the shot history month.`)
                }else if(lang === "ar"){
                    shopHistoryMonthOfCosmeticsEmbed.setAuthor({name: `تاريخ الشوب, شهر`, iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/shopping-cart_1f6d2.png'})
                    shopHistoryMonthOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار شهر تاريخ الشوب')
                }

                //loop through seasons
                const now = moment("2022-01-01")
                const stopPoint = moment("2023-01-01")
                var monthsOfShopHistory = []

                while(now.year() != stopPoint.year()){
                    monthsOfShopHistory.push({
                        label: `${now.format("MMMM")}`,
                        value: `${now.format("MM")}`,
                    })

                    now.add(1, 'month')
                }

                //create a row for drop down menu for categories
                const shopHistoryMonthOfCosmeticsRow = new Discord.ActionRowBuilder()

                //create the drop menu
                const shopHistoryMonthOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
                shopHistoryMonthOfCosmeticsDropMenu.setCustomId('historyMonth')
                if(lang === "en") shopHistoryMonthOfCosmeticsDropMenu.setPlaceholder('Select a month!')
                else if(lang === "ar") shopHistoryMonthOfCosmeticsDropMenu.setPlaceholder('اختار شهر!')
                shopHistoryMonthOfCosmeticsDropMenu.addOptions(monthsOfShopHistory)

                //add the drop menu to its row
                shopHistoryMonthOfCosmeticsRow.addComponents(shopHistoryMonthOfCosmeticsDropMenu)

                //edit the orignal image
                itemFinderMessage.edit({embeds: [shopHistoryMonthOfCosmeticsEmbed], components: [shopHistoryMonthOfCosmeticsRow, buttonDataRow]})
                
                //await for the user
                await message.channel.awaitMessageComponent({filter, time: limit})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel"){
                        itemFinderMessage.delete() //delete the main message
                        values = [] //empty values
                        url = null //return a null url as the request has been canceled
                    }

                    //if user chose a year
                    if(collected.customId === "historyMonth"){
                        url += `${collected.values[0]}-`

                        //create an embed
                        const shopHistoryDayOfCosmeticsEmbed = new Discord.EmbedBuilder()
                        shopHistoryDayOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en"){
                            shopHistoryDayOfCosmeticsEmbed.setAuthor({name: `Shop History, Day`, iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/shopping-cart_1f6d2.png'})
                            shopHistoryDayOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the shot history day\n\`First drop menu lists days from 1 to 15 and the second lists the rest.\`.`)
                        }else if(lang === "ar"){
                            shopHistoryDayOfCosmeticsEmbed.setAuthor({name: `تاريخ الشوب, يوم`, iconURL: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/google/313/shopping-cart_1f6d2.png'})
                            shopHistoryDayOfCosmeticsEmbed.setDescription('\n\`اول سهم يحتوي على 15 يوم و السهم الثاني يحتوي على الايام المتبقية.\`الرجاء الضغط على السهم لاختيار يوم تاريخ الشوب')
                        }

                        //loop through seasons
                        const day = moment(collected.values[0], 'MM').daysInMonth()
                        if(lang === "en") var daysOfShopHistory15 = [{
                            label: `Skip Day`,
                            value: `skipDay`
                        }]
                
                        if(lang === "ar") var daysOfShopHistory15 = [{
                            label: `تخطي اليوم`,
                            value: `skipDay`
                        }]

                        if(lang === "en") var daysOfShopHistory30 = [{
                            label: `Skip Day`,
                            value: `skipDay`
                        }]
                
                        if(lang === "ar") var daysOfShopHistory30 = [{
                            label: `تخطي اليوم`,
                            value: `skipDay`
                        }]
                        
                        for(let i = 1; i <= day; i++){
                            
                            if(i <= 15) daysOfShopHistory15.push({
                                label: `${moment(i, 'D').format("Do")}`,
                                value: `${moment(i, 'D').format("DD")}`
                            })

                            else{
                                daysOfShopHistory30.push({
                                    label: `${moment(i, 'D').format("Do")}`,
                                    value: `${moment(i, 'D').format("DD")}`
                                })
                            }
                        }

                        //create a row for drop down menu for categories
                        const shopHistoryDay15OfCosmeticsRow = new Discord.ActionRowBuilder()
                        const shopHistoryDay30OfCosmeticsRow = new Discord.ActionRowBuilder()

                        //create the drop menu less tha 15
                        const shopHistoryDay15OfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
                        shopHistoryDay15OfCosmeticsDropMenu.setCustomId('historyDay15')
                        if(lang === "en") shopHistoryDay15OfCosmeticsDropMenu.setPlaceholder('Select a day! - 15 Days')
                        else if(lang === "ar") shopHistoryDay15OfCosmeticsDropMenu.setPlaceholder('اختار يوم! - 15 يوم')
                        shopHistoryDay15OfCosmeticsDropMenu.addOptions(daysOfShopHistory15)

                        //create the drop menu more tha 15
                        const shopHistoryDay30OfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
                        shopHistoryDay30OfCosmeticsDropMenu.setCustomId('historyDay30')
                        if(lang === "en") shopHistoryDay30OfCosmeticsDropMenu.setPlaceholder('Select a day! - +15 Days')
                        else if(lang === "ar") shopHistoryDay30OfCosmeticsDropMenu.setPlaceholder('اختار يوم! - +15 يوم')
                        shopHistoryDay30OfCosmeticsDropMenu.addOptions(daysOfShopHistory30)

                        //add the drop menu to its row
                        shopHistoryDay15OfCosmeticsRow.addComponents(shopHistoryDay15OfCosmeticsDropMenu)
                        shopHistoryDay30OfCosmeticsRow.addComponents(shopHistoryDay30OfCosmeticsDropMenu)

                        //edit the orignal image
                        itemFinderMessage.edit({embeds: [shopHistoryDayOfCosmeticsEmbed], components: [shopHistoryDay15OfCosmeticsRow, shopHistoryDay30OfCosmeticsRow, buttonDataRow]})
                        
                        //await for the user
                        await message.channel.awaitMessageComponent({filter, time: limit})
                        .then(async collected => {
                            collected.deferUpdate();

                            //if cancel button has been clicked
                            if(collected.customId === "Cancel"){
                                itemFinderMessage.delete() //delete the main message
                                values = [] //empty values
                                url = null //return a null url as the request has been canceled
                            }

                            //if user chose a year
                            if(collected.customId === "historyDay15" || collected.customId === "historyDay30"){
                                if(collected.values[0] !== "skipDay") url += `${collected.values[0]}`
                                else url += `*`
                                
                            }
                        })
                    }
                })
            }
        })
    }

    //if the user chose battlepass
    if(values.includes('battlepass')){

        //create an embed
        const chapterOfCosmeticsEmbed = new Discord.EmbedBuilder()
        chapterOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            chapterOfCosmeticsEmbed.setAuthor({name: `Battlepass, Chapter`, iconURL: 'https://imgur.com/90m1ldM.png'})
            chapterOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the battlepass's chapter.`)
        }else if(lang === "ar"){
            chapterOfCosmeticsEmbed.setAuthor({name: `بطاقة المعركة, الفصل`, iconURL: 'https://imgur.com/90m1ldM.png'})
            chapterOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار فصل بطاقة المعركة')
        }

        //loop through seasons
        const allChapters = [], foundChapters = []
        for(const chapters of seasonsData){

            if(!foundChapters.includes(chapters.chapter)){
                foundChapters.push(chapters.chapter)
                if(lang === "en") allChapters.push(
                    {
                        label: `Chapter ${chapters.chapter}`,
                        value: `${chapters.chapter}`
                    }
                )

                else if(lang === "ar") allChapters.push(
                    {
                        label: `الفصل ${chapters.chapter}`,
                        value: `${chapters.chapter}`
                    }
                )
            }
        }

        //create a row for drop down menu for categories
        const chapterOfCosmeticsRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const chapterOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
        chapterOfCosmeticsDropMenu.setCustomId('cosmetic_chapter')
        if(lang === "en") chapterOfCosmeticsDropMenu.setPlaceholder('Select a chapter!')
        else if(lang === "ar") chapterOfCosmeticsDropMenu.setPlaceholder('اختار فصل!')
        chapterOfCosmeticsDropMenu.addOptions(allChapters)

        //add the drop menu to its row
        chapterOfCosmeticsRow.addComponents(chapterOfCosmeticsDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [chapterOfCosmeticsEmbed], components: [chapterOfCosmeticsRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a search tag option has been chosen
            if(collected.customId === "cosmetic_chapter"){

                //create an embed
                const seasonOfCosmeticsEmbed = new Discord.EmbedBuilder()
                seasonOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en"){
                    seasonOfCosmeticsEmbed.setAuthor({name: `Battlepass, Season`, iconURL: 'https://imgur.com/90m1ldM.png'})
                    seasonOfCosmeticsEmbed.setDescription(`Please click on the Drop-Down menu and choose the battlepass's season`)
                }else if(lang === "ar"){
                    seasonOfCosmeticsEmbed.setAuthor({name: `بطاقة المعركة, الموسم`, iconURL: 'https://imgur.com/90m1ldM.png'})
                    seasonOfCosmeticsEmbed.setDescription('الرجاء الضغط على السهم لاختيار موسم بطاقة المعركة')
                }

                //loop through seasons
                const allSeasons = []
                for(const seasons of seasonsData){

                    if(seasons.chapter === Number(collected.values[0])) allSeasons.push({
                            label: seasons.displayName,
                            value: `&battlepass.displayText.chapter=Chapter ${collected.values[0]}&battlepass.displayText.season=Season ${seasons.season}`
                        })
                }

                //create a row for drop down menu for categories
                const seasonOfCosmeticsRow = new Discord.ActionRowBuilder()

                //create the drop menu
                const seasonOfCosmeticsDropMenu = new Discord.SelectMenuBuilder()
                seasonOfCosmeticsDropMenu.setCustomId('cosmetic_season')
                if(lang === "en") seasonOfCosmeticsDropMenu.setPlaceholder('Select a season!')
                else if(lang === "ar") seasonOfCosmeticsDropMenu.setPlaceholder('اختار موسم!')
                seasonOfCosmeticsDropMenu.addOptions(allSeasons)

                //add the drop menu to its row
                seasonOfCosmeticsRow.addComponents(seasonOfCosmeticsDropMenu)

                //edit the orignal image
                itemFinderMessage.edit({embeds: [seasonOfCosmeticsEmbed], components: [seasonOfCosmeticsRow, buttonDataRow]})
                
                //await for the user
                await message.channel.awaitMessageComponent({filter, time: limit})
                .then(async collected => {
                    collected.deferUpdate();

                    //if cancel button has been clicked
                    if(collected.customId === "Cancel"){
                        itemFinderMessage.delete() //delete the main message
                        values = [] //empty values
                        url = null //return a null url as the request has been canceled
                    }

                    //if a search tag option has been chosen
                    if(collected.customId === "cosmetic_season") url += `${collected.values[0]}`
                    
                })
            }
        })
    }

    //if the user chose a game version
    if(values.includes('version')){

        //create an embed
        const versionOfCosmeticsEmbed = new Discord.EmbedBuilder()
        versionOfCosmeticsEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            versionOfCosmeticsEmbed.setTitle(`Cosmetic Update Version`)
            versionOfCosmeticsEmbed.setDescription(`Please click on the start button to add a cosmetic update version.`)
        }else if(lang === "ar"){
            versionOfCosmeticsEmbed.setTitle(`رقم تحديث العنصر`)
            versionOfCosmeticsEmbed.setDescription('الرجاء الضغط على زر البدء لتحديد رقم تحديث العنصر.')
        }

        //create a row for buttons
        const buttonDataForModalRow = new Discord.ActionRowBuilder()

        //add EN buttons
        if(lang === "en"){
            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Start')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("Start")
            ) 

            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel")
            )
        }

        //add AR buttons
        else if(lang === "ar"){
            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Start')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("البدء")
            )

            buttonDataForModalRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('Cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("اغلاق")
            )
        }

        // Create the modal and add text fields
        const versionModal = new Discord.ModalBuilder()
        versionModal.setCustomId('version')
        if(lang === "en"){
            versionModal.setTitle('Cosmetic Update Version') //set modal title
            versionModal.addComponents( // add fields
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('versionInput')
                    .setLabel("Cosmetic update version (Only Number).")
                    .setStyle(Discord.TextInputStyle.Short)
                )
            )
        }else if(lang === "ar"){
            versionModal.setTitle('رقم تحديث العنصر') //set modal title
            versionModal.addComponents( // add fields
                new Discord.ActionRowBuilder().addComponents(
                    new Discord.TextInputBuilder()
                    .setCustomId('versionInput')
                    .setLabel("رقم تحديث العنصر (فقط ارقام).")
                    .setStyle(Discord.TextInputStyle.Short)
                )
            )
        }

        //edit the orignal image
        itemFinderMessage.edit({embeds: [versionOfCosmeticsEmbed], components: [buttonDataForModalRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if the user clicked on start
            if(collected.customId === "Start"){
                await collected.showModal(versionModal)

                //listen for modal submission
                const modalFilter = (interaction) => interaction.customId === 'version';
                await collected.awaitModalSubmit({modalFilter, time: limit})
                .then(async modalCollect => {
                    modalCollect.deferUpdate();

                    //register the submited input value
                    url += `&added.version=${modalCollect.fields.getTextInputValue('versionInput')}`
                    
                })
            }
        })
    }

    //if the user chose copyrighted
    if(values.includes('copyrighted')){

        //create an embed
        const copyrightedEmbed = new Discord.EmbedBuilder()
        copyrightedEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            copyrightedEmbed.setAuthor({name: `Copyrighted`, iconURL: `https://imgur.com/Xx5n7WW.png`})
            copyrightedEmbed.setDescription(`Please click on the Drop-Down menu and choose if the cosmetic contains copyrighted audio or not.`)
        }else if(lang === "ar"){
            copyrightedEmbed.setAuthor({name: `حقوق الطبع و النشر`, iconURL: `https://imgur.com/Xx5n7WW.png`})
            copyrightedEmbed.setDescription('الرجاء الضغط على السهم لاختيار ما اذا كان العنصر يحتوي على حقوق الطبع و النشر ام لا.')
        }

        //create a row for drop down menu for categories
        const copyrightedRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const copyrightedDropMenu = new Discord.SelectMenuBuilder()
        copyrightedDropMenu.setCustomId('copyrighted_audio')
        if(lang === "en") copyrightedDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") copyrightedDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for EN
        if(lang === "en") copyrightedDropMenu.addOptions(
            {
                label: 'Yes, it does',
                value: 'true',
                emoji: `✅`
            },
            {
                label: 'No, it doesn\'t',
                value: 'false',
                emoji: `❎`
            }
        )

        //add options for AR
        if(lang === "ar") copyrightedDropMenu.addOptions(
            {
                label: 'نعم, انه كذلك',
                value: 'true',
                emoji: `✅`
            },
            {
                label: 'لا, انه ليس كذلك',
                value: 'false',
                emoji: `❎`
            }
        )

        //add the drop menu to its row
        copyrightedRow.addComponents(copyrightedDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [copyrightedEmbed], components: [copyrightedRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a copyrighted option has been chosen
            if(collected.customId === "copyrighted_audio") url += `&copyrighted=${collected.values[0]}`
            
        })
    }
    
    //if the user chose upcoming
    if(values.includes('upcoming')){

        //create an embed
        const upcomingEmbed = new Discord.EmbedBuilder()
        upcomingEmbed.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en"){
            upcomingEmbed.setAuthor({name: `Upcoming`, iconURL: `https://imgur.com/Xx5n7WW.png`})
            upcomingEmbed.setDescription(`Please click on the Drop-Down menu and choose if the cosmetic is upcoming or not.`)
        }else if(lang === "ar"){
            upcomingEmbed.setAuthor({name: `قادم قريبا`, iconURL: `https://imgur.com/Xx5n7WW.png`})
            upcomingEmbed.setDescription('الرجاء الضغط على السهم لاختيار ما اذا كان العنصر قادم قريبا ام لا.')
        }

        //create a row for drop down menu for categories
        const upcomingRow = new Discord.ActionRowBuilder()

        //create the drop menu
        const upcomingDropMenu = new Discord.SelectMenuBuilder()
        upcomingDropMenu.setCustomId('upcoming')
        if(lang === "en") upcomingDropMenu.setPlaceholder('Nothing selected!')
        else if(lang === "ar") upcomingDropMenu.setPlaceholder('الرجاء الأختيار!')

        //add options for EN
        if(lang === "en") upcomingDropMenu.addOptions(
            {
                label: 'Yes, it does',
                value: 'true',
                emoji: `✅`
            },
            {
                label: 'No, it doesn\'t',
                value: 'false',
                emoji: `❎`
            }
        )

        //add options for AR
        if(lang === "ar") upcomingDropMenu.addOptions(
            {
                label: 'نعم, انه كذلك',
                value: 'true',
                emoji: `✅`
            },
            {
                label: 'لا, انه ليس كذلك',
                value: 'false',
                emoji: `❎`
            }
        )

        //add the drop menu to its row
        upcomingRow.addComponents(upcomingDropMenu)

        //edit the orignal image
        itemFinderMessage.edit({embeds: [upcomingEmbed], components: [upcomingRow, buttonDataRow]})
        
        //await for the user
        await message.channel.awaitMessageComponent({filter, time: limit})
        .then(async collected => {
            collected.deferUpdate();

            //if cancel button has been clicked
            if(collected.customId === "Cancel"){
                itemFinderMessage.delete() //delete the main message
                values = [] //empty values
                url = null //return a null url as the request has been canceled
            }

            //if a copyrighted option has been chosen
            if(collected.customId === "upcoming") url += `&upcoming=${collected.values[0]}`
            
        })
    }

    //return the url request
    if(url) itemFinderMessage.delete() //delete the main message
    return url

}
