const Data = require('../../../FNBRMENA')
const FNBRMENA = new Data()
const moment = require('moment')
const { Client } = require('fnbr')
const HandleServicesCommands = require('../../../Events/HandleServicesCommands.js')

module.exports = {
    commands: 'activate',
    expectedArgs: '',
    minArgs: null,
    maxArgs: null,
    cooldown: 120,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

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
        if(!activeFortniteXMPP.includes(message.author.id)){

            //get access to fortnite XMPP services using fnbr.js
            const service = new Client({
                auth: {
                    authorizationCode: text
                }
            })

            //get the device auth key and store it to database
            service.on('deviceauth:created', async (deviceAuth) => {

                //json data
                const auth = {
                    id: message.author.id,
                    credintials: deviceAuth,
                    date: moment().format(),
                    status: true
                }

                //store the data
                await db.collection("FortniteXMPP").doc(message.author.id).set(auth)

            })

            //logining
            await service.login()
            HandleServicesCommands(service, Discord, client, admin, FNBRMENA, errorEmoji, checkEmoji, loadingEmoji)

        }else{

            //get the device auth credintials from database
            const databaseProfile = await db.collection("FortniteXMPP").doc(message.author.id).get()

            //if the service is already up and running
            if(databaseProfile.data().status){

                //login using device auth
                const service = new Client({
                    auth: {
                        deviceAuth: databaseProfile.data().credintials
                    }
                })

                //logining
                await service.login()
                HandleServicesCommands(service, Discord, client, admin, FNBRMENA, errorEmoji, checkEmoji, loadingEmoji)

            }else{

                //if there is an active XMPP already for the user
                const errorRequest = new Discord.MessageEmbed()
                errorRequest.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") errorRequest.setTitle(`Oh uh, there is an active service already please use the service commands ${errorEmoji}`)
                else if(lang === "ar") errorRequest.setTitle(`اوه عذرا، الخدمة متفعله بحسابك مسبقا الرجاء استعمال اوامر الخدمة ${errorEmoji}`)
                message.reply(errorRequest)
            }
        }
    }
}