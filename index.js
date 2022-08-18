const serviceAccount = require('./Firebase/ServiceAccount.json')
const Events = require('./Events/Events.js')
const admin = require('firebase-admin')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.DirectMessageReactions,
  Discord.GatewayIntentBits.DirectMessageTyping, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildBans, Discord.GatewayIntentBits.GuildEmojisAndStickers,
  Discord.GatewayIntentBits.GuildEmojisAndStickers, Discord.GatewayIntentBits.GuildIntegrations, Discord.GatewayIntentBits.GuildInvites, Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.GuildMessageTyping, Discord.GatewayIntentBits.GuildPresences,
  Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildWebhooks, Discord.GatewayIntentBits.MessageContent], partials: [Discord.Partials.Channel]})
const { DisTube } = require('distube')
const { YtDlpPlugin } = require("@distube/yt-dlp")
const Data = require('./FNBRMENA')
const path = require('path')
const FNBRMENA = new Data()
const fs = require('fs')

//Get access to the database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fnbrmena-1-default-rtdb.firebaseio.com",
  storageBucket: 'gs://fnbrmena-1.appspot.com'
});

//define the distube on client
client.disTube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new YtDlpPlugin()
  ],
})

// DisTube event listeners, more in the documentation page
client.disTube
    .on('playSong', async (queue, song) => {

        //play the requested song
        const musicPlaying = new Discord.EmbedBuilder()
        musicPlaying.setColor(FNBRMENA.Colors("embed"))
        musicPlaying.setTitle(`Playing \`${song.name}\``)
        musicPlaying.setDescription(`Duration: \`${song.formattedDuration}\` Queue Duration: ${queue.duration}`)
        musicPlaying.setImage(song.thumbnail)
        musicPlaying.setAuthor({name: "Played By " + song.user.username})
        queue.textChannel.send({embeds: [musicPlaying], components: [
          new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
             .setStyle(Discord.ButtonStyle.Link)
             .setLabel("Music Link")
             .setURL(song.url)
          )
        ]})
    })
    .on('addSong', (queue, song) => {

        //add song to the queue
        const addSong = new Discord.EmbedBuilder()
        addSong.setColor(FNBRMENA.Colors("embed"))
        addSong.setTitle(`\`${song.name}\``)
        addSong.setDescription(`Duration: \`${song.formattedDuration}\``)
        addSong.setImage(song.thumbnail)
        addSong.setAuthor({name: "Added By " + song.user.username})
        queue.textChannel.send({embeds: [addSong], components: [
          new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
             .setStyle(Discord.ButtonStyle.Link)
             .setLabel("Music Link")
             .setURL(song.url)
          )
        ]})

    })
    .on('error', async (err) => {
      console.log(err)
    })

//client event listner
client.on('ready', async () => {
  console.log('FNBRMENA Bot is online!')

  //get the prefix from database
  const prefix = await FNBRMENA.Admin(admin, "", "", "Prefix")

  //list of status
  const status = [
    `FNBRMENA | ${prefix}Commands to start`,
    `FNBRMENA | Read Rules First`,
    `FNBRMENA | Twitter: FNBRMENA`,
    `FNBRMENA | Tiktok: FNBRMENA`,
  ]

  //status index
  var index = 0

  //set interval to change the status
  setInterval(async () => {
    client.user.setPresence({ 
      activities: [
        {name: status[index],
        type: 'PLAYING'}
      ],
      status: 'online'
  
      })

      //change the index status
      if(index < (status.length - 1)){
        index++
      }else{
        index = 0
      }
  }, 30000)

  const baseFile = 'CommandBase.js'
  const commandBase = require(`./commands/${baseFile}`)
  const Array = []
  const commandsData = []

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
        commandsData.push(option)
        commandBase(option)
      }
    }
  }

  // Initializing emojis
  const emojisObject = {
    countEmoji: client.emojis.cache.get("932316012001525760"),
    endEmoji: client.emojis.cache.get("920024867603120168"),
    errorEmoji: client.emojis.cache.get("836454225344856066"),
    checkEmoji: client.emojis.cache.get("836454263260971018"),
    loadingEmoji: client.emojis.cache.get("862704096312819722"),
    greenStatus: client.emojis.cache.get("855805718363111434"),
    redStatus: client.emojis.cache.get("855805718779002899"),
    vbucks: client.emojis.cache.get("1009803488009658498"),
    marvel: client.emojis.cache.get("1009803470322274385"),
    dc: client.emojis.cache.get("1009803515075506216"),
    starwars: client.emojis.cache.get("1009803479608463400"),
    dark: client.emojis.cache.get("1009803512688955525"),
    icon: client.emojis.cache.get("1009803463984685106"),
    shadow: client.emojis.cache.get("1009803474965377104"),
    slurp: client.emojis.cache.get("1009803476856999977"),
    frozen: client.emojis.cache.get("1009803547153530890"),
    lava: client.emojis.cache.get("1009803465809215660"),
    gaming: client.emojis.cache.get("1009803549200359516"),
    legendary: client.emojis.cache.get("1009803468300636230"),
    epic: client.emojis.cache.get("1009803517185241108"),
    rare: client.emojis.cache.get("1009803472499134474"),
    uncommon: client.emojis.cache.get("1009803505852227596"),
    common: client.emojis.cache.get("1009803510449188937"),
    outfit: client.emojis.cache.get("1009803716448231445"),
    backpack: client.emojis.cache.get("1009803705845022750"),
    emote: client.emojis.cache.get("1009803708185444393"),
    loadingscreen: client.emojis.cache.get("1009803712291676160"),
    music: client.emojis.cache.get("1009803714338504796"),
    pickaxe: client.emojis.cache.get("1009803695657062531"),
    contrail: client.emojis.cache.get("1009803718729932930"),
    glider: client.emojis.cache.get("1009803710278414387"),
    wrap: client.emojis.cache.get("1009803703332655125"),
    emoji: client.emojis.cache.get("1009803693912232047"),
    pet: client.emojis.cache.get("1009803691655708752"),
    spray: client.emojis.cache.get("1009803697485791262"),
    toy: client.emojis.cache.get("1009803699394203788"),
    banner: client.emojis.cache.get("1009803508398182523"),
    event: client.emojis.cache.get("1009806747915014194"),
    variants: client.emojis.cache.get("1009807068825407519"),
    fncs: client.emojis.cache.get("1009803544897003610"),
    exclusive: client.emojis.cache.get("1009803531135504436"),
    reactive: client.emojis.cache.get("1009807070868021248"),
    traversal: client.emojis.cache.get("1009807067273498684"),
    animated: client.emojis.cache.get("1009807063481864212"),
    synced: client.emojis.cache.get("1009807065482547220"),
    birthday: client.emojis.cache.get("1009803504153546842"),
    umbrella: client.emojis.cache.get("1009803494586318898"),
    battlepassTiers: client.emojis.cache.get("879859225059287040"),
    battlepassStars: client.emojis.cache.get("879823941428973598"),
    epicgames: client.emojis.cache.get("1009817355058163774"),
    playstation: client.emojis.cache.get("1009817358321324077"),
    xbox: client.emojis.cache.get("1009817366827376680"),
  }

  //excute
  readCommands('commands')
  commandBase.listen(client, admin, emojisObject)
  Events(client, admin, commandsData, emojisObject)
  
})

client.login(FNBRMENA.APIKeys("DiscordBotToken"));