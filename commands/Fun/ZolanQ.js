module.exports = {
    commands: 'zolan',
    type: 'Fun',
    minArgs: null,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        if(message.author.id === "670067434278879235" || message.author.id === "325507145871130624"){
            if(text.includes("edit title")){
                admin.database().ref("ERA's").child("Zolan").update({
                    title: text.replace('edit title', '')
                })
            }
            if(text.includes("edit about")){
                admin.database().ref("ERA's").child("Zolan").update({
                    aboutMe: text.replace('edit about', '')
                })
            }
        }

        admin.database().ref("ERA's").child("Zolan").once('value')
        .then(async data => {
            const e = new Discord.EmbedBuilder()
            .setColor(FNBRMENA.Colors("embed"))
            .setTitle(data.val().title)
            .setDescription(data.val().aboutMe)

            message.channel.send({embeds: [e]})
        })
    }
}