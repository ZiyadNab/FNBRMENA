const FortniteAPI = require("fortnite-api-com");
const Canvas = require('canvas');
const key = require('../../Coinfigs/config.json')
const config = {
  apikey: key.apis.fortniteapi,
  language: "en",
  debug: true
};
var Fortnite = new FortniteAPI(config);
var query
var platform
var Solo
var Duo
var Trio
var Squad
var All



module.exports = {
    commands: 'stat',
    expectedArgs: '<Stat>',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, arguments, text, Discord, client) => {

        query = {
            name: arguments,
            accountType:"epic",
            timeWindow: "lifetime"
        };

        Fortnite.BRStats(query)
            .then( async res =>{
                console.log(res)
                
            if(!res.error){

            const p = new Discord.MessageEmbed()
            .setColor('#BB00EE')
            .setTitle('Choose a method')
            .addFields(
                {name: 'All', value: 'React to Number :one:'},
                {name: 'KB/M', value: 'React to Number :two:'},
                {name: 'Controller', value: 'React to Number :three:'},
                {name: 'Mobile', value: 'React to Number :four:'},
            )
            const msgReact = await message.channel.send(p)
            await msgReact.react('1️⃣')
            await msgReact.react('2️⃣')
            await msgReact.react('3️⃣')
            await msgReact.react('4️⃣')
            const filter = (reaction, user) => {
            return ['1️⃣', '2️⃣', '3️⃣', '4️⃣'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then( async collected => {
                const reaction = collected.first();
                    if(reaction.emoji.name === '1️⃣'){
                        platform = "All"
                        All = res.data.stats.all.overall
                        Solo = res.data.stats.all.solo
                        Duo = res.data.stats.all.duo
                        Trio = res.data.stats.all.trio
                        Squad = res.data.stats.all.squad
                    }
                    if(reaction.emoji.name === '2️⃣'){
                        platform = "KB/M"
                        All = res.data.stats.keyboardMouse.overall
                        Solo = res.data.stats.keyboardMouse.solo
                        Duo = res.data.stats.keyboardMouse.duo
                        Trio = res.data.stats.keyboardMouse.trio
                        Squad = res.data.stats.keyboardMouse.squad
                    }
                    if(reaction.emoji.name === '3️⃣'){
                        platform = "CONT Playaa"
                        All = res.data.stats.gamepad.overall
                        Solo = res.data.stats.gamepad.solo
                        Duo = res.data.stats.gamepad.duo
                        Trio = res.data.stats.gamepad.trio
                        Squad = res.data.stats.gamepad.squad
                    }
                    if(reaction.emoji.name === '4️⃣'){
                        platform = "MOBILE"
                        All = res.data.stats.touch.overall
                        Solo = res.data.stats.touch.solo
                        Duo = res.data.stats.touch.duo
                        Trio = res.data.stats.touch.trio
                        Squad = res.data.stats.touch.squad
                    }
                }).catch(err => {
                    msgReact.delete()
                    const error = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(":regional_indicator_x: Sorry we canceled your process becuase no language has been selected")
                    message.reply(error)
                })
                msgReact.delete()

            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`Getting Player Stats info ... ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

                    const canvas = Canvas.createCanvas(3500, 2200);
                    const ctx = canvas.getContext('2d');
                                                
                    // creating the background
                    const background = await Canvas.loadImage('./assets/Stats/stats.png')
                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                    //name
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 180px Burbank Big Condensed'
                    ctx.fillText("Player Name: " + res.data.account.name, 100, 230)

                    //|
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 210px Burbank Big Condensed'
                    ctx.fillText("|", (((res.data.account.name.length + 13) *78)), 230)

                    //lvl
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 180px Burbank Big Condensed'
                    ctx.fillText("lvl: " + res.data.battlePass.level, (((res.data.account.name.length + 13) *80) + 30), 230)

                    //platform
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='right';
                    ctx.font = 'normal 200px Burbank Big Condensed'
                    ctx.fillText(platform, 3400, 230)

                    //all

                    //matches
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 120px Burbank Big Condensed'
                    ctx.fillText(All.matches, 740, 900)

                    //wins
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 120px Burbank Big Condensed'
                    ctx.fillText(All.wins, 580, 1100)

                    //kd
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 120px Burbank Big Condensed'
                    ctx.fillText(All.kd +"%", 520, 1310)

                    //kills
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 120px Burbank Big Condensed'
                    ctx.fillText(All.kills, 555, 1525)

                    //deaths
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 120px Burbank Big Condensed'
                    ctx.fillText(All.deaths, 665, 1730)

                    //deaths
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = 'normal 120px Burbank Big Condensed'
                    ctx.fillText(All.winRate + "%", 680, 1915)

                    if(Solo !== null){
                        //solo

                        //wins
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Solo.wins, 1550, 690)

                        //matches
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Solo.matches, 1930, 690)

                        //kills
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Solo.kills, 2330, 690)

                        //kd
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Solo.kd +"%", 2725, 690)

                        //deaths
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Solo.deaths, 3100, 690)
                    }

                    if(Duo !== null){
                        //duo

                        //wins
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Duo.wins, 1550, 1120)

                        //matches
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Duo.matches, 1930, 1120)

                        //kills
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Duo.kills, 2330, 1120)

                        //kd
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Duo.kd +"%", 2725, 1120)

                        //deaths
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Duo.deaths, 3100, 1120)
                    }

                    if(Trio !== null){
                        //trio

                        //wins
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Trio.wins, 1550, 1560)

                        //matches
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Trio.matches, 1930, 1560)

                        //kills
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Trio.kills, 2330, 1560)

                        //kd
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Trio.kd +"%", 2725, 1560)

                        //deaths
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Trio.deaths, 3100, 1560)
                    }

                    if(Squad !== null){
                        //squad

                        //wins
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Squad.wins, 1550, 2010)

                        //matches
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Squad.matches, 1930, 2010)

                        //kills
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Squad.kills, 2330, 2010)

                        //kd
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Squad.kd +"%", 2725, 2010)

                        //deaths
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign='center';
                        ctx.font = 'normal 100px Burbank Big Condensed'
                        ctx.fillText(Squad.deaths, 3100, 2010)
                    }

                    //sending
                    const att = new Discord.MessageAttachment(canvas.toBuffer(), res.username + ".png")
                    await message.channel.send(att)
                    msg.delete()
                })
            }else{
                const error = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle('make sure that you have entered an EPICGAMES username')
                message.channel.send(error)
            }
            }).catch(err => {
                console.log(err)
            })
    },
    
    requiredRoles: []
}