const serviceAccount = require('./Firebase/ServiceAccount.json')
const config = require('./Coinfigs/config.json')
const Events = require('./Events/Events.js')
const admin = require('firebase-admin')
const Discord = require('discord.js')
const client = new Discord.Client()
require('discord-buttons')(client)
const DisTube = require('distube')
const Data = require('./FNBRMENA')
const path = require('path')
const FNBRMENA = new Data()
const fs = require('fs')

//Get access to the database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fnbrmena-1-default-rtdb.firebaseio.com"
});

//define the distube on client
const disTube = new DisTube(client, {
  searchSongs: false,
  emitNewSongOnly: true
})

//status
const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filter || 'Off'}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? 'All Queue' : 'This Song' : 'Off'}\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``

// DisTube event listeners, more in the documentation page
disTube
    .on('playSong', async (message, queue, song) => {

        const playing = new Discord.MessageEmbed()
        playing.setTitle(`Playing \`${song.name}\``)
        playing.setDescription(`Duration: \`${song.formattedDuration}\` Queue Duration: ${queue.duration}`)
        playing.setImage(song.thumbnail)
        playing.setAuthor("Played By " + song.user.username)
        message.channel.send(playing)

    })
    .on('addSong', (message, queue, song) => {

        const addSong = new Discord.MessageEmbed()
        addSong.setTitle(`\`${song.name}\``)
        addSong.setDescription(`Duration: \`${song.formattedDuration}\``)
        addSong.setImage(song.thumbnail)
        addSong.setAuthor("Added By " + song.user.username)
        message.channel.send(addSong)

    })
    .on('error', async (err) => {
      console.log(err)
    })

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
  commandBase.listen(client, admin, disTube)
  Events(client, admin, Array)
  
})

client.login(FNBRMENA.APIKeys("DiscordBotToken"));