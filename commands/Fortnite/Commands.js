const error = require('../Errors')

module.exports = {
    commands: 'commands',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the language from database
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            //index to start the commands from and how many commands in a single page
            var index = 0
            var pagesLength = 0
            var page = 1
            var pageCommands = 5
            var newPage = 0

            //list of commands in english
            CommandsEN = [
                {name: '-Lang', value: 'You can change your account language'},
                {name: '-PAK', value: 'Get every cosmetic in a single pak file'},
                {name: '-Search', value: 'You can search whatever cosmetic you want'},
                {name: '-Set', value: 'Return a picture of the set cosmetics'},
                {name: '-Since', value: 'You can get every item that has passed the number of days by your choice'},
                {name: '-Upcoming', value: 'Return a picture of every unrealesed item'},
                {name: '-News', value: 'You can see what news is active In-Game right now'},
                {name: '-Help', value: 'If you neeed help simply just ask'},
                {name: '-Social', value: 'You can get all my Social Medial Accounts'},
                {name: '-Merge', value: 'You can merge any item in the game into one image'},
                {name: '-AES', value: 'Get the current AES of the update'}, 
                {name: '-Battlepass', value: 'Get the battlepass items as a picture'},
                {name: '-Map', value: 'Generate a picture of the current map'},
                {name: '-Weapon', value: 'Generate a picture of any weapon stats'},
                {name: '-Section', value: 'You can see what are the itemshop sections'},
                {name: '-Progress', value: 'You can see how many days left until this season ends'},
                {name: '-Upcoming', value: 'Return every skin in the itemshop that hasnt been realesed yet'},
                {name: '-Stats', value: 'Get any user info of all or any platform'},
                {name: '-New', value: 'You can generate a leaked cosmetic list image'},
                {name: '-Itemshop', value: 'You can generate a picture of the current itemshop'},
                {name: '-SAC', value: 'Return a Support a Creator code informaitions'},
                {name: '-Quests', value: 'Get a list of a challenges for any week'},
            ]

            //list of commands in arabic
            CommandsAR = [
                {name: 'امر [ Lang- ]', value: 'تغير اللغة'},
                {name: 'امر [ PAK- ]', value: 'استخرج جميع العناصر في PAK معين'},
                {name: 'امر [ Search- ]', value: 'ابحث عن اي عنصر باللعبة'},
                {name: 'امر [ Set- ]:', value: 'احصل على صورة مكونه من مجموعة معينه'},
                {name: 'امر [ Since- ]:', value: 'احصل على صورة بجميع العناصر الي تعددت الرقم المعين من الايام'},
                {name: 'امر [ Upcoming- ]', value: 'يستخرج لك البوت صورة بجميع العناصر الي للان ما نزلت'},
                {name: 'امر [ News- ]', value: 'تقدر تحصل على الاخبار المتاحه باللعبة الان'},
                {name: 'امر [ Help- ]:', value: 'اذا تحتاج مساعدة فقط اطلب من الدعم'},
                {name: 'امر [ Social- ]:', value: 'تقدر تحصل على جميع روابط التواصل الاجتمعي حقتي'},
                {name: 'امر [ Merge- ]:', value: 'تقدر تدمج اي عنصر باللعبة الى صورة وحده'},
                {name: 'امر [ AES- ]:', value: 'احصل على مفتاح الـ AES الخاص بالتحديث الحالي'},
                {name: 'امر [ Battlepass- ]:', value: 'احصل على صورة الباتل باس كاملة'},
                {name: 'امر [ Map- ]:', value: 'انشاء صورة للماب'},
                {name: 'امر [ Weapon- ]:', value: 'انشاء صورة لاحصائيات اي سلاح باللعبة'},
                {name: 'امر [ Section- ]:', value: 'احصل على عناصر الشوب'},
                {name: 'امر [ Stats- ]:', value: 'احصل على جميع معلومات اي حساب في اي منصه'},
                {name: 'امر [ Progress- ]:', value: 'احصل على معلومات السيزون'},
                {name: 'امر [ Upcoming- ]:', value: 'احصل على جميع عناصر الشوب الي للان ما نزلت'},
                {name: 'امر [ New- ]:', value: 'احصل على جميل العناصر المسربة'},
                {name: 'امر [ Itemshop- ]:', value: 'احصل على صورة الايتم شوب'},
                {name: 'امر [ SAC- ]', value: 'استخرج معلومات اي كود ايتم شوب'},
                {name: 'امر [ Quests- ]:', value: 'استخرج صورة للتحديات لآي اسبوع'},
            ]

            //creating an embed
            const list = new Discord.MessageEmbed()
            list.setColor('#BB00EE')

            //check if the language is english or arabic
            if(lang === "en"){
                //add title
                list.setTitle(`Here is a list of commands, use the reactions to scroll over commands ${checkEmoji}`)
            }else if(lang === "ar"){
                //add title
                list.setTitle(`مجموعة من الاوامر استعمل الازرار للتنقل بين الاوامر ${checkEmoji}`)
            }

            //see how many pages
            if(lang === "en"){
                pagesLength = CommandsEN.length / pageCommands
            }else if(lang === "ar"){
                pagesLength = CommandsAR.length / pageCommands
            }

            //forcing to be an int
            if(pagesLength % 2 !== 0){
                pagesLength += 1
                pagesLength = pagesLength | 0
            }

            //add footer for page number
            list.setFooter("( " + page + "/" + pagesLength + " )")
            
            //list the first 5 commands
            for(let i = index; i < pageCommands; i++){

                //check the language
                if(lang === "en"){

                    //get commands from the en array
                    list.addFields(
                        CommandsEN[i]
                    )
                }else if(lang === "ar"){

                    //get commands from the ar array
                    list.addFields(
                        CommandsAR[i]
                    )
                }
            }

            //send the embed
            const msgReact = await message.channel.send(list)

            //add reactions
            await msgReact.react('⏮️')
            await msgReact.react('◀️')
            await msgReact.react('▶️')
            await msgReact.react('⏭️')
            await msgReact.react('🛑')
            const filter = (reaction, user) => {
                return ['⏮️','◀️', '▶️','⏭️','🛑'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            const collected = await msgReact.createReactionCollector(filter, {time: 3 * 60000, errors: ['time']})
            collected.on("collect", collect => {

                const reaction = collect
                if(reaction.emoji.name === '⏮️'){

                    //create embed
                    const firstPage = new Discord.MessageEmbed()
                    firstPage.setColor('#BB00EE')
                    
                    //change the page value
                    page = 1

                    //change the commands list
                    index = 0
                    newPage = pageCommands

                    //set footer
                    firstPage.setFooter("( " + page + "/" + pagesLength + " )")

                    //check lang
                    if(lang === "en"){
                        //add title
                        firstPage.setTitle(`Here is a list of commands, use the reactions to scroll over commands ${checkEmoji}`)

                        //list the next page
                        for(let i = index; i < newPage; i++){
                            //get commands from the en array
                            firstPage.addFields(
                                CommandsEN[i]
                            )
                        }
                    }else if(lang === "ar"){

                        //add title
                        firstPage.setTitle(`مجموعة من الاوامر استعمل الازرار للتنقل بين الاوامر ${checkEmoji}`)

                        //list the next page
                        for(let i = index; i < newPage; i++){
                            //get commands from the en array
                            firstPage.addFields(
                                CommandsAR[i]
                            )
                        }
                    }
                    msgReact.edit(firstPage)
                }
                if(reaction.emoji.name === '◀️'){

                    //create embed
                    const backwardPage = new Discord.MessageEmbed()
                    backwardPage.setColor('#BB00EE')

                    //u cant backword at the first page
                    if(page === 1){
                        return
                    }

                    //change the page value
                    page--

                    //change the commands list
                    index -= pageCommands
                    newPage = pageCommands + index

                    //checking the language
                    if(lang === "en"){

                        //check for undefined commands
                        while(newPage > CommandsEN.length){
                            newPage--
                        }

                        if(index < CommandsEN.length){
                            //add footer for page number
                            backwardPage.setFooter("( " + page + "/" + pagesLength + " )")

                            //add title
                            backwardPage.setTitle(`Here is a list of commands, use the reactions to scroll over commands ${checkEmoji}`)

                            //list the next page
                            for(let i = index; i < newPage; i++){
                                //get commands from the en array
                                backwardPage.addFields(
                                    CommandsEN[i]
                                )
                            }
                        }else{
                            backwardPage.setTitle(`Sorry, this is the last page ${errorEmoji}`)
                        }
                    }else if(lang === "ar"){

                        //check for undefined commands
                        while(newPage > CommandsEN.length){
                            newPage--
                        }

                        if(index < CommandsAR.length){
                            //add footer for page number
                            backwardPage.setFooter("( " + page + "/" + pagesLength + " )")

                            //add title
                            backwardPage.setTitle(`مجموعة من الاوامر استعمل الازرار للتنقل بين الاوامر ${checkEmoji}`)

                            //list the next page
                            for(let i = index; i < newPage; i++){
                                //get commands from the en array
                                backwardPage.addFields(
                                    CommandsAR[i]
                                )
                            }
                        }else{
                            backwardPage.setTitle(`لقد وصلت لاخر صفحه ${errorEmoji}`)
                        }
                    }
                    msgReact.edit(backwardPage)
                }
                if(reaction.emoji.name === '▶️'){

                    //create embed
                    const forwardPage = new Discord.MessageEmbed()
                    forwardPage.setColor('#BB00EE')

                    //change the page value
                    page++

                    //change the commands list
                    index += pageCommands
                    newPage = index + pageCommands

                    //checking the language
                    if(lang === "en"){

                        //check for undefined commands
                        while(newPage > CommandsEN.length){
                            newPage--
                        }

                        if(index < CommandsEN.length){
                            //add footer for page number
                            forwardPage.setFooter("( " + page + "/" + pagesLength + " )")

                            //add title
                            forwardPage.setTitle(`Here is a list of commands, use the reactions to scroll over commands ${checkEmoji}`)

                            //list the next page
                            for(let i = index; i < newPage; i++){
                                //get commands from the en array
                                forwardPage.addFields(
                                    CommandsEN[i]
                                )
                            }
                        }else{
                            forwardPage.setTitle(`Sorry, this is the last page ${errorEmoji}`)
                        }
                    }else if(lang === "ar"){

                        //check for undefined commands
                        while(newPage > CommandsEN.length){
                            newPage--
                        }

                        if(index < CommandsAR.length){
                            //add footer for page number
                            forwardPage.setFooter("( " + page + "/" + pagesLength + " )")

                            //add title
                            forwardPage.setTitle(`مجموعة من الاوامر استعمل الازرار للتنقل بين الاوامر ${checkEmoji}`)

                            //list the next page
                            for(let i = index; i < newPage; i++){
                                //get commands from the en array
                                forwardPage.addFields(
                                    CommandsAR[i]
                                )
                            }
                        }else{
                            forwardPage.setTitle(`لقد وصلت لاخر صفحه ${errorEmoji}`)
                        }
                    }
                    msgReact.edit(forwardPage)
                }
                if(reaction.emoji.name === '⏭️'){
                    //create embed
                    const firstPage = new Discord.MessageEmbed()
                    firstPage.setColor('#BB00EE')
                    
                    //change the page value
                    page = pagesLength

                    //set footer
                    firstPage.setFooter("( " + page + "/" + pagesLength + " )")

                    //change the commands list
                    index = pagesLength * pageCommands
                    newPage = pagesLength * pageCommands
                    index  -= pageCommands

                    //check lang
                    if(lang === "en"){

                        //check for undefined commands
                        while(newPage > CommandsEN.length){
                            newPage--
                        }

                        //add title
                        firstPage.setTitle(`Here is a list of commands, use the reactions to scroll over commands ${checkEmoji}`)

                        //list the next page
                        for(let i = index; i < newPage; i++){
                            //get commands from the en array
                            firstPage.addFields(
                                CommandsEN[i]
                            )
                        }
                    }else if(lang === "ar"){

                        //check for undefined commands
                        while(newPage > CommandsAR.length){
                            newPage--
                        }

                        //add title
                        firstPage.setTitle(`مجموعة من الاوامر استعمل الازرار للتنقل بين الاوامر ${checkEmoji}`)

                        //list the next page
                        for(let i = index; i < newPage; i++){
                            //get commands from the en array
                            firstPage.addFields(
                                CommandsAR[i]
                            )
                        }
                    }
                    msgReact.edit(firstPage)
                }
                if(reaction.emoji.name === '🛑'){
                    msgReact.delete()
                }
            })
        })
    },
}