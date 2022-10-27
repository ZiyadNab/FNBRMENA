module.exports = {
    commands: 'export',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        // Request Data
        await FNBRMENA.Export(text)
        .then(async res => {

            // File type is json
            if(res.headers['content-type'].includes('application/json')){

                // Send the generating message
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading ${res.data.jsonOutput[0].Name}... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري تحميل بيانات ${res.data.jsonOutput[0].Name}... ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then(async msg => {

                    // Send the file
                    const att = new Discord.AttachmentBuilder(Buffer.from(JSON.stringify(res.data.jsonOutput[0], null, 2)), {name: `${res.data.jsonOutput[0].Name}.json`})
                    await message.reply({files: [att], embeds: []})
                    msg.delete()
                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }

            // File type is an image
            else if(res.headers['content-type'].includes('image')){

                // Send the generating message
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading the image file... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ملف الصورة... ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then(async msg => {

                    // Send the file
                    await FNBRMENA.arrayBufferExport(text)
                    .then(async resArrayBuf => {

                        const att = new Discord.AttachmentBuilder(Buffer.from(resArrayBuf.data), {name: `${text.substring(text.lastIndexOf('/'), text.length)}.png`})
                        await message.reply({files: [att], embeds: []})
                        msg.delete() 
                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })
                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })
            }

            // File type is an image
            else if(res.headers['content-type'].includes('audio')){

                // Send the generating message
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading the audio file... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ملف الصوت... ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then(async msg => {

                    // Send the file
                    await FNBRMENA.arrayBufferExport(text)
                    .then(async resArrayBuf => {

                        const att = new Discord.AttachmentBuilder(Buffer.from(resArrayBuf.data), {name: `${text.substring(text.lastIndexOf('/'), text.length)}.ogg`})
                        await message.reply({files: [att], embeds: []})
                        msg.delete()
                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })
                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })

                // Not supported file type
            }else{
                const noSupportedFileTypeError = new Discord.EmbedBuilder()
                noSupportedFileTypeError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noSupportedFileTypeError.setTitle(`The file type ${res.headers['content-type']} isn't supported. ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noSupportedFileTypeError.setTitle(`نوع الملف ${res.headers['content-type']} ليس مدعوم${emojisObject.errorEmoji}`)
                message.reply({embeds: [noSupportedFileTypeError]})
            }
        }).catch(err => {

            // No data found
            if(err.response.status === 404 && err.response.data.errored){

                // No package has been found
                const noPackageHasBeenFoundError = new Discord.EmbedBuilder()
                noPackageHasBeenFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noPackageHasBeenFoundError.setTitle(`No package has been found, check your path. ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noPackageHasBeenFoundError.setTitle(`لا يمكنني العثور على الملف الرجاء التأكد من مسار الملف ${emojisObject.errorEmoji}`)
                message.reply({embeds: [noPackageHasBeenFoundError]})

            }else  FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}