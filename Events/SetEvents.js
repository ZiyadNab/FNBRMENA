const FortniteAPI = require("fortniteapi.io-api");
const Discord = require('discord.js')
const key = require('../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);

module.exports = (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Set)

    //result
    var response = []
    var names = []
    var number = 0

    //handle sets
    const Set = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("set").once('value', async function (data) {
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status){

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

                        //inisilizing sets variavle
                        var counter = 0
                        if(lang === "en") var sets = "New sets just got added\n"
                        else if(lang === "ar") var sets = "تم اضافة مجموعات جديدة\n"

                        //loop throw every set
                        for(let i = 0; i < res.sets.length; i++){

                            //check where is the new set
                            if(!names.includes(res.sets[i].name)){
                                counter++
                                sets += '\n• ' + counter + ': '+ res.sets[i].name
                            }
                        }

                        //add title
                        if(lang === "en") sets += `\n\n• ${counter} Set(s) in total`
                        else if(lang === "ar") sets += `\n\n• المجموع ${counter} مجموعة`

                        //create embed
                        const setInfo = new Discord.MessageEmbed()

                        //add color
                        setInfo.setColor(FNBRMENA.Colors("embed"))

                        //set description
                        setInfo.setDescription(sets)

                        //send message
                        message.send(setInfo)

                        //store data
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
    setInterval(Set, 2 * 10000)
}