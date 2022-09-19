const Discord = require('discord.js')
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
                                        {name: "Status", value: detailed.data.data.user.dropCampaign.status, inline: true},
                                        {name: "Required Minutes Watched", value: detailed.data.data.user.dropCampaign.timeBasedDrops[0].requiredMinutesWatched, inline: true},
                                        {name: "Starts At", value: moment(detailed.data.data.user.dropCampaign.startAt).format("dddd, MMMM Do of YYYY"), inline: true},
                                        {name: "Ends At", value: moment(detailed.data.data.user.dropCampaign.endAt).format("dddd, MMMM Do of YYYY"), inline: true},
                                        {name: "Type", value: res.data.items[num].type.name, inline: true},
                                        {name: "Rarity", value: res.data.items[num].rarity.name, inline: true},
                                        {name: "Price", value: `${res.data.items[num].price}`, inline: true},
                                        {name: "Introduction", value: introduction, inline: true},
                                        {name: "Set", value: set, inline: true},
                                        {name: "Reactive ?", value: reactive, inline: true},
                                        {name: "Copy Righted Music ?", value: copyrighted, inline: true},
                                        {name: "Occurrences", value: `${occurrences}`, inline: true},
                                        {name: "Added", value: `${Now.diff(res.data.items[num].added.date, 'days')} days at ${moment(res.data.items[num].added.date).format("ddd, hA")}`, inline: true},
                                        {name: "First Seen", value: First, inline: true},
                                        {name: "Last Seen", value: Last, inline: true},
                                    )

                                    // Set drop image
                                    //twitchDropsEmbed.setImage(detailed.data.data.user.dropCampaign.timeBasedDrops[0].benefitEdges[0].benefit.imageAssetURL)

                                    // Set footer
                                    twitchDropsEmbed.setFooter({text: `${detailed.data.data.user.dropCampaign.game.name}, ${detailed.data.data.user.dropCampaign.owner.name}`})

                                    // Send the message
                                    if(role.Status) await message.send({content: `${detailed.data.data.user.dropCampaign.timeBasedDrops[0].benefitEdges[0].benefit.imageAssetURL} <@&${role.roleID}>`, embeds: [twitchDropsEmbed], components: [row]})
                                    else await message.send({embeds: [twitchDropsEmbed], components: [row]})
                                    
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
    setInterval(TwitchDrops, 1 * 20000)
}
