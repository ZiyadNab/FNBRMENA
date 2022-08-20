const Data = require('../FNBRMENA')
const FNBRMENA = new Data()
const Discord = require('discord.js')
const moment = require('moment')
require('moment-timezone')
const config = require('./../Configs/config.json')

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
        const { member, content, guild } = await message

        // If a user send a direct message
        if(message.channel.type === Discord.ChannelType.DM && content !== ""){

            // New direct message received
            const newDirectMessage = new Discord.EmbedBuilder()
            newDirectMessage.setColor(FNBRMENA.Colors('embed'))
            newDirectMessage.setTitle('New DM Message')
            newDirectMessage.setDescription(`**User:** ${message.author.tag}\n**ID:** ${message.author.id}\n**User Language:** ${await FNBRMENA.Admin(admin, message, "", "Lang")}\n**Date:** ${new Date()}\n\n**Content:** \`\`\`bash\n"${content}"\`\`\``)
            const logsChannel = client.channels.cache.find(channel => channel.id === '839544462568980510')
            logsChannel.send(newDirectMessage)
        }

        // Get the bot's prefix from database
        const prefix = await FNBRMENA.Admin(admin, message, "", "Prefix")

        // Get user's data from database
        const userData = await FNBRMENA.Admin(admin, message, "", "User");

        // Get moderation roles from database
        const moderationRoles = await FNBRMENA.Admin(admin, message, "", "Moderation");

        // Get bot's status from database
        const botStats = await FNBRMENA.Admin(admin, message, "", "Status")

        // Exceeding Numbers Game
        if(message.channel.id === config.channels.numbers){

            // Get the last message sent
            const numbersGame = await FNBRMENA.Admin(admin, message, "", "numbersGame")

            // If the message sent isn't a number nor exceeding the last message send then delete it
            if(isNaN(content) || Number(content) < numbersGame.lastMessage + 1 || Number(content) > numbersGame.lastMessage + 1) await message.delete() // Delete the user's message
            else{

                // Store the new number
                await admin.database().ref("ERA's").child("numbersGame").update({
                    lastMessage: Number(content)
                })

                if(numbersGame.leaderboard[member.id] != undefined) var newScore = ++numbersGame.leaderboard[member.id].score
                else var newScore = 1

                // Change the user's leaderboard
                await admin.database().ref("ERA's").child("numbersGame").child("leaderboard").child(member.id).update({
                    score: newScore
                 })
            }
        }

        // Split on any number of spaces
        const args = content.split(/[ ]+/)

        // Remove the command which is the first index
        const commandUsed = args.shift().toLowerCase()
        const alias = commandUsed.replace(prefix, '')

        // If the message starts with the bot's prefix
        if(commandUsed.startsWith(prefix) && message.channel.id != config.channels.numbers){
            const command = allCommands[commandUsed.replace(prefix,'')]
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
                permissionError = "Sorry you do not have acccess to this command",
                callback,
            } = command

            // a command has been ran

            // Get the used command data from database
            const commandData = await FNBRMENA.Admin(admin, message, alias, "Command")

            // // If a user has quick access
            for(const roleID of moderationRoles.roleIDs){

                // Ensure the user has a moderation role
                if(member.roles.cache.has(roleID) || userData.quickAccess){

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
                            if(commandData.commandData.commandStatus.status) syntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${emojisObject.greenStatus}\n\n${descriptionEN}\n`)
                            else syntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${emojisObject.redStatus}\n\n${descriptionEN}\n`)
                            syntaxError.addFields(
                                {name: `Command guide:`, value: `\n\n\`${expectedArgsEN}\``},
                                {name: `Examples:`, value: `\`${Examples}\``},
                                {name: `ًWhere:`, value: `(${prefix}) Sign: The prefix\n(${alias}) Word: The command used\n${Symbol}`}
                            )

                            // Command hint
                            if(hintEN !== false) syntaxError.addFields({name: `Hint:`, value: `\`${hintEN}\``})

                        }else if(userData.lang === "ar"){

                            // An explanation message
                            syntaxError.setAuthor({name: `عملية خاطئة`})
                            if(commandData.commandData.commandStatus.status) syntaxError.setDescription(`الأمر المستعمل: ${alias}\nحالة الأمر: ${emojisObject.greenStatus}\n\n${descriptionAR}\n`)
                            else syntaxError.setDescription(`الأمر المستعمل: ${alias}\nحالة الأمر: ${emojisObject.redStatus}\n\n${descriptionAR}\n`)
                            syntaxError.addFields(
                                {name: `ارشادات الأستخدام:`, value: `\n\n\`${expectedArgsAR}\``},
                                {name: `أمثلة:`, value: `\`${Examples}\``},
                                {name: `حيث أن:`, value: `علامة (${prefix}): تعني العلامة المسبوقة\nكلمة (${alias}): تعني الأمر المستعمل\n${Symbol}`}
                            )

                            // Command hint
                            if(hintAR !== false) syntaxError.addFields({name: `تلميحة:`, value: `\`${hintAR}\``})
                        }

                        // Set thumbnail
                        syntaxError.setThumbnail('https://imgur.com/auAsgQN.png')

                        // Send a guided message
                        await message.reply({embeds: [syntaxError]})
                        return
                    }

                    // Handle the custom command code
                    callback(FNBRMENA, message, args, args.join(' '), Discord, client, admin, userData, alias, emojisObject)
                    return
                }
            }

            // Check if the bot online or offline
            if(botStats){
      
                // Check if the command is active
                if(commandData.commandData.commandStatus.status){
                    
                    // A command has been ran
            
                    // Ensure the user has the required permissions
                    for(const permission of commandData.commandData.permissions) {
                        if(!member.hasPermission(permission)) {
                            if(userData.lang === "en"){

                                const permissionErr = new Discord.EmbedBuilder()
                                permissionErr.setColor(FNBRMENA.Colors("embedError"))
                                permissionErr.setTitle(`${permissionError} ${emojisObject.errorEmoji} `)
                                message.reply({embeds: [permissionErr]})
                            }else if(userData.lang === "ar"){

                                const permissionErr = new Discord.EmbedBuilder()
                                permissionErr.setColor(FNBRMENA.Colors("embedError"))
                                permissionErr.setTitle(`عذرا ليس لديك صلاحية لهذا الامر ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [permissionErr]})
                            }
                            return
                        }
                    }

                    // Ensure the user has the required roles
                    for(const requiredRole of commandData.commandData.roles) {
                        const role = guild.roles.cache.find((role) => role.id === requiredRole)

                        if(!role || !member.roles.cache.has(role.id)){
                            if(userData.lang === "en"){

                                const roleErr = new Discord.EmbedBuilder()
                                roleErr.setColor(FNBRMENA.Colors("embedError"))
                                roleErr.setTitle(`You must have the "${requiredRole}" role to use this command ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [roleErr]})
                            }else if(userData.lang === "ar"){

                                const roleErr = new Discord.EmbedBuilder()
                                roleErr.setColor(FNBRMENA.Colors("embedError"))
                                roleErr.setTitle(`يجب عليك الحصول على رول "${requiredRole}" لأستخدام الامر ${emojisObject.errorEmoji}`)
                                message.reply({embeds: [roleErr]})
                            }
                            return
                        }
                    }

                    // Ensure the user has not ran the command too frequently
                    let cooldownString = `${guild.id}-${message.author.id}-${alias}`

                    // Check what cooldown source to implement
                    if(commandData.commandData.cooldown.filesSource) var cooldownSorce = cooldown
                    else var cooldownSorce = commandData.commandData.cooldown.serversCooldown

                    // Push the cooldownString to recentlyRan if it's not included to start the cooldown process
                    if(cooldownSorce > 0 && recentlyRan.includes(cooldownString)){
                        const timeRemaning = cooldownSorce - ((new Date().getTime() - startTimeMS) / 1000) | 0
                        if(userData.lang === "en"){

                            const cooldownErr = new Discord.EmbedBuilder()
                            cooldownErr.setColor(FNBRMENA.Colors("embedError"))
                            cooldownErr.setTitle(`You can't run this command too soon please wait ${timeRemaning} sec... ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [cooldownErr]})
                        }else if(userData.lang === "ar"){

                            const cooldownErr = new Discord.EmbedBuilder()
                            cooldownErr.setColor(FNBRMENA.Colors("embedError"))
                            cooldownErr.setTitle(`لا يمكنك استعمال الامر اكثر من مرا بنفس الوقت الرجاء انتظر ${timeRemaning} ثانية ${emojisObject.errorEmoji}`)
                            message.reply({embeds: [cooldownErr]})
                        }
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
                            if(commandData.commandData.commandStatus.status) syntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${emojisObject.greenStatus}\n\n${descriptionEN}\n`)
                            else syntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${emojisObject.redStatus}\n\n${descriptionEN}\n`)
                            syntaxError.addFields(
                                {name: `Command guide:`, value: `\n\n\`${expectedArgsEN}\``},
                                {name: `Examples:`, value: `\`${Examples}\``},
                                {name: `ًWhere:`, value: `(${prefix}) Sign: The prefix\n(${alias}) Word: The command used\n${Symbol}`}
                            )

                            // Command hint
                            if(hintEN !== false) syntaxError.addFields({name: `Hint:`, value: `\`${hintEN}\``})

                        }else if(userData.lang === "ar"){

                            // An explanation message
                            syntaxError.setAuthor({name: `عملية خاطئة`})
                            if(commandData.commandData.commandStatus.status) syntaxError.setDescription(`الأمر المستعمل: ${alias}\nحالة الأمر: ${emojisObject.greenStatus}\n\n${descriptionAR}\n`)
                            else syntaxError.setDescription(`الأمر المستعمل: ${alias}\nحالة الأمر: ${emojisObject.redStatus}\n\n${descriptionAR}\n`)
                            syntaxError.addFields(
                                {name: `ارشادات الأستخدام:`, value: `\n\n\`${expectedArgsAR}\``},
                                {name: `أمثلة:`, value: `\`${Examples}\``},
                                {name: `حيث أن:`, value: `علامة (${prefix}): تعني العلامة المسبوقة\nكلمة (${alias}): تعني الأمر المستعمل\n${Symbol}`}
                            )

                            // Command hint
                            if(hintAR !== false) syntaxError.addFields({name: `تلميحة:`, value: `\`${hintAR}\``})
                        }

                        // Set thumbnail
                        syntaxError.setThumbnail('https://imgur.com/auAsgQN.png')

                        // Send a guided message
                        message.reply({embeds: [syntaxError]})
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
                    commandTurnedOffErr.setColor(FNBRMENA.Colors("embedError"))
                    moment.locale(userData.lang)

                    // Get the user name
                    const commanedTurnedOffBy = client.users.cache.get(commandData.commandData.commandStatus.by);

                    // An explanation message
                    if(userData.lang === "en"){

                        commandTurnedOffErr.setTitle(`Status: ${emojisObject.redStatus}`)
                        if(commanedTurnedOffBy){
                            if(commandData.commandData.commandStatus.reasonEN === null) commandTurnedOffErr.setDescription(`Reason: \`Sorry this command is offline at the moment, please try again later\`\nBy: \`${commanedTurnedOffBy.tag}\`\nDate: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do of YYYY")}\`\nAgo:  \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} days ago\``)
                            else commandTurnedOffErr.setDescription(`Reason: \`${commandData.commandData.commandStatus.reasonEN}\`\nBy: \`${commanedTurnedOffBy.tag}\`\nDate: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do of YYYY")}\`\nAgo:  \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} days ago\``)
                        }else{
                            if(commandData.commandData.commandStatus.reasonEN === null) commandTurnedOffErr.setDescription(`Reason: \`Sorry this command is offline at the moment, please try again later\`\nBy: \`${commandData.commandData.commandStatus.by}\`\nDate: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do of YYYY")}\`\nAgo:  \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} days ago\``)
                            else commandTurnedOffErr.setDescription(`Reason: \`${commandData.commandData.commandStatus.reasonEN}\`\nBy: \`${commandData.commandData.commandStatus.by}\`\nDate: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do of YYYY")}\`\nAgo: \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} days ago\``)
                        }
                    }
                    else if(userData.lang === "ar"){

                        commandTurnedOffErr.setTitle(`الحالة: ${emojisObject.redStatus}`)
                        if(commanedTurnedOffBy){
                            if(commandData.commandData.commandStatus.reasonAR === null) commandTurnedOffErr.setDescription(`\`السبب: \`نأسف تم ايقاف الامر لمدة معينة نرجوا المحاولة لاحقا\nمن: \`${commanedTurnedOffBy.tag}\`\nالتاريخ: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do من YYYY")}\`\nقبل: \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} يوم مضى\``)
                            else commandTurnedOffErr.setDescription(`السبب: \`${commandData.commandData.commandStatus.reasonAR}\`\nمن: \`${commanedTurnedOffBy.tag}\`\nالتاريخ: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do من YYYY")}\`\nقبل:  \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} يوم مضى\``)
                        }else{
                            if(commandData.commandData.commandStatus.reasonAR === null) commandTurnedOffErr.setDescription(`\`السبب: \`نأسف تم ايقاف الامر لمدة معينة نرجوا المحاولة لاحقا\nمن: \`${commandData.commandData.commandStatus.by}\`\nالتاريخ: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do من YYYY")}\`\nقبل: \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} يوم مضى\``)
                            commandTurnedOffErr.setDescription(`السبب: \`${commandData.commandData.commandStatus.reasonAR}\`\nمن: \`${commandData.commandData.commandStatus.by}\`\nالتاريخ: \`${moment.tz(commandData.commandData.commandStatus.date, userData.timezone).format("dddd, MMMM Do من YYYY")}\`\nقبل:  \`${moment.tz(moment(), userData.timezone).diff(moment.tz(commandData.commandData.commandStatus.date, userData.timezone), 'days')} يوم مضى\``)
                        }
                    }

                    // Send the message
                    message.reply({embeds: [commandTurnedOffErr]})
                }
            }else{
                
                // Bot is offline
                const botStatusOfflineErr = new Discord.EmbedBuilder()
                botStatusOfflineErr.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") botStatusOfflineErr.setTitle(`Errr, Sorry the bot is off at the moment ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") botStatusOfflineErr.setTitle(`عذرا البوت مغلق بالوقت الحالي ${emojisObject.errorEmoji}`)
                message.reply({embeds: [botStatusOfflineErr]})
            }
        }
    })
}