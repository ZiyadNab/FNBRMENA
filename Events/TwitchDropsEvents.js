const Discord = require('discord.js')
const Canvas = require('canvas')
const moment = require('moment')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Twitch)

    // Result
    var response = []
    var ids = []
    var number = 0

    // Handle the blogs
    const TwitchDrops = async () => {

        // Checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("twitchdrops").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const role = data.val().Role

            // If the event is set to be true [ON]
            if(status){

                // Request data
                await FNBRMENA.TwitchCampaign()
                .then(async res => {

                    // Storing the first start up
                    if(number === 0){

                        // Storing
                        for(let i = 0; i < res.data.data.currentUser.dropCampaigns.length; i++){
                            ids[i] = await res.data.data.currentUser.dropCampaigns[i].id
                        }

                        // Stop from storing again
                        number++
                    }

                    // If push is enabled
                    if(push.Status){
                        if(push.pushType.toLowerCase() === "all") ids = []
                        else{

                            ids.splice(ids.findIndex(dropId => {
                                return dropId === push.dropID
                            }), 1)
                        }
                    }

                    // Storing the new blog to compare
                    for(let i = 0; i < res.data.data.currentUser.dropCampaigns.length; i++){
                        response[i] = await res.data.data.currentUser.dropCampaigns[i].id
                    }

                    // Check if there is a new drop
                    if(JSON.stringify(response) !== JSON.stringify(ids)){

                        // New drop has been registerd lets find it
                        for(let i = 0; i < response.length; i++){
                            
                            // Compare if its the index i includes or not
                            if(!ids.includes(response[i])){

                                // Request detailed data
                                FNBRMENA.TwitchDropsDetailed(response[i])
                                .then(async detailed => {

                                    // Canvas variables
                                    var width = 0
                                    var height = 160
                                    var newline = 0
                                    var x = 0
                                    var y = 0

                                    // Canvas length
                                    var length = detailed.data.data.user.dropCampaign.timeBasedDrops.length

                                    if(length <= 2) length = length
                                    else if(length > 2 && length <= 4) length = length / 2
                                    else if(length > 4 && length <= 8) length = length / 3
                                    else if(length > 7 && length <= 50) length = length / 5
                                    else if(length > 50 && length < 70) length = length / 7
                                    else length = length / 10

                                    // Forcing to be int
                                    if(length % 2 !== 0){
                                        length += 1;
                                        length = length | 0;
                                    }
                                    
                                    // Creating width
                                    width += (length * 160) + (length * 2) - 2

                                    // Creating height
                                    for(let i = 0; i < detailed.data.data.user.dropCampaign.timeBasedDrops.length; i++){
                                        
                                        if(newline === length){
                                            height += 160 + 2
                                            newline = 0
                                        }
                                        
                                    }

                                    //registering fonts
                                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                                    //creating canvas
                                    const canvas = Canvas.createCanvas(width, height);
                                    const ctx = canvas.getContext('2d');

                                    //background
                                    const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                                    ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                                    // Loop though ever drop
                                    for(let x = 0; x < detailed.data.data.user.dropCampaign.timeBasedDrops.length; x++){
                                        newline++

                                        // Load the reward image
                                        const skin = await Canvas.loadImage(detailed.data.data.user.dropCampaign.timeBasedDrops[x].benefitEdges[0].benefit.imageAssetURL);
                                        ctx.drawImage(skin, x, y, 160, 160)

                                        // Change x, y variables
                                        x = x + 2 + 160; 
                                        if (length === newline){
                                            y = y + 2 + 160;
                                            x = 0;
                                            newline = 0;
                                        }
                                    }
                                    
                                    // Create embed
                                    const twitchDropsEmbed = new Discord.EmbedBuilder()
                                    twitchDropsEmbed.setColor(FNBRMENA.Colors("embed"))

                                    // Set author, title and image
                                    twitchDropsEmbed.setAuthor({ name: detailed.data.data.user.dropCampaign.name, iconURL: detailed.data.data.user.dropCampaign.timeBasedDrops[0].benefitEdges[0].benefit.imageAssetURL})
                                    twitchDropsEmbed.setTitle(detailed.data.data.user.dropCampaign.timeBasedDrops[0].name)
                                    twitchDropsEmbed.setThumbnail(res.data.data.currentUser.dropCampaigns[i].game.boxArtURL)

                                    // Add description
                                    if(detailed.data.data.user.dropCampaign.description) twitchDropsEmbed.setDescription(detailed.data.data.user.dropCampaign.description)
                                    else{

                                        // No description is available
                                        if(lang === "en") twitchDropsEmbed.setDescription(`No description.`)
                                        else if(lang === "ar") twitchDropsEmbed.setDescription(`لا يوجد وصف.`)
                                    }

                                    // Moment locale language
                                    moment.locale(lang)

                                    // Creating a button row
                                    const row = new Discord.ActionRowBuilder()

                                    // Create buttons for en
                                    if(lang === "en"){
                                        row.addComponents( // Link your account link
                                            new Discord.ButtonBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("LINK YOUR ACCOUNT")
                                            .setURL(detailed.data.data.user.dropCampaign.accountLinkURL)
                                        )
                                        row.addComponents( // More details button
                                            new Discord.ButtonBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("DROP DETAILS")
                                            .setURL(detailed.data.data.user.dropCampaign.detailsURL)
                                        )
                                    }

                                    // Create buttons for ar
                                    else if(lang === "ar"){
                                        row.addComponents( // Link your account link
                                            new Discord.ButtonBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("اربط حسابك")
                                            .setURL(detailed.data.data.user.dropCampaign.accountLinkURL)
                                        )
                                        row.addComponents( // More details button
                                            new Discord.ButtonBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("معلومات اضافية")
                                            .setURL(detailed.data.data.user.dropCampaign.detailsURL)
                                        )
                                    }

                                    // Add fields
                                    twitchDropsEmbed.addFields(
                                        {name: "Status", value: `\`${detailed.data.data.user.dropCampaign.status}\``},
                                        {name: "Required Minutes Watched", value: `\`${detailed.data.data.user.dropCampaign.timeBasedDrops[0].requiredMinutesWatched}\``},
                                        {name: "Starts At", value: `\`${moment(detailed.data.data.user.dropCampaign.timeBasedDrops[0].benefitEdges[0].startAt).format("dddd, MMMM Do of YYYY")}\``},
                                        {name: "Ends At", value: `\`${moment(detailed.data.data.user.dropCampaign.timeBasedDrops[0].benefitEdges[0].endAt).format("dddd, MMMM Do of YYYY")}\``},
                                    )

                                    // Set footer
                                    twitchDropsEmbed.setFooter({text: `${detailed.data.data.user.dropCampaign.game.name}, ${detailed.data.data.user.dropCampaign.owner.name}`})

                                    // Send the message
                                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${response[i]}.png`})
                                    if(role.Status) await message.send({content: `${detailed.data.data.user.dropCampaign.timeBasedDrops[0].benefitEdges[0].benefit.imageAssetURL} <@&${role.roleID}>`, embeds: [twitchDropsEmbed], components: [row], files: [att]})
                                    else await message.send({embeds: [twitchDropsEmbed], components: [row], files: [att]})
                                })
                            }
                        }

                        // Storing
                        for(let i = 0; i < res.data.data.currentUser.dropCampaigns.length; i++){
                            ids[i] = await res.data.data.currentUser.dropCampaigns[i].id
                        }

                        // Trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("twitchdrops").child("Push").update({
                            Status: false
                        })

                    }
                
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'twitchdrops')
        
                })
            }
        })
    }
    setInterval(TwitchDrops, 1 * 30000)
}
