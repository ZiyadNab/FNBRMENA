const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment');
const Canvas = require('canvas');
const { MessageButton } = require('discord-buttons');

module.exports = {
    commands: 'query',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadinEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //adding user query to search
        var Query = []

        //inisilize index
        var Index = 0

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

        //add every rarity in-game
        var rarities = [
            'LEGENDARY',
            'EPIC',
            'RARE',
            'UNCOMMON',
            'COMMON',
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

        //something u remember
        var remember = []

        //list every possible query
        var queryList = [
            'type',
            'price',
            'gameplayTagsStyles',
            'set',
            'introductionChapter',
            'introductionSeason',
            'rarity',
            'series',
            'upcoming',
            'reactive',
        ]

        //setting up the questions
        const Questions = async (Query) => {

            //filter user input
            const filterType = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the type of the item ?, if u don't know type *\n0: Outfit\n1: Backbling\n2: Pickaxe\n3: Glider\n4: Contrail\n5: Emote\n6: Spray\n7: Wrap\n8: Music Pack\n9: Loading Screen"
            else if(lang === "ar") var reply = "ايش نوع العنصر ؟ اذا ما تعرف اكتب *\n0: سكن\n1: شنطة\n2: بيكاكس\n3: مظلة\n4: نزلة\n5: رقصة\n6: بخاخ\n7: لون سلاح\n8: ميوزك لوبي\n9: شاشة تحميل"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterType, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user enterd out of ragnge
                        if(collected.first().content < types.length){
                            Query[Index] = collected.first().content
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`Out of range number, please try again and enter a number from the list above ${errorEmoji}`)
                            else if(lang === "ar") err.setTitle(`لقد قمت بكتابة رقم ليس موجود بالقائمة الرجاء محاولة مرا اخرى ${errorEmoji}`)

                            await message.channel.send(err)

                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))

            //++
            Index++

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //filter user input
            const filterName = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "type any words you remember ?, if u don't know type *"
            else if(lang === "ar") var reply = "اكتب اي حرف تتذكره من اسم العنصر، اذا ما تعرف اكتب *"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterName, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){
                        
                        //add the name
                        remember[0] = await collected.first().content
                    }else{
                        remember[0] = "*"
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //filter user input
            const filterBattlepass = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "does the item from the battlepass ?, if u don't know type *"
            else if(lang === "ar") var reply = "هل العنصر من الباتل باس ؟، اذا ما تعرف اكتب *"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterBattlepass, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){
                        
                        //add the name
                        remember[1] = await collected.first().content
                    }else{
                        remember[1] = "*"
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //if the item is from the battlepass
            if(remember[1] === "false"){

                //filter user input
                const filterItemshop = async m => await m.author.id === message.author.id

                //add the text for the questions
                if(lang === "en") var reply = "does the item from the itemshop ?, if u don't know type *\nTrue = Yes\nFalse = No"
                else if(lang === "ar") var reply = "هل العنصر من الايتم شوب ؟، اذا ما تعرف اكتب *\nنعم = True\nلا = False"

                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filterItemshop, {max: 1, time: 60000})
                    .then( async collected => {

                        //delete the message
                        notify.delete()

                        //if the user knows the anser of the question
                        if(collected.first().content !== "*"){
                            
                            //add the name
                            remember[2] = await collected.first().content
                        }else{
                            remember[2] = "*"
                        }
                    })
                })

            }else{
                remember[2] = "false"
            }

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //filter user input
            const filterPrice = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the price of the item ?, if u don't know type *"
            else if(lang === "ar") var reply = "كم سعر العنصر ؟ اذا ما تعرف اكتب *"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterPrice, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user added a value not NUMBER
                        if(!isNaN(collected.first().content)){

                            //store the price to the array
                            Query[Index] = await collected.first().content
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`The value you added is not a number ${errorEmoji}`)
                            else if(lang === "ar") err.setTitle(`لقت قمت بكابة رقم غلط ${errorEmoji}`)

                            await message.channel.send(err)
                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterStyles = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "does the item has styles ?, if u don't know type *\nTrue = Yes\nFalse = No"
            else if(lang === "ar") var reply = "هل العنصر يحتوي على ستايلات ؟ اذا ما تعرف اكتب *\nنعم = True\nلا = False"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterStyles, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user entered wrong value
                        if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                            //store user input
                            Query[Index] = collected.first().content.toLowerCase()
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                            else if(lang === "ar") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                            await message.channel.send(err)

                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterSets = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the set of the item ?, if u don't know type *"
            else if(lang === "ar") var reply = "ايش المجموعة حقت العنصر ؟ اذا ما تعرف اكتب *"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterSets, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //add the set
                        Query[Index] = await collected.first().content

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterChapter = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the chapter the item added to ?, if u don't know type *"
            else if(lang === "ar") var reply = "ايش الشابتر الي نزل فيه العنصر ؟ اذا ما تعرف اكتب *"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterChapter, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //add the set
                        Query[Index] = await collected.first().content

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterSeason = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the season the item added to ?, if u don't know type *"
            else if(lang === "ar") var reply = "ايش الموسم الي نزل فيه العنصر ؟ اذا ما تعرف اكتب *"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterSeason, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //add the set
                        Query[Index] = await collected.first().content

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterRarity = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the rarity of the item ?, if u don't know type *\n0: Legendary\n1: Epic\n2: Rare\n3: Uncommon\n4: Common"
            else if(lang === "ar") var reply = "ايش ندرة العنصر ؟ اذا ما تعرف اكتب *\n0: برتقالي\n1: بنفسجي\n2: ازرق\n3: اخضر\n4: ابيض\n"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterRarity, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user enterd out of ragnge
                        if(collected.first().content < rarities.length){
                            Query[Index] = collected.first().content
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`Out of range number, please try again and enter a number from the list above ${errorEmoji}`)
                            else if(lang === "ar") err.setTitle(`لقد قمت بكتابة رقم ليس موجود بالقائمة الرجاء محاولة مرا اخرى ${errorEmoji}`)

                            await message.channel.send(err)

                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterSeries = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "what is the series of the item ?, if u don't know type *\n0: Marvel\n1: DC\n2: StarWars\n3: Dark\n4: Icon\n5: Shadow\n6: Slurp\n7: Frozen\n8: Lava\n9: Gaming"
            else if(lang === "ar") var reply = "ايش سلسلة العنصر ؟ اذا ما تعرف اكتب *\n0: مارفل\n1: دي سي\n2: ستار وارز\n3: المكعب\n4: المشاهير\n5: الظلام\n6: السلرب\n7: الثلج\n8: اللافا\n9: الالعاب"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterSeries, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user enterd out of ragnge
                        if(collected.first().content < series.length){
                            Query[Index] = collected.first().content
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`Out of range number, please try again and enter a number from the list above ${errorEmoji}`)
                            else if(lang === "ar") err.setTitle(`لقد قمت بكتابة رقم ليس موجود بالقائمة الرجاء محاولة مرا اخرى ${errorEmoji}`)

                            await message.channel.send(err)

                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //if the type is emote
            if(types[Query[0]] === "emote"){

                //list every possible query
                queryList = [
                    'type',
                    'price',
                    'gameplayTagsStyles',
                    'set',
                    'introductionChapter',
                    'introductionSeason',
                    'rarity',
                    'series',
                    'copyrightedAudio',
                    'upcoming',
                    'reactive',
                ]

                //filter user input
                const filterCopyrighted = async m => await m.author.id === message.author.id

                //add the text for the questions
                if(lang === "en") var reply = "Does the item contains copyrighted audio ?, if u don't know type *\nTrue = Yes\nFalse = No"
                else if(lang === "ar") var reply = "هل تحتوي الرقصه على حقوق الطبع و النشر ؟ اذا ما تعرف اكتب *\nنعم = True\nلا = False"

                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filterCopyrighted, {max: 1, time: 60000})
                    .then( async collected => {

                        //delete the message
                        notify.delete()

                        //if the user knows the anser of the question
                        if(collected.first().content !== "*"){

                            //if the user entered wrong value
                            if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                                //store user input
                                Query[Index] = collected.first().content.toLowerCase()
                            }else{

                                //add user error
                                Query[Index] = 'User Error'

                                //create an error
                                const err = await new Discord.MessageEmbed()

                                //add color
                                await err.setColor(FNBRMENA.Colors("embed"))

                                //add title
                                if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                                else if(lang === "ar") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                                await message.channel.send(err)

                            }

                        }else{
                            Query[Index] = await collected.first().content
                        }
                    })
                })

                if(Query.includes("User Error")){
                    return Query = ['User Error']
                }

                //filter user input
                const filterTraversal = async m => await m.author.id === message.author.id

                //add the text for the questions
                if(lang === "en") var reply = "does the emote is traversal ?, if u don't know type *\nTrue = Yes\nFalse = No"
                else if(lang === "ar") var reply = "هل الرقصه قابلة للمشي ؟، اذا ما تعرف اكتب *"

                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filterTraversal, {max: 1, time: 60000})
                    .then( async collected => {

                        //delete the message
                        notify.delete()

                        //if the user knows the anser of the question
                        if(collected.first().content !== "*"){
                            
                            //add the name
                            remember[Index] = await collected.first().content
                        }else{
                            remember[Index] = "*"
                        }
                    })
                })

                if(Query.includes("User Error")){
                    return Query = ['User Error']
                }

                //++
                Index++

            }else{
                remember[3] = "false"
                Query[Index] = "false"
            }

            //filter user input
            const filterUpcoming = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "Does the item set to be an upcoming item ?, if u don't know type *\nTrue = Yes\nFalse = No"
            else if(lang === "ar") var reply = "هل العنصر ما بعد نزل ؟ اذا ما تعرف اكتب *\nنعم = True\nلا = False"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterUpcoming, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user entered wrong value
                        if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                            //store user input
                            Query[Index] = collected.first().content.toLowerCase()
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                            else if(lang === "en") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                            await message.channel.send(err)

                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            //++
            Index++

            //filter user input
            const filterReactive = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "Does the item is reactive ?, if u don't know type *\nTrue = Yes\nFalse = No"
            else if(lang === "ar") var reply = "هل العنصر متفاعل ؟ اذا ما تعرف اكتب *\nنعم = True\nلا = False"

            await message.reply(reply)
            .then( async notify => {

                //listen for user input
                await message.channel.awaitMessages(filterReactive, {max: 1, time: 60000})
                .then( async collected => {

                    //delete the message
                    notify.delete()

                    //if the user knows the anser of the question
                    if(collected.first().content !== "*"){

                        //if the user entered wrong value
                        if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                            //store user input
                            Query[Index] = collected.first().content.toLowerCase()
                        }else{

                            //add user error
                            Query[Index] = 'User Error'

                            //create an error
                            const err = await new Discord.MessageEmbed()

                            //add color
                            await err.setColor(FNBRMENA.Colors("embed"))

                            //add title
                            if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                            else if(lang === "ar") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                            await message.channel.send(err)

                        }

                    }else{
                        Query[Index] = await collected.first().content
                    }
                })
            })

            if(Query.includes("User Error")){
                return Query = ['User Error']
            }

            return await Query
        }

        //let the user to be prepared for asking questions, lets create a button
        let start = new MessageButton()

        //button style
        start.setStyle('blurple')

        //button label
        if(lang === "en") start.setLabel('Start!')
        else if(lang === "ar") start.setLabel('ابدا!')

        //button id
        start.setID('start');

        //add the reply text
        if(lang === "en") var reply = "i will ask you questions to help find your item easily, click START to begain"
        else if(lang === "ar") var reply = 'راح اسألك اسئلة عشان اقدر اجيب العصر الي تحاول تبحث عنه، اضغط ابدا اذا انت مستعد'

        //send the button
        const clicked = await message.channel.send(reply, start)

        //filtering
        const filter = (button) => button.clicker.user.id === message.author.id;

        //await click
        await clicked.awaitButtons(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(async collected => {

            //delete the start message
            await clicked.delete()

            //call the picker function
            Query = await Questions(Query)

        }).catch(err => {

            //if user took 1 minutes without pressing start
            clicked.delete()
            if(lang === "en"){
                const error = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(`ْUntil when ill wait for u to start ? BTW i canceled your prosses if you are ready just type it again ${errorEmoji}`)
                message.reply(error)
            }else if(lang === "ar"){
                const error = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(`الى متى انتظرك تبدا ؟ الزبده طفيت الامر اذا كنت جاهز اكتبه ثانية ${errorEmoji}`)
                message.reply(error)
            }
        })
        
        //if all questions has been answered without any issues
        if(!Query.includes('User Error')){

            //request data
            FNBRMENA.Query('lang', Query, queryList, rarities, types, series)
            .then(async res => {

                //create an embed
                const chances = new Discord.MessageEmbed()

                //add color
                chances.setColor(FNBRMENA.Colors("embed"))

                //if there is a match
                if(res.data.items.length !== 0){

                    //counter
                    var counter = 1

                    //create varable to store the names
                    var string = ""

                    //loop throw the result
                    for(let i = 0; i < res.data.items.length; i++){

                        //if its from the battlepass
                        if(remember[1] === "true"){

                            //check if the item is a battlepass or not
                            if(res.data.items[i].battlepass !== null){

                                //if the user added words
                                if(remember[0] !== "*"){

                                    //if the name includes the words that the use added
                                    if(res.data.items[i].name.toLowerCase().includes(remember[0].toLowerCase())){

                                        //add the items to the string variable
                                        string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                        counter++
                                    }
                                }else{
                                    //add the items to the string variable
                                    string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                    counter++
                                }
                            }

                        }else if(remember[2] === "true"){

                            //if the item is from the itemshop
                            if(res.data.items[i].gameplayTags.includes('Cosmetics.Source.ItemShop')){

                                //if the user added words
                                if(remember[0] !== "*"){

                                    //if the name includes the words that the use added
                                    if(res.data.items[i].name.toLowerCase().includes(remember[0].toLowerCase())){

                                        //add the items to the string variable
                                        string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                        counter++
                                    }
                                }else{

                                    //add the items to the string variable
                                    string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                    counter++
                                }
                            }

                        }else if(remember[3] === "true"){

                            //if the item is from the shop
                            if(res.data.items[i].gameplayTags.includes('Cosmetics.Source.ItemShop')){

                                //if the user added words
                                if(remember[0] !== "*"){

                                    //if the item is from the itemshop
                                    if(res.data.items[i].gameplayTags.includes('Cosmetics.UserFacingFlags.Emote.Traversal')){

                                        //if the name includes the words that the use added
                                        if(res.data.items[i].name.toLowerCase().includes(remember[0].toLowerCase())){

                                            //add the items to the string variable
                                            string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                            counter++
                                        }
                                    }
                                }else{

                                    //add the items to the string variable
                                    string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                    counter++
                                }
                            }else if(res.data.items[i].battlepass !== null){

                                //if the user added words
                                if(remember[0] !== "*"){

                                    //if the item is from the itemshop
                                    if(res.data.items[i].gameplayTags.includes('Cosmetics.UserFacingFlags.Emote.Traversal')){

                                        //if the name includes the words that the use added
                                        if(res.data.items[i].name.toLowerCase().includes(remember[0].toLowerCase())){

                                            //add the items to the string variable
                                            string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                            counter++
                                        }
                                    }
                                }else{
                                    //add the items to the string variable
                                    string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                    counter++
                                }
                            }else{

                                //if the item is from the itemshop
                                if(res.data.items[i].gameplayTags.includes('Cosmetics.UserFacingFlags.Emote.Traversal')){

                                    //if the user added words
                                    if(remember[0] !== "*"){

                                        //if the name includes the words that the use added
                                        if(res.data.items[i].name.toLowerCase().includes(remember[0].toLowerCase())){

                                            //add the items to the string variable
                                            string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                            counter++
                                        }
                                    }else{
                                        //add the items to the string variable
                                        string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                        counter++
                                    }
                                }
                            }

                        }else if(remember[0] !== "*"){

                            //ensure the item is not a battlepass or shop
                            if(res.data.items[i].battlepass === null && !res.data.items[i].gameplayTags.includes('Cosmetics.Source.ItemShop')){
    
                                //if the name includes the words that the use added
                                if(res.data.items[i].name.toLowerCase().includes(remember[0].toLowerCase())){

                                    //add the items to the string variable
                                    string += "•" + counter + ": " + res.data.items[i].name + "\n"
                                    counter++
                                }
                            }
                            
                        }else{

                            //add the items to the string variable
                            string += "•" + counter + ": " + res.data.items[i].name + "\n"
                            counter++

                        }
                    }

                    //add description
                    chances.setDescription(string)

                    //send the message
                    await message.channel.send(chances)

                }else{

                }

            })
        }
    }
}