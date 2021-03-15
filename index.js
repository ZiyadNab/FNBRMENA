const path = require('path')
const fs = require('fs')
const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./Coinfigs/config.json')
const UserJoined = require('./Events/User.js')
const Commands = require('./Events/Commands.js')
const firebase = require('firebase/app')
const admin = require('firebase-admin')
const serviceAccount = require('./Firebase/ServiceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fnbrmena-1-default-rtdb.firebaseio.com"
});

client.on('ready', async () => {
  console.log('FNBR_MENA Bot is online!')
  client.setMaxListeners(0);

  const baseFile = 'CommandBase.js'
  const commandBase = require(`./commands/${baseFile}`)
  const Array = []

  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        Array.push(option.commands)
        commandBase(client, option, admin)
      }
    }
  }

  readCommands('commands')
  UserJoined(client, admin)
  Commands(client, admin, Array)
})

client.login(config.apis.token);