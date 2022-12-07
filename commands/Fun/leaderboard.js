const config = require('./../../Configs/config.json')
module.exports = {
    commands: 'score',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Get the last message sent
        const games = await FNBRMENA.Admin(admin, message, "", "Games")

        // Create an embed
        const leaderboardTypeEmbed = new Discord.EmbedBuilder()
        leaderboardTypeEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            leaderboardTypeEmbed.setTitle(`Leaderboard Type`)
            leaderboardTypeEmbed.setDescription('Please click on the Drop-Down menu and select a leaderboard type.\n`You have only 30 seconds until this operation ends, Make it quick`!')
        }else if(userData.lang === "ar"){
            leaderboardTypeEmbed.setTitle(`نوع الترتيب`)
            leaderboardTypeEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع ترتيب.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
        }

        // Create a row for cancel button
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

        // Create a row for drop down menu for categories
        const leaderboardTypePaksRow = new Discord.ActionRowBuilder()

        const leaderboardTypeDropMenu = new Discord.SelectMenuBuilder()
        leaderboardTypeDropMenu.setCustomId('leaderboard')
        if(userData.lang === "en") leaderboardTypeDropMenu.setPlaceholder('Select a leaderboard type!')
        else if(userData.lang === "ar") leaderboardTypeDropMenu.setPlaceholder('من فضلك اختر نوع الترتيب!')
        leaderboardTypeDropMenu.addOptions(
            {
                label: `Numbers`,
                value: `Numbers`
            },
            {
                label: `Tic-Tac-Toe`,
                value: `TTT`
            },
        )

        // Add the drop menu to the categoryDropMenu
        leaderboardTypePaksRow.addComponents(leaderboardTypeDropMenu)

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [leaderboardTypeEmbed], components: [leaderboardTypePaksRow, buttonDataRow]})

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {
            collected.deferUpdate()

            // If canecl button has been clicked
            if(collected.customId === "Cancel") dropMenuMessage.delete()

            if(collected.customId === "leaderboard"){

                // If the user chose Numbers
                if(collected.values[0] === "Numbers"){
                    dropMenuMessage.delete()

                    // Get the results
                    const results = []
                    for(const leaderboard of Object.keys(games.numbersGame.leaderboard)){
                        if(leaderboard !== 'DONTDELETE') results.push({
                            id: leaderboard,
                            score: games.numbersGame.leaderboard[leaderboard].score
                        })
                    }

                    // Sort the results
                    results.sort(function (a, b) {
                        return b.score - a.score
                    })
                    
                    // Check if there is any args
                    if(args.length !== 0){

                        // Get user's data
                        const user = await message.guild.members.cache.get(text)

                        // Check if the user's ID is valid
                        if(user){

                            // Check if the user has any score
                            if(games.numbersGame.leaderboard[text] != undefined){

                                // Get the user's score
                                const userScoreEmbed = new Discord.EmbedBuilder()
                                userScoreEmbed.setColor(FNBRMENA.Colors("embed"))
                                userScoreEmbed.setTitle(`${user.user.username} has ${games.numbersGame.leaderboard[text].score} points`)
                                message.reply({embeds: [userScoreEmbed]})
                            }else{

                                // There is no score for the given user
                                const noScoreFoundError = new Discord.EmbedBuilder()
                                noScoreFoundError.setColor(FNBRMENA.Colors("embedError"))
                                noScoreFoundError.setTitle(`${user.user.username} hasn't played yet ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [noScoreFoundError]})
                            }
                        }else{

                            // User id is not correct
                            const theUserIdIsWrongError = new Discord.EmbedBuilder()
                            theUserIdIsWrongError.setColor(FNBRMENA.Colors("embedError"))
                            theUserIdIsWrongError.setTitle(`There is such a user with ${text} id, please try again ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [theUserIdIsWrongError]})
                        }
                    }else{

                        // Print the top players
                        const leaderboardTop = new Discord.EmbedBuilder()
                        leaderboardTop.setColor(FNBRMENA.Colors("embed"))
                        leaderboardTop.setTitle(`Top ${games.numbersGame.top}`)

                        // Looping
                        let string = ``, counter = 1
                        for(let i = 0; i < games.numbersGame.top; i++){
                            if(results[i]){
                                const user = await message.guild.members.cache.get(results[i].id)
                                if(user) string += `${counter++}. ${user.user.username} has ${results[i].score} points\n`
                            }else string += `${counter++}. No players yet\n`
                        }
                        leaderboardTop.setDescription(`Here are the top ${games.numbersGame.top} in numbers game\n\n${string}\n\n${emojisObject.starwars} Current number is \`${games.numbersGame.lastMessage}\`, go to ${message.guild.channels.cache.get(config.channels.numbers).toString()} to participate`)
                        message.reply({embeds: [leaderboardTop]})
                    }
                }

                // If the user chose TTT
                if(collected.values[0] === "TTT"){
                    dropMenuMessage.delete()

                    // Get the results
                    const results = []
                    for(const leaderboard of Object.keys(games.tictactoe.leaderboard)){
                        if(leaderboard !== 'DONTDELETE') results.push({
                            id: leaderboard,
                            wins: games.tictactoe.leaderboard[leaderboard].wins
                        })
                    }

                    // Sort the results
                    results.sort(function (a, b) {
                        return b.wins - a.wins
                    })
                    
                    // Check if there is any args
                    if(args.length !== 0){

                        // Get user's data
                        const user = await message.guild.members.cache.get(text)

                        // Check if the user's ID is valid
                        if(user){

                            // Check if the user has any wins
                            if(games.tictactoe.leaderboard[text] != undefined){

                                // Get the user's wins
                                const userScoreEmbed = new Discord.EmbedBuilder()
                                userScoreEmbed.setColor(FNBRMENA.Colors("embed"))
                                userScoreEmbed.setTitle(`${user.user.username} has ${games.tictactoe.leaderboard[text].wins} wins`)
                                message.reply({embeds: [userScoreEmbed]})
                            }else{

                                // There is no wins for the given user
                                const noScoreFoundError = new Discord.EmbedBuilder()
                                noScoreFoundError.setColor(FNBRMENA.Colors("embedError"))
                                noScoreFoundError.setTitle(`${user.user.username} hasn't played yet ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [noScoreFoundError]})
                            }
                        }else{

                            // User id is not correct
                            const theUserIdIsWrongError = new Discord.EmbedBuilder()
                            theUserIdIsWrongError.setColor(FNBRMENA.Colors("embedError"))
                            theUserIdIsWrongError.setTitle(`There is such a user with ${text} id, please try again ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [theUserIdIsWrongError]})
                        }
                    }else{

                        // Print the top players
                        const leaderboardTop = new Discord.EmbedBuilder()
                        leaderboardTop.setColor(FNBRMENA.Colors("embed"))
                        leaderboardTop.setTitle(`Top ${games.tictactoe.top}`)

                        // Looping
                        let string = ``, counter = 1
                        for(let i = 0; i < games.tictactoe.top; i++){
                            if(results[i]){
                                const user = await message.guild.members.cache.get(results[i].id)
                                if(user) string += `${counter++}. ${user.user.username} has ${results[i].wins} wins\n`
                            }else string += `${counter++}. No players yet\n`
                        }
                        leaderboardTop.setDescription(`Here are the top ${games.tictactoe.top} in Tic-Tac-Toe mini-game,you can use \`xo\` command to play with an opponent.\n\n${string}\n\n${emojisObject.starwars} Total matches played ${games.tictactoe.totalMatchesPlayed} match`)
                        message.reply({embeds: [leaderboardTop]})
                    }
                }
            }

        }).catch(async err => {
            dropMenuMessage.delete()
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}