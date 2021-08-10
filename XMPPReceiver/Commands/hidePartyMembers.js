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

            try {
                //hide members
                await service.party.hideMembers(args[0])

                //party members are hidden
                const backblingSuccess = new Discord.MessageEmbed()
                backblingSuccess.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") backblingSuccess.setTitle(`The party members are hidden successfully. ${errorEmoji}`)
                else if(lang === "ar") backblingSuccess.setTitle(`تم اخفاء افراد المجموعة بنجاح ${errorEmoji}`)
                message.reply(backblingSuccess)
            } catch {

                //if there is an error while hiding the party
                const hidingError = new Discord.MessageEmbed()
                hidingError.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") hidingError.setTitle(`There was an error while hiding the party, please try again later. ${errorEmoji}`)
                else if(lang === "ar") hidingError.setTitle(`يوجد مشكلة اثناء اخفاء افراد المجموعة. يرجى المحاولة لاحقا ${errorEmoji}`)
                message.reply(hidingError)
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