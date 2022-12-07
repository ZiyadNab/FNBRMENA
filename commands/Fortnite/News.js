const Canvas = require('canvas')
const wrap = require('word-wrap')
const Gif = require('gif-encoder-2')

module.exports = {
    commands: 'news',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 20,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Setup database storage
        const storage = admin.storage().bucket()

        // Image creator
        const newsImageCreator = async (type, data, hash, push) => {

            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Getting News ... ${emojisObject.loadingEmoji}`)
            if(userData.lang === "ar") generating.setTitle(`جاري تحميل الاخبار ... ${emojisObject.loadingEmoji}`)
            const msg = await message.reply({embeds: [generating]})
            try {

                // If the image doesn't exists on the db storage
                if(!push[0]){

                    // Delete the old existing news file
                    await admin.storage().bucket().deleteFiles({
                        prefix: `preloadedcommands/${alias}/${userData.lang}/${type}/`
                    })

                    // Registering fonts
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                    // Create canvas
                    const canvas = Canvas.createCanvas(2560, 1440);
                    const ctx = canvas.getContext('2d');

                    // Create the encoder
                    const encoder = new Gif(canvas.width, canvas.height, 'neuquant', true)
                    
                    // Add gif delay between image and image
                    encoder.setDelay(3 * 1000)
                    encoder.setQuality(1)

                    // Start encoding
                    encoder.start()

                    // Creating a row
                    const row = new Discord.ActionRowBuilder()
                    var isRow = false

                    // Loop through every
                    for(let i = 0; i < data.length; i++){

                        // Initializing variables
                        var title = data[i].title
                        var body = data[i].body
                        var image = data[i].image

                        // Draw the image based on the index
                        const newsImage = await Canvas.loadImage(image)
                        ctx.drawImage(newsImage, 0, 0, canvas.width, canvas.height)

                        // Add the credits
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'left';
                        ctx.font = '63px Burbank Big Condensed'
                        ctx.fillText("FNBRMENA", 17, 64)

                        // Add the lower side fog
                        const imageLowerFog = await Canvas.loadImage('./assets/News/fogV2.png')
                        ctx.drawImage(imageLowerFog, 0, 0, canvas.width, canvas.height)

                        // Drop shadow
                        ctx.shadowOffsetY = 50
                        ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                        ctx.shadowBlur = 100;

                        // Add the tileImage only if there is one
                        if(data[i].tileImage != undefined){

                            // Draw the tileImage on the given coordinates
                            const tileImage = await Canvas.loadImage(data[i].tileImage)
                            ctx.drawImage(tileImage, canvas.width - 470, 24, 420, 210)
                            
                            // Add a stroke arround the image
                            ctx.strokeStyle = 'white';
                            ctx.lineWidth = 3.5;
                            ctx.rect(canvas.width - 470, 24, 420, 210);
                            ctx.stroke();

                            // Get the title tab name
                            if(data[i].tabTitle !== null) var tabTitle = data[i].tabTitle
                            else var tabTitle = data[i].title

                            // Add the tabTitle
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign = 'center';
                            if(userData.lang === "en") ctx.font = '50px Burbank Big Condensed'
                            else if(userData.lang === "ar") ctx.font = '50px Arabic'
                            ctx.fillText(tabTitle.toUpperCase(), canvas.width - 260, 287)

                        }

                        // Now lets add the news indicator
                        var x = canvas.width - 35
                        var y = 20
                        ctx.shadowOffsetY = 6.5
                        ctx.shadowColor = 'black';
                        ctx.shadowBlur = 34;

                        for(let t = 0; t < data.length; t++){

                            // Check if the t equals to i, if so the make the indicator for this index larger than the others
                            if(t == i){

                                ctx.fillStyle = 'white' // Color plate
                                ctx.fillRect(x, y, 15, 267) // Filling
                                
                                // Update y value
                                y += 267 + 14

                            }else{

                                ctx.globalAlpha = 0.5 // Change transparency
                                ctx.fillStyle = 'white' // Color plate
                                ctx.fillRect(x, y, 14, 134) // Filling 
                                ctx.globalAlpha = 1 // Restore transparency

                                // Update y value
                                y += 134 + 13

                            }
                        }

                        // Now lets add the title
                        ctx.shadowBlur = 100;
                        ctx.fillStyle = '#ffffff';
                        if(userData.lang === "en"){
                            ctx.font = '100px Burbank Big Condensed'
                            ctx.textAlign = 'left';
                            ctx.fillText(title.toUpperCase(), 40, 1160)
                        }else if(userData.lang === "ar"){
                            ctx.font = '100px Arabic'
                            ctx.textAlign = 'right';
                            ctx.fillText(title.toUpperCase(), canvas.width - 40, 1160)
                        }

                        // Reset shadows
                        ctx.shadowColor = 'rgba(0,0,0,0)';

                        // Add the description );
                        ctx.fillStyle = '#00deff';
                        body = wrap(body, {width: 50})
                        if(userData.lang === "en"){
                            ctx.font = '50px Burbank Big Condensed'
                            ctx.textAlign = 'left';
                            ctx.fillText(body, 86, 1235)
                        }else if(userData.lang === "ar"){
                            ctx.font = '50px Arabic'
                            ctx.textAlign = 'right';
                            ctx.fillText(body, canvas.width - 86, 1235)
                        }

                        // Add a button if there is a link
                        if(data[i].websiteUrl != undefined){
                            isRow = true
                            row.addComponents(
                                new Discord.ButtonBuilder()
                                .setStyle(Discord.ButtonStyle.Link)
                                .setLabel(title)
                                .setURL(data[i].websiteUrl)
                            )
                        }

                        // Add a frame to the encoder
                        encoder.addFrame(ctx);
                    }

                    // Finish encoding
                    encoder.finish();

                    // Upload the image to the database storage
                    await admin.storage().bucket().file(`preloadedcommands/${alias}/${userData.lang}/${type}/${hash}.gif`).save(encoder.out.getData())

                    // Send the message
                    const att = new Discord.AttachmentBuilder(encoder.out.getData(), {name: `${hash}.gif`})
                    if(isRow) await message.reply({files: [att], components: [row]})
                    else await message.reply({files: [att]})
                    msg.delete()

                }else{

                    // An image is already exists on the db storage
                    const file = storage.file(`preloadedcommands/${alias}/${userData.lang}/${type}/${hash}.gif`)
                    await file.makePublic()
                    const att = new Discord.AttachmentBuilder(await file.publicUrl())
                    await message.reply({files: [att]})
                    msg.delete()
                }

            }catch(err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }
        }
        
        // Request data
        await FNBRMENA.News(userData.lang)
        .then(async res => {

            // Create random landing embed message
            const newsTypeEmbed = new Discord.EmbedBuilder()
            newsTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                newsTypeEmbed.setAuthor({name: `NEWS`, iconURL: `https://imgur.com/g1j40Om.png`})
                newsTypeEmbed.setDescription('Choose the news type BR or STW.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                newsTypeEmbed.setAuthor({name: `الأخبار`, iconURL: `https://imgur.com/g1j40Om.png`})
                newsTypeEmbed.setDescription('اختر نوع باتل رويال ام انقاذ العالم.\n.`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            // Create a row for buttons
            const buttonsDataRow = new Discord.ActionRowBuilder()

            // BR button
            const brNewsButton = new Discord.ButtonBuilder()
            brNewsButton.setCustomId('BR')
            brNewsButton.setStyle(Discord.ButtonStyle.Primary)
            if(res.data.data.br === null) brNewsButton.setDisabled(true)
            if(userData.lang === "en") brNewsButton.setLabel("Battle Royale")
            else if(userData.lang === "ar") brNewsButton.setLabel("باتل رويال")

            // STW button
            const stwNewsButton = new Discord.ButtonBuilder()
            stwNewsButton.setCustomId('STW')
            stwNewsButton.setStyle(Discord.ButtonStyle.Success)
            if(res.data.data.stw === null) stwNewsButton.setDisabled(true)
            if(userData.lang === "en") stwNewsButton.setLabel("Save The World")
            else if(userData.lang === "ar") stwNewsButton.setLabel("انقاذ العالم")

            // Cancel button
            const cancelButton = new Discord.ButtonBuilder()
            cancelButton.setCustomId('Cancel')
            cancelButton.setStyle(Discord.ButtonStyle.Danger)
            if(userData.lang === "en") cancelButton.setLabel("Cancel")
            else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
            
            // Add the buttons to the buttonsDataRow
            buttonsDataRow.addComponents(brNewsButton, stwNewsButton, cancelButton)

            // Send the button
            const newsTypeMessage = await message.reply({embeds: [newsTypeEmbed], components: [buttonsDataRow]})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === newsTypeMessage.id && i.guild.id === message.guild.id)
            })

            // Await the user click
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                // If cancel button has been clicked
                if(collected.customId === "Cancel") newsTypeMessage.delete()

                // User clicked BR
                if(collected.customId === "BR"){
                    newsTypeMessage.delete()
                    newsImageCreator(
                        "br",
                        res.data.data.br.motds, 
                        res.data.data.br.hash,
                        await storage.file(`preloadedcommands/${alias}/${userData.lang}/br/${res.data.data.br.hash}.gif`).exists()
                    )
                }

                // User clicked STW
                if(collected.customId === "STW"){
                    newsTypeMessage.delete()
                    newsImageCreator(
                        "stw",
                        res.data.data.stw.messages,
                        res.data.data.stw.hash,
                        await storage.file(`preloadedcommands/${alias}/${userData.lang}/stw/${res.data.data.stw.hash}.gif`).exists()
                    )
                }
            }).catch(async err => {
                newsTypeMessage.delete()
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
            })
        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })
    }
}