const Discord = require('discord.js')
const key = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Set)

    //result
    var response = []
    var names = []
    var number = 0

    //handle sets
    const Set = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("set").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push.Push
            const index = data.val().Push.Index

            //if the event is set to be true [ON]
            if(status){

                //request data
                FNBRMENA.listSets(options = {lang: lang})
                .then(async res => {

                    if(number === 0){

                        //store data
                        response = await res.data.sets

                        for(let i = 0; i < res.data.sets.length; i++){
                            names[i] = await res.data.sets[i].name
                        }

                        //add sets names
                        number++

                    }

                    //push
                    if(push) for(let i = 0; i < index; i++){
                        names[i] = ''
                        response[i] = ''
                    }

                    //check data
                    if(JSON.stringify(res.data.sets) !== JSON.stringify(response)){

                        //inisilizing sets variavle
                        var counter = 0
                        if(lang === "en") var sets = "New sets just got added\n"
                        else if(lang === "ar") var sets = "تم اضافة مجموعات جديدة\n"

                        //loop throw every set
                        for(let i = 0; i < res.data.sets.length; i++){

                            //check where is the new set
                            if(!names.includes(res.data.sets[i].name)) sets += `\n• ${counter++}: ${res.data.sets[i].name}`
                            
                        }

                        //add title
                        if(lang === "en") sets += `\n\n• ${counter} Set(s) in total`
                        else if(lang === "ar") sets += `\n\n• المجموع ${counter} مجموعة`

                        //create embed
                        const newSetsEmbed = new Discord.EmbedBuilder()
                        newSetsEmbed.setColor(FNBRMENA.Colors("embed"))
                        newSetsEmbed.setDescription(sets)

                        //send message
                        message.send({embeds: [newSetsEmbed]})

                        //store data
                        response = await res.data.sets
                        for(let i = 0; i < res.data.sets.length; i++){
                            names[i] = await res.data.sets[i].name
                        }

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("set").child("Push").update({
                            Push: false
                        })
                    }
                    
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'sets')
        
                })
            }
        })
    }
    setInterval(Set, 1 * 30000)
}