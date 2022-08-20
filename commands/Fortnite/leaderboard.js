
module.exports = {
    commands: 'score',
    type: 'Fun',
    minArgs: 0,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
                
        // Get the last message sent
        const numbersGame = await FNBRMENA.Admin(admin, message, "", "numbersGame")
        
        // Check if there is any args
        if(args.length !== 0){

            // Get user's data
            const user = await message.guild.members.cache.get(text)

            // Check if the user's ID is valid
            if(user){

                // Check if the user has any score
                if(numbersGame.leaderboard[text] != undefined){

                    // Get the user's score
                    const userScoreEmbed = new Discord.EmbedBuilder()
                    userScoreEmbed.setColor(FNBRMENA.Colors("embed"))
                    userScoreEmbed.setTitle(`${user.user.username} has ${numbersGame.leaderboard[text].score} points`)
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

            // Get the results
            const results = []
            for(const leaderboard of Object.keys(numbersGame.leaderboard)){
                if(leaderboard !== 'DONTDELETE') results.push({
                    id: leaderboard,
                    score: numbersGame.leaderboard[leaderboard].score
                })
            }

            // Sort the results
            results.sort(function (a, b) {
                return b.score - a.score
            })

            // Print the top players
            const leaderboardTop = new Discord.EmbedBuilder()
            leaderboardTop.setColor(FNBRMENA.Colors("embed"))
            leaderboardTop.setTitle(`Top ${numbersGame.top}`)

            // Looping
            let string = ``, counter = 1
            for(let i = 0; i < numbersGame.top; i++){
                if(results[i]){
                    const user = await message.guild.members.cache.get(results[i].id)
                    if(user) string += `${counter++}. ${user.user.username} has ${results[i].score} points\n`
                    else string += `${counter++}. No players yet\n`
                }
            }
            leaderboardTop.setDescription(`Here are the top 3 in numbers game\n\n${string}`)
            message.reply({embeds: [leaderboardTop]})
        }
    }
}