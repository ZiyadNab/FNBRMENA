const Discord = require('discord.js')
const Canvas = require('canvas')
const config = require('../Configs/config.json')
const axios = require('axios')
const moment = require('moment')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Section)

    // Results
    var response = []
    var lastModified = []

    // Handle the blogs
    const DynamicBackgrounds = async () => {
        const data = (await admin.database().ref("ERA's").child("Events").child("section").once('value')).val();
        
        if (data.Active) {
            try {
                const res = await axios({ method: 'GET', url: `https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game/mp-item-shop?lang=${data.Lang}` });
                if (response.length === 0) {
                    lastModified = res.data.lastModified;
                    for (const section of res.data.shopData.sections) response.push(section)
                }
    
                if (data.Push.Status) {
                    lastModified = '';
                    const pushIndex = response.findIndex(section => section.sectionID === data.Push.id);
                    if (pushIndex !== -1) response.splice(pushIndex, 1);
                }
    
                if (res.data.lastModified !== lastModified) {
                    for (const section of res.data.shopData.sections) {
                        if (!JSON.stringify(response).includes(JSON.stringify(section))){

                            // Set supported playlists
                            const contextMap = {
                                "battleRoyale": "Battle Royale",
                                "juno": "Lego",
                                "delMar": "Rocket Racing",
                                "sparks": "Festival"
                            }

                            const addedEmbed = new Discord.EmbedBuilder()
                            addedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                            addedEmbed.setTimestamp(parseFloat(moment().format("x")))
                            addedEmbed.addFields(
                                {
                                    name: 'Section ID', value: section.sectionID, inline: true
                                },
                                {
                                    name: 'Display Name', value: section.displayName, inline: true
                                },
                                {
                                    name: 'Priority Rank [1-100]', value: `${section.metadata.stackRanks[0].stackRankValue}`, inline: true
                                },
                                {
                                    name: 'Start Date', value: moment(section.metadata.stackRanks[0].startDate).format("dddd, Do MMMM YYYY")
                                },
                                {
                                    name: 'Supports', value: Object.keys(contextMap).map(key => {
                                        const found = section.metadata.stackRanks.find(item => item.context === key);
                                        return `${found ? emojisObject.uncommon : emojisObject.MarvelSeries} ${contextMap[key]}`;
                                    }).join('\n')
                                }
                            )

                            // Check if the section has a custom texture background
                            if(section.metadata.background.customTexture !== undefined){

                                // Registering fonts
                                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "italic"})

                                // Create a canvas
                                const backgroundIMG = await Canvas.loadImage(section.metadata.background.customTexture)
                                const canvas = Canvas.createCanvas(2560, 1440);
                                const ctx = canvas.getContext('2d')

                                // Draw the image
                                ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                // Add credits
                                if(data.Credits){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '50px Burbank Big Condensed';
                                    ctx.fillText("FNBRMENA", 15, 55);
                                }

                                // Add attachments
                                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${section.sectionID}.png`})
                                if(data.Role.Status) await message.send({content: `<@&${data.Role.roleID}>`, embeds: [addedEmbed], files: [att]})
                                else await message.send({embeds: [addedEmbed], files: [att]})

                            }else{
                                if(data.Role.Status) await message.send({content: `<@&${data.Role.roleID}>`, embeds: [addedEmbed]})
                                else await message.send({embeds: [addedEmbed]})

                            }
                        }
                    }

                    for (const section of response) {
                        if (!JSON.stringify(res.data.shopData.sections).includes(JSON.stringify(section))){

                            // Set supported playlists
                            const contextMap = {
                                "battleRoyale": "Battle Royale",
                                "juno": "Lego",
                                "delMar": "Rocket Racing",
                                "sparks": "Festival"
                            }

                            const removedEmbed = new Discord.EmbedBuilder()
                            removedEmbed.setColor(FNBRMENA.Colors("embedError"))
                            removedEmbed.setTimestamp(parseFloat(moment().format("x")))
                            removedEmbed.addFields(
                                {
                                    name: 'Section ID', value: section.sectionID, inline: true
                                },
                                {
                                    name: 'Display Name', value: section.displayName, inline: true
                                },
                                {
                                    name: 'Priority Rank [1-100]', value: `${section.metadata.stackRanks[0].stackRankValue}`, inline: true
                                },
                                {
                                    name: 'Start Date', value: moment(section.metadata.stackRanks[0].startDate).format("dddd, Do MMMM YYYY")
                                },
                                {
                                    name: 'Supports', value: Object.keys(contextMap).map(key => {
                                        const found = section.metadata.stackRanks.find(item => item.context === key);
                                        return `${found ? emojisObject.uncommon : emojisObject.MarvelSeries} ${contextMap[key]}`;
                                    }).join('\n')
                                }
                            )

                            // Check if the section has a custom texture background
                            if(section.metadata.background.customTexture !== undefined){

                                // Registering fonts
                                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700"});
                                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "italic"})

                                // Create a canvas
                                const backgroundIMG = await Canvas.loadImage(section.metadata.background.customTexture)
                                const canvas = Canvas.createCanvas(2560, 1440);
                                const ctx = canvas.getContext('2d')

                                // Draw the image
                                ctx.drawImage(backgroundIMG, 0, 0, canvas.width, canvas.height)

                                // Add credits
                                if(data.Credits){
                                    ctx.fillStyle = '#ffffff';
                                    ctx.textAlign='left';
                                    ctx.font = '50px Burbank Big Condensed';
                                    ctx.fillText("FNBRMENA", 15, 55);
                                }

                                // Add attachments
                                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${section.sectionID}.png`})
                                if(data.Role.Status) await message.send({content: `<@&${data.Role.roleID}>`, embeds: [removedEmbed], files: [att]})
                                else await message.send({embeds: [removedEmbed], files: [att]})

                            }else{
                                if(data.Role.Status) await message.send({content: `<@&${data.Role.roleID}>`, embeds: [removedEmbed]})
                                else await message.send({embeds: [removedEmbed]})

                            }
                        }
                    }

                    lastModified = res.data.lastModified;
                    response = res.data.shopData.sections;
    
                    await admin.database().ref("ERA's").child("Events").child("section").child("Push").update({
                        Status: false
                    });
                }
            } catch (err) {
                console.log(err)
                FNBRMENA.eventsLogs(admin, client, err, 'sections');
            }
        }
    };
    
    setInterval(DynamicBackgrounds, 1 * 20000)
}