const axios = require('axios')
const Canvas = require('canvas');
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')
const fort = require("fortnite-api-com");
const credintials = {
    apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
    language: "en",
    debug: true
};

var Fortnite = new fort(credintials);

module.exports = (client, admin) => {
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
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === true){
                
                //request data
                Fortnite.AES()
                .then(async res => {

                    //store the first time data
                    if(number === 0){

                        //storing pak files...
                        for(let i = 0; i < res.data.dynamicKeys.length; i++){
                            pakFilename[i] = await res.data.dynamicKeys[i].pakFilename
                        }

                        //store aes
                        aes = await res.data.build
                        number++
                    }

                    //push new data
                    if(push === true){
                        response = []
                    }

                    //storing pak files...
                    for(let i = 0; i < res.data.dynamicKeys.length; i++){
                        response[i] = await res.data.dynamicKeys[i].pakFilename
                    }

                    //when a new update released
                    if(res.data.build !== aes){

                        //create embed
                        const aesMessage = new Discord.MessageEmbed()

                        //add color
                        aesMessage.setColor('#00ffff')

                        //set title
                        if(lang === "en") aesMessage.setTitle("New Update Has Been Found!")
                        else if(lang === "ar") aesMessage.setTitle("توفر تحديث جديد!")
                        
                        //set description
                        aesMessage.setDescription(res.data.build)

                        //send
                        message.send(aesMessage)

                        //store aes build number
                        aes = await res.data.build
                    }

                    if(JSON.stringify(pakFilename) !== JSON.stringify(response)){
                        
                        //get the new pak
                        for(let i = 0; i < response.length; i++){

                            //trying to find the new file
                            if(!pakFilename.includes(response[i])){

                                const newPak = await res.data.dynamicKeys.filter(found => {
                                    return found.pakFilename === response[i]
                                })
                                
                                //check if file is not .ucas
                                if(!newPak[0].pakFilename.includes("WindowsClient.ucas")){

                                    //chech if the file not optional
                                    if(newPak[0].pakFilename.substring(12, 20) !== "optional"){

                                        //get the pak number
                                        var pakNumber = await newPak[0].pakFilename.substring(8, newPak[0].pakFilename.indexOf("-"))
                                        
                                        //create embed
                                        const pak = new Discord.MessageEmbed()

                                        //add color
                                        pak.setColor('#00ffff')

                                        //set title
                                        if(lang === "en") pak.setTitle("New pak file has been unlocked " + pakNumber)
                                        else if(lang === "ar") pak.setTitle("تم فك التشفير عن ملف " + pakNumber)
                                        
                                        //set description
                                        pak.setDescription("PAK File: " + newPak[0].pakFilename + "\nPAK Guid: " + res.data.dynamicKeys[i].pakGuid + "\nKey: " + res.data.dynamicKeys[i].key)

                                        //send
                                        message.send(pak)

                                    }
                                }
                            }
                        }
                        
                        //storing pak files...
                        for(let i = 0; i < res.data.dynamicKeys.length; i++){
                            pakFilename[i] = await res.data.dynamicKeys[i].pakFilename
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("pak").update({
                            Push: false
                        })
                    }
                }).catch(err => {
                    console.log("The issue is in Pak Events ", err)
                })
            }
        })
    }
    setInterval(PAK, 1 * 60000)
}