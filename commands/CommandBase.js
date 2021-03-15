const { prefix } = require('../Coinfigs/config.json')
const Discord = require('discord.js')

module.exports = (client, commandOptions, admin) => {
  let {
    commands,
    expectedArgs = '',
    permissionError = 'You do not have permission to run this command.',
    minArgs = 0,
    maxArgs = null,
    requiredRoles = [],
    callback,
  } = commandOptions

  // Ensure the command and aliases are in an array
  if (typeof commands === 'string') {
    commands = [commands]
  }

  //console.log(`Registering command "${commands[0]}"`)

  // Listen for messages
  client.on('message', async (message) => {
    const { member, content, guild } = message

    for (const alias of commands) {
      const command = `${prefix}${alias.toLowerCase()}`

      if (
        content.toLowerCase().startsWith(`${command} `) ||
        content.toLowerCase() === command
      ) {
        //checking
        admin.database().ref("ERA's").child("Commands").child(alias).child("Active").once('value', async function (data) {
          var access = data.val().ON;
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
                const PermErr = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(permissionError)
                message.channel.send(PermErr)
                return
              }
            }

            // Ensure the user has the required roles
            for (const requiredRole of requiredRoles) {
              const role = guild.roles.cache.find(
                (role) => role.name === requiredRole
              )

              if (!role || !member.roles.cache.has(role.id)) {
                const RoleErr = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(`You must have the "${requiredRole}" role to use this command.`)
                message.channel.send(RoleErr)
                return
              }
            }

            // Split on any number of spaces
            const args = content.split(/[ ]+/)

            // Remove the command which is the first index
            args.shift()

            // Ensure we have the correct number of args
            if (
              args.length < minArgs ||
              (maxArgs !== null && args.length > maxArgs)
            ) {
              const SyntaxError = new Discord.MessageEmbed()
              .setColor('#BB00EE')
              .setTitle(`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`)
              message.channel.send(SyntaxError)
              return
            }

            // Handle the custom command code
        
            callback(message, args, args.join(' '),Discord, client, admin)
          } 
          if(access === "false"){
            const err = new Discord.MessageEmbed()
            .setColor('#BB00EE')
            .setTitle("Sorry this command is offline at the moment")
            message.channel.send(err)
          }
        })
      return
      }
    }
  })
}