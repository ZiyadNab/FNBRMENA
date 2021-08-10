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

            //try to change the user lvl if there is an error catch it
            try {

                //change the user lvl
                await service.party.members.get(databaseProfile.data().credintials.accountId).setLevel(args[0])

                //backbling has been changed
                const lvlSuccess = new Discord.MessageEmbed()
                lvlSuccess.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") lvlSuccess.setTitle(`TYour lvl has changed to ${args[0]} successfully. ${errorEmoji}`)
                else if(lang === "ar") lvlSuccess.setTitle(`تم تغير لفل الحساب الى ${args[0]} بنجاح ${errorEmoji}`)
                message.reply(lvlSuccess)
            } catch {

                 //if there is an error while changing the user lvl
                 const lvlError = new Discord.MessageEmbed()
                 lvlError.setColor(FNBRMENA.Colors("embed"))
                 if(lang === "en") lvlError.setTitle(`There was an error while changing the user lvl, please try again later. ${errorEmoji}`)
                 else if(lang === "ar") lvlError.setTitle(`يوجد مشكلة اثناء تغير لفل الحساب يرجى المحاولة لاحقا ${errorEmoji}`)
                 message.reply(lvlError)
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