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
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //adding user query to search
        var Query = []

        //add every type in-game
        var types = [
            'outfit',
            'backpack',
            'pickaxe',
            'glider',
            'contrail',
            'emote',
            'spray',
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
            'price',
            'gameplayTagsStyles',
            'set',
            'introductionChapter',
            'introductionSeason',
            'type',
            'rarity',
            'series',
            'copyrightedAudio',
            'upcoming',
            'reactive',
        ]

        //list of questions
        var ENQuestions = [
            "what is the price of the item ?, if u don't know type *",
            "does the item has styles ?, if u don't know type *\nTrue = Yes\nFalse = No",
            "what is the set of the item ?, if u don't know type *",
            "what is the chapter the item added to ?, if u don't know type *",
            "what is the season the item added to ?, if u don't know type *",
            "what is the type of the item ?, if u don't know type *\n0: Outfit\n1: Backbling\n2: Pickaxe\n3: Glider\n4: Contrail\n5: Emote\n6: Spray\n7: Wrap\n8: Music Pack\n9: Loading Screen",
            "what is the rarity of the item ?, if u don't know type *\n0: Legendary\n1: Epic\n2: Rare\n3: Uncommon\n4: Common",
            "what is the series of the item ?, if u don't know type *\n0: Marvel\n1: DC\n2: StarWars\n3: Dark\n4: Icon\n5: Shadow\n6: Slurp\n7: Frozen\n8: Lava\n9: Gaming",
            "Does the item contains copyrighted audio ?, if u don't know type *\nTrue = Yes\nFalse = No",
            "Does the item set to be an upcoming item ?, if u don't know type *\nTrue = Yes\nFalse = No",
            "Does the item is reactive ?, if u don't know type *\nTrue = Yes\nFalse = No",
        ]

        //setting up the questions
        const Questions = async (Query) => {

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
                    }
                })
            })

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
                    }
                })
            })

            //filter user input
            const filterItemshop = async m => await m.author.id === message.author.id

            //add the text for the questions
            if(lang === "en") var reply = "does the item from the itemshop ?, if u don't know type *\nTrue = Yes\nFalse = No"
            else if(lang === "ar") var reply = "هل العنصر من الايتم شوب ؟، اذا ما تعرف اكتب *"

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
                    }
                })
            })

            //loop throw every query possiable
            for(let i = 0; i < queryList.length; i++){

                if(Query.includes('User Error')){
                    break
                }

                //filter user input
                const filter = async m => await m.author.id === message.author.id

                //add the text for the questions
                if(lang === "en") var reply = ENQuestions[i]
                else if(lang === "ar") var reply = ENQuestions[i]

                await message.reply(reply)
                .then( async notify => {

                    //listen for user input
                    await message.channel.awaitMessages(filter, {max: 1, time: 60000})
                    .then( async collected => {

                        //delete the message
                        notify.delete()

                        //if the user knows the anser of the question
                        if(collected.first().content !== "*"){

                            //if the question name related
                            if(queryList[i] === 'name'){

                                //add the set
                                remember[i] = await collected.first().content
                                
                            }

                            //if the question price related
                            if(queryList[i] === 'price'){

                                //if the user added a value not NUMBER
                                if(!isNaN(collected.first().content)){

                                    //store the price to the array
                                    Query[i] = await collected.first().content
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`The value you added is not a number ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`لقت قمت بكابة رقم غلط ${errorEmoji}`)

                                    await message.channel.send(err)
                                }
                            }

                            //if the question has styles related
                            if(queryList[i] === 'gameplayTagsStyles'){

                                //if the user entered wrong value
                                if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                                    //store user input
                                    Query[i] = collected.first().content.toLowerCase()
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                            //if the question set related
                            if(queryList[i] === 'set'){

                                //add the set
                                Query[i] = await collected.first().content
                                
                            }

                            //if the question introduction chapter related
                            if(queryList[i] === 'introductionChapter'){

                                //add the set
                                Query[i] = await collected.first().content
                                
                            }

                            //if the question introduction season related
                            if(queryList[i] === 'introductionSeason'){

                                //add the set
                                Query[i] = await collected.first().content
                                
                            }

                            //if the question type related
                            if(queryList[i] === 'type'){

                                //if the user enterd out of ragnge
                                if(collected.first().content < types.length){
                                    Query[i] = collected.first().content
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Out of range number, please try again and enter a number from the list above ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`لقد قمت بكتابة رقم ليس موجود بالقائمة الرجاء محاولة مرا اخرى ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                            //if the question series related
                            if(queryList[i] === 'rarity'){

                                //if the user enterd out of ragnge
                                if(collected.first().content < rarities.length){
                                    Query[i] = collected.first().content
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Out of range number, please try again and enter a number from the list above ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`لقد قمت بكتابة رقم ليس موجود بالقائمة الرجاء محاولة مرا اخرى ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                            //if the question series related
                            if(queryList[i] === 'series'){

                                //if the user enterd out of ragnge
                                if(collected.first().content < series.length){
                                    Query[i] = collected.first().content
                                }else{

                                    //add the error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Out of range number, please try again and enter a number from the list above ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`لقد قمت بكتابة رقم ليس موجود بالقائمة الرجاء محاولة مرا اخرى ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                            //if the question copyrighted audio related
                            if(queryList[i] === 'copyrightedAudio'){

                                //if the user entered wrong value
                                if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                                    //store user input
                                    Query[i] = collected.first().content.toLowerCase()
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                            //if the question upcoming audio related
                            if(queryList[i] === 'upcoming'){

                                //if the user entered wrong value
                                if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                                    //store user input
                                    Query[i] = collected.first().content.toLowerCase()
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                            //if the question reactive audio related
                            if(queryList[i] === 'reactive'){

                                //if the user entered wrong value
                                if(collected.first().content.toLowerCase() === "true" || collected.first().content.toLowerCase() === "false"){

                                    //store user input
                                    Query[i] = collected.first().content.toLowerCase()
                                }else{

                                    //add user error
                                    Query[i] = 'User Error'

                                    //create an error
                                    const err = await new Discord.MessageEmbed()

                                    //add color
                                    await err.setColor('#BB00EE')

                                    //add title
                                    if(lang === "en") err.setTitle(`Please make sure to type TRUE or FALSE correctly ${errorEmoji}`)
                                    else if(lang === "en") err.setTitle(`الرجائ كتابة TRUE او FALSE بشكل صحيح ${errorEmoji}`)

                                    await message.channel.send(err)

                                }
                            }

                        }else{
                            Query[i] = await collected.first().content
                        }
                    }).catch(err => console.log(err))
                }).catch(err => console.log(err))
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
                .setColor('#BB00EE')
                .setTitle(`ْUntil when ill wait for u to start ? BTW i canceled your prosses if you are ready just type it again ${errorEmoji}`)
                message.reply(error)
            }else if(lang === "ar"){
                const error = new Discord.MessageEmbed()
                .setColor('#BB00EE')
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
                chances.setColor('#BB00EE')

                //if there is a match
                if(res.data.items.length !== 0){

                    //define the match
                    var match = ""

                    //create varable to store the names
                    var string = ""

                    //loop throw the result
                    for(let i = 0; i < res.data.items.length; i++){

                        //if its from the battlepass
                        if(remember[1] === "true"){

                            //check if the item is a battlepass or not
                            if(res.data.items[i].battlepass !== null){

                                if(lang === "en") match = "(50% Match)"
                                else if(lang === "ar") match = "(مناسب بنسبة 50%)"

                                //if the name includes the words that the use added
                                if(res.data.items[i].name.includes(remember[0])){

                                    if(lang === "en") match = "(75% Match)"
                                    else if(lang === "ar") match = "(مناسب بنسبة 75%)"

                                    //add the items to the string variable
                                    string += "•" + (i + 1) + ": " + res.data.items[i].name + " " + match + "\n"
                                }else{
                                    //add the items to the string variable
                                    string += "•" + (i + 1) + ": " + res.data.items[i].name + " " + match + "\n"
                                }
                            }

                        }else{
                            if(remember[2] === "true"){

                                //if the item is from the itemshop
                                if(res.data.items[i].gameplayTags.includes('Cosmetics.Source.ItemShop')){

                                if(lang === "en") match = "(50% Match)"
                                else if(lang === "ar") match = "(مناسب بنسبة 50%)"

                                //if the name includes the words that the use added
                                if(res.data.items[i].name.includes(remember[0])){

                                    if(lang === "en") match = "(75% Match)"
                                    else if(lang === "ar") match = "(مناسب بنسبة 75%)"

                                    //add the items to the string variable
                                    string += "•" + (i + 1) + ": " + res.data.items[i].name + " " + match + "\n"
                                }else{
                                    //add the items to the string variable
                                    string += "•" + (i + 1) + ": " + res.data.items[i].name + " " + match + "\n"
                                }
                            }
                        }else{
                                //if the name includes the words that the use added
                                if(res.data.items[i].name.includes(remember[0])){

                                    //add the items to the string variable
                                    string += "•" + (i + 1) + ": " + res.data.items[i].name + " " + match + "\n"
                                }else{
                                    //add the items to the string variable
                                    string += "•" + (i + 1) + ": " + res.data.items[i].name + "\n"
                                }

                            }
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