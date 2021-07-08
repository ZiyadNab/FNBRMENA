const FortniteAPI = require("fortniteapi.io-api");
const Discord = require('discord.js')
const key = require('../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Set)

    //result
    var response = []
    var names = []
    var number = 0
    var sets = ''
    var counter = 1

    const Set = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("set").once('value', async function (data) {

            //store the data
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === "true"){

                //request data
                fortniteAPI.listSets(options = {lang: lang})
                .then(async res => {

                    if(number === 0){

                        //store data
                        response = await res.sets

                        for(let i = 0; i < res.sets.length; i++){
                            names[i] = await res.sets[i].name
                        }

                        //add sets names
                        number++
                    }

                    //check data
                    if(JSON.stringify(res.sets) !== JSON.stringify(response)){

                        //loop throw every set
                        for(let i = 0; i < res.sets.length; i++){

                            //check where is the new set
                            if(!names.includes(res.sets[i].name)){
                                sets += '\n• ' + counter + ': '+ res.sets[i].name
                                counter++
                            }
                        }

                        //add title
                        if(lang === "en"){
                            sets += '\n\n• ' + counter + ' Sets in total'
                        }else if(lang === "ar"){
                            sets += '\n\n• المجموع '+counter+' مجموعة'
                        }

                        //create embed
                        const setInfo = new Discord.MessageEmbed()

                        //add color
                        setInfo.setColor('#00ffff')

                        //set title
                        if(lang === "en"){
                            setInfo.setTitle("All new sets in this update")
                        }else if(lang === "ar"){
                            setInfo.setTitle("جميع المجموعات الجديدة في التحديث الحالي")
                        }

                        //set description
                        setInfo.setDescription(sets)

                        //send message
                        message.send(setInfo)
                        response = await res.sets
                        for(let i = 0; i < res.sets.length; i++){
                            names[i] = await res.sets[i].name
                        }
                    }
                }).catch(err => {
                    console.log("The issue is in Set Events ", err)
                })
            }
        })
    }
    setInterval(Set, 2 * 60000)
}