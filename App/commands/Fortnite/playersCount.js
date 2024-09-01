const moment = require('moment')
const axios = require('axios')
const qs = require('qs')

module.exports = {
    commands: 'players',
    type: 'Fortnite',
    descriptionEN: 'Return a simplified stats about active players.',
    descriptionAR: 'إرجاع إحصائيات مبسطة عن اللاعبين النشطين.',
    expectedArgsEN: 'To use the command you need to specify a weapon name.',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Request data
        FNBRMENA.Discovery()
        .then(async res => {

            // Generating animation
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Expanding data, please wait ${emojisObject.loadingEmoji}.`)
            else if(userData.lang === "ar") generating.setTitle(`جاري توسيع البيانات ، يرجى الانتظار ${emojisObject.loadingEmoji}.`)
            const msg = await message.reply({embeds: [generating], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            })
            
            try {

                // Get the most playlist has players
                var sortedPlaylists = []
                res.data.discovery.map(e => {
                    
                    e.result.map(x => {
                        sortedPlaylists.push({
                            id: x.linkCode,
                            name: null,
                            players: x.playersCount
                        })
                    })
                })

                sortedPlaylists.sort((a, b) => {
                    return b.players - a.players
                })

                // Request token
                const token = await axios.get('https://fnbrmena.com/api/auth/get/ios')

                // Request playlists data
                    const playlists = await axios.post('https://links-public-service-live.ol.epicgames.com/links/api/fn/mnemonic/', [
                        { "mnemonic": sortedPlaylists[0].id, "type": "", "filter": false },
                        { "mnemonic": sortedPlaylists[1].id, "type": "", "filter": false },
                        { "mnemonic": sortedPlaylists[2].id, "type": "", "filter": false }
                    ],
                    {
                        headers: {
                            'Authorization': `${token.data.data.token_type} ${token.data.data.access_token}`,
                            'User-Agent': 'Fortnite/++Fortnite+Release-24.20-CL-25019967 Windows/10.0.22622.1.256.64bit'
                        }
                    }
                )

                // Set data
                if(playlists.data[0].metadata.alt_title) sortedPlaylists[0].name = userData.lang === "ar" ? playlists.data[0].metadata.alt_title.ar : playlists.data[0].metadata.title
                else {
                    await axios.get(`https://fortnite-api.com/v1/playlists/${sortedPlaylists[0].id}?language=${userData.lang}`)
                    .then(e => {
                        sortedPlaylists[0].name = e.data.data.name
                    }).catch(e => {
                        sortedPlaylists[0].name = 'NO NAME'
                    })
                    
                }
                if(playlists.data[1].metadata.alt_title) sortedPlaylists[1].name = userData.lang === "ar" ? playlists.data[1].metadata.alt_title.ar : playlists.data[1].metadata.title
                else{
                    await axios.get(`https://fortnite-api.com/v1/playlists/${sortedPlaylists[1].id}?language=${userData.lang}`)
                    .then(e => {
                        sortedPlaylists[1].name = e.data.data.name
                    }).catch(e => {
                        sortedPlaylists[1].name = 'NO NAME'
                    })
                }
                if(playlists.data[2].metadata.alt_title) sortedPlaylists[2].name = userData.lang === "ar" ? playlists.data[2].metadata.alt_title.ar : playlists.data[2].metadata.title
                else{
                    await axios.get(`https://fortnite-api.com/v1/playlists/${sortedPlaylists[2].id}?language=${userData.lang}`)
                    .then(e => {
                        sortedPlaylists[2].name = e.data.data.name
                    }).catch(e => {
                        sortedPlaylists[2].name = 'NO NAME'
                    })
                }

                // Create an embed
                const playersCount = new Discord.EmbedBuilder()
                playersCount.setColor(FNBRMENA.Colors("embed"))
                playersCount.setThumbnail(`https://i.ibb.co/R27LjY9/oFULqaR.png`)
                if(userData.lang === "en"){
                    playersCount.setTitle(`FORTNITE ACTIVE PLAYERS ${emojisObject.info}`)
                    playersCount.setDescription(`Fortnite has \`${res.data.totalPlayers}\` currently active players at the moment, this result has been taken <t:${moment().unix()}:R>.`)
                    playersCount.addFields(
                        {
                            name: sortedPlaylists[0].name,
                            value: `${sortedPlaylists[0].players} Players.`
                        },
                        {
                            name: sortedPlaylists[1].name,
                            value: `${sortedPlaylists[1].players} Players.`
                        },
                        {
                            name: sortedPlaylists[2].name,
                            value: `${sortedPlaylists[2].players} Players.`
                        }
                    )
                }else if(userData.lang === "ar"){
                    playersCount.setTitle(`اللاعبون النشطون في Fortnite ${emojisObject.info}.`)
                    playersCount.setDescription(`لدى Fortnite حاليا \`${res.data.totalPlayers}\` لاعبًا نشطًا في الوقت الحالي , تم أخذ هذه النتيجة <t:${moment().unix()}:R>.`)
                    playersCount.addFields(
                        {
                            name: sortedPlaylists[0].name,
                            value: `${sortedPlaylists[0].players} لاعب.`
                        },
                        {
                            name: sortedPlaylists[1].name,
                            value: `${sortedPlaylists[1].players} لاعب.`
                        },
                        {
                            name: sortedPlaylists[2].name,
                            value: `${sortedPlaylists[2].players} لاعب.`
                        }
                    )
                }
                msg.edit({embeds: [playersCount], components: [], files: []})

            } catch (err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }

        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}    