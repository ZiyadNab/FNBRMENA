module.exports = {
    commands: 'sac',
    type: 'Fortnite',
    descriptionEN: 'Use this command to extract the support a creator data.',
    descriptionAR: 'أستعمل الأمر لأستخراج معلومات كود الشوب.',
    expectedArgsEN: 'Use this command then type the SAC name.',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب اسم كود الشوب.',
    argsExample: ['AV2', 'AV2', 'AV2'],
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //request data
        FNBRMENA.CreatorCodeSearch(text)
        .then(async res => {

            //create embed
            const SACInfo = new Discord.EmbedBuilder()
            SACInfo.setColor(FNBRMENA.Colors("embed"))

            //check verified
            if(res.data.data.verified){
                if(userData.lang === "en") var verified = `Yes!`
                else if(userData.lang === "ar") var verified = `نعم!`
            }else{
                if(userData.lang === "en") var verified = `No!`
                else if(userData.lang === "ar") var verified = `لا!`
            }

            //is the user language is english
            if(userData.lang === "en") var str = `• Name: \`${res.data.data.account.name}\`\n• ID: \`${res.data.data.account.id}\`\n• Code: \`${res.data.data.code.toUpperCase()}\`\n• Status: \`${res.data.data.status}\`\n• Verified?: \`${verified}\``
            else if(userData.lang === "ar") var str = `• الآسم: \`${res.data.data.account.name}\`\n• الآيدي: \`${res.data.data.account.id}\`\n• الكود: \`${res.data.data.code.toUpperCase()}\`\n• حالة الكود: \`${res.data.data.status}\`\n• موثق؟: \`${verified}\``

            //set description
            SACInfo.setDescription(str)
            message.reply({embeds: [SACInfo]})

        }).catch(async err => {
            if(err.response.data.status === 404 && err.response.data.status !== undefined){

                //no support a creator code has been found
                if(err.response.data.error === "the requested code is invalid or was not found"){

                    const noSACHasBeenFound = new Discord.EmbedBuilder()
                    noSACHasBeenFound.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noSACHasBeenFound.setTitle(`Can't find ${text} creator code ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noSACHasBeenFound.setTitle(`لا يمكنني العثور على كود ${text}. حاول مجددا ${emojisObject.errorEmoji}`)
                    await message.reply({embeds: [noSACHasBeenFound]})
                }

            }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}