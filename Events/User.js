module.exports = async (client, admin) => {

    client.on('guildMemberAdd', member => {
        if(member.user.bot === false){
            admin.database().ref("ERA's").child("Users").child(member.id).set({
                id: member.user.id,
                name: member.user.username,
                discriminator: member.user.discriminator,
                lang: "en",
                timezone: "America/Los_Angeles"
            })
        }
    }) 
    client.on('guildMemberRemove', member => {
        if(member.user.bot === false){
            admin.database().ref("ERA's").child("Users").child(member.id).remove()
        }
    }) 

}