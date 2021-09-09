const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI("d4ce1562-839ff66b-3946ccb6-438eb9cf");

module.exports = {
    commands: 'wids',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")
                
        fortniteAPI.lisloot(options = {lang: "en"})
        .then(async res => {
            const WIDs = await res.weapons.filter(function(value) {
                return value.name.includes(text)
            })
            if(WIDs.length !== 0){
                //string
                const WIDs_Info = new Discord.MessageEmbed()
                WIDs_Info.setColor(FNBRMENA.Colors("embed"))
                for(let i = 0; i < WIDs.length; i++){
                    WIDs_Info.addFields(
                        {name: WIDs[i].name, value: WIDs[i].id + " ["+WIDs[i].rarity+"]"}
                    )
                }
                WIDs_Info.setTitle("WIDs for " + text + " " + checkEmoji)
                message.channel.send(WIDs_Info)
            }else{
                if(lang === "en"){
                    const err = new Discord.MessageEmbed()
                    err.setColor(FNBRMENA.Colors("embed"))
                    err.setTitle(`There is no weapon with that name ${errorEmoji}`)
                    message.channel.send(err)
                }else if(lang === "ar"){
                    const err = new Discord.MessageEmbed()
                    err.setColor(FNBRMENA.Colors("embed"))
                    err.setTitle(`لا يوجد سلاح بهذا الاسم ${errorEmoji}`)
                    message.channel.send(err)
                }
            }
        })
    },
    requiredRoles: []
}