const Data = require('../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas')
const Discord = require('discord.js')
const moment = require('moment')
require('moment-timezone')
const config = require('./../Configs/config.json')
const { translate } = require('bing-translate-api')
const emojis = require('node-emoji')

const allCommands = {}

module.exports = async (commandOptions) => {
    let {
        commands,
    } = commandOptions

    // Ensure the command and aliases are in an array
    if (typeof commands === 'string') {
        commands = [commands]
    }

    //console.log(`Registering command "${commands[0]}"`)

    for(const command of commands){
        allCommands[command] = {
        ...commandOptions,
        commands
        }
    }
}

//cooldowning
let recentlyRan = []
let startTimeMS = 0

module.exports.listen = async (client, admin, emojisObject) => {

    // Listen for messages
    client.on('messageCreate', async (message) => {
        const { member, content, guild } = message

        // Ensure bots messages don't request data
        if(message.author.bot) return

        // If a user send a direct message
        if(message.channel.type === Discord.ChannelType.DM && content !== ""){

            // New direct message received
            const newDirectMessage = new Discord.EmbedBuilder()
            newDirectMessage.setColor(FNBRMENA.Colors('embed'))
            newDirectMessage.setTitle('New DM Message')
            newDirectMessage.setDescription(`**User:** ${message.author.tag}\n**ID:** ${message.author.id}\n**Date:** ${new Date()}\n\n**Content:** \`\`\`bash\n"${content}"\`\`\``)
            const logsChannel = client.channels.cache.find(channel => channel.id === config.events.Logs)
            return logsChannel.send({embeds: [newDirectMessage]})

        }
        
        // Get bot's server data from database
        const serverStats = await FNBRMENA.Admin(admin, message, "", "Server")

        // Exceeding Numbers Game
        if(message.channel.id === config.channels.numbers){

            // Get the last message sent
            const games = await FNBRMENA.Admin(admin, message, "", "Games")

            // If the message sent isn't a number nor exceeding the last message send then delete it
            if(isNaN(content) || Number(content) < games.numbersGame.lastMessage + 1 || Number(content) > games.numbersGame.lastMessage + 1) await message.delete() // Delete the user's message
            else{

                // Store the new number
                await admin.database().ref("ERA's").child("Games").child("numbersGame").update({
                    lastMessage: Number(content)
                })

                if(games.numbersGame.leaderboard[member.id] != undefined) var newScore = ++games.numbersGame.leaderboard[member.id].score
                else var newScore = 1

                // Change the user's leaderboard
                await admin.database().ref("ERA's").child("Games").child("numbersGame").child("leaderboard").child(member.id).update({
                    score: newScore
                })
            }

            return
        }
        // Add emojis
        // message.react(emojis.random().emoji)

        // Split on any number of spaces
        const args = content.split(/[ ]+/)

        // Remove the command which is the first index
        const commandUsed = args.shift().toLowerCase()
        const alias = commandUsed.replace(serverStats.prefix, '')

        // If the message starts with the bot's prefix
        if(commandUsed.startsWith(serverStats.prefix) && message.channel.id != config.channels.numbers){
            const command = allCommands[commandUsed.replace(serverStats.prefix,'')]
            if(!command){
                return
            }

            // Get command attributes
            const {
                type = null,
                descriptionEN = 'There is no explaination for this command YET',
                descriptionAR = 'لايوجد تعليمات على هذا الأمر للأن',
                expectedArgsEN = 'Just use the command its self no arguments needed',
                hintEN = false,
                hintAR = false,
                expectedArgsAR = 'فقط استعمل الأمر بدون اي شي اضافي',
                argsExample = [false],
                minArgs = 0,
                maxArgs = null,
                cooldown = -1,
                callback,
            } = command

            // a command has been ran

            // Get the used command data from database
            const commandData = await FNBRMENA.Admin(admin, message, alias, "Command")

            // Get user's data from database
            const userData = await FNBRMENA.Admin(admin, message, "", "User")

            // If a user has quick access
            if(userData.quickAccess && (serverStats.quickAccess || member.id === serverStats.owner)){

                // Ensure we have the correct number of args
                if(args.length < minArgs || (maxArgs !== null && args.length > maxArgs)){

                    // A syntax error occurred
                    const syntaxError = new Discord.EmbedBuilder()
                    syntaxError.setColor(FNBRMENA.Colors("syntaxError"))

                    // Loop through every argsExample array
                    let Examples = ``
                    let Symbol = ``
                    for(const example of argsExample){
                        if(example !== false){
                            Examples += `${commandUsed} ${example}\n`
                        }else Examples += `No examples for this command just use ${commandUsed}`
                        if(userData.lang === "en" && example !== false) Symbol += `(${example}) Symbol: The output chosen\n`
                        else if(userData.lang === "ar" && example !== false) Symbol += `رمز (${example}): تحديد نوع الأستخراج\n`
                    }

                    if(userData.lang === "en"){

                        // An explanation message
                        syntaxError.setAuthor({name: `Syntax Error`})
                        if(commandData.command.commandData.commandStatus.status) syntaxError.setDescription(`Command Used: \`${alias.toUpperCase()}\`\nCommand Status: ${emojisObject.Uncommon}\n\n${descriptionEN}\n`)
                        else syntaxError.setDescription(`Command Used: \`${alias.toUpperCase()}\`\nCommand Status: ${emojisObject.MarvelSeries}\n\n${descriptionEN}\n`)
                        syntaxError.addFields(
                            {name: `Command guide:`, value: `\n\n\`${expectedArgsEN}\``},
                            {name: `Examples:`, value: `\`${Examples}\``},
                            {name: `ًWhere:`, value: `(${serverStats.prefix}) Sign: The prefix\n(${alias}) Word: The command used\n${Symbol}`}
                        )

                        // Command hint
                        if(hintEN !== false) syntaxError.addFields({name: `Hint:`, value: `\`${hintEN}\``})

                    }else if(userData.lang === "ar"){

                        // An explanation message
                        syntaxError.setAuthor({name: `عملية خاطئة`})
                        if(commandData.command.commandData.commandStatus.status) syntaxError.setDescription(`الأمر المستعمل: \`${alias.toUpperCase()}\`\nحالة الأمر: ${emojisObject.Uncommon}\n\n${descriptionAR}\n`)
                        else syntaxError.setDescription(`الأمر المستعمل: \`${alias.toUpperCase()}\`\nحالة الأمر: ${emojisObject.MarvelSeries}\n\n${descriptionAR}\n`)
                        syntaxError.addFields(
                            {name: `ارشادات الأستخدام:`, value: `\n\n\`${expectedArgsAR}\``},
                            {name: `أمثلة:`, value: `\`${Examples}\``},
                            {name: `حيث أن:`, value: `علامة (${serverStats.prefix}): تعني العلامة المسبوقة\nكلمة (${alias}): تعني الأمر المستعمل\n${Symbol}`}
                        )

                        // Command hint
                        if(hintAR !== false) syntaxError.addFields({name: `تلميحة:`, value: `\`${hintAR}\``})
                    }

                    // Set thumbnail
                    syntaxError.setThumbnail('https://i.ibb.co/7NRmhYr/auAsgQN.png')

                    // Send a guided message
                    message.reply({embeds: [syntaxError], components: [], files: []})
                    return
                }

                // Handle the custom command code
                callback(FNBRMENA, message, args, args.join(' '), Discord, client, admin, userData, alias, emojisObject)
                return
            }

            // Check bot status
            if(serverStats.bot.status){
    
                // Check if the command is active
                if(commandData.command.commandData.commandStatus.status){
                    
                    // A command has been ran

                    // Ensure the user is not banned
                    if(commandData.usersBanned){

                        const userBanErr = new Discord.EmbedBuilder()
                        userBanErr.setColor(FNBRMENA.Colors("embedError"))
                        userBanErr.setThumbnail('https://i.ibb.co/0FZxNr6/tS0dHcs.png')
                        if(userData.lang === "en"){
                            userBanErr.setTitle(`YOU HAVE BEEN BANNED!`)
                            userBanErr.setFooter({text: `Banned ${(moment().diff(moment(commandData.usersBanned.date), 'days') === 0) ? `${(moment().diff(moment(commandData.usersBanned.date), 'hours') === 0) ? `${moment().diff(moment(commandData.usersBanned.date), 'minutes')} minute(s)` : `${moment().diff(moment(commandData.usersBanned.date), 'hours')} hour(s)`}` : `${moment().diff(moment(commandData.usersBanned.date), 'days')} days`} ago`})
                            if(commandData.usersBanned.reasonEN === null) userBanErr.setDescription(`You have been banned from using ${commandData.command.aliases[0].toUpperCase()} command, reasons are unknown please ask the moderation team for more information.\n\nKeep in mind that this ban might be given to you by mistake, so if you haven't done anything wrong [__LET US KNOW__](https://discord.com/channels/756464693492842496/800405068880281661) as soon as possible`)
                            else{

                                userBanErr.setDescription(`You have been banned from using ${commandData.command.aliases[0].toUpperCase()} command.\n\nKeep in mind that this ban might be given to you by mistake, so if you haven't done anything wrong [__LET US KNOW__](https://discord.com/channels/756464693492842496/800405068880281661) as soon as possible`)
                                userBanErr.addFields(
                                    {
                                        name: `Reason`,
                                        value: `\`${commandData.usersBanned.reasonEN}\``,
                                    }
                                )
                            }
                        }
                        else if(userData.lang === "ar"){
                            userBanErr.setTitle(`لقد تم حظرك!`)
                            userBanErr.setFooter({text: `محظور منذ ${(moment().diff(moment(commandData.usersBanned.date), 'days') === 0) ? `${(moment().diff(moment(commandData.usersBanned.date), 'hours') === 0) ? `${moment().diff(moment(commandData.usersBanned.date), 'minutes')} دقيقة` : `${moment().diff(moment(commandData.usersBanned.date), 'hours')} ساعة`}` : `${moment().diff(moment(commandData.usersBanned.date), 'days')} يوم`}`})
                            if(commandData.usersBanned.reasonAR === null) userBanErr.setDescription(`لقد تم حظرك من استخدام امر ${commandData.command.aliases[0].toUpperCase()} , الاسباب مجهولة الرجاء التحدث من الدعم للمزيد من المعلومات.\n\nللعلم من الممكن تم حظرك عن طريق الخطأ , لذا في حال لم تقم بأي غلط [__اخبرنا في الحال__](https://discord.com/channels/756464693492842496/800405068880281661) في اقرب وقت ممكن`)
                            else{

                                userBanErr.setDescription(`لقد تم حظرك من استخدام امر ${commandData.command.aliases[0].toUpperCase()}.\n\nللعلم من الممكن تم حظرك عن طريق الخطأ , لذا في حال لم تقم بأي غلط [__اخبرنا في الحال__](https://discord.com/channels/756464693492842496/800405068880281661) في اقرب وقت ممكن`)
                                userBanErr.addFields(
                                    {
                                        name: `السبب`,
                                        value: `\`${commandData.usersBanned.reasonAR}\``,
                                    }
                                )
                            }
                        }
                        message.reply({embeds: [userBanErr], components: [], files: []})
                        return
                    }

                    // Ensure the user uses the command in commands channel
                    if((!serverStats.allowedChannels.includes(message.channel.id) && !commandData.command.allowedChannels.includes(message.channel.id) && serverStats.lockedChannels)){

                        const wrongChat = new Discord.EmbedBuilder()
                        wrongChat.setThumbnail('https://i.ibb.co/gdV8YrS/x7F9Q0K.png')
                        wrongChat.setColor(FNBRMENA.Colors("syntaxError"))
                        if(userData.lang === "en"){
                            wrongChat.setTitle(`INCORRECT CHANNEL ${emojisObject.errorEmoji}.`)
                            var string = ``
                            for(const chat of serverStats.allowedChannels) string += `• <#${chat}>\n`
                            for(const chat of commandData.command.allowedChannels) string += `• <#${chat}>\n`
                            wrongChat.setDescription(`Commands can only be ran in the following chat(s)\n\n${string}`)
                        }else if(userData.lang === "ar"){
                            wrongChat.setTitle(`قناة غير صحيحة ${emojisObject.errorEmoji}.`)
                            var string = ``
                            for(const chat of serverStats.allowedChannels) string += `• <#${chat}>\n`
                            for(const chat of commandData.command.allowedChannels) string += `• <#${chat}>\n`
                            wrongChat.setDescription(`يمكنك استخدام الاوامر فقط غي القنوات التالية \n\n${string}`)
                        }
                        message.reply({embeds: [wrongChat], components: [], files: []})
                        return
                    }
            
                    // Ensure the user has the required permissions
                    for(const permission of commandData.command.commandData.permissions) {
                        if(!member.hasPermission(permission)) {
                            
                            const permissionErr = new Discord.EmbedBuilder()
                            permissionErr.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") permissionErr.setTitle(`Sorry you do not have acccess to this command ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") permissionErr.setTitle(`عذرا ليس لديك صلاحية لهذا الامر ${emojisObject.errorEmoji}.`)
                            message.reply({embeds: [permissionErr], components: [], files: []})
                            return
                        }
                    }

                    // Ensure the user has premium access
                    if(commandData.command.commandData.premium){

                        if(!userData.premium){
                            const premiumErr = new Discord.EmbedBuilder()
                            premiumErr.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") premiumErr.setTitle(`This command is only for premium users please buy access first ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "en") premiumErr.setTitle(`الأمر فقط لأصحاب الوصول الخاص و الرجاء اولا الشراء ${emojisObject.errorEmoji}.`)
                            message.reply({embeds: [premiumErr], components: [], files: []})
                            return
                        }
                    }
            
                    // Ensure the user has the required permissions
                    for(const permission of commandData.command.commandData.permissions) {
                        if(!member.hasPermission(permission)) {
                            
                            const permissionErr = new Discord.EmbedBuilder()
                            permissionErr.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") permissionErr.setTitle(`Sorry you do not have acccess to this command ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") permissionErr.setTitle(`عذرا ليس لديك صلاحية لهذا الامر ${emojisObject.errorEmoji}.`)
                            message.reply({embeds: [permissionErr], components: [], files: []})
                            return
                        }
                    }

                    // Ensure the user has the required roles
                    for(const requiredRole of commandData.command.commandData.roles) {
                        const role = guild.roles.cache.find((role) => role.id === requiredRole)

                        if(!role || !member.roles.cache.has(role.id)){

                            const roleErr = new Discord.EmbedBuilder()
                            roleErr.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") roleErr.setTitle(`You must have the "${(role === undefined ? requiredRole : role.name)}" role to use this command ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") roleErr.setTitle(`يجب عليك الحصول على رول "${(role === undefined ? requiredRole : role.name)}" لأستخدام الامر ${emojisObject.errorEmoji}.`)
                            message.reply({embeds: [roleErr], components: [], files: []})
                            return
                        }
                    }

                    // Ensure the user has not ran the command too frequently
                    let cooldownString = `${guild.id}-${message.author.id}-${alias}`

                    // Check what cooldown source to implement
                    if(commandData.command.commandData.cooldown.filesSource) var cooldownSorce = cooldown
                    else var cooldownSorce = commandData.command.commandData.cooldown.serversCooldown

                    // Push the cooldownString to recentlyRan if it's not included to start the cooldown process
                    if(cooldownSorce > 0 && recentlyRan.includes(cooldownString)){
                        const timeRemaning = cooldownSorce - ((new Date().getTime() - startTimeMS) / 1000) | 0

                        const cooldownErr = new Discord.EmbedBuilder()
                        cooldownErr.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") cooldownErr.setTitle(`You can't run this command too soon please wait ${timeRemaning} sec... ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") cooldownErr.setTitle(`لا يمكنك استعمال الامر اكثر من مرا بنفس الوقت الرجاء انتظر ${timeRemaning} ثانية ${emojisObject.errorEmoji}.`)
                        message.reply({embeds: [cooldownErr], components: [], files: []})
                        return
                    }

                    // Ensure we have the correct number of args
                    if(args.length < minArgs || (maxArgs !== null && args.length > maxArgs)){

                        // A syntax error occurred
                        const syntaxError = new Discord.EmbedBuilder()
                        syntaxError.setColor(FNBRMENA.Colors("syntaxError"))

                        // Loop through every argsExample array
                        let Examples = ``
                        let Symbol = ``
                        for(const example of argsExample){
                            if(example !== false){
                                Examples += `${commandUsed} ${example}\n`
                            } else Examples += `No examples for this command just use ${commandUsed}`
                            if(userData.lang === "en" && example !== false) Symbol += `(${example}) Symbol: The output chosen\n`
                            else if(userData.lang === "ar" && example !== false) Symbol += `رمز (${example}): تحديد نوع الأستخراج\n`
                        }

                        if(userData.lang === "en"){

                            // An explanation message
                            syntaxError.setAuthor({name: `Syntax Error`})
                            if(commandData.command.commandData.commandStatus.status) syntaxError.setDescription(`Command Used: \`${alias.toUpperCase()}\`\nCommand Status: ${emojisObject.Uncommon}\n\n${descriptionEN}\n`)
                            else syntaxError.setDescription(`Command Used: \`${alias.toUpperCase()}\`\nCommand Status: ${emojisObject.MarvelSeries}\n\n${descriptionEN}\n`)
                            syntaxError.addFields(
                                {name: `Command guide:`, value: `\n\n\`${expectedArgsEN}\``},
                                {name: `Examples:`, value: `\`${Examples}\``},
                                {name: `ًWhere:`, value: `(${serverStats.prefix}) Sign: The prefix\n(${alias}) Word: The command used\n${Symbol}`}
                            )

                            // Command hint
                            if(hintEN !== false) syntaxError.addFields({name: `Hint:`, value: `\`${hintEN}\``})

                        }else if(userData.lang === "ar"){

                            // An explanation message
                            syntaxError.setAuthor({name: `عملية خاطئة`})
                            if(commandData.command.commandData.commandStatus.status) syntaxError.setDescription(`الأمر المستعمل: \`${alias.toUpperCase()}\`\nحالة الأمر: ${emojisObject.Uncommon}\n\n${descriptionAR}\n`)
                            else syntaxError.setDescription(`الأمر المستعمل: \`${alias.toUpperCase()}\`\nحالة الأمر: ${emojisObject.MarvelSeries}\n\n${descriptionAR}\n`)
                            syntaxError.addFields(
                                {name: `ارشادات الأستخدام:`, value: `\n\n\`${expectedArgsAR}\``},
                                {name: `أمثلة:`, value: `\`${Examples}\``},
                                {name: `حيث أن:`, value: `علامة (${serverStats.prefix}): تعني العلامة المسبوقة\nكلمة (${alias}): تعني الأمر المستعمل\n${Symbol}`}
                            )

                            // Command hint
                            if(hintAR !== false) syntaxError.addFields({name: `تلميحة:`, value: `\`${hintAR}\``})
                        }

                        // Set thumbnail
                        syntaxError.setThumbnail('https://i.ibb.co/7NRmhYr/auAsgQN.png')

                        // Send a guided message
                        message.reply({embeds: [syntaxError], components: [], files: []})
                        return
                    }

                    //start the cooldown
                    if(cooldownSorce > 0){
                        recentlyRan.push(cooldownString)
                        startTimeMS = (new Date()).getTime()

                        setTimeout( () => {
                            recentlyRan = recentlyRan.filter((string) => {
                                return string !== cooldownString
                            })
                        }, 1000 * cooldownSorce)
                    }

                    // Handle the custom command code
                    callback(FNBRMENA, message, args, args.join(' '), Discord, client, admin, userData, alias, emojisObject)

                }else{

                    // The command used is disabled
                    const commandTurnedOffErr = new Discord.EmbedBuilder()
                    commandTurnedOffErr.setColor(FNBRMENA.Colors("embedWarning"))
                    commandTurnedOffErr.setThumbnail('https://cdn-icons-png.flaticon.com/512/1008/1008928.png')
                    moment.locale(userData.lang)

                    if(userData.lang === "en"){
                        commandTurnedOffErr.setTitle(`TEMPORARILY DISABLED!`)
                        commandTurnedOffErr.setFooter({text: `Disabled ${(moment().diff(moment(commandData.command.commandData.commandStatus.date), 'days') === 0) ? `${(moment().diff(moment(commandData.command.commandData.commandStatus.date), 'hours') === 0) ? `${moment().diff(moment(commandData.command.commandData.commandStatus.date), 'minutes')} minute(s)` : `${moment().diff(moment(commandData.command.commandData.commandStatus.date), 'hours')} hour(s)`}` : `${moment().diff(moment(commandData.command.commandData.commandStatus.date), 'days')} days`} ago`})
                        if(commandData.command.commandData.commandStatus.reasonEN === null) commandTurnedOffErr.setDescription(`ًWe are sorry to interrupt you, The command ${commandData.command.aliases[0].toUpperCase()} has been temporarily disabled until further notice, Yet reasons are unknown please bear with us until we finish maintenance, Keep in mind it MIGHT take longer times than expected to finish maintenance. Thank you.`)
                        else{

                            commandTurnedOffErr.setDescription(`We are sorry to interrupt you, The command ${commandData.command.aliases[0].toUpperCase()} has been temporarily disabled until further notice, Keep in mind it **MIGHT** take longer times than expected to finish maintenance. Thank you.`)
                            commandTurnedOffErr.addFields(
                                {
                                    name: `Reason`,
                                    value: `\`${commandData.command.commandData.commandStatus.reasonEN}\``,
                                }
                            )
                        }
                    }else if(userData.lang === "ar"){
                        commandTurnedOffErr.setTitle(`موقوف مؤقتا!`)
                        commandTurnedOffErr.setFooter({text: `موقوف منذ ${(moment().diff(moment(commandData.command.commandData.commandStatus.date), 'days') === 0) ? `${(moment().diff(moment(commandData.command.commandData.commandStatus.date), 'hours') === 0) ? `${moment().diff(moment(commandData.command.commandData.commandStatus.date), 'minutes')} دقيقة` : `${moment().diff(moment(commandData.command.commandData.commandStatus.date), 'hours')} ساعة`}` : `${moment().diff(moment(commandData.command.commandData.commandStatus.date), 'days')} يوم`}`})
                        if(commandData.command.commandData.commandStatus.reasonAR === null) commandTurnedOffErr.setDescription(`نأسف لمقاطعتك ، الأمر ${commandData.command.aliases[0].toUpperCase()} تم تعطيله مؤقتًا حتى إشعار آخر ، ولكن الأسباب غير معروفة ، يرجى تحملنا حتى ننتهي من الصيانة ، ضع في اعتبارك أنه **من الممكن** يستغرق وقتًا أطول من المتوقع لإنهاء الصيانة.  شكرًا لك.`)
                        else{

                            commandTurnedOffErr.setDescription(`نأسف لمقاطعتك ، الأمر ${commandData.command.aliases[0].toUpperCase()} تم تعطيله مؤقتًا حتى إشعار آخر ، ضع في اعتبارك أنه **من الممكن** يستغرق وقتًا أطول من المتوقع لإنهاء الصيانة.  شكرًا لك.`)
                            commandTurnedOffErr.addFields(
                                {
                                    name: `السبب`,
                                    value: `\`${commandData.command.commandData.commandStatus.reasonAR}\``,
                                }
                            )
                        }
                    }

                    // Send the message
                    message.reply({embeds: [commandTurnedOffErr], components: [], files: []})
                }
            }else{
                
                // Bot is offline
                const botStatusOfflineErr = new Discord.EmbedBuilder()
                botStatusOfflineErr.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") botStatusOfflineErr.setTitle(`Errr, Sorry the bot is off at the moment ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") botStatusOfflineErr.setTitle(`عذرا البوت مغلق بالوقت الحالي ${emojisObject.errorEmoji}`)
                message.reply({embeds: [botStatusOfflineErr], components: [], files: []})
            }
        }
    })

    client.on(Discord.Events.InteractionCreate, async interaction => {

        if(interaction.isButton()){

            const splittedId = interaction.customId.split('-')
            if(splittedId[0] === 'Poll'){

                // Setting up the db firestore
                var db = await admin.firestore()

                const pollRichEmbed = interaction.message.embeds[0]
                if(!pollRichEmbed) return interaction.reply({content: `Can't find the poll data to process your request.`, ephemeral: true})

                // Poll document
                const pollData = await db.collection("Polls").doc(`${splittedId[3]}`).get()

                // Check if the poll id given is already exists 
                if(pollData.exists){

                    // If restrictions are enabled
                    if(splittedId[4].toLowerCase() === 'true'){

                        // Check if the user has already voted
                        if(pollData.data().voters.includes(interaction.user.id)) return interaction.reply({content: `Your vote has already been submitted!`, ephemeral: true})

                        // Get the existing voters from the database
                        const pollVoters = pollData.data().voters
                        pollVoters.push(interaction.user.id)

                        // Update the data
                        await db.collection("Polls").doc(`${splittedId[3]}`).update({
                            voters: pollVoters
                        })
                    }

                }else{

                    // If restrictions are enabled
                    if(splittedId[4].toLowerCase() === 'true'){

                        // Update the data
                        db.collection("Polls").doc(`${splittedId[3]}`).set({
                            messageId: interaction.message.id,
                            channelId: interaction.message.channelId,
                            voters: [interaction.user.id]
                        })
                    }else{

                        db.collection("Polls").doc(`${splittedId[3]}`).set({
                            messageId: interaction.message.id,
                            channelId: interaction.message.channelId,
                        })
                    }
                }

                const yesField = pollRichEmbed.fields[0]
                const noField = pollRichEmbed.fields[1]

                // Creating canvas
                const canvas = Canvas.createCanvas(2000, 23)
                const ctx = canvas.getContext('2d')

                // Create a new embed
                const pollEmbed = new Discord.EmbedBuilder()
                pollEmbed.setColor(`#${splittedId[5]}`)
                pollEmbed.setFields(pollRichEmbed.fields)
                pollEmbed.setFooter(pollRichEmbed.footer)
                pollEmbed.setDescription(pollRichEmbed.description)

                switch(splittedId[1]){
                    case "Yes": {

                        // Get the total Yes's/No's count
                        const newYesCount = parseInt(yesField.value) + 1
                        const newNoCount = parseInt(noField.value)

                        // Draw Yes's
                        ctx.fillStyle = `#${splittedId[5]}`
                        ctx.fillRect(0, 0, (newYesCount / (newYesCount + newNoCount)) * canvas.width, canvas.height)

                        // Draw No's
                        ctx.fillStyle = `#000000`
                        ctx.fillRect(canvas.width, 0, -(newNoCount / (newYesCount + newNoCount)) * canvas.width, canvas.height)

                        // Attach the image
                        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `pollFooter.png`})
                        pollEmbed.setImage('attachment://pollFooter.png')

                        // Update message
                        yesField.value = newYesCount
                        interaction.reply({content: `Your vote has been submitted!`, ephemeral: true})
                        interaction.message.edit({embeds: [pollEmbed], files: [attachment]})
                    }
                    break;
                    case "No": {

                        // Get the total Yes's/No's count
                        const newYesCount = parseInt(yesField.value)
                        const newNoCount = parseInt(noField.value) + 1

                        // Draw Yes's
                        ctx.fillStyle = `#${splittedId[5]}`
                        ctx.fillRect(0, 0, (newYesCount / (newYesCount + newNoCount)) * canvas.width, canvas.height)

                        // Draw No's
                        ctx.fillStyle = `#000000`
                        ctx.fillRect(canvas.width, 0, -(newNoCount / (newYesCount + newNoCount)) * canvas.width, canvas.height)

                        // Attach the image
                        const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `pollFooter.png`})
                        pollEmbed.setImage('attachment://pollFooter.png')

                        // Update message
                        noField.value = newNoCount
                        interaction.reply({content: `Your vote has been submitted!`, ephemeral: true})
                        interaction.message.edit({embeds: [pollEmbed], files: [attachment]})

                    }
                    break;
                }
            }

            if(splittedId[0] === 'Translate'){

                const translateRichEmbed = interaction.message.embeds[0]
                if(!translateRichEmbed) return interaction.reply({content: `Can't find the embed data to process your request.`, ephemeral: true})

                // Translate data
                const title = await translate(translateRichEmbed.title, null, 'ar', true)
                const description = await translate(translateRichEmbed.description, null, 'ar', true)

                // Create a new embed
                const translateEmbed = new Discord.EmbedBuilder()
                translateEmbed.setColor(translateRichEmbed.color)
                translateEmbed.setTitle(title.translation)
                translateEmbed.setDescription(description.translation)

                interaction.reply({embeds: [translateEmbed], ephemeral: true})

            }


        }

        if(interaction.isChatInputCommand()){

            const command = interaction.client.commands.get(interaction.commandName)

            // Get user's data from database
            const userData = await FNBRMENA.Admin(admin, interaction, "", "User", true)

            if (!command) return

            try {
                await command.execute(FNBRMENA, interaction, Discord, client, admin, userData, emojisObject);
            } catch (error) {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    })
}