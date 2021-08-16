const Data = require('../FNBRMENA')
const FNBRMENA = new Data()
const Discord = require('discord.js')

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

module.exports.listen = async (client, admin, distube) => {

    // Listen for messages
    client.on('message', async (message) => {
        const { member, content, guild } = message

        //if a user used the bot in DM's
        if(message.channel.type === 'dm' && message.content !== ""){

            //inisilizing embed
            const DM = new Discord.MessageEmbed()
            DM.setColor(FNBRMENA.Colors('embed'))

            //set title
            DM.setTitle('New DM Message')
            
            //set description
            DM.setDescription(`**User:** ${message.author.tag}\n**ID:** ${message.author.id}\n**User Language:** ${await FNBRMENA.Admin(admin, message, "", "Lang")}\n**Date:** ${new Date()}\n\n**Content:** \`\`\`bash\n"${message.content}"\`\`\``)

            //send the message to the bot-logs channel
            const logs = client.channels.cache.find(channel => channel.id === '876077567269023754')
            logs.send(DM)
        }

        //get the prefix from database
        const prefix = await FNBRMENA.Admin(admin, message, "", "Prefix")

        // Split on any number of spaces
        const args = content.split(/[ ]+/)

        // Remove the command which is the first index
        const commandUsed = args.shift().toLowerCase()
        const alias = commandUsed.replace(prefix, '')

        if(commandUsed.startsWith(prefix)){
            const command = allCommands[commandUsed.replace(prefix,'')]
            if(!command){
                return
            }

            const {
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
            const errorEmoji = client.emojis.cache.get("836454225344856066")
            const checkEmoji = client.emojis.cache.get("836454263260971018")
            const loadingEmoji = client.emojis.cache.get("862704096312819722")
            const red = client.emojis.cache.get("855805718779002899")
            const green = client.emojis.cache.get("855805718363111434")

            //get the user language from the database
            const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

            //get the command access
            const access = await FNBRMENA.Admin(admin, message, alias, "Command")

            //checking if the bot on or off
            const status = await FNBRMENA.Admin(admin, message, "", "Status")

            if(message.author.id === "325507145871130624"){

                // Ensure we have the correct number of args
                if(args.length < minArgs || (maxArgs !== null && args.length > maxArgs)){

                    //inislizing discord embed
                    const SyntaxError = new Discord.MessageEmbed()
                    SyntaxError.setColor(FNBRMENA.Colors("embed"))

                    //loop throw every argsExample array
                    let Examples = `No examples for this command just use ${commandUsed}`
                    let Symbol = ``
                    for(const example of argsExample){
                        if(example !== false) Examples += `${commandUsed} ${example}\n`
                        if(lang === "en" && example !== false) Symbol += `(${example}) Symbol: The output chosen\n`
                        else if(lang === "ar" && example !== false) Symbol += `رمز (${example}): تحديد نوع الأستخراج\n`
                    }

                    if(lang === "en"){

                        //set author, description and add feilds
                        SyntaxError.setAuthor(`Syntax Error`)
                        if(access === "true") SyntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${green}\n\n${descriptionEN}\n`)
                        else SyntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${red}\n\n${descriptionEN}\n`)
                        SyntaxError.addFields(
                            {name: `Command guide:`, value: `\n\n\`${expectedArgsEN}\``},
                            {name: `Examples:`, value: `\`${Examples}\``},
                            {name: `ًWhere:`, value: `(${prefix}) Sign: The prefix\n(${alias}) Word: The command used\n${Symbol}`}
                        )

                        //add hints if there is a hint
                        if(hintEN !== false) SyntaxError.addFields({name: `Hint:`, value: `\`${hintEN}\``})

                    }else if(lang === "ar"){

                        //set author, description and add feilds
                        SyntaxError.setAuthor(`عملية خاطئة`)
                        SyntaxError.setDescription(`الأمر المستعمل: ${alias}\nحالة الأمر: ${green}\n\n${descriptionAR}\n`)
                        SyntaxError.addFields(
                            {name: `ارشادات الأستخدام:`, value: `\n\n\`${expectedArgsAR}\``},
                            {name: `أمثلة:`, value: `\`${Examples}\``},
                            {name: `حيث أن:`, value: `علامة (${prefix}): تعني العلامة المسبوقة\nكلمة (${alias}): تعني الأمر المستعمل\n${Symbol}`}
                        )

                        //add hints if there is a hint
                        if(hintAR !== false) SyntaxError.addFields({name: `تلميحة:`, value: `\`${hintAR}\``})
                    }

                    //set thumbnail
                    SyntaxError.setThumbnail('https://imgur.com/auAsgQN.png')

                    //send the guide message
                    message.channel.send(SyntaxError)
                    return
                }

                // Handle the custom command code
                callback(message, args, args.join(' '), Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, distube)
      
            }else{
                //checking if the bot on or off
                if(status === "on"){
      
                    //checking if the command is active
                    if(access === "true"){
                        // A command has been ran
                
                        // Ensure the user has the required permissions
                        const perms = await FNBRMENA.Admin(admin, message, alias, "Perms")

                        for(const permission of perms) {
                            if(!member.hasPermission(permission)) {
                                if(lang === "en"){

                                    const permissionErr = new Discord.MessageEmbed()
                                    permissionErr.setColor(FNBRMENA.Colors("embed"))
                                    permissionErr.setTitle(`${permissionError} ${errorEmoji} `)
                                    message.channel.send(permissionErr)
                                }else if(lang === "ar"){

                                    const permissionErr = new Discord.MessageEmbed()
                                    permissionErr.setColor(FNBRMENA.Colors("embed"))
                                    permissionErr.setTitle(`عذرا ليس لديك صلاحية لهذا الامر ${errorEmoji}`)
                                    message.channel.send(permissionErr)
                                }
                                return
                            }
                        }

                        //get the command roles from the database
                        const roles = await FNBRMENA.Admin(admin, message, alias, "Roles")

                        // Ensure the user has the required roles
                        for(const requiredRole of roles) {
                            const role = guild.roles.cache.find((role) => role.name === requiredRole)

                            if(!role || !member.roles.cache.has(role.id)){
                                if(lang === "en"){

                                    const roleErr = new Discord.MessageEmbed()
                                    roleErr.setColor(FNBRMENA.Colors("embed"))
                                    roleErr.setTitle(`You must have the "${requiredRole}" role to use this command ${errorEmoji}`)
                                    message.channel.send(roleErr)
                                }else if(lang === "ar"){

                                    const roleErr = new Discord.MessageEmbed()
                                    roleErr.setColor(FNBRMENA.Colors("embed"))
                                    roleErr.setTitle(`يجب عليك الحصول على رول "${requiredRole}" لأستخدام الامر ${errorEmoji}`)
                                    message.channel.send(roleErr)
                                }
                                return
                            }
                        }

                        // Ensure the use has not ran the command too frequently
                        if(message.channel.type !== "dm"){
                            let cooldownString = `${guild.id}-${message.author.id}-${alias}`
                            if(cooldown > 0 && recentlyRan.includes(cooldownString)){
                                if(lang === "en"){

                                    const cooldownErr = new Discord.MessageEmbed()
                                    cooldownErr.setColor(FNBRMENA.Colors("embed"))
                                    cooldownErr.setTitle(`You can't run this command too soon please wait ${cooldown} sec... ${errorEmoji}`)
                                    message.channel.send(cooldownErr)
                                }else if(lang === "ar"){

                                    const cooldownErr = new Discord.MessageEmbed()
                                    cooldownErr.setColor(FNBRMENA.Colors("embed"))
                                    cooldownErr.setTitle(`لا يمكنك استعمال الامر اكثر من مرا بنفس الوقت الرجاء انتظر ${cooldown} ثانية ${errorEmoji}`)
                                    message.channel.send(cooldownErr)
                                }
                                return
                            }
                        }

                        // Ensure we have the correct number of args
                        if(args.length < minArgs || (maxArgs !== null && args.length > maxArgs)){

                            //inislizing discord embed
                            const SyntaxError = new Discord.MessageEmbed()
                            SyntaxError.setColor(FNBRMENA.Colors("embed"))

                            //loop throw every argsExample array
                            let Examples = `No examples for this command just use ${commandUsed}`
                            let Symbol = ``
                            for(const example of argsExample){
                                if(example !== false) Examples += `${commandUsed} ${example}\n`
                                if(lang === "en" && example !== false) Symbol += `(${example}) Symbol: The output chosen\n`
                                else if(lang === "ar" && example !== false) Symbol += `رمز (${example}): تحديد نوع الأستخراج\n`
                            }

                            if(lang === "en"){

                                //set author, description and add feilds
                                SyntaxError.setAuthor(`Syntax Error`)
                                if(access) SyntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${green}\n\n${descriptionEN}\n`)
                                else SyntaxError.setDescription(`Command Used: ${alias}\nCommand Status: ${red}\n\n${descriptionEN}\n`)
                                SyntaxError.addFields(
                                    {name: `Command guide:`, value: `\n\n\`${expectedArgsEN}\``},
                                    {name: `Examples:`, value: `\`${Examples}\``},
                                    {name: `ًWhere:`, value: `(${prefix}) Sign: The prefix\n(${alias}) Word: The command used\n${Symbol}`}
                                )

                                //add hints if there is a hint
                                if(hintEN !== false) SyntaxError.addFields({name: `Hint:`, value: `\`${hintEN}\``})

                            }else if(lang === "ar"){

                                //set author, description and add feilds
                                SyntaxError.setAuthor(`عملية خاطئة`)
                                SyntaxError.setDescription(`الأمر المستعمل: ${alias}\nحالة الأمر: ${green}\n\n${descriptionAR}\n`)
                                SyntaxError.addFields(
                                    {name: `ارشادات الأستخدام:`, value: `\n\n\`${expectedArgsAR}\``},
                                    {name: `أمثلة:`, value: `\`${Examples}\``},
                                    {name: `حيث أن:`, value: `علامة (${prefix}): تعني العلامة المسبوقة\nكلمة (${alias}): تعني الأمر المستعمل\n${Symbol}`}
                                )

                                //add hints if there is a hint
                                if(hintAR !== false) SyntaxError.addFields({name: `تلميحة:`, value: `\`${hintAR}\``})
                            }

                            //set thumbnail
                            SyntaxError.setThumbnail('https://imgur.com/auAsgQN.png')

                            //send the guide message
                            message.channel.send(SyntaxError)
                            return
                        }

                        //start the cooldown
                        if(cooldown > 0){
                            recentlyRan.push(cooldownString)

                            setTimeout( () => {
                                recentlyRan = recentlyRan.filter((string) => {
                                    return string !== cooldownString
                                })
                            }, 1000 * cooldown)
                        }

                        // Handle the custom command code
                        callback(message, args, args.join(' '),Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, distube)

                    }else if(access === "false"){
                        if(lang === "en"){
                            const err = new Discord.MessageEmbed()
                            err.setColor(FNBRMENA.Colors("embed"))
                            err.setTitle(`Sorry this command is offline at the moment, please try again later ${errorEmoji}`)
                            message.channel.send(err)
                        }else if(lang === "ar"){
                            const err = new Discord.MessageEmbed()
                            err.setColor(FNBRMENA.Colors("embed"))
                            err.setTitle(`نأسف تم ايقاف الامر لمدة معينة نرجوا المحاولة لاحقا ${errorEmoji}`)
                            message.channel.send(err)
                        }
                    }
                }else{
                    if(lang === "en"){

                        const off = new Discord.MessageEmbed()
                        .setColor(FNBRMENA.Colors("embed"))
                        .setTitle(`Errr, Sorry the bot is off at the moment ${errorEmoji}`)
                        message.channel.send(off)
                    }else if(lang === "ar"){

                        const offAR = new Discord.MessageEmbed()
                        .setColor(FNBRMENA.Colors("embed"))
                        .setTitle(`عذرا البوت مغلق بالوقت الحالي ${errorEmoji}`)
                        message.channel.send(offAR)
                    }
                }
            }
        }
    })
}