const axios = require('axios')
const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()

module.exports = {
    commands: 'replay',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data using the given session id
        FNBRMENA.Replays(text)
        .then(async res => {

            //if there is a data found
            if(res.data.result){

                //request the file
                await axios.get(res.data.data.chunks[0].link, { headers: {'Content-Type': 'application/json','Authorization': FNBRMENA.APIKeys("FortniteAPI.io"),} })
                .then(async downloadFile => {

                    //send attatchment
                    const att = await new Discord.MessageAttachment(downloadFile.data, `${res.data.data.chunks[0].Id}.replay`)

                    //send the emote video
                    await message.channel.send(downloadFile.data)

                })

            }else{

                //no session has been found
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No session has been found check your session id and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على جلسة الرجاء التأكد من كتابة معرف الجلسة بشكل صحيح ${errorEmoji}`)
                message.channel.send(Err)
            }
        })
    }
}