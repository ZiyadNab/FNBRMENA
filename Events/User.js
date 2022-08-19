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
            
            //get the user's doc and delete it
            await admin.firestore().collection("Users").doc(member.id).delete()
        }
    }) 

}