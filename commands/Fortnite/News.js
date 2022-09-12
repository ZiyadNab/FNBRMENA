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

        //image creator
        const newsImageCreator = async (data, hash) => {
            console.log(data)

            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Getting News ... ${emojisObject.loadingEmoji}`)
            if(userData.lang === "ar") generating.setTitle(`جاري تحميل الاخبار ... ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then(async msg => {

                //registering fonts
                Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
                Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

                //create canvas
                const canvas = Canvas.createCanvas(3840, 2160);
                const ctx = canvas.getContext('2d');

                //create the encoder
                const encoder = new Gif(canvas.width, canvas.height, 'neuquant', true)
                
                //add gif delay between image and image
                encoder.setDelay(3 * 1000)
                encoder.setQuality(1)

                //start encoding
                encoder.start()

                //creating a row
                const row = new Discord.ActionRowBuilder()
                var isRow = false

                //loop through every
                for(let i = 0; i < data.length; i++){

                    //initializing variables
                    var title = data[i].title
                    var body = data[i].body
                    var image = data[i].image
                    console.log(title, body, image)

                    //draw the image based on the index
                    const newsImage = await Canvas.loadImage(image)
                    ctx.drawImage(newsImage, 0, 0, canvas.width, canvas.height)

                    //add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.font = '95px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 25, 95)

                    //add the lower side fog
                    const imageLowerFog = await Canvas.loadImage('./assets/News/fogV2.png')
                    ctx.drawImage(imageLowerFog, 0, 0, canvas.width, canvas.height)

                    //drop shadow
                    ctx.shadowOffsetY = 75
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                    ctx.shadowBlur = 150;

                    //add the tileImage only if there is one
                    if(data[i].tileImage != undefined){

                        //draw the tileImage on the given coordinates
                        const tileImage = await Canvas.loadImage(data[i].tileImage)
                        ctx.drawImage(tileImage, canvas.width - 705, 35, 630, 315)
                        
                        //add a stroke arround the image
                        ctx.strokeStyle = 'white';
                        ctx.lineWidth = 5;
                        ctx.rect(canvas.width - 705, 35, 630, 315);
                        ctx.stroke();

                        //get the title tab name
                        if(data[i].tabTitle !== null) var tabTitle = data[i].tabTitle
                        else var tabTitle = data[i].title

                        //add the tabTitle
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'center';
                        if(userData.lang === "en") ctx.font = '75px Burbank Big Condensed'
                        else if(userData.lang === "ar") ctx.font = '75px Arabic'
                        ctx.fillText(tabTitle.toUpperCase(), canvas.width - 390, 430)

                    }

                    //now lets add the news indicator
                    var x = canvas.width - 52
                    var y = 30
                    ctx.shadowOffsetY = 10
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 50;

                    for(let t = 0; t < data.length; t++){

                        //check if the t equals to i, if so the make the indicator for this index larger than the others
                        if(t == i){

                            ctx.fillStyle = 'white' //color plate
                            ctx.fillRect(x, y, 22, 400) //filling
                            
                            //update y value
                            y += 400 + 20

                        }else{

                            ctx.globalAlpha = 0.5 //change transparency
                            ctx.fillStyle = 'white' //color plate
                            ctx.fillRect(x, y, 22, 200) //filling 
                            ctx.globalAlpha = 1 //restore transparency

                            //update y value
                            y += 200 + 20

                        }
                    }

                    //now lets add the title
                    ctx.shadowBlur = 150;
                    ctx.fillStyle = '#ffffff';
                    if(userData.lang === "en"){
                        ctx.font = '150px Burbank Big Condensed'
                        ctx.textAlign = 'left';
                        ctx.fillText(title.toUpperCase(), 60, 1740)
                    }else if(userData.lang === "ar"){
                        ctx.font = '150px Arabic'
                        ctx.textAlign = 'right';
                        ctx.fillText(title.toUpperCase(), canvas.width - 60, 1740)
                    }

                    //reset shadows
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                    //add the description );
                    ctx.fillStyle = '#00deff';
                    body = wrap(body, {width: 75})
                    if(userData.lang === "en"){
                        ctx.font = '75px Burbank Big Condensed'
                        ctx.textAlign = 'left';
                        ctx.fillText(body, 130, 1850)
                    }else if(userData.lang === "ar"){
                        ctx.font = '75px Arabic'
                        ctx.textAlign = 'right';
                        ctx.fillText(body, canvas.width - 130, 1850)
                    }

                    //add a button if there is a link
                    if(data[i].websiteUrl != undefined){
                        isRow = true
                        row.addComponents(
                            new Discord.ButtonBuilder()
                            .setStyle(Discord.ButtonStyle.Link)
                            .setLabel(title)
                            .setURL(data[i].websiteUrl)
                        )
                    }

                    //add a frame to the encoder
                    encoder.addFrame(ctx);
                }

                //finish encoding
                encoder.finish();

                //send the message
                const att = new Discord.AttachmentBuilder(encoder.out.getData(), {name: `${hash}.gif`}) 
                if(isRow) await message.reply({files: [att], components: [row]})
                else await message.reply({files: [att]})
                msg.delete()

            }).catch(async err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })
        }
        
        //request data
        await FNBRMENA.News(userData.lang)
        .then(async res => {

            //create random landing embed message
            const newsTypeEmbed = new Discord.EmbedBuilder()
            newsTypeEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                newsTypeEmbed.setAuthor({name: `NEWS`, iconURL: `https://imgur.com/g1j40Om.png`})
                newsTypeEmbed.setDescription('Choose the news type BR or STW.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                newsTypeEmbed.setAuthor({name: `الأخبار`, iconURL: `https://imgur.com/g1j40Om.png`})
                newsTypeEmbed.setDescription('اختر نوع باتل رويال ام انقاذ العالم.\n.`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            //create a row for buttons
            const buttonsDataRow = new Discord.ActionRowBuilder()

            //br button
            const brNewsButton = new Discord.ButtonBuilder()
            brNewsButton.setCustomId('BR')
            brNewsButton.setStyle(Discord.ButtonStyle.Primary)
            if(res.data.data.br === null) brNewsButton.setDisabled(true)
            if(userData.lang === "en") brNewsButton.setLabel("Battle Royale")
            else if(userData.lang === "ar") brNewsButton.setLabel("باتل رويال")

            //stw button
            const stwNewsButton = new Discord.ButtonBuilder()
            stwNewsButton.setCustomId('STW')
            stwNewsButton.setStyle(Discord.ButtonStyle.Success)
            if(res.data.data.stw === null) stwNewsButton.setDisabled(true)
            if(userData.lang === "en") stwNewsButton.setLabel("Save The World")
            else if(userData.lang === "ar") stwNewsButton.setLabel("انقاذ العالم")

            //cancle button
            const cancelButton = new Discord.ButtonBuilder()
            cancelButton.setCustomId('Cancel')
            cancelButton.setStyle(Discord.ButtonStyle.Danger)
            if(userData.lang === "en") cancelButton.setLabel("Cancel")
            else if(userData.lang === "ar") cancelButton.setLabel("اغلاق")
            
            //add the buttons to the buttonsDataRow
            buttonsDataRow.addComponents(brNewsButton, stwNewsButton, cancelButton)

            //send the button
            const newsTypeMessage = await message.reply({embeds: [newsTypeEmbed], components: [buttonsDataRow]})

            //filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === newsTypeMessage.id && i.guild.id === message.guild.id)
            })

            //await the user click
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                //if canel button has been clicked
                if(collected.customId === "Cancel") newsTypeMessage.delete()

                //user clicked BR
                if(collected.customId === "BR"){
                    newsTypeMessage.delete()
                    newsImageCreator(res.data.data.br.motds, res.data.data.br.hash)
                }

                //user clicked STW
                if(collected.customId === "STW"){
                    newsTypeMessage.delete()
                    newsImageCreator(res.data.data.stw.messages, res.data.data.stw.hash)
                }
            }).catch(async err => {
                newsTypeMessage.delete()
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })
        }).catch(async err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
    }
}
