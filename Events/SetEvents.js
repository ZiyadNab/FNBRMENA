const FortniteAPI = require("fortniteapi.io-api");
const Discord = require('discord.js')
const moment = require('moment')
const key = require('../Coinfigs/config.json')
const fortniteAPI = new FortniteAPI(key.apis.fortniteio);
const Canvas = require('canvas');

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Set)
    //result
    var data = []
    var lang = "en"
    var number = 0
    var sets = ''
    var counter = 0

    const Set = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("set").once('value', async function (data) {
            var status = data.val().Active;
            if(status === "true"){
                fortniteAPI.listSets(options = {lang: lang})
                .then(async res => {
                    if(number === 0){
                        data = res.sets
                        number++
                    }
                    if(JSON.stringify(res.sets) !== JSON.stringify(data)){
                        for(let i = 0; i < res.sets.length; i++){
                            if(JSON.stringify(data[i]) !== JSON.stringify(res.sets[i])){
                                counter++
                                sets += '\n• '+counter+': '+res.sets[i].name
                            }
                        }
                        if(lang === "en"){
                            sets += '\n\n• '+counter+' Sets in total'
                        }else if(lang === "ar"){
                            sets += '\n\n• المجموع '+counter+' مجموعة'
                        }
                        const setInfo = new Discord.MessageEmbed()
                        setInfo.setColor('#BB00EE')
                        if(lang === "en"){
                            setInfo.setTitle("All new sets in this update")
                        }else if(lang === "ar"){
                            setInfo.setTitle("جميع المجموعات الجديدة في التحديث الحالي")
                        }
                        setInfo.setDescription(sets)
                        message.send(setInfo)
                        data = res.sets
                    }
                })
            }
        })
    }
    setInterval(Set, 1 * 60000)
}