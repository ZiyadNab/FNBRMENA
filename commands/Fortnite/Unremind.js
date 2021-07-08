const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'unremind',
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
        var ids = []
        var names = []
        var num = 0

        //inisilizing type string
        if(lang === "en"){
            var type = "Getting all of the reminders under your account"
        }else if(lang === "ar"){
            var type = "جاري جلب جميع التنبيهات لحسابك"
        }

        const generating = new Discord.MessageEmbed()
        generating.setColor(FNBRMENA.Colors("embed"))
        generating.setTitle(`${type} ${loadingEmoji}`)
        message.channel.send(generating)
        .then( async m => {
        
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
                                
                                //add every reminder to the array
                                string += "• " + counter + ": " + await res.item.name + "\n"
                                ids[counter] = await res.item.id
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
                    Reminders.setTitle("Please choose an item to remove")
                }else if(lang === "ar"){
                    Reminders.setTitle("الرجاء اختيار عنصر ليتم حذفه")
                }

                //add description
                Reminders.setDescription(string)

                //await messages
                await message.channel.send(Reminders)
                .then( async msg => {

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //reply message
                    if(lang === "en"){
                        reply = "please choose from above list the command will stop listen in 20 sec"
                    }else if(lang === "ar"){
                        reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"
                    }
                    message.reply(reply)
                    .then( async notify => {

                        //listen
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            if(collected.first().content >= 0 && collected.first().content < string.length){

                                num = collected.first().content
                                msg.delete()
                                notify.delete()

                                //delete the right item
                                for(let i = 0; i < snapshot.size; i++){

                                    var docRef = await db.collection("Reminders").doc(`${i}`)
                                    await docRef.get()
                                    .then(async doc => {
                                        if (await doc.exists) {
                                            if(await doc.data().id === message.author.id && ids[num] === doc.data().mainId){

                                                //delete the item
                                                await db.collection("Reminders").doc(`${i}`).delete()
                                                
                                                //create embed
                                                const embed = new Discord.MessageEmbed()

                                                //add the color
                                                embed.setColor(FNBRMENA.Colors("embed"))

                                                //add the title
                                                if(lang === "en"){
                                                    embed.setTitle(`The ${names[num]} item has been removed successfully ${checkEmoji}`)
                                                }else if(lang === "ar"){
                                                    embed.setTitle(`تم حذف العنصر ${names[num]} بنجاح ${checkEmoji}`)
                                                }

                                                await m.delete()
                                                message.channel.send(embed)
                                            
                                            }
                                        }
                                    })
                                }

                            }else{

                                msg.delete()
                                notify.delete()
                                m.delete()
                                
                                if(lang === "en"){
                                    const error = new Discord.MessageEmbed()
                                    .setColor(FNBRMENA.Colors("embed"))
                                    .setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                    message.reply(error)
                                }else if(lang === "ar"){
                                    const error = new Discord.MessageEmbed()
                                    .setColor(FNBRMENA.Colors("embed"))
                                    .setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                    message.reply(error)
                                }
                            }
                        }).catch(err => {
                            m.delete()
                            notify.delete()
                            msg.delete()
                            if(lang === "en"){
                                const error = new Discord.MessageEmbed()
                                .setColor(FNBRMENA.Colors("embed"))
                                .setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                                message.reply(error)
                            }else if(lang === "ar"){
                                const error = new Discord.MessageEmbed()
                                .setColor(FNBRMENA.Colors("embed"))
                                .setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                                message.reply(error)
                            }
                        })
                    })
                })
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
                
                m.edit(err)
            }
        })
    }
}