module.exports = {
    commands: 'sac',
    type: 'Fortnite',
    descriptionEN: 'Extracts informations support a creator data.',
    descriptionAR: 'أستخراج معلومات عن معرف المتجر.',
    expectedArgsEN: 'Use this command then type the SAC name.',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب معرف المتجر.',
    argsExample: ['AV2', 'AV2', 'AV2'],
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Request data
        FNBRMENA.CreatorCodeSearch(text)
        .then(async res => {

            // Create embed
            const SACInfo = new Discord.EmbedBuilder()
            SACInfo.setColor(FNBRMENA.Colors("embed"))

            // Check verified
            if(res.data.data.verified){
                if(userData.lang === "en") var verified = `Yes!`
                else if(userData.lang === "ar") var verified = `نعم!`
            }else{
                if(userData.lang === "en") var verified = `No!`
                else if(userData.lang === "ar") var verified = `لا!`
            }

            // Check language
            if(userData.lang === "en") var str = `• Name: \`${res.data.data.account.name}\`\n• ID: \`${res.data.data.account.id}\`\n• Code: \`${res.data.data.code.toUpperCase()}\`\n• Status: \`${res.data.data.status}\`\n• Verified?: \`${verified}\``
            else if(userData.lang === "ar") var str = `• الآسم: \`${res.data.data.account.name}\`\n• الآيدي: \`${res.data.data.account.id}\`\n• الكود: \`${res.data.data.code.toUpperCase()}\`\n• حالة الكود: \`${res.data.data.status}\`\n• موثق؟: \`${verified}\``

            // Set description
            SACInfo.setDescription(str)
            message.reply({embeds: [SACInfo], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })

        }).catch(async err => {
            if(err.response.data.status === 404 && err.response.data.status !== undefined){

                // No support a creator code has been found
                if(err.response.data.error === "the requested code is invalid or was not found"){

                    const noSACHasBeenFound = new Discord.EmbedBuilder()
                    noSACHasBeenFound.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") noSACHasBeenFound.setTitle(`Can't find ${text} creator code ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") noSACHasBeenFound.setTitle(`لا يمكنني العثور على كود ${text}. حاول مجددا ${emojisObject.errorEmoji}`)
                    await message.reply({embeds: [noSACHasBeenFound]})
                }

            }else FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}