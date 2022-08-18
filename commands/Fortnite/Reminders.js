const moment = require('moment')

module.exports = {
    commands: 'reminders',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        const generating = new Discord.EmbedBuilder()
        generating.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en") generating.setTitle(`Getting all of the reminders under your account ${emojisObject.loadingEmoji}`)
        if(userData.lang === "ar") generating.setTitle(`جاري جلب جميع التنبيهات لحسابك ${emojisObject.loadingEmoji}`)
        message.reply({embeds: [generating]})
        .then(async msg => {

            //seeting up the db firestore
            var db = await admin.firestore()

            //define the collection
            const docRef = await db.collection("Users").doc(`${message.author.id}`).collection("Reminders")

            //get the collection data
            const snapshot = await docRef.get()

            //if the user has no reminders
            if(snapshot.size > 0){

                //get every single collection
                var string = ``
                for(let i = 0; i < snapshot.size; i++){

                    //get the item name
                    await FNBRMENA.Search(userData.lang, "id", snapshot.docs[i].id)
                    .then(async res => {

                        //long client has been waiting for
                        moment.locale(userData.lang)
                        var Now = moment()
                        var long = moment(snapshot.docs[i].data().date)
                        const day = Now.diff(long, 'days')
                        
                        //add every reminder to the array
                        if((i + 1) != snapshot.size){
                            if(userData.lang === "en") string += `${emojisObject.countEmoji} ${res.data.items[0].name} \`${day} Waiting days.\`\n`
                            else if(userData.lang === "ar") string += `${res.data.items[0].name} \`${day} يوم منتظر.\`\n`

                        }else{
                            if(userData.lang === "en") string += `${emojisObject.endEmoji} ${res.data.items[0].name} \`${day} Waiting days.\`\n`
                            else if(userData.lang === "ar") string += `${res.data.items[0].name} \`${day} يوم منتظر.\`\n`
                        }

                    //handeling errors
                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

                    })
                }

                //creeate embed
                const remindersEmbed = new Discord.EmbedBuilder()
                remindersEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    remindersEmbed.setTitle(`Reminders for ${message.author.username}`)
                    remindersEmbed.setDescription(`You will be notified when these items are in the Item Shop.\nAdd & remove items with remind and unremind. \n\n${string}\n\n${emojisObject.starwars} You can add ${20 - snapshot.size} more reminders (${snapshot.size}/20).`)
                }else if(userData.lang === "ar"){
                    remindersEmbed.setTitle(`التذكيرات لـ ${message.author.username}`)
                    remindersEmbed.setDescription(`سوف يتم تنبيهك في حال توفر احد العناصر التاليه في متجر العناصر.\nاضف & احذف العناصر بأستخدام remind و unremind. \n\n${string}\n\n${emojisObject.starwars} يمكنك اضافة ${20 - snapshot.size} من المذكرات (${snapshot.size}/20).`)
                }
                await message.reply({embeds: [remindersEmbed]})
                msg.delete()

            }else{

                //create embed
                const noRemindersFoundError = new Discord.EmbedBuilder()
                noRemindersFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noRemindersFoundError.setTitle(`You dont have any reminders ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noRemindersFoundError.setTitle(`ليس لديك اي عنصر للتذكير ${emojisObject.errorEmoji}`)
                msg.edit({embeds: [noRemindersFoundError]})
            }
            
        //handeling errors
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)

        })
    }
}