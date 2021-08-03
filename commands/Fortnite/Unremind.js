const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
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

        //data
        var string = ""
        var counter = 0
        var ids = []
        var names = []
        var num = 0

        const generating = new Discord.MessageEmbed()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en") generating.setTitle(`Getting all of the reminders under your account ${loadingEmoji}`)
        else if(lang === "ar") generating.setTitle(`جاري جلب جميع التنبيهات لحسابك ${loadingEmoji}`)
        message.channel.send(generating)
        .then( async m => {
        
            //define the collection
            const docRef = await db.collection("Reminders")

            //get the collection data
            const snapshot = await docRef.get()
            
            //get every single collection
            for(let i = 0; i < snapshot.size; i++){

                //if the id is undefined
                if(await snapshot.docs[i].data().id !== undefined){

                    //if the data user ID matching the message author
                    if(await snapshot.docs[i].data().id === message.author.id){

                        //get the item name
                        await fortniteAPI.getItemDetails(itemId = snapshot.docs[i].data().mainId, options = {lang: lang})
                        .then(async res => {

                            //long client has been waiting for
                            moment.locale(lang)
                            var Now = moment()
                            var long = moment(snapshot.docs[i].data().date)
                            const day = Now.diff(long, 'days')
                            
                            //add every reminder to the array
                            if(lang === "en") string += "• " + counter + ": " + await res.item.name + " | Days Waiting: " + day + "\n"
                            else if(lang === "ar") string += "• " + counter + ": " + await res.item.name + " | الايام المنتظرة: " + day + "\n"
                            names[counter] = await res.item.name
                            ids[counter] = await res.item.id
                            counter++

                        })
                    }
                }
            }

            //if the user has no reminders
            if(names.length !== 0){

                //creeate embed
                const Reminders = new Discord.MessageEmbed()

                //add the color
                Reminders.setColor(FNBRMENA.Colors("embed"))

                //add title
                if(lang === "en") Reminders.setTitle("Please choose an item to remove")
                else if(lang === "ar") Reminders.setTitle("الرجاء اختيار عنصر ليتم حذفه")

                //add description
                Reminders.setDescription(string)

                //await messages
                await message.channel.send(Reminders)
                .then( async msg => {

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //reply message
                    if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                    else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

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

                                    //if the id is undefined
                                    if(await snapshot.docs[i].data().id !== undefined){
                                        
                                        //insure that the data is valid and its from the same author
                                        if(await snapshot.docs[i].data().id === message.author.id && ids[num] === snapshot.docs[i].data().mainId){

                                            //delete the item
                                            await db.collection("Reminders").doc(`${snapshot.docs[i].id}`).delete()
                                            
                                            //create embed
                                            const embed = new Discord.MessageEmbed()

                                            //add the color
                                            embed.setColor(FNBRMENA.Colors("embed"))

                                            //add the title
                                            if(lang === "en") embed.setTitle(`The ${names[num]} item has been removed successfully ${checkEmoji}`)
                                            else if(lang === "ar") embed.setTitle(`تم حذف العنصر ${names[num]} بنجاح ${checkEmoji}`)

                                            await m.delete()
                                            message.channel.send(embed)
                                        
                                        }
                                    }
                                }

                            }else{

                                //delete messages
                                msg.delete()
                                notify.delete()
                                m.delete()
                                
                                //if user typed a number out of range
                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)

                            }
                        }).catch(err => {

                            //delete messages
                            m.delete()
                            notify.delete()
                            msg.delete()
                            
                            const error = new Discord.MessageEmbed()
                            error.setColor(FNBRMENA.Colors("embed"))
                            error.setTitle(`${FNBRMENA.Errors("Time", lang)} ${errorEmoji}`)
                            message.reply(error)
                        })
                    })
                })
            }else{

                //create embed
                const err = new Discord.MessageEmbed()
                err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") err.setTitle(`You dont have any reminders ${errorEmoji}`)
                else if(lang === "ar") err.setTitle(`ليس لديك اي عنصر للتذكير ${errorEmoji}`)
                m.edit(err)

            }
        })
    }
}