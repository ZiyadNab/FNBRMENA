const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');

module.exports = {
    commands: 'merge',
    expectedArgs: '[ Name of the cosmetics with + between everyone ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: 15,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //num for the specific item
        var num = 0

        //inisilizing list and names
        var names = []
        var list = []
        var namesCounter = 0

        //handling errors
        var errorHandleing = 0

        //specify the parms
        var type = "name"

        const listItems = async () => {

            //storing the items
            var list = []
            var listCounter = 0
            while(await text.indexOf("+") !== -1){

                //getting the index of the + in text string
                var stringNumber = text.indexOf("+")
                //substring the cosmetic name and store it
                var cosmetic = text.substring(0,stringNumber)
                //trimming every space
                cosmetic = cosmetic.trim()
                //store it into the array
                list[listCounter] = cosmetic
                //remove the cosmetic from text to start again if the while statment !== -1
                text = text.replace(cosmetic + ' +','')
                //remove every space in text
                text = text.trim()
                //add the listCounter index
                listCounter++
                //end of wile lets try aagin
            }
            //still there is the last cosmetic name so lets trim text
            text = text.trim()
            //add the what text holds in the last index
            list[listCounter++] = text

            //loop throw every item
            for(let i = 0; i < list.length; i++){

                //if still there is no error
                if(errorHandleing === 0){

                    //if the input is *
                    if(list[i] === "*"){
                    
                        //remove everything from text
                        text = ""
            
                        //change the type
                        type = "custom"
            
                        const query = [
                            'type',
                            'price',
                            'series',
                            'rarity',
                            'introduction',
                            'tags',
                            'set',
                            'battlepass',
                            'copyrighted',
                        ]
            
                        //add every type in-game
                        var types = [
                            'outfit',
                            'backpack',
                            'pickaxe',
                            'glider',
                            'contrail',
                            'emote',
                            'spray',
                            'wrap',
                            'music',
                            'loadingscreen'
                        ]
            
                        //list of gameplay tags
                        var tags = [
                            'Cosmetics.Source.ItemShop',
                            'Cosmetics.UserFacingFlags.HasVariants',
                            'Cosmetics.UserFacingFlags.Reactive',
                            'Cosmetics.UserFacingFlags.Emote.Traversal',
                            'Cosmetics.UserFacingFlags.Wrap.Animated',
                            'Cosmetics.UserFacingFlags.Synced'
                        ]
            
                        //add every series in-game
                        var series = [
                            'MarvelSeries',
                            'DCUSeries',
                            'ColumbusSeries',
                            'CUBESeries',
                            'CreatorCollabSeries',
                            'ShadowSeries',
                            'SlurpSeries',
                            'FrozenSeries',
                            'LavaSeries',
                            'PlatformSeries'
                        ]
            
                        //add every rarity in-game
                        var rarities = [
                            'LEGENDARY',
                            'EPIC',
                            'RARE',
                            'UNCOMMON',
                            'COMMON',
                        ]
                        
                        //create an embed
                        const choose = await new Discord.MessageEmbed()
            
                        //set color
                        await choose.setColor(FNBRMENA.Colors("embed"))
            
                        //set title
                        if(await lang === "en") choose.setTitle(`Please specify your search types`)
                        else if(await lang === "ar") choose.setTitle(`الرجاء اختيار نوع عملية البحث`)
            
                        if(await lang === "en"){
            
                            //add fields ar
                            await choose.addFields(
                                {name: '• 0: Type', value: 'Used to specify the item type ~ e.g. Outfits, Emotes...'},
                                {name: '• 1: Price', value: 'Used to specify the item price ~ e.g. 1500, 1200...'},
                                {name: '• 2: Series', value: 'Used to specify the item series ~ e.g. Icon Series, DC Series...'},
                                {name: '• 3: Rarity', value: 'Used to specify the item rarity ~ e.g. Legendary, Rare...'},
                                {name: '• 4: Introduction', value: 'Used to specify the item introduction ~ e.g. Chatper 2 Season 3...'},
                                {name: '• 5: Tags', value: 'Used to specify the item gameplay tags ~ e.g. Itemshop, Reactive, Styles...'},
                                {name: '• 6: Set', value: 'Used to specify the item set ~ e.g. Storm Scavenger, To The Moon...'},
                                {name: '• 7: Battlepass', value: 'Used to specify the item battlepass ~ e.g. Chatper 2 Season 3...'},
                                {name: '• 8: Copyrighted', value: 'Used to specify if the item containg copyrighted audio or not ~ e.g. True, False'},
                            )
                        }else if(await lang === "ar"){
            
                            //add fields ar
                            await choose.addFields(
                                {name: '• 0: النوع', value: 'يستعمل في تحديد نوع العنصر ~ مثل سكنات, رقصات...'},
                                {name: '• 1: السعر', value: 'يستعمل في تحديد نوع السعر ~ مثل 1500, 1200...'},
                                {name: '• 2: السلسلة', value: 'يستعمل في تحديد سلسلة العنصر ~ مثل ايكون, دي سي...'},
                                {name: '• 3: الندرة', value: 'يستعمل في تحديد نوع الندرة ~ مثل اسطوري, نادر...'},
                                {name: '• 4: تقديم العنصر', value: 'يستعمل في تحديد متى تم تقديم العنصر ~ مثل شابتر ٢ سيزون ٣...'},
                                {name: '• 5: شعارات', value: 'يستعمل في تحديد شعارات العنصر ~ مثل ايتم شوب, متفاعل، ستايلات!...'},
                                {name: '• 6: المجموعة', value: 'يستعمل في تحديد نوع المجموعة ~ مثل كاسحة العاصفة, نحو القمر!...'},
                                {name: '• 7: باتل باس', value: 'يستعمل في تحديد الباتل باس للعنصر ~ مثل شابتر ٢ سيزون ٣...'},
                                {name: '• 8: حقوق الطبع و النشر', value: 'يستعمل في تحديد اذا العنصر يحتوي على حقوق الطبع و النشر ام لا ~ مثال True او False'},
                            )
                        }
            
                        //send the message
                        await message.channel.send(choose)
                        .then(async choose => {
            
                            //filtering
                            const filter = async m => await m.author.id === message.author.id
            
                            //add the reply
                            if(await lang === "en") var reply = "please choose from above list the command will stop listen in 20 sec"
                            else if(await lang === "ar") var reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
            
                            //send the message
                            await message.reply(reply)
                            .then( async notify => {
            
                                //await messages
                                await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                                .then( async collected => {
            
                                    //delete messages
                                    notify.delete()
                                    choose.delete()
            
                                    //storing the items
                                    var list = []
                                    var Counter = 0
                                    while(await collected.first().content.indexOf("+") !== -1){
            
                                        //getting the index of the + in text string
                                        var stringNumber = collected.first().content.indexOf("+")
                                        //substring the typeChosen name and store it
                                        var typeChosen = collected.first().content.substring(0,stringNumber)
                                        //trimming every space
                                        typeChosen = typeChosen.trim()
                                        //store it into the array
                                        list[Counter] = typeChosen
                                        //remove the typeChosen from text to start again if the while statment !== -1
                                        collected.first().content = collected.first().content.replace(typeChosen + ' +','')
                                        //remove every space in text
                                        collected.first().content = collected.first().content.trim()
                                        //add the counter index
                                        Counter++
                                        //end of while lets try aagin
                                    }
                                    //still there is the last typeChosen name so lets trim text
                                    collected.first().content = collected.first().content.trim()
                                    //add the what text holds in the last index
                                    list[Counter++] = await collected.first().content
            
                                    if(list.length > 1){
                                        //listen for user input
                                        for(let i = 0; i < list.length; i++){
            
                                            //if the user input is valid
                                            if(query.includes(query[list[i]])){
                                                
                                                if(errorHandleing === 0){
            
                                                    if(query[list[i]] === "type"){
            
                                                        //create embed
                                                        const typeInput = await new Discord.MessageEmbed()
                
                                                        //set the color
                                                        await typeInput.setColor(FNBRMENA.Colors("embed"))
                
                                                        //set title
                                                        if(lang === "en") typeInput.setTitle('what is the type of the item ?')
                                                        else if(lang === "ar") typeInput.setTitle('ايش نوع العنصر ؟')
                
                                                        //set description
                                                        if(lang === "en") typeInput.setDescription("0: Outfit\n1: Backbling\n2: Pickaxe\n3: Glider\n4: Contrail\n5: Emote\n6: Spray\n7: Wrap\n8: Music Pack\n9: Loading Screen")
                                                        else if(lang === "ar") typeInput.setDescription("0: سكن\n1: شنطة\n2: بيكاكس\n3: مظلة\n4: نزلة\n5: رقصة\n6: بخاخ\n7: لون سلاح\n8: ميوزك لوبي\n9: شاشة تحميل")
                
                                                        //send the embed
                                                        await message.channel.send(typeInput)
                                                        .then(async msgTypes => {
                
                                                            //add the reply
                                                            if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                                                            else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                            await message.reply(reply)
                                                            .then( async notifyType => {
                
                                                                //listen for user input
                                                                await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                                .then( async collectedType => {
                
                                                                    //delete the message
                                                                    notifyType.delete()
                                                                    msgTypes.delete()
                
                                                                    //check if its a number
                                                                    if(!isNaN(collectedType.first().content)){
            
                                                                        //check if the number in range
                                                                        if(collectedType.first().content >= 0 && collectedType.first().content < types.length){
                    
                                                                            //store the type
                                                                            text += "&type=" + types[collectedType.first().content]
                                                                        }else{
                                                                            
                                                                            //add an error
                                                                            errorHandleing++
                    
                                                                            //if user typed a number out of range
                                                                            if(lang === "en"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }else if(lang === "ar"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }
                                                                        }
                                                                    }else{
                                                                        //add an error
                                                                        errorHandleing++
                        
                                                                        //if user typed a number out of range
                                                                        if(lang === "en"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }else if(lang === "ar"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }
                                                                    }
                                                                }).catch(err => {
                
                                                                    //if user took to long to excute the command
                                                                    notifyType.delete()
                                                                    msgTypes.delete()
                
                                                                    //add an error
                                                                    errorHandleing++
                
                                                                    const errorTime = new Discord.MessageEmbed()
                                                                    .setColor(FNBRMENA.Colors("embed"))
                                                                    .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                    message.reply(errorTime)
                                                                })
                                                            })
                                                        })
                                                    }
                
                                                    if(query[list[i]] === "price"){
                                                        //add the reply
                                                        if(lang === "en") reply = "what is your price ? the command will stop listen in 20 sec"
                                                        else if(lang === "ar") reply = "ماهو السعر؟، سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                        await message.reply(reply)
                                                        .then( async notifyPrice => {
                
                                                            //listen for user input
                                                            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                            .then( async collectedPrice => {
                
                                                                //delete the message
                                                                notifyPrice.delete()
                
                                                                //check if its a number
                                                                if(!isNaN(collectedPrice.first().content)){
            
                                                                    //check if the number in range
                                                                    if(collectedPrice.first().content >= 0 && collectedPrice.first().content <= 5000){
            
                                                                        text += "&price=" + collectedPrice.first().content
                                                                    }else{
                                                                        //add an error
                                                                        errorHandleing++
                    
                                                                        //if user typed a number out of range
                                                                        if(lang === "en"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }else if(lang === "ar"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }
                                                                    }
                                                                }else{
                                                                    //add an error
                                                                    errorHandleing++
                    
                                                                    //if user typed a number out of range
                                                                    if(lang === "en"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }else if(lang === "ar"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }
                                                                }
                                                            }).catch(err => {
                
                                                                //add an error
                                                                errorHandleing++
            
                                                                //delete the message
                                                                notifyPrice.delete()
                
                                                                //if user took to long to excute the command
                                                                const priceError = new Discord.MessageEmbed()
                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                message.reply(priceError)
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "series"){
            
                                                        //create embed
                                                        const seriesInput = await new Discord.MessageEmbed()
                
                                                        //set the color
                                                        await seriesInput.setColor(FNBRMENA.Colors("embed"))
                
                                                        //set title
                                                        if(lang === "en") seriesInput.setTitle('what is the series of the item ?')
                                                        else if(lang === "ar") seriesInput.setTitle('ايش هي سلسلة العنصر ؟')
                
                                                        //set description
                                                        if(lang === "en") seriesInput.setDescription("0: Marvel\n1: DC\n2: StarWars\n3: Dark\n4: Icon\n5: Shadow\n6: Slurp\n7: Frozen\n8: Lava\n9: Gaming")
                                                        else if(lang === "ar") seriesInput.setDescription("0: مارفل\n1: دي سي\n2: ستار وارز\n3: المكعب\n4: المشاهير\n5: الظلام\n6: السلرب\n7: الثلج\n8: اللافا\n9: الالعاب")
                
                                                        //send the embed
                                                        await message.channel.send(seriesInput)
                                                        .then(async msgSeries => {
                
                                                            //add the reply
                                                            if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                                                            else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                            await message.reply(reply)
                                                            .then( async notifySeries => {
                
                                                                //listen for user input
                                                                await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                                .then( async collectedSeries => {
                
                                                                    //delete the message
                                                                    notifySeries.delete()
                                                                    msgSeries.delete()
                
                                                                    //check if its a number
                                                                    if(!isNaN(collectedSeries.first().content)){
            
                                                                        if(collectedSeries.first().content >= 0 && collectedSeries.first().content < series.length){
                    
                                                                            //store the type
                                                                            text += "&series=" + series[collectedSeries.first().content]
                                                                        }else{
                                                                            
                                                                            //add an error
                                                                            errorHandleing++
                    
                                                                            //if user typed a number out of range
                                                                            if(lang === "en"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }else if(lang === "ar"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }
                                                                        }
                                                                    }else{
                                                                        //add an error
                                                                        errorHandleing++
                        
                                                                        //if user typed a number out of range
                                                                        if(lang === "en"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }else if(lang === "ar"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }
                                                                    }
                                                                }).catch(err => {
                
                                                                    //delete the message
                                                                    notifySeries.delete()
                                                                    msgSeries.delete()
                
                                                                    //add an error
                                                                    errorHandleing++
                
                                                                    const errorTime = new Discord.MessageEmbed()
                                                                    .setColor(FNBRMENA.Colors("embed"))
                                                                    .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                    message.reply(errorTime)
                                                                })
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "rarity"){
            
                                                        //create embed
                                                        const rarityInput = await new Discord.MessageEmbed()
                
                                                        //set the color
                                                        await rarityInput.setColor(FNBRMENA.Colors("embed"))
                
                                                        //set title
                                                        if(lang === "en") rarityInput.setTitle('what is the rarity of the item ?')
                                                        else if(lang === "ar") rarityInput.setTitle('ايش هي ندرة العنصر ؟')
                
                                                        //set description
                                                        if(lang === "en") rarityInput.setDescription("0: Legendary\n1: Epic\n2: Rare\n3: Uncommon\n4: Common")
                                                        else if(lang === "ar") rarityInput.setDescription("0: أسطوري\n1: ملحمي\n2: نادر\n3: غير شائع\n4: شائع")
                
                                                        //send the embed
                                                        await message.channel.send(rarityInput)
                                                        .then(async msgRarity => {
                
                                                            //add the reply
                                                            if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                                                            else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                            await message.reply(reply)
                                                            .then( async notifyRarity => {
                
                                                                //listen for user input
                                                                await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                                .then( async collectedRarity => {
                
                                                                    //delete the message
                                                                    notifyRarity.delete()
                                                                    msgRarity.delete()
            
                                                                    //check if its a number
                                                                    if(!isNaN(collectedRarity.first().content)){
                
                                                                        if(collectedRarity.first().content >= 0 && collectedRarity.first().content < rarities.length){
                    
                                                                            //store the type
                                                                            text += "&rarity=" + rarities[collectedRarity.first().content]
                                                                        }else{
                                                                            
                                                                            //add an error
                                                                            errorHandleing++
                    
                                                                            //if user typed a number out of range
                                                                            if(lang === "en"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }else if(lang === "ar"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }
                                                                        }
                                                                    }else{
                                                                        //add an error
                                                                        errorHandleing++
                        
                                                                        //if user typed a number out of range
                                                                        if(lang === "en"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }else if(lang === "ar"){
                                                                            const errorType = await new Discord.MessageEmbed()
                                                                            .setColor(FNBRMENA.Colors("embed"))
                                                                            .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                            message.reply(errorType)
                                                                        }
                                                                    }
                                                                }).catch(err => {
                
                                                                    //delete the message
                                                                    notifyRarity.delete()
                                                                    msgRarity.delete()
                
                                                                    //add an error
                                                                    errorHandleing++
                
                                                                    const errorTime = new Discord.MessageEmbed()
                                                                    .setColor(FNBRMENA.Colors("embed"))
                                                                    .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                    message.reply(errorTime)
                                                                })
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "introduction"){
            
                                                        //add the reply
                                                        if(lang === "en") reply = "what is the chapter ? the command will stop listen in 20 sec"
                                                        else if(lang === "ar") reply = "ماهو الشابتر سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                        await message.reply(reply)
                                                        .then( async notifyChapter => {
                
                                                            //listen for user input
                                                            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                            .then( async collectedChapter => {
                
                                                                //delete the message
                                                                notifyChapter.delete()
                
                                                                //check if its a number
                                                                if(!isNaN(collectedChapter.first().content)){
            
                                                                    text += "&introduction.chapter=Chapter " + collectedChapter.first().content
                                                                }else{
                                                                    //add an error
                                                                    errorHandleing++
            
                                                                    //if user typed a number out of range
                                                                    if(lang === "en"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }else if(lang === "ar"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }
                                                                }
            
                                                                //add the reply
                                                                if(lang === "en") reply = "what is the season ? the command will stop listen in 20 sec"
                                                                else if(lang === "ar") reply = "ماهو السيزون سوف ينتهي الامر خلال ٢٠ ثانية"
                        
                                                                await message.reply(reply)
                                                                .then( async notifySeason => {
                        
                                                                    //listen for user input
                                                                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                                    .then( async collectedSeason => {
                        
                                                                        //delete the message
                                                                        notifySeason.delete()
                        
                                                                        text += "&introduction.season=Season " + collectedSeason.first().content
                                                                    }).catch(err => {
                        
                                                                        //add an error
                                                                        errorHandleing++
            
                                                                        //delete the message
                                                                        notifySeason.delete()
                        
                                                                        //if user took to long to excute the command
                                                                        const priceError = new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                        message.reply(priceError)
                                                                    })
                                                                })
                                                            }).catch(err => {
                
                                                                //add an error
                                                                errorHandleing++
            
                                                                //delete the message
                                                                notifyChapter.delete()
                
                                                                //if user took to long to excute the command
                                                                const priceError = new Discord.MessageEmbed()
                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                message.reply(priceError)
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "tags"){
            
                                                        //create embed
                                                        const tagsInput = await new Discord.MessageEmbed()
                
                                                        //set the color
                                                        await tagsInput.setColor(FNBRMENA.Colors("embed"))
                
                                                        //set title
                                                        if(lang === "en") tagsInput.setTitle('what is the tags of the item ?')
                                                        else if(lang === "ar") tagsInput.setTitle('ايش هي الشعارات للعنصر ؟')
            
                                                        if(lang === "en") tagsInput.setDescription(`0: Itemshop\n1: Has Styles\n2: Reactive\n3: Traversal\n4: Animated\n5: Synced`)
                                                        else if(lang === "ar") tagsInput.setDescription(`0: ايتم شوب\n1: يتضمن ستايلات\n2: متفاعل\n3: قابل للمشي\n4: متحرك\n5: متزامن`)
            
                                                        //send the embed
                                                        await message.channel.send(tagsInput)
                                                        .then(async msgTags => {
                
                                                            //add the reply
                                                            if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                                                            else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                            await message.reply(reply)
                                                            .then( async notifyTags => {
            
                                                                //listen for user input
                                                                await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                                .then( async collectedTags => {
            
                                                                    //delete messages
                                                                    notifyTags.delete()
                                                                    msgTags.delete()
            
                                                                    //add the gameplay parms to text
                                                                    text += "&gameplayTags="
            
                                                                    //storing the items
                                                                    var listTags = []
                                                                    var CounterTags = 0
                                                                    while(await collectedTags.first().content.indexOf("+") !== -1){
            
                                                                        //getting the index of the + in text string
                                                                        var stringNumber = collectedTags.first().content.indexOf("+")
                                                                        //substring the tagsChosen name and store it
                                                                        var tagsChosen = collectedTags.first().content.substring(0,stringNumber)
                                                                        //trimming every space
                                                                        tagsChosen = tagsChosen.trim()
                                                                        //store it into the array
                                                                        listTags[CounterTags] = tagsChosen
                                                                        //remove the tagsChosen from text to start again if the while statment !== -1
                                                                        collectedTags.first().content = collectedTags.first().content.replace(tagsChosen + ' +','')
                                                                        //remove every space in text
                                                                        collectedTags.first().content = collectedTags.first().content.trim()
                                                                        //add the counter index
                                                                        CounterTags++
                                                                        //end of while lets try aagin
                                                                    }
                                                                    //still there is the last tagsChosen name so lets trim text
                                                                    collectedTags.first().content = collectedTags.first().content.trim()
                                                                    //add the what text holds in the last index
                                                                    listTags[CounterTags++] = await collectedTags.first().content
            
                                                                    //add the first tag
                                                                    text += tags[listTags[0]]
            
                                                                    for(let t = 1; t < listTags.length; t++){
            
                                                                        //check if its a number
                                                                        if(!isNaN(listTags[t])){
                                                                            //check if the number in range
                                                                            if(listTags[t] >= 0 && listTags[t] < tags.length){
                        
                                                                                //store the type
                                                                                text += "," + tags[listTags[t]]
                                                                            }else{
                                                                                
                                                                                //add an error
                                                                                errorHandleing++
                        
                                                                                //if user typed a number out of range
                                                                                if(lang === "en"){
                                                                                    const errorType = await new Discord.MessageEmbed()
                                                                                    .setColor(FNBRMENA.Colors("embed"))
                                                                                    .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                                                                    message.reply(errorType)
                                                                                }else if(lang === "ar"){
                                                                                    const errorType = await new Discord.MessageEmbed()
                                                                                    .setColor(FNBRMENA.Colors("embed"))
                                                                                    .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                                                                    message.reply(errorType)
                                                                                }
                                                                            }
                                                                        }else{
                                                                            //add an error
                                                                            errorHandleing++
                            
                                                                            //if user typed a number out of range
                                                                            if(lang === "en"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }else if(lang === "ar"){
                                                                                const errorType = await new Discord.MessageEmbed()
                                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                                .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                                message.reply(errorType)
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "set"){
                                                        //add the reply
                                                        if(lang === "en") reply = "what is the set ? the command will stop listen in 20 sec"
                                                        else if(lang === "ar") reply = "ماهي المجموعة؟، سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                        await message.reply(reply)
                                                        .then( async notifySet => {
                
                                                            //listen for user input
                                                            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                            .then( async collectedSet => {
                
                                                                //delete the message
                                                                notifySet.delete()
                
                                                                text += "&set.name=" + collectedSet.first().content
                                                            }).catch(err => {
                
                                                                //add an error
                                                                errorHandleing++
            
                                                                //delete the message
                                                                notifySet.delete()
                
                                                                //if user took to long to excute the command
                                                                const priceError = new Discord.MessageEmbed()
                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                message.reply(priceError)
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "battlepass"){
            
                                                        //add the reply
                                                        if(lang === "en") reply = "what is the battlepass chapter ? the command will stop listen in 20 sec"
                                                        else if(lang === "ar") reply = "ماهو الشابتر للباتل باس سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                        await message.reply(reply)
                                                        .then( async notifyBattlepassChapter => {
                
                                                            //listen for user input
                                                            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                            .then( async collectedBattlepassChapter => {
                
                                                                //delete the message
                                                                notifyBattlepassChapter.delete()
            
                                                                //check if its a number
                                                                if(!isNaN(collectedBattlepassChapter.first().content)){
                                                                    text += "&battlepass.displayText.chapter=Chapter " + collectedBattlepassChapter.first().content
                                                                }else{
                                                                    //add an error
                                                                    errorHandleing++
            
                                                                    //if user typed a number out of range
                                                                    if(lang === "en"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`Please type only number without any symbols or words ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }else if(lang === "ar"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`رجاء كتابة فقط رقم بدون كلامات او علامات ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }
                                                                }
            
                                                                //add the reply
                                                                if(lang === "en") reply = "what is the battlepass season ? the command will stop listen in 20 sec"
                                                                else if(lang === "ar") reply = "ماهو السيزون للباتل باس سوف ينتهي الامر خلال ٢٠ ثانية"
                        
                                                                await message.reply(reply)
                                                                .then( async notifyBattlepassSeason => {
                        
                                                                    //listen for user input
                                                                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                                    .then( async collectedBattlepassSeason => {
                        
                                                                        //delete the message
                                                                        notifyBattlepassSeason.delete()
                        
                                                                        text += "&battlepass.displayText.season=Season " + collectedBattlepassSeason.first().content
                                                                    }).catch(err => {
                        
                                                                        //add an error
                                                                        errorHandleing++
            
                                                                        //delete the message
                                                                        notifyBattlepassSeason.delete()
                        
                                                                        //if user took to long to excute the command
                                                                        const priceError = new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                        message.reply(priceError)
                                                                    })
                                                                })
                                                            }).catch(err => {
                
                                                                //add an error
                                                                errorHandleing++
            
                                                                //delete the message
                                                                notifyBattlepassChapter.delete()
                
                                                                //if user took to long to excute the command
                                                                const priceError = new Discord.MessageEmbed()
                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                message.reply(priceError)
                                                            })
                                                        })
                                                    }
            
                                                    if(query[list[i]] === "copyrighted"){
                                                        //add the reply
                                                        if(lang === "en") reply = "is the item containg copyrighted audio ? the command will stop listen in 20 sec"
                                                        else if(lang === "ar") reply = "هل العنصر يحتوي على حقوق طبع و نشر سوف ينتهي الامر خلال ٢٠ ثانية"
                
                                                        await message.reply(reply)
                                                        .then( async notifyCopyrighted => {
                
                                                            //listen for user input
                                                            await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                                                            .then( async collectedCopyrighted => {
                
                                                                //delete the message
                                                                notifyCopyrighted.delete()
                
                                                                //check if the user typo is right or not
                                                                if(collectedCopyrighted.first().content.toLowerCase() === "true" || collectedCopyrighted.first().content.toLowerCase() === "false"){
                                                                    text += "&copyrightedAudio=" + collectedCopyrighted.first().content.toLowerCase()
                                                                }else{
                                                                    //add an error
                                                                    errorHandleing++
                
                                                                    //if user typed a number out of range
                                                                    if(lang === "en"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`Please type TRUE or FALSE correctly ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }else if(lang === "ar"){
                                                                        const errorType = await new Discord.MessageEmbed()
                                                                        .setColor(FNBRMENA.Colors("embed"))
                                                                        .setTitle(`الرجاء كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)
                                                                        message.reply(errorType)
                                                                    }
                                                                }
                                                            }).catch(err => {
                
                                                                //add an error
                                                                errorHandleing++
            
                                                                //delete the message
                                                                notifyCopyrighted.delete()
                
                                                                //if user took to long to excute the command
                                                                const priceError = new Discord.MessageEmbed()
                                                                .setColor(FNBRMENA.Colors("embed"))
                                                                .setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                                                message.reply(priceError)
                                                            })
                                                        })
                                                    }
                                                }
                                            }else{
                                                //add an error
                                                errorHandleing++

                                                const errorNumberNotListed = new Discord.MessageEmbed()
                                                errorNumberNotListed.setColor(FNBRMENA.Colors("embed"))
                                                if(lang === "en") errorNumberNotListed.setTitle(`The number ${list[i]} is not listed ${errorEmoji}`)
                                                else if(lang === "ar") errorNumberNotListed.setTitle(`الرقم ${list[i]} ليس موجود بالقائمة ${errorEmoji}`)
                                                message.reply(errorNumberNotListed)
                                            }
                                        }
                                    }else{
                                        
                                        //add an error
                                        errorHandleing++
                                        const errorMoreTypes = new Discord.MessageEmbed()
                                        errorMoreTypes.setColor(FNBRMENA.Colors("embed"))
                                        if(lang === "en") errorMoreTypes.setTitle(`Please choose 2 or more types to make the command works ${errorEmoji}`)
                                        else if(lang === "ar") errorMoreTypes.setTitle(`يجب عليك الاختيار اكثر من نوعين ${errorEmoji}`)
                                        message.reply(errorMoreTypes) 
            
                                    }
                                }).catch(err => {
            
                                    //add an error
                                    errorHandleing++
            
                                    //if user took to long to excute the command
                                    notify.delete()
                                    choose.delete()
            
                                    const error = new Discord.MessageEmbed()
                                    error.setColor(FNBRMENA.Colors("embed"))
                                    error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                    message.reply(error)
                                })
                            })
                        })

                        //add the patern to the list
                        list[i] = await text
                    }

                    //if the input is an id
                    if(list[i].includes("_")){
                        type = "id"
                    }

                    //request data
                    await FNBRMENA.Search(lang, type, list[i])
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

                            if(lang === "en") string += `• -1: Merge them all \n`
                            else if(lang === "ar") string += `• -1: دمج جميع العناصر \n`

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
                                        if(collected.first().content >= 0 && collected.first().content < res.data.items.length || collected.first().content === "-1"){

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
                                    }).catch(err => {

                                        //add an error
                                        errorHandleing++
                
                                        //if user took to long to excute the command
                                        notify.delete()
                                        choose.delete()
                
                                        const error = new Discord.MessageEmbed()
                                        error.setColor(FNBRMENA.Colors("embed"))
                                        error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                                        message.reply(error)
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
                            const Err = new Discord.MessageEmbed()
                            Err.setColor(FNBRMENA.Colors("embed"))
                            if(!list[i].includes("&")){
                                if(lang === "en") Err.setTitle(`the ${list[i]} is not a valid item check your speling and try again ${errorEmoji}`)
                                else if(lang === "ar") Err.setTitle(`الـ ${list[i]} ليس عنصر صحيح الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                            }else{
                                if(lang === "en") Err.setTitle(`There is no items matching your entry ${errorEmoji}`)
                                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على عناصر تناسب ادوات البحث الخاصة بك ${errorEmoji}`)
                            }
                            message.reply(Err)
                            
                        }

                        //if everything is correct start merging
                        if(errorHandleing === 0 && res.data.items.length > 0){

                            //if the user wants to merge all or not
                            if(num !== "-1"){
                                names[namesCounter] = await res.data.items[num].id
                            }else{

                                //loop throw every item
                                for(let a = 0; a < res.data.items.length; a++){
                                    names[namesCounter] = await res.data.items[a].id
                                    namesCounter++
                                }
                                namesCounter--
                            }
                        }
                    })
                }
                
                //change the index and the type
                type = "name"
                namesCounter++
                num = 0
            }
        }

        const removeDuplicates = async () => {

        }

        const printItems = async () => {

            //canvas variables
            var width = 0
            var height = 512
            var newline = 0
            var x = 0
            var y = 0

            //canvas length
            var length = names.length

            if(length <= 2) length = length
            else if(length >= 3 && length <= 4) length = length / 2
            else if(length > 4 && length <= 7) length = length / 3
            else if(length > 7 && length <= 50)length = length / 5
            else length = length / 10

            //forcing to be int
            if (length % 2 !== 0){
                length += 1;
                length = length | 0;
            }
            
            //creating width
            if(names.length === 1) width = 512
            else width += (length * 512) + (length * 5) - 5

            //creating height
            for(let i = 0; i < names.length; i++){
                
                if(newline === length){
                    height += 512 + 5
                    newline = 0
                }
                newline++
            }

            //getting item data loading
            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Loading items data... ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`تحميل معلومات العناصر... ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                //registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //applytext
                const applyText = (canvas, text) => {
                    const ctx = canvas.getContext('2d');
                    let fontSize = 40;
                    do {
                        if(lang === "en"){
                            ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                        }else if(lang === "ar"){
                            ctx.font = `${fontSize -= 1}px Arabic`;
                        }
                    } while (ctx.measureText(text).width > 420);
                    return ctx.font;
                }

                //creating canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                //background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                //reseting newline
                newline = 0

                //loop throw every item
                for(let i = 0; i < names.length; i++){

                    //request data
                    await FNBRMENA.Search(lang, "id", names[i])
                    .then(async res => {

                        //reseting num
                        num = 0

                        //skin informations
                        var name = res.data.items[num].name;
                        if(res.data.items[num].description !== "") var description = res.data.items[num].description
                        else if(lang === "en") var description = "There is no description to this item"
                        else if(lang === "ar") var description = "لا يوجد وصف للعنصر"
                        var image = res.data.items[num].images.icon
                        if(res.data.items[num].series === null) var rarity = res.data.items[num].rarity.id
                        else var rarity = res.data.items[num].series.id
                        newline = newline + 1;

                        //searching
                        if(rarity === 'Legendary'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/legendary.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLegendary.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))  
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'Epic'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/epic.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderEpic.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'Rare'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/rare.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderRare.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'Uncommon'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/uncommon.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderUncommon.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'Common'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/common.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderCommon.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'MarvelSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/marvel.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderMarvel.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))  
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'DCUSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dc.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDc.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'CUBESeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/dark.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderDark.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'CreatorCollabSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/icon.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderIcon.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'ColumbusSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/starwars.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderStarwars.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))   
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'ShadowSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/shadow.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderShadow.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'SlurpSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/slurp.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderSlurp.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'FrozenSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/frozen.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderFrozen.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'LavaSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/lava.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderLava.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425)) 
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }
                        if(rarity === 'PlatformSeries'){
                            //creating image
                            const skinholder = await Canvas.loadImage('./assets/Rarities/standard/gaming.png')
                            ctx.drawImage(skinholder, x, y, 512, 512)
                            const skin = await Canvas.loadImage(image);
                            ctx.drawImage(skin, x, y, 512, 512)
                            const skinborder = await Canvas.loadImage('./assets/Rarities/standard/borderGaming.png')
                            ctx.drawImage(skinborder, x, y, 512, 512)
                            if(lang === "en"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Burbank Big Condensed'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }else if(lang === "ar"){
                                ctx.fillStyle = '#ffffff';
                                ctx.textAlign='center';
                                ctx.font = '40px Arabic'
                                ctx.fillText(name, (256 + x), (y + 425))
                                ctx.font = applyText(canvas, description);
                                ctx.textAlign='center';
                                ctx.fillText(description, (256 + x), (y + 480))
                            }
                        }

                        var yTags = y
                        for(let i = 0; i < res.data.items[num].gameplayTags.length; i++){

                            //if the item is animated
                            if(res.data.items[num].gameplayTags[i].includes('Animated')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Animated-64.png')
                                ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                yTags += 40
                            }

                            //if the item is reactive
                            if(res.data.items[num].gameplayTags[i].includes('Reactive')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Adaptive-64.png')
                                ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                yTags += 40
                            }

                            //if the item is synced emote
                            if(res.data.items[num].gameplayTags[i].includes('Synced')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Synced-64x.png')
                                ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                yTags += 40
                            }

                            //if the item is traversal
                            if(res.data.items[num].gameplayTags[i].includes('Traversal')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Traversal-64.png')
                                ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                yTags += 40
                            }

                            //if the item has styles
                            if(res.data.items[num].gameplayTags[i].includes('HasVariants') || res.data.items[num].gameplayTags[i].includes('HasUpgradeQuests')){

                                //the itm is animated add the animated icon
                                const skinholder = await Canvas.loadImage('./assets/Tags/T-Icon-Variant-64.png')
                                ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                                yTags += 40
                            }
                        }

                        //if the item contains copyrited audio
                        if(res.data.items[num].copyrightedAudio === true){

                            //the itm is animated add the animated icon
                            const skinholder = await Canvas.loadImage('./assets/Tags/mute.png')
                            ctx.drawImage(skinholder, x + 467, yTags + 12, 30, 30)

                            yTags += 40
                        }

                        // changing x and y
                        x = x + 5 + 512; 
                        if (length === newline){
                            y = y + 5 + 512;
                            x = 0;
                            newline = 0;
                        }
                    })
                }

                //send the image
                if(names.length < 20){
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), message.author.id + '.png')
                    await message.channel.send(att)
                    msg.delete()
                }else{
                    const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
                    await message.channel.send(att)
                    msg.delete()
                }
            })
            
        }

        await listItems()
        if(errorHandleing === 0) await removeDuplicates()
        if(errorHandleing === 0) await printItems()
    }
}