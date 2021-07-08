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

    //get the prefix from database
    const prefix = await FNBRMENA.Admin(admin, message, "", "Prefix")

    // Split on any number of spaces
    const args = content.split(/[ ]+/)

    // Remove the command which is the first index
    const name = args.shift().toLowerCase()
    const alias = name.replace(prefix,'')

    if(name.startsWith(prefix)){
      const command = allCommands[name.replace(prefix,'')]
      if(!command){
        return
      }

      const {
        expectedArgs,
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

      //get the user language from the database
      const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

      if(message.author.id === "325507145871130624"){

        // Ensure we have the correct number of args
        if (
          args.length < minArgs ||
          (maxArgs !== null && args.length > maxArgs)
        ) {
          if(lang === "en"){
            const SyntaxError = new Discord.MessageEmbed()
            .setColor(FNBRMENA.Colors("embed"))
            .setTitle(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs} ${errorEmoji}`)
            message.channel.send(SyntaxError)
          }else if (lang === "ar"){
            const SyntaxError = new Discord.MessageEmbed()
            .setColor(FNBRMENA.Colors("embed"))
            .setTitle(`غلط في عملية كتابة الامر الرجاء كتابة الامر بالشكل الصحيح \n${prefix}${alias} ${expectedArgs} ${errorEmoji}`)
            message.channel.send(SyntaxError)
          }
          return
        }

        // Handle the custom command code
    
        callback(message, args, args.join(' '), Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, distube)
      
      }else{
        //checking if the bot on or off
        const status = await FNBRMENA.Admin(admin, message, "", "Status")
        if(status === "on"){
      
          //checking if the command is active
          const access = await FNBRMENA.Admin(admin, message, alias, "Command")
          if(access === "true"){
            // A command has been ran
            
            // Ensure the user has the required permissions
            const perms = await FNBRMENA.Admin(admin, message, alias, "Perms")

            for (const permission of perms) {
              if (!member.hasPermission(permission)) {
                if(lang === "en"){
                  const PermErr = new Discord.MessageEmbed()
                  .setColor(FNBRMENA.Colors("embed"))
                  .setTitle(`${permissionError} ${errorEmoji} `)
                  message.channel.send(PermErr)
                }else if(lang === "ar"){
                  const PermErr = new Discord.MessageEmbed()
                  .setColor(FNBRMENA.Colors("embed"))
                  .setTitle(`عذرا ليس لديك صلاحية لهذا الامر ${errorEmoji}`)
                  message.channel.send(PermErr)
                }
                return
              }
            }

            //get the command roles from the database
            const roles = await FNBRMENA.Admin(admin, message, alias, "Roles")

            // Ensure the user has the required roles
            for (const requiredRole of roles) {
              const role = guild.roles.cache.find(
                (role) => role.name === requiredRole
              )

              if (!role || !member.roles.cache.has(role.id)) {
                if(lang === "en"){
                  const RoleErr = new Discord.MessageEmbed()
                  .setColor(FNBRMENA.Colors("embed"))
                  .setTitle(`You must have the "${requiredRole}" role to use this command ${errorEmoji}`)
                  message.channel.send(RoleErr)
                }else if(lang === "ar"){
                  const RoleErrAR = new Discord.MessageEmbed()
                  .setColor(FNBRMENA.Colors("embed"))
                  .setTitle(`يجب عليك الحصول على رول "${requiredRole}" لأستخدام الامر ${errorEmoji}`)
                  message.channel.send(RoleErrAR)
                }
                return
              }
            }

            // Ensure the use has not ran the command too frequently
            let cooldownString = `${guild.id}-${member.id}-${alias}`
            if(cooldown > 0 && recentlyRan.includes(cooldownString)){
              if(lang === "en"){
                const RoleErr = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(`You can't run this command too soon please wait ${cooldown} sec... ${errorEmoji}`)
                message.channel.send(RoleErr)
              }else if(lang === "ar"){
                const RoleErrAR = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(`لا يمكنك استعمال الامر اكثر من مرا بنفس الوقت الرجاء انتظر ${cooldown} ثانية ${errorEmoji}`)
                message.channel.send(RoleErrAR)
              }
              return
            }

            // Ensure we have the correct number of args
            if (
              args.length < minArgs ||
              (maxArgs !== null && args.length > maxArgs)
            ) {
              if(lang === "en"){
                const SyntaxError = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs} ${errorEmoji}`)
                message.channel.send(SyntaxError)
              }else if (lang === "ar"){
                const SyntaxErrorAR = new Discord.MessageEmbed()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(`غلط في عملية كتابة الامر الرجاء كتابة الامر بالشكل الصحيح \n${prefix}${alias} ${expectedArgs} ${errorEmoji}`)
                message.channel.send(SyntaxErrorAR)
              }
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

          }if(access === "false"){
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