module.exports = async (client, admin) => {

    client.on('guildMemberAdd', async member => {
        if(!member.user.bot){

            //create a doc when a user joins
            admin.firestore().collection("Users").doc(member.id).set({
                id: member.user.id,
                lang: "en",
                timezone: "America/Los_Angeles",
                premium: false,
                quickAccess: false
            })
        }
    })
    
    client.on('guildMemberRemove', async member => {
        if(!member.user.bot){
            
            // Get the user document
            const docRef = await admin.firestore().collection("Users").doc(member.id)

            // Get the user reminders
            const reminders = await docRef.collection("Reminders").get()

            // Batch
            const batch = await admin.firestore().batch()
            
            // Delete all reminders if there is any
            await reminders.forEach(async doc => {
                batch.delete(doc.ref)
            })

            // Commit all changes
            await batch.commit()
            
            // Delete the user document
            docRef.delete()
            
        }
    })
}
