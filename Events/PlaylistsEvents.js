const FortniteAPI = require("fortniteapi.io-api");
const Discord = require('discord.js')
const moment = require('moment')
const key = require('../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const config = require('../Coinfigs/config.json');
const { default: axios } = require("axios");

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Playlists)

    //result
    var response = []
    var names = []
    var number = 0

    const Playlists = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("playlists").once('value', async function (data) {
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === "true"){
                
                //get the current game modes
                axios.get('https://fortniteapi.io/v1/game/modes?enabled=true&lang=' + lang , { headers: {'Content-Type': 'application/json','Authorization': "d4ce1562-839ff66b-3946ccb6-438eb9cf",} })
                .then(async res => {

                    if(number === 0){

                        //store data
                        for(let i = 0; i < res.data.modes.length; i++){
                            response[i] = await res.data.modes[i]
                            names[i] = await res.data.modes[i].name
                        }

                        number++
                    }

                    //push modes
                    if(push === "ture"){
                        response = []
                    }

                    //if the data was not the same
                    if(JSON.stringify(res.data.modes) !== JSON.stringify(response)){

                        //date
                        moment.locale(lang)
                        if(lang === "en"){
                            var date = moment().format("dddd, MMMM Do of YYYY")
                        }else if(lang === "ar"){
                            var date = moment().format("dddd, MMMM Do من YYYY")
                        }

                        //loop throw every active playlists
                        for(let i = 0; i < res.data.modes.length; i++){

                            //if the playlist isn't in the response array
                            if(!names.includes(res.data.modes[i].name)){

                                //create embed
                                const ActivePlaylist = new Discord.MessageEmbed()

                                //set the embed color
                                ActivePlaylist.setColor('#BB00EE')

                                if(lang === "en"){

                                    //add title and fields [EN]
                                    ActivePlaylist.setTitle("A new active playlist " + res.data.modes[i].name)
                                    ActivePlaylist.addFields(
                                        {name: "Max Team Size:", value: res.data.modes[i].maxTeamSize},
                                        {name: "Date:", value: date},
                                    )
                                }else if(lang === "ar"){

                                    //add title and fields [AR]
                                    ActivePlaylist.setTitle("تم تفعيل طور جديد " + res.data.modes[i].name)
                                    ActivePlaylist.addFields(
                                        {name: "عدد التيم:", value: res.data.modes[i].maxTeamSize},
                                        {name: "التاريخ:", value: date},
                                    )
                                }

                                //description
                                ActivePlaylist.setDescription(res.data.modes[i].description)

                                //add emage and credits stuff
                                if(res.data.modes[i].image.includes("https://")){
                                    ActivePlaylist.setImage(res.data.modes[i].image)
                                }else{
                                    ActivePlaylist.setImage("https://i.imgur.com/RBFGS9F.jpeg")
                                }
                                ActivePlaylist.setFooter('Generated By FNBRMENA Bot')
                                ActivePlaylist.setAuthor('FNBRMENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBRMENA')

                                //send the embed
                                await message.send(ActivePlaylist)
                            }
                        }

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("playlists").update({
                            Push: "false"
                        })

                        //restore data
                        for(let i = 0; i < res.data.modes.length; i++){
                            response[i] = await res.data.modes[i]
                            names[i] = await res.data.modes[i].name
                        }

                    }
                }).catch(err => {
                    console.log("The issue is in Playlists Events ", err)
                })
            }
        })
    }
    setInterval(Playlists, 2 * 60000)
}