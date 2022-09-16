const Canvas = require('canvas')
const wrap = require('word-wrap')
const Gif = require('gif-encoder-2')

module.exports = {
    commands: 'news',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: 20,
    pushChild: true,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //image creator
        const newsImageCreator = async (data, hash) => {

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
                const canvas = Canvas.createCanvas(2560, 1440);
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

                    //draw the image based on the index
                    const newsImage = await Canvas.loadImage(image)
                    ctx.drawImage(newsImage, 0, 0, canvas.width, canvas.height)

                    //add the credits
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'left';
                    ctx.font = '63px Burbank Big Condensed'
                    ctx.fillText("FNBRMENA", 17, 64)

                    //add the lower side fog
                    const imageLowerFog = await Canvas.loadImage('./assets/News/fogV2.png')
                    ctx.drawImage(imageLowerFog, 0, 0, canvas.width, canvas.height)

                    //drop shadow
                    ctx.shadowOffsetY = 50
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                    ctx.shadowBlur = 100;

                    //add the tileImage only if there is one
                    if(data[i].tileImage != undefined){

                        //draw the tileImage on the given coordinates
                        const tileImage = await Canvas.loadImage(data[i].tileImage)
                        ctx.drawImage(tileImage, canvas.width - 470, 24, 420, 210)
                        
                        //add a stroke arround the image
                        ctx.strokeStyle = 'white';
                        ctx.lineWidth = 3.5;
                        ctx.rect(canvas.width - 470, 24, 420, 210);
                        ctx.stroke();

                        //get the title tab name
                        if(data[i].tabTitle !== null) var tabTitle = data[i].tabTitle
                        else var tabTitle = data[i].title

                        //add the tabTitle
                        ctx.fillStyle = '#ffffff';
                        ctx.textAlign = 'center';
                        if(userData.lang === "en") ctx.font = '50px Burbank Big Condensed'
                        else if(userData.lang === "ar") ctx.font = '50px Arabic'
                        ctx.fillText(tabTitle.toUpperCase(), canvas.width - 260, 287)

                    }

                    //now lets add the news indicator
                    var x = canvas.width - 35
                    var y = 20
                    ctx.shadowOffsetY = 6.5
                    ctx.shadowColor = 'black';
                    ctx.shadowBlur = 34;

                    for(let t = 0; t < data.length; t++){

                        //check if the t equals to i, if so the make the indicator for this index larger than the others
                        if(t == i){

                            ctx.fillStyle = 'white' //color plate
                            ctx.fillRect(x, y, 15, 267) //filling
                            
                            //update y value
                            y += 267 + 14

                        }else{

                            ctx.globalAlpha = 0.5 //change transparency
                            ctx.fillStyle = 'white' //color plate
                            ctx.fillRect(x, y, 14, 134) //filling 
                            ctx.globalAlpha = 1 //restore transparency

                            //update y value
                            y += 134 + 13

                        }
                    }

                    //now lets add the title
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

                    //reset shadows
                    ctx.shadowColor = 'rgba(0,0,0,0)';

                    //add the description );
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

process.on("message", async (data) => {
    // console.log("Child PID: " + process.pid)

    var callback = new Function('return ' + data.callback)();
    callback(data.FNBRMENA, data.message, data.args, data.text, require('discord.js'), "", "", data.userData, data.alias, data.emojisObject)
})