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

            //try to change the status to sitting out if there is an error catch it
            try {

                //change the status to sitting out
                await service.party.members.get(databaseProfile.data().credintials.accountId).setSittingOut(args[0])

                //status has been changed to sitting out
                const sittingSuccess = new Discord.MessageEmbed()
                sittingSuccess.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") sittingSuccess.setTitle(`The status has been changed to sitting out successfully. ${errorEmoji}`)
                else if(lang === "ar") sittingSuccess.setTitle(`تم تغير الحالة الى بالخارج الى فترة طويلة بنجاح ${errorEmoji}`)
                message.reply(sittingSuccess)
            } catch {

                 //if there is an error while changing the status to sitting out
                 const sittingError = new Discord.MessageEmbed()
                 sittingError.setColor(FNBRMENA.Colors("embed"))
                 if(lang === "en") sittingError.setTitle(`There was an error while changing the status to Sitting Out, please try again later. ${errorEmoji}`)
                 else if(lang === "ar") sittingError.setTitle(`يوجد مشكلة اثناء تغير الحالة الى بالخارج الى فترة طويلة يرجى المحاولة لاحقا ${errorEmoji}`)
                 message.reply(sittingError)
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