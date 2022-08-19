const config = require('../Configs/config.json')
const Discord = require('discord.js')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.PAK)

    //result
    var pakFilename = []
    var response = []
    var aes = ""
    var number = 0

    const PAK = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("pak").once('value', async function (data) {

            //soring database data
            const status = data.val().Active;
            const lang = data.val().Lang;
            const push = data.val().Push

            //if the event is set to be true [ON]
            if(status){
                
                //request data
                FNBRMENA.AES()
                .then(async res => {

                    //store the first time data
                    if(number === 0){

                        //storing pak files...
                        for(let i = 0; i < res.data.data.dynamicKeys.length; i++){
                            pakFilename[i] = await res.data.data.dynamicKeys[i].pakFilename
                        }

                        //store aes
                        aes = await res.data.data.build
                        number++
                    }

                    //push new data
                    if(push){
                        pakFilename = []
                    }

                    //storing pak files...
                    for(let i = 0; i < res.data.data.dynamicKeys.length; i++){
                        response[i] = await res.data.data.dynamicKeys[i].pakFilename
                    }

                    //when a new update released
                    if(res.data.data.build !== aes){

                        //create embed
                        const aesMessage = new Discord.EmbedBuilder()
                        aesMessage.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") aesMessage.setTitle("New Update Has Been Found!")
                        else if(lang === "ar") aesMessage.setTitle("توفر تحديث جديد!")
                        aesMessage.setDescription(res.data.data.build)
                        message.send({embeds: [aesMessage]})

                        //store aes build number
                        aes = await res.data.data.build
                    }

                    if(JSON.stringify(pakFilename) !== JSON.stringify(response)){
                        
                        //get the new pak
                        for(let i = 0; i < response.length; i++){

                            //trying to find the new file
                            if(!pakFilename.includes(response[i])){

                                const newPak = await res.data.data.dynamicKeys.filter(found => {
                                    return found.pakFilename === response[i]
                                })
                                
                                //check if file is not .ucas
                                if(!newPak[0].pakFilename.includes("WindowsClient.ucas")){

                                    //chech if the file not optional
                                    if(newPak[0].pakFilename.substring(12, 20) !== "optional"){

                                        //get the pak number
                                        var pakNumber = await newPak[0].pakFilename.substring(8, newPak[0].pakFilename.indexOf("-"))
                                        
                                        //create embed
                                        const pak = new Discord.EmbedBuilder()

                                        //add color
                                        pak.setColor('#00ffff')

                                        //set title
                                        if(lang === "en") pak.setTitle("New pak file has been unlocked " + pakNumber)
                                        else if(lang === "ar") pak.setTitle("تم فك التشفير عن ملف " + pakNumber)
                                        
                                        //set description
                                        pak.setDescription("PAK File: " + newPak[0].pakFilename + "\nPAK Guid: " + res.data.data.dynamicKeys[i].pakGuid + "\nKey: " + res.data.data.dynamicKeys[i].key)

                                        //send
                                        message.send({embeds: [pak]})

                                    }
                                }
                            }
                        }
                        
                        //storing pak files...
                        for(let i = 0; i < res.data.data.dynamicKeys.length; i++){
                            pakFilename[i] = await res.data.data.dynamicKeys[i].pakFilename
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("pak").update({
                            Push: false
                        })
                    }
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'pak')
        
                })
            }
        })
    }
    setInterval(PAK, 1 * 60000)
}