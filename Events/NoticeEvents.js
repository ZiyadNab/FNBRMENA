const axios = require('axios')
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Notice)

    //result
    var response = []
    var number = 0

    const Section = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("notice").once('value', async function (data) {
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === true){

                //request data
                axios.get('https://fn-api.com/api/emergencyNotices?lang=' + lang)
                .then(async res => {

                    //store the data if the bot got restarted
                    if (number === 0) {
                        for(let i = 0; i < res.data.data.length; i++){
                            response[i] = await res.data.data[i]
                        }
                        number++
                    }

                    //if the client wants to pust data
                    if(push === true){
                        response = []
                    }

                    //checking for deff
                    if (JSON.stringify(res.data.data) !== JSON.stringify(response) && res.data.data.length !== 0) {

                        //create embed
                        const Notice = new Discord.MessageEmbed()

                        //add the color
                        Notice.setColor('#00ffff')
                        
                        for (let i = 0; i < res.data.data.length; i++) {

                            //if the notice not stored in response
                            if(!response.includes(res.data.data[i])){

                                //add title
                                Notice.setTitle(res.data.data[i].title)

                                //add description
                                Notice.setDescription(res.data.data[i].body)

                                //add platforms
                                if(res.data.data[i].platforms !== undefined){
                                    var string = ""
                                    for(let j = 0; j < res.data.data[i].platforms.length; j++){

                                        //add strings
                                        string += "` " + res.data.data[i].platforms[j] + " ` "
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
                                if(res.data.data[i].playlists !== undefined){
                                    var playlists = ""
                                    for(let j = 0; j < res.data.data[i].playlists.length; j++){

                                        //get data
                                        const playlist = await axios.get(`https://fortnite-api.com/v1/playlists/${res.data.data[i].playlists[j]}?lang=${lang}`)
                                        
                                        //add the playlist name
                                        if(playlist.data.data.subName === null){
                                            playlists += "` " + playlist.data.data.name + " ` "
                                        }else{
                                            playlists += "` " + playlist.data.data.name + " - " + playlist.data.data.subName + " ` "
                                        }
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
                                if(res.data.data[i].gamemodes !== undefined){
                                    var gamemodes = ""
                                    for(let j = 0; j < res.data.data[i].gamemodes.length; j++){

                                        //add gamemodes
                                        gamemodes += "` " + res.data.data[i].gamemodes[j] + " ` "

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
                            }
                        }

                        //send
                        message.send(Notice);

                        //store data
                        for(let i = 0; i < res.data.data.length; i++){
                            response[i] = await res.data.data[i]
                        }

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("notice").update({
                            Push: false
                        })
                    }
                }).catch(err => {
                    console.log("The issue is in Notice Events ", err)
                })
            }
        })
    }
    setInterval(Section, 1 * 30000)
}