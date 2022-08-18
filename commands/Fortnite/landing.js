const Canvas = require('canvas');

module.exports = {
    commands: 'land',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        FNBRMENA.listCurrentPOI(userData.lang, "current")
        .then(async res => {

            //land picker
            const landingPicker = async () => {

                //create a row for Cancel button
                const tryAgainButtonDataRow = new Discord.ActionRowBuilder()

                //start button
                const tryAgainButton = new Discord.ButtonBuilder()
                tryAgainButton.setCustomId('Again')
                tryAgainButton.setStyle(Discord.ButtonStyle.Primary)
                if(userData.lang === "en") tryAgainButton.setLabel("Try Again")
                else if(userData.lang === "ar") tryAgainButton.setLabel("محاولة اخرى")

                //cancle button
                const tryAgainCancelButton = new Discord.ButtonBuilder()
                tryAgainCancelButton.setCustomId('Cancel')
                tryAgainCancelButton.setStyle(Discord.ButtonStyle.Danger)
                if(userData.lang === "en") tryAgainCancelButton.setLabel("Cancel")
                else if(userData.lang === "ar") tryAgainCancelButton.setLabel("اغلاق")
                
                //add the cancel button to the buttonDataRow
                tryAgainButtonDataRow.addComponents(tryAgainButton, tryAgainCancelButton)

                //generating animation
                const generating = new Discord.EmbedBuilder()
                generating.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") generating.setTitle(`Loading ${res.data.list.length} POIs ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ${res.data.list.length} منطقة ${emojisObject.loadingEmoji}`)
                message.reply({embeds: [generating]})
                .then(async msg => {

                    //get a random number
                    var randomImage = Math.floor(Math.random() * res.data.list.length)
                    
                    //creating embed
                    const landingSpotPickedEmbed = new Discord.EmbedBuilder()
                    landingSpotPickedEmbed.setColor(FNBRMENA.Colors("embed"))

                    //set title
                    if(userData.lang === "en"){
                        landingSpotPickedEmbed.setAuthor({name: `Random Landing!`, iconURL: `https://imgur.com/AM2wrGC.png`})
                        landingSpotPickedEmbed.setDescription(`You are going to land at **${res.data.list[randomImage].name}**`)
                    }else if(userData.lang === "ar"){
                        landingSpotPickedEmbed.setAuthor({name: `النزول العشوائي!`, iconURL: `https://imgur.com/AM2wrGC.png`})
                        landingSpotPickedEmbed.setDescription(`راح تنزل في منطقة **${res.data.list[randomImage].name}**`)
                    }

                    //Registering fonts
                    Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})
                    Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});

                    //canvas
                    const canvas = Canvas.createCanvas(1920, 1080);
                    const ctx = canvas.getContext('2d');

                    //background
                    const background = await Canvas.loadImage(res.data.list[randomImage].images[0].url)
                    ctx.drawImage(background, 0, 0, 1920, 1080)

                    //add blue fog
                    const fog = await Canvas.loadImage('./assets/News/fog.png')
                    ctx.drawImage(fog, 0, 0, 1920, 1080)

                    //credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign='left';
                    ctx.font = '60px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 15, 55)

                    //encoding...
                    const att = new Discord.AttachmentBuilder(canvas.toBuffer(), `${res.data.list[randomImage].name}.png`)
                    const PickingLandingSpotAgainMessage = await message.reply({embeds: [landingSpotPickedEmbed], components: [tryAgainButtonDataRow], files: [att]})

                    //delete generating msg
                    msg.delete()

                    //filtering the user clicker
                    const filter = i => i.user.id === message.author.id

                    //await for the user
                    await message.channel.awaitMessageComponent({filter, time: 30000})
                    .then(async collected => {
                        collected.deferUpdate();

                        //if canel button has been clicked
                        if(collected.customId === "Cancel") PickingLandingSpotAgainMessage.delete()
                        if(collected.customId === "Again"){
                            await PickingLandingSpotAgainMessage.delete()
                            landingPicker()
                        }

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        
                    })
                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    
                })
            }

            //create random landing embed message
            const RandomLandingSpotEmbed = new Discord.EmbedBuilder()
            RandomLandingSpotEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                RandomLandingSpotEmbed.setAuthor({name: `Random Landing!`, iconURL: `https://imgur.com/AM2wrGC.png`})
                RandomLandingSpotEmbed.setDescription('Click on start to make the bot chooses a location to land on.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                RandomLandingSpotEmbed.setAuthor({name: `النزول العشوائي!`, iconURL: `https://imgur.com/AM2wrGC.png`})
                RandomLandingSpotEmbed.setDescription('اضغط على زر البدء لجعل البوت يختار لك مكان للنزول.\n.`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }
            
            //create a row for buttons
            const buttonsDataRow = new Discord.ActionRowBuilder()

            //start button
            const startButton = new Discord.ButtonBuilder()
            startButton.setCustomId('Start')
            startButton.setStyle(Discord.ButtonStyle.Primary)
            if(userData.lang === "en") startButton.setLabel("Start")
            else if(userData.lang === "ar") startButton.setLabel("ابدأ")

            //cancle button
            const cancelButton = new Discord.ButtonBuilder()
            cancelButton.setCustomId('Cancel')
            cancelButton.setStyle(Discord.ButtonStyle.Danger)
            if(userData.lang === "en") cancelButton.setLabel("Cancel")
            else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
            
            //add the buttons to the buttonsDataRow
            buttonsDataRow.addComponents(startButton, cancelButton)

            //send the button
            const randomLanderMessaghe = await message.reply({embeds: [RandomLandingSpotEmbed], components: [buttonsDataRow]})

            //filtering the user clicker
            const filter = i => i.user.id === message.author.id

            //await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                //if canel button has been clicked
                if(collected.customId === "Cancel") randomLanderMessaghe.delete()
                if(collected.customId === "Start"){
                    randomLanderMessaghe.delete()
                    landingPicker()
                }
            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })

        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            
        })
    }
}    