const axios = require('axios');
const Canvas = require('canvas')
const moment = require('moment')

module.exports = {
    commands: 'section',
    expectedArgs: '<Section>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, arguments, text, Discord, client) => {
        axios.get('https://fn-api.com/api/shop_categories')
        .then( async (res) => {
            console.log(res)
            //length
            var length = res.data.shopCategories.length;

            // generating animation
            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`Loading ${length} Sections... ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

            //time
            var time = moment(res.data.timestamp).format("h:mm a");

            //x and y
            var x = 23;
            var y = 323;
            //width
            var width = 900;
            //height
            var height = 100;
            for (let i = 0; i < length; i++){
                height += 150;
            }

            height += 100

            //canvas
            const canvas = Canvas.createCanvas(width, height);
            const ctx = canvas.getContext('2d'); 

            //background
            const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            //credit
            const credit = await Canvas.loadImage('./assets/Credits/FNBR_MENA_Black.png')
            ctx.drawImage(credit,30, 80, 864,230)

            //data
            for (let i = 0; i < length; i++){

                const card = await Canvas.loadImage('./assets/Section/card.png')
                ctx.drawImage(card,x, y, 850,150)

                ctx.fillStyle = '#ffffff';
                ctx.textAlign='center';
                ctx.font = '50px Burbank Big Condensed'
                ctx.fillText(res.data.shopCategories[i].sectionName + ' | ' + res.data.shopCategories[i].quantity + ' Tab', (x + 400), (y + 80))
                ctx.font = '60px Burbank Big Condensed'
                ctx.fillText((i + 1), (x + 60), (y + 80))

                y += 120;
            }

            ctx.fillStyle = '#000000';
            ctx.textAlign='center';
            ctx.font = '50px Burbank Big Condensed'
            ctx.fillText("Applies at 3:00 AM", (x + 400), (y + 70))

            const sending = new Discord.MessageEmbed()
            .setColor('#BB00EE')
            .setTitle(`Sending the image please wait ... ${emoji}`)
            await msg.edit(sending)

            const att = new Discord.MessageAttachment(canvas.toBuffer('image/jpeg', {quality: 0.5}))
            await message.channel.send(att)

            const Sections = new Discord.MessageEmbed()
                Sections.setColor('#BB00EE')
                Sections.setTitle('Itemshop Sections')
                Sections.setDescription('All the itemshop sections from the API')
                for (let i = 0; i < res.data.shopCategories.length; i++){
                Sections.addFields(
                    {name: res.data.shopCategories[i].sectionName, value: res.data.shopCategories[i].quantity + ' | Tab', inline: true}
                    )   
                }
                Sections.setFooter('Generated By FNBR_MENA Bot')
                Sections.setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                msg.delete()
                message.reply(Sections);
            })
            .catch((err) => {
                console.log(err)
            })

        })
        .catch((err) => {
            console.log(err)
        })
    },
    
    requiredRoles: []
}