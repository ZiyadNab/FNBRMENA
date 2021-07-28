const Discord = require('discord.js')
const key = require('../Coinfigs/config.json');
const axios = require("axios");

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Section)

    //result
    var response = []
    var names = []
    var number = 0

    const Sections = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("newsections").once('value', async function (data) {

            //store the data
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === true){

                //request data
                axios.get(`https://fortniteapi.io/v2/shop/sections/list?lang=${lang}`, { headers: {'Content-Type': 'application/json','Authorization': "d4ce1562-839ff66b-3946ccb6-438eb9cf",} })
                .then(async res => {

                    if(number === 0){

                        //store data
                        for(let i = 0; i < res.data.sections.length; i++){
                            names[i] = await res.data.sections[i].sectionId
                        }

                        //add sets names
                        number++

                    }

                    //store data to response
                    for(let i = 0; i < res.data.sections.length; i++){
                        response[i] = await res.data.sections[i].sectionId
                    }

                    if(push === true){
                        names[0] = ""
                        names[1] = ""
                        names[2] = ""
                    }

                    //check data
                    if(JSON.stringify(names) !== JSON.stringify(response)){

                        //inisilizing variavle
                        var section = ""
                        var counter = 0
                        var added = 0
                        var removed = 0

                        //loop throw every NEW section
                        for(let i = 0; i < response.length; i++){

                            //check where is the new set
                            if(!names.includes(response[i])){
                                counter++
                                added++
                                section += '\n• ' + counter + ': ' + response[i]
                            }
                        }

                        //loop throw every OLD section
                        for(let i = 0; i < names.length; i++){

                            //check where is the new set
                            if(!response.includes(names[i])){
                                counter++
                                removed++
                                section += '\n• ' + counter + ': ' + names[i]
                            }
                        }

                        //add title
                        if(counter <= 1){
                            if(lang === "en") section += `\n\n• ${counter} New section in total`
                            else if(lang === "ar") section += `\n\n• بمجموع ${counter} قسم جديد!`
                        }else{
                            if(lang === "en") section += `\n\n• ${counter} New sections in total`
                            else if(lang === "ar") section += `\n\n• بمجموع ${counter} أقسام جديدة!`
                        }

                        //create embed
                        const sectionsInfo = new Discord.MessageEmbed()

                        //add color
                        sectionsInfo.setColor('#00ffff')

                        //set title
                        if(added >= 1){
                            if(lang === "en") sectionsInfo.setTitle("All new sections that got added to the API")
                            else if(lang === "ar") sectionsInfo.setTitle("جميع الأقسام الجديدة التي تمت اضافتها في الـ API")
                        }else if(removed >= 1){
                            if(lang === "en") sectionsInfo.setTitle("All new sections that got removed to the API")
                            else if(lang === "ar") sectionsInfo.setTitle("جميع الأقسام المحذوفة التي تمت حذفها في الـ API")
                        }

                        //set description
                        sectionsInfo.setDescription(section)

                        //send message
                        message.send(sectionsInfo)

                        //store data
                        for(let i = 0; i < res.data.sections.length; i++){
                            names[i] = await res.data.sections[i].sectionId
                        }
                    }
                    
                }).catch(err => {
                    console.log("The issue is in New Sections Events ", err)
                })
            }
        })
    }
    setInterval(Sections, 1 * 10000)
}