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
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

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

        const generating = new Discord.MessageEmbed()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en") generating.setTitle(`Getting all of the reminders under your account ${loadingEmoji}`)
        if(lang === "ar") generating.setTitle(`جاري جلب جميع التنبيهات لحسابك ${loadingEmoji}`)
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
                Reminders.setColor(FNBRMENA.Colors("embed"))

                //add title
                if(lang === "en"){
                    Reminders.setTitle("All the reminders for your account")
                }else if(lang === "ar"){
                    Reminders.setTitle("جميع التذكيرات لحسابك")
                }

                //add description
                Reminders.setDescription(string)

                //send the message
                await message.channel.send(Reminders)
                msg.delete()

            }else{
                //create embed
                const err = new Discord.MessageEmbed()

                //add the color
                err.setColor(FNBRMENA.Colors("embed"))

                //add the title
                if(lang === "en"){
                    err.setTitle(`You dont have any reminders ${errorEmoji}`)
                }else if(lang === "ar"){
                    err.setTitle(`ليس لديك اي عنصر للتذكير ${errorEmoji}`)
                }

                msg.edit(err)
            }
        })
    }
}