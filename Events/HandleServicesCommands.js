module.exports = async (service, Discord, client, admin, FNBRMENA, errorEmoji, checkEmoji, loadingEmoji) => {

    //listen for commands
    client.on('message', async (message) => {
        const { member, content, guild } = message

        //get the prefix
        const prefix = await FNBRMENA.Admin(admin, message, "", "Prefix")

        if(content.startsWith(prefix)){

            const args = content.split(/[ ]+/)
            const command = args.shift().toLowerCase()
            const alias = command.replace(prefix, '')
            console.log(args, command, alias)

            if(alias === 'setoutfit'){

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

                    //change the outfit
                    service.party.me.setOutfit(args[0])

                }else{

                    //if there is not an active XMPP already for the user
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Please use command startbot to activate your service ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`من فضلك استعمل امر startbot لتفعيل الخدمات ${errorEmoji}`)
                    message.reply(errorRequest)

                }
            }

            if(alias === 'setemote'){

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

                    //change the outfit
                    service.party.me.setEmote(args[0])

                }else{

                    //if there is not an active XMPP already for the user
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Please use command startbot to activate your service ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`من فضلك استعمل امر startbot لتفعيل الخدمات ${errorEmoji}`)
                    message.reply(errorRequest)

                }
            }

            if(alias === 'setbackbling'){

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

                    //change the outfit
                    service.party.me.setBackpack(args[0])

                }else{

                    //if there is not an active XMPP already for the user
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Please use command startbot to activate your service ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`من فضلك استعمل امر startbot لتفعيل الخدمات ${errorEmoji}`)
                    message.reply(errorRequest)

                }
            }

            if(alias === 'clearemote'){

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

                    //change the outfit
                    service.party.me.clearEmote()

                }else{

                    //if there is not an active XMPP already for the user
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Please use command startbot to activate your service ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`من فضلك استعمل امر startbot لتفعيل الخدمات ${errorEmoji}`)
                    message.reply(errorRequest)

                }
            }

            if(alias === 'hide'){

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

                    //change the outfit
                    service.party.hideMembers(args[0])

                }else{

                    //if there is not an active XMPP already for the user
                    const errorRequest = new Discord.MessageEmbed()
                    errorRequest.setColor(FNBRMENA.Colors("embed"))
                    if(lang === "en") errorRequest.setTitle(`Please use command startbot to activate your service ${errorEmoji}`)
                    else if(lang === "ar") errorRequest.setTitle(`من فضلك استعمل امر startbot لتفعيل الخدمات ${errorEmoji}`)
                    message.reply(errorRequest)

                }
            }
        }
    })
}
