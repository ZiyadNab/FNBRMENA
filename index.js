const serviceAccount = require('./Firebase/ServiceAccount.json')
const config = require('./Coinfigs/config.json')
const Events = require('./Events/Events.js')
const admin = require('firebase-admin')
const Discord = require('discord.js')
const client = new Discord.Client()
require('discord-buttons')(client)
const Data = require('./FNBRMENA')
const path = require('path')
const FNBRMENA = new Data()
const fs = require('fs')


//Get access to the database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fnbrmena-1-default-rtdb.firebaseio.com"
});

//client event listner
client.on('ready', async () => {
  console.log('FNBRMENA Bot is online!')

  const baseFile = 'CommandBase.js'
  const commandBase = require(`./commands/${baseFile}`)
  const Array = []

  //read all commands
  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile) {
        const option = require(path.join(__dirname, dir, file))
        Array.push(option.commands)
        commandBase(option)
      }
    }
  }

  //excute
  readCommands('commands')
  commandBase.listen(client, admin)
  Events(client, admin, Array)
  
})

client.login(FNBRMENA.APIKeys("DiscordBotToken"));