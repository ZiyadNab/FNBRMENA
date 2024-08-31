const serviceAccount = require('./Firebase/ServiceAccount.json')
const Events = require('./Events/Events.js')
const admin = require('firebase-admin')
const Discord = require('discord.js')
const client = new Discord.Client({ intents: [Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.DirectMessageReactions,
  Discord.GatewayIntentBits.DirectMessageTyping, Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildBans, Discord.GatewayIntentBits.GuildEmojisAndStickers,
  Discord.GatewayIntentBits.GuildEmojisAndStickers, Discord.GatewayIntentBits.GuildIntegrations, Discord.GatewayIntentBits.GuildInvites, Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.GuildMessageTyping, Discord.GatewayIntentBits.GuildPresences,
  Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.GuildWebhooks, Discord.GatewayIntentBits.MessageContent], partials: [Discord.Partials.Channel], allowedMentions:{ parse:["everyone"] }})
const Data = require('./FNBRMENA.js')
const path = require('path')
const FNBRMENA = new Data()
const fs = require('fs')
const { Player } = require('discord-player');

// Get access to the database
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fnbrmena-1-default-rtdb.firebaseio.com",
  storageBucket: 'gs://fnbrmena-1.appspot.com'
});

client.player = new Player(client, {
  smoothVolume: true,
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
})

client.player
  .on("trackStart", (queue, track) => {

    // Emitted a new song
    const musicPlaying = new Discord.EmbedBuilder()
    musicPlaying.setColor(FNBRMENA.Colors("embed"))
    musicPlaying.setTitle(`Now Playing \`${track.title}\``)
    musicPlaying.setDescription(`Duration: \`${track.duration}\` Queue: \`${queue.tracks.length}\``)
    musicPlaying.setThumbnail(track.thumbnail)
    musicPlaying.setAuthor({name: `Played By ${track.requestedBy.username}`, iconURL: `https://cdn.discordapp.com/avatars/${track.requestedBy.id}/${track.requestedBy.avatar}.jpeg`})
    queue.metadata.channel.send({embeds: [musicPlaying], components: [
      new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
         .setStyle(Discord.ButtonStyle.Link)
         .setLabel("Music Link")
         .setURL(track.url)
      )
    ]})
  })

// Client event listner
client.on('ready', async () => {
  console.log('FNBRMENA Bot is online!')

  // Get the prefix from database
  const serverStats = await FNBRMENA.Admin(admin, "", "", "Server")

  // List of status
  const statusOptions = [
    {
      type: Discord.ActivityType.Watching,
      text: `FNBRMENA | Read Rules First`,
      status: 'online'
    },
    {
      type: Discord.ActivityType.Listening,
      text: `FNBRMENA | ${serverStats.Prefix}Commands to start`,
      status: 'online'
    },
    {
      type: Discord.ActivityType.Playing,
      text: `FNBRMENA | Twitter: FNBRMENA`,
      status: 'online'
    },
    {
      type: Discord.ActivityType.Playing,
      text: `FNBRMENA | Tiktok: FNBRMENA`,
      status: 'online'
    },
  ]

  // Status index
  var index = 0

  // Set interval to change the status
  setInterval(async () => {
    
    // setPresence
    client.user.setPresence({
      activities: [
        {
          name: statusOptions[index].text,
          type: statusOptions[index].type,
        }
      ],
      status: statusOptions[index].status,
    })

    // Change the index status
    if(index < (statusOptions.length - 1)) index++
    else index = 0
      
  }, 30000)

  const baseFile = 'CommandBase.js'
  const commandBase = require(`./commands/${baseFile}`)
  const Array = []
  const commandsData = []

  // Read all commands
  const readCommands = (dir) => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readCommands(path.join(dir, file))
      } else if (file !== baseFile && !dir.includes('SlashCommands')) {
        const option = require(path.join(__dirname, dir, file))
        Array.push(option.commands)
        commandsData.push(option)
        commandBase(option)
      }
    }
  }

  client.commands = new Discord.Collection()

  const commandsPath = path.join(__dirname, 'commands/SlashCommands')
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

  for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file)
      const command = require(filePath)
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command)
      } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`)
      }
  }

  // Initializing emojis
  const emojisObject = {
    alert: client.emojis.cache.get("1051192598552924200"),
    info: client.emojis.cache.get("1050021928171216946"),
    style: client.emojis.cache.get("1050021926191509544"),
    grant: client.emojis.cache.get("1050021923934973983"),
    up: client.emojis.cache.get("1034950916396298341"),
    down: client.emojis.cache.get("1034950950688923668"),
    overall: client.emojis.cache.get("1032987970300559391"),
    keyboard: client.emojis.cache.get("1032984199663198228"),
    controller: client.emojis.cache.get("1032987555232235541"),
    touchpad: client.emojis.cache.get("1032987178516631622"),
    countEmoji: client.emojis.cache.get("932316012001525760"),
    endEmoji: client.emojis.cache.get("920024867603120168"),
    errorEmoji: client.emojis.cache.get("836454225344856066"),
    checkEmoji: client.emojis.cache.get("836454263260971018"),
    loadingEmoji: client.emojis.cache.get("862704096312819722"),
    greenStatus: client.emojis.cache.get("855805718363111434"),
    redStatus: client.emojis.cache.get("855805718779002899"),
    vbucks: client.emojis.cache.get("1006523175712080033"),
    MarvelSeries: client.emojis.cache.get("1006534539197288479"),
    DCUSeries: client.emojis.cache.get("1009803515075506216"),
    ColumbusSeries: client.emojis.cache.get("1006534548277956760"),
    CUBESeries: client.emojis.cache.get("1009803512688955525"),
    CreatorCollabSeries: client.emojis.cache.get("1006534565793382531"),
    ShadowSeries: client.emojis.cache.get("1009803474965377104"),
    SlurpSeries: client.emojis.cache.get("1009803476856999977"),
    FrozenSeries: client.emojis.cache.get("1009803547153530890"),
    LavaSeries: client.emojis.cache.get("1009803465809215660"),
    PlatformSeries: client.emojis.cache.get("1009803549200359516"),
    mythic: client.emojis.cache.get("1009803549200359516"),
    exotic: client.emojis.cache.get("1009803549200359516"),
    transcendent: client.emojis.cache.get("1009803549200359516"),
    legendary: client.emojis.cache.get("1006534570004447342"),
    epic: client.emojis.cache.get("1006534558717587527"),
    rare: client.emojis.cache.get("1006534541734842428"),
    uncommon: client.emojis.cache.get("1006534550345748601"),
    common: client.emojis.cache.get("1006534552451289099"),
    Legendary: client.emojis.cache.get("1006534570004447342"),
    Epic: client.emojis.cache.get("1006534558717587527"),
    Rare: client.emojis.cache.get("1006534541734842428"),
    Uncommon: client.emojis.cache.get("1006534550345748601"),
    Common: client.emojis.cache.get("1006534552451289099"),
    outfit: client.emojis.cache.get("1009803716448231445"),
    bundle: client.emojis.cache.get("1033039994413121638"),
    backpack: client.emojis.cache.get("1009803705845022750"),
    emote: client.emojis.cache.get("1009803708185444393"),
    loadingscreen: client.emojis.cache.get("1009803712291676160"),
    music: client.emojis.cache.get("1009803714338504796"),
    pickaxe: client.emojis.cache.get("999122783625805854"),
    contrail: client.emojis.cache.get("1009803718729932930"),
    glider: client.emojis.cache.get("1009803710278414387"),
    wrap: client.emojis.cache.get("1009803703332655125"),
    emoji: client.emojis.cache.get("1009803693912232047"),
    pet: client.emojis.cache.get("1009803691655708752"),
    spray: client.emojis.cache.get("1009803697485791262"),
    toy: client.emojis.cache.get("1009803699394203788"),
    banner: client.emojis.cache.get("1009803508398182523"),
    bannertoken: client.emojis.cache.get("1009803508398182523"),
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
    epicgames: client.emojis.cache.get("1112198989576679464"),
    playstation: client.emojis.cache.get("1112198991925481594"),
    xbox: client.emojis.cache.get("1112198996992208956"),
    build: client.emojis.cache.get("1113505134996095026"),
    nobuild: client.emojis.cache.get("1113505138951344208"),
  }

  // Excute
  readCommands('commands')
  commandBase.listen(client, admin, emojisObject)
  Events(client, admin, commandsData, emojisObject)
  
})

client.login(FNBRMENA.APIKeys("DiscordBotToken"));