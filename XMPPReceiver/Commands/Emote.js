const Data = require('../../FNBRMENA.js')
const FNBRMENA = new Data()

//handle the outfit changer
module.exports = async (message, args, service, Discord, client, admin, errorEmoji, checkEmoji, loadingEmoji) => {

    //get the user language from the database
    const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

    //seeting up the db firestore
    var db = admin.firestore()

    //request all the document 
    const doc = await db.collection("FortniteXMPP").get()

    //all the active XMPP services
    let activeFortniteXMPP = []
    let counterActiveFortniteXMPP = 0

    //if there is an active document add an error and if not add a new one
    await doc.forEach(doc => {

        //store all the active XMPP services
        activeFortniteXMPP[counterActiveFortniteXMPP] = doc.id
        counterActiveFortniteXMPP++

    })

    //if the user hansn't yet activated his own XMPP service
    if(activeFortniteXMPP.includes(message.author.id)){

        //get the device auth credintials from database
        const databaseProfile = await db.collection("FortniteXMPP").doc(message.author.id).get()
        if(databaseProfile.data().status){

            //try to change the emote if there is an error catch it
            try {

                //request data
                FNBRMENA.SearchByType(lang, args[0], "emote", "id")
                .then(async res => {

                    //check if the item has been found
                    if(res.data.items.length > 0){

                        //change the emote
                        await service.party.members.get(databaseProfile.data().credintials.accountId).setEmote(res.data.items[0].id)

                        //emote has been changed
                        const emoteSuccess = new Discord.MessageEmbed()
                        emoteSuccess.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") emoteSuccess.setTitle(`The emote has been changed to ${res.data.items[0].name} successfully. ${errorEmoji}`)
                        else if(lang === "ar") emoteSuccess.setTitle(`تم تغير الرقصة الى ${res.data.items[0].name} بنجاح ${errorEmoji}`)
                        message.reply(emoteSuccess)
                    }else{

                        //item not found
                        const emoteError = new Discord.MessageEmbed()
                        emoteError.setColor(FNBRMENA.Colors("embed"))
                        if(lang === "en") emoteError.setTitle(`There is no emote with that id. Please check your speling ${errorEmoji}`)
                        else if(lang === "ar") emoteError.setTitle(`لايوجد زي بهذا المعرف. الرجاء التحقق من المعرف ثم حاول مجددا ${errorEmoji}`)
                        message.reply(emoteError)
                    }
                })

            } catch {

                //if there is an error while changing the emote
                const emoteError = new Discord.MessageEmbed()
                emoteError.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") emoteError.setTitle(`There was an error while changing the Emote, please try again later. ${errorEmoji}`)
                else if(lang === "ar") emoteError.setTitle(`يوجد مشكلة اثناء تغير الرقصة. يرجى المحاولة لاحقا ${errorEmoji}`)
                message.reply(emoteError)
            }
        }else{

            //if there is not an active XMPP already for the user
            const statusOff = new Discord.MessageEmbed()
            statusOff.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") statusOff.setTitle(`Your service status in now offline. Please use command activate to start ${errorEmoji}`)
            else if(lang === "ar") statusOff.setTitle(`عذرا. حالة الخدمة لديك مغلقةالدجاء استعمل امر activate للبدء ${errorEmoji}`)
            message.reply(statusOff)

        }
    }else{

        //if there is not an active XMPP already for the user
        const errorRequest = new Discord.MessageEmbed()
        errorRequest.setColor(FNBRMENA.Colors("embed"))
        if(lang === "en") errorRequest.setTitle(`Please use activate command to activate your service ${errorEmoji}`)
        else if(lang === "ar") errorRequest.setTitle(`من فضلك استعمل امر activate لتفعيل الخدمات ${errorEmoji}`)
        message.reply(errorRequest)

    }
}