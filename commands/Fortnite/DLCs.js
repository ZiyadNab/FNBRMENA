const axios = require('axios');

module.exports = {
    commands: 'dlc',
    expectedArgs: '<dlc>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, arguments, text, Discord) => {
        axios.get('https://fn-api.com/api/epicstore')
        .then((res) => {
            console.log(res.data.dlcs.dlc);
            for (let i = 0; i < res.data.dlcs.dlc.length; i++){
                const dlcs = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle('Active DLC')
                .setImage(res.data.dlcs.dlc[i].image.src)
                .setDescription(res.data.dlcs._type)
                .addFields(
                    {name: res.data.dlcs.dlc[i].title, value: res.data.dlcs.dlc[i].description}
                )
                .setFooter('Generated By FNBR_MENA Bot')
                .setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                message.reply(dlcs);
            }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    
    requiredRoles: []
}