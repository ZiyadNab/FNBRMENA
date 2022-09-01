const axios = require('axios')
const Discord = require('discord.js')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Notice)

    //result
    var response = []
    var number = 0

    //handling notice events
    const Notice = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("notice").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push
            const role = data.val().Role

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    //constant to make work easy
                    const emergencynotice = await res.data.emergencynoticev2.emergencynotices.emergencynotices

                    //store the data if the bot got restarted
                    if(number === 0) {
                        response = await emergencynotice
                        number++
                    }

                    //if the client wants to pust data
                    if(push) response = []

                    //checking for deff
                    if (JSON.stringify(emergencynotice) !== JSON.stringify(response) && emergencynotice.length !== 0) {
                        
                        //loop throw every notice
                        for (let i = 0; i < emergencynotice.length; i++){

                            //if the notice not stored in response
                            if(!JSON.stringify(response).includes(JSON.stringify(emergencynotice[i]))){

                                //inisilizing embed
                                const Notice = new Discord.EmbedBuilder()
                                Notice.setColor(FNBRMENA.Colors("embed"))
                                Notice.setTitle(emergencynotice[i].title)
                                Notice.setDescription(emergencynotice[i].body)

                                //add platforms
                                if(emergencynotice[i].platforms !== undefined){
                                    var string = ``
                                    for(let j = 0; j < emergencynotice[i].platforms.length; j++){

                                        //add strings
                                        string += `\`${emergencynotice[i].platforms[j]}\` `
                                    }

                                    //add platform feild
                                    if(lang === "en"){
                                        Notice.addFields({
                                            name: "Platforms",
                                            value: string
                                        })
                                    }else if(lang === "ar"){
                                        Notice.addFields({
                                            name: "المنصات",
                                            value: string
                                        })
                                    }
                                }

                                //playlists
                                if(emergencynotice[i].playlists !== undefined){
                                    var playlists = ``
                                    for(let j = 0; j < emergencynotice[i].playlists.length; j++){

                                        //get data
                                        const playlist = await axios.get(`https://fortnite-api.com/v1/playlists/${emergencynotice[i].playlists[j]}?lang=${lang}`)
                                        
                                        //add the playlist name
                                        if(playlist.data.data.subName === null) playlists += `${playlist.data.data.name} `
                                        else playlists += `\`${playlist.data.data.name}-${playlist.data.data.subName}\` `
                                    }

                                    if(lang === "en"){
                                        Notice.addFields({
                                            name: "Playlists",
                                            value: playlists,
                                        })
                                    }else if(lang === "ar"){
                                        Notice.addFields({
                                            name: "الاطوار",
                                            value: playlists,
                                        })
                                    }
                                }

                                //add gamemodes
                                if(emergencynotice[i].gamemodes !== undefined){
                                    var gamemodes = ``
                                    for(let j = 0; j < emergencynotice[i].gamemodes.length; j++){

                                        //add gamemodes
                                        gamemodes += `\`${emergencynotice[i].gamemodes[j]}\` `

                                    }

                                    if(lang === "en"){
                                        Notice.addFields({
                                            name: "Game Modes",
                                            value: gamemodes,
                                        })
                                    }else if(lang === "ar"){
                                        Notice.addFields({
                                            name: "طور اللعب",
                                            value: gamemodes,
                                        })
                                    }
                                }

                                //send
                                if(role.Status) await message.send({content: `<@&${role.roleID}>`, embeds: [Notice]})
                                else await message.send({embeds: [Notice]})
                            }
                        }

                        //store data
                        response = await emergencynotice

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("notice").update({
                            Push: false
                        })
                    }
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'notice')
        
                })
            }
        })
    }
    setInterval(Notice, 1 * 20000)
}