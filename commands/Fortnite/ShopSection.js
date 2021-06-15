const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const axios = require('axios');
const Canvas = require('canvas')

module.exports = {
    commands: 'section',
    expectedArgs: '<Section>',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")
        
        //request data
        axios.get('https://fn-api.com/api/shop/sections?lang=' + lang)
        .then(async (res) => {

            //create embed
            const Sections = new Discord.MessageEmbed()

            //add the color
            Sections.setColor('#BB00EE')

            //add title
            if(lang === "en"){
                Sections.setTitle('Itemshop Sections')
                Sections.setDescription('All the itemshop sections from the API')
            }else if(lang === "ar"){
                Sections.setTitle('عناصر الشوب')
                Sections.setDescription('جميع عناصر الشوب من الـ API')
            }
            
            for (let i = 0; i < res.data.data.sections.length; i++) {
                
                //add fields
                if(lang === "en"){
                    Sections.addFields({
                        name: res.data.data.sections[i].name,
                        value: res.data.data.sections[i].quantity + ' | Tab',
                    })
                }else if(lang === "ar"){
                    Sections.addFields({
                        name: res.data.data.sections[i].name,
                        value: res.data.data.sections[i].quantity + ' | صفحه',
                    })
                }

            }

            message.channel.send(Sections)
        })
        .catch((err) => {
            console.log(err)
        })
    },
}