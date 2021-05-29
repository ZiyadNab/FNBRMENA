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
    var response = []
    var aesData = []
    var pakNumberData = []
    var pakGuildData = []
    var Counter = 0
    var pakNumber
    var pakFile
    var pakGuild
    var lang = "ar"
    var number = 0

    const PAK = async () => {
        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("pak").once('value', async function (data) {
            var status = data.val().Active;
            if(status === "true"){
                Fortnite.AES()
                .then(async res => {
                    if(number === 0){
                        response = res.data.dynamicKeys
                        aesData = res.data.build
                        number++
                    }
                    if(res.data.build !== aesData){
                        const aes = new Discord.MessageEmbed()
                        aes.setColor('#BB00EE')
                        aes.setTitle("New Update Has Been Found!")
                        aes.setDescription(res.data.build)
                        message.send(aes)
                        aesData = res.data.build
                    }
                    if(JSON.stringify(res.data.dynamicKeys) !== JSON.stringify(response)){
                        Counter = 0
                        for(let i = 0; i < res.data.dynamicKeys.length; i++){
                            pakFile = res.data.dynamicKeys[i].pakFilename
                            if(pakFile.endsWith("pak")){
                                if(pakFile.substring(12, 20) !== "optional"){
                                    pakNumber = pakFile.substring(8,12)
                                    pakGuild = res.data.dynamicKeys[i].pakGuid
                                    if(pakNumberData.includes(pakNumber)){
                                        if(!pakGuildData.includes(pakGuild)){
                                            //run a command
                                            message.send(pakNumber)
                                            pakGuildData[Counter] = pakGuild
                                        }
                                            
                                    }else{
                                        //run a command
                                        message.send(pakNumber)
                                        pakGuildData[Counter] = pakGuild
                                        pakNumberData[Counter] = pakNumber
                                    }
                                    Counter++
                                }
                            }
                        }
                        response = res.data.dynamicKeys
                    }
                })
            }
        })
    }
    setInterval(PAK, 1 * 60000)
}