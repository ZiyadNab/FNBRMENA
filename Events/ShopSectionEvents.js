const Discord = require('discord.js')
const moment = require('moment')
const key = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Section)

    // Results
    var tag = false
    const Sections = async () => {

        // Getting the sets data
        admin.database().ref("ERA's").child("Events").child("section").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const role = data.val().Role

            // Checking if the event is active
            if(status){

                // Request shop sections
                FNBRMENA.shopSections(lang)
                .then(async res => {

                    // If push is enabled
                    if(push){

                        // Trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("section").update({
                            Push: false
                        })

                        // Apply push request
                        tag = true
                    }

                    // If tag is set to true and there is a next section
                    if(tag && res.data.list.some(e => (e.isNext && moment().isBefore(e.nextRotation)))){

                        // Set the new sections
                        var current = `\`\`\`ansi\n[2;36m[2;31m`
                        var next = `\`\`\`ansi\n[2;36m[2;31m[2;34m`
                        var summary = `\`\`\`ansi\n[2;36m`

                        for(const i of res.data.list[1].sections){
                            next += `• ${i.sectionDisplayName} | ${i.tabs} ${lang === "en" ? "Tab(s)" : "صفحة"}\n`
                            if(!res.data.list[0].sections.some(e => e.sectionDisplayName === i.sectionDisplayName && e.tabs === i.tabs)) summary += `• ${i.sectionDisplayName} | ${i.tabs} ${lang === "en" ? "Tab(s)" : "صفحة"}\n`
                        }

                        summary += `[2;31m`
                        for(const i of res.data.list[0].sections){
                            current += `• ${i.sectionDisplayName} | ${i.tabs} ${lang === "en" ? "Tab(s)" : "صفحة"}\n`

                            if(!res.data.list[1].sections.some(e => e.sectionDisplayName === i.sectionDisplayName && e.tabs === i.tabs)) summary += `• ${i.sectionDisplayName} | ${i.tabs} ${lang === "en" ? "Tab(s)" : "صفحة"}\n`
                        }

                        summary += `[2;37m`
                        for(const i of res.data.list[0].sections)
                            if(res.data.list[1].sections.some(e => e.sectionDisplayName === i.sectionDisplayName && e.tabs === i.tabs)) summary += `• ${i.sectionDisplayName} | ${i.tabs} ${lang === "en" ? "Tab(s)" : "صفحة"}\n`
                        
                        // Close fields
                        current += `\`\`\``
                        next += `\`\`\``
                        summary += `\`\`\``

                        // Create an embed
                        const shopSectionsEmbed = new Discord.EmbedBuilder()
                        shopSectionsEmbed.setColor(FNBRMENA.Colors("embed"))
                        shopSectionsEmbed.setTimestamp(new Date(res.data.list[1].nextRotation))
                        shopSectionsEmbed.setFields(
                            {
                                name: lang === "en" ? "New" : "جديد",
                                value: next,
                                inline: true
                            },
                            {
                                name: lang === "en" ? "Old" : "قديم",
                                value: current,
                                inline: true
                            },
                            {
                                name: lang === "en" ? "Summary" : "ملخص",
                                value: summary,
                                inline: false
                            },
                        )

                        // Update tag to false so in does not get inside again unless pushed
                        tag = false

                        // Send the message
                        if(role.Status) await message.send({content: `<@&${role.roleID}>`, embeds: [shopSectionsEmbed]})
                        else await message.send({embeds: [shopSectionsEmbed]})
                        

                    } else if(!res.data.list.some(e => e.isNext)) tag = true // Set tag to true only if sections has gone public 
                    
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'shopsections')
        
                })
            }
        })
    }
    setInterval(Sections, 1 * 30000)
}