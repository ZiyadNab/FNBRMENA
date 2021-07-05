const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'reminders',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //seeting up the db firestore
        var db = admin.firestore()

        //get the collection from the database
        const snapshot = await db.collection("Reminders").get()

        //data
        var string = ""
        var counter = 0
        var names = []

        //inisilizing type string
        if(lang === "en"){
            var type = "Getting all of the reminders under your account"
        }else if(lang === "ar"){
            var type = "جاري جلب جميع التنبيهات لحسابك"
        }

        const generating = new Discord.MessageEmbed()
        generating.setColor('#BB00EE')
        const emoji = client.emojis.cache.get("805690920157970442")
        generating.setTitle(`${type} ${emoji}`)
        message.channel.send(generating)
        .then( async msg => {
        
            //get every single collection
            for(let i = 0; i < snapshot.size; i++){
                var docRef = await db.collection("Reminders").doc(`${i}`)
                await docRef.get()
                .then(async doc => {
                    if (await doc.exists) {
                        if(await doc.data().id === message.author.id){

                            //get the item name
                            await fortniteAPI.getItemDetails(itemId = doc.data().mainId, options = {lang: lang})
                            .then( async res => {

                                //long client has been waiting for
                                moment.locale(lang)
                                var Now = moment()
                                var long = moment(doc.data().date)
                                const day = Now.diff(long, 'days')
                                
                                //add every reminder to the array
                                if(lang === "en") string += "• " + counter + ": " + await res.item.name + " | Days Waiting: " + day + "\n"
                                else if(lang === "ar") string += "• " + counter + ": " + await res.item.name + " | الايام المنتظرة: " + day + "\n"
                                names[counter] = await res.item.name
                                counter++

                            })
                        }
                    }
                })
            }

            //if the user has no reminders
            if(names.length !== 0){

                //creeate embed
                const Reminders = new Discord.MessageEmbed()

                //add the color
                Reminders.setColor('#BB00EE')

                //add title
                if(lang === "en"){
                    Reminders.setTitle("Please choose an item to remove")
                }else if(lang === "ar"){
                    Reminders.setTitle("الرجاء اختيار عنصر ليتم حذفه")
                }

                //add description
                Reminders.setDescription(string)

                //send the message
                message.channel.send(Reminders)

            }else{
                //create embed
                const err = new Discord.MessageEmbed()

                //add the color
                err.setColor('#BB00EE')

                //add the title
                if(lang === "en"){
                    err.setTitle(`You dont have any reminders ${errorEmoji}`)
                }else if(lang === "ar"){
                    err.setTitle(`ليس لديك اي عنصر للتذكير ${errorEmoji}`)
                }

                await message.channel.send(err)
                msg.edit(err)
            }
        })
    }
}