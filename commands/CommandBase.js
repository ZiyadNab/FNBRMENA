const { prefix } = require('../Coinfigs/config.json')
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

module.exports.listen = async (client, admin) => {
  // Listen for messages
  client.on('message', async (message) => {
    const { member, content, guild } = message

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
        permissionError = "Sorry you do not have acccess to this command",
        requiredRoles = [],
        callback,
      } = command

      // a command has been ran
      const errorEmoji = client.emojis.cache.get("836454225344856066")
      const checkEmoji = client.emojis.cache.get("836454263260971018")

      admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
        var lang = data.val().lang;

        if(message.author.id === "325507145871130624"){

          // Ensure we have the correct number of args
          if (
            args.length < minArgs ||
            (maxArgs !== null && args.length > maxArgs)
          ) {
            if(lang === "en"){
              const SyntaxError = new Discord.MessageEmbed()
              .setColor('#BB00EE')
              .setTitle(`:x: Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
              message.channel.send(SyntaxError)
            }else if (lang === "ar"){
              const SyntaxError = new Discord.MessageEmbed()
              .setColor('#BB00EE')
              .setTitle(`:x: غلط في عملية كتابة الامر الرجاء كتابة الامر بالشكل الصحيح \n${prefix}${alias} ${expectedArgs}`)
              message.channel.send(SyntaxError)
            }
            return
          }

          // Handle the custom command code
      
          callback(message, args, args.join(' '),Discord, client, admin, alias, errorEmoji, checkEmoji)

        }else{
          //checking if the bot on or off
        admin.database().ref("ERA's").child("Server").child("Status").once('value', async function (data) {
          var status = data.val().Bot;
          if(status === "on"){
        
            //checking if the command is active
            admin.database().ref("ERA's").child("Commands").child(alias).child("Active").once('value', async function (data) {
              var access = data.val().Status;
              var ReasonEN = data.val().ReasonEN;
              var ReasonAR = data.val().ReasonAR;
              if(access === "true"){
                // A command has been ran
                
                // Ensure the user has the required permissions
                var p = []
                await admin.database().ref("ERA's").child("Commands").child(alias).child("Perms").child("0").once('value', async data => {
                  if(data.val() !== null){
                    p = data.val()
                  }
                })
                for (const permission of p) {
                  if (!member.hasPermission(permission)) {
                    if(lang === "en"){
                      const PermErr = new Discord.MessageEmbed()
                      .setColor('#BB00EE')
                      .setTitle(":x: "+permissionError)
                      message.channel.send(PermErr)
                    }else if(lang === "ar"){
                      const PermErr = new Discord.MessageEmbed()
                      .setColor('#BB00EE')
                      .setTitle(":x: عذرا ليس لديك صلاحية لهذا الامر.")
                      message.channel.send(PermErr)
                    }
                    return
                  }
                }

                // Ensure the user has the required roles
                for (const requiredRole of requiredRoles) {
                  const role = guild.roles.cache.find(
                    (role) => role.name === requiredRole
                  )

                  if (!role || !member.roles.cache.has(role.id)) {
                    if(lang === "en"){
                      const RoleErr = new Discord.MessageEmbed()
                      .setColor('#BB00EE')
                      .setTitle(`:x: You must have the "${requiredRole}" role to use this command.`)
                      message.channel.send(RoleErr)
                    }else if(lang === "ar"){
                      const RoleErrAR = new Discord.MessageEmbed()
                      .setColor('#BB00EE')
                      .setTitle(`:x: هذا الامر فقط متوفر اذا كان لديك رول "${requiredRole}"`)
                      message.channel.send(RoleErrAR)
                    }
                    return
                  }
                }

                // Ensure we have the correct number of args
                if (
                  args.length < minArgs ||
                  (maxArgs !== null && args.length > maxArgs)
                ) {
                  if(lang === "en"){
                    const SyntaxError = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`:x: Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
                    message.channel.send(SyntaxError)
                  }else if (lang === "ar"){
                    const SyntaxErrorAR = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`:x: غلط في عملية كتابة الامر الرجاء كتابة الامر بالشكل الصحيح \n${prefix}${alias} ${expectedArgs}`)
                    message.channel.send(SyntaxErrorAR)
                  }
                  return
                }

                // Handle the custom command code
            
                callback(message, args, args.join(' '),Discord, client, admin, alias, errorEmoji, checkEmoji)
              } if(access === "false"){
                  if(lang === "en"){
                      const err = new Discord.MessageEmbed()
                      err.setColor('#BB00EE')
                      if(ReasonEN !== null){
                        err.setTitle(ReasonEN)
                      }else{
                        err.setTitle(":x: Sorry this command is offline at the moment, please try again later")
                      }
                      message.channel.send(err)
                  }else if(lang === "ar"){
                      const err = new Discord.MessageEmbed()
                      err.setColor('#BB00EE')
                      if(ReasonAR !== ''){
                        err.setTitle(ReasonAR)
                      }else{
                        err.setTitle(":x: نأسف تم ايقاف الامر لمدة معينة نرجوا المحاولة لاحقا")
                      }
                      message.channel.send(err)
                  }
                }
              })
            }else{
              if(lang === "en"){
                const off = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(":robot: Errr, Sorry the bot is off at the moment")
                message.channel.send(off)
              }else if(lang === "ar"){
                const offAR = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(":robot: عذرا البوت مغلق بالوقت الحالي")
                message.channel.send(offAR)
              }
            }
          })
        }
      })
    }
  })
}