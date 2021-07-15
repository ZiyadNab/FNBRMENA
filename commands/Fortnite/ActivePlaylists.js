const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const Canvas = require('canvas');

module.exports = {
    commands: 'activeplaylists',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {
        
        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //request data
        FNBRMENA.ActivePlayLists(lang)
        .then(async res => {

            //seprate the modes inisilization
            var Top = []
            var Middle = []
            var Bottom = []

            //index
            var TopIndex = 0
            var MiddleIndex = 0
            var BottomIndex = 0

            //loop throw every active playlists
            for(let i = 0; i < res.data.modes.length; i++){

                //if the playlist is an BR mode
                if(res.data.modes[i].category === 0)
                Top[TopIndex] = await res.data.modes[i]; TopIndex++

                //if the playlist is an BRLTM mode
                if(res.data.modes[i].category === 1)
                Middle[MiddleIndex] = await res.data.modes[i]; MiddleIndex++

                //if the playlist is an Creative mode
                if(res.data.modes[i].category === 2)
                Bottom[BottomIndex] = await res.data.modes[i]; BottomIndex++
                
            }

            //creating width
            var width = 0

            //see whats is bigger the Top, Middle or Bottom
            if(Top.length > Middle.length && Top.length > Bottom.length){

                //Top
                if(Top.length < 5) width = (1024 * Top.length) + 1024
                else width = (512 * Top.length) + 1024

            }

            if(Middle.length > Top.length && Middle.length > Bottom.length){

                //Middle
                if(Middle.length < 5) width = (1024 * Middle.length) + 1024
                else width = (512 * Middle.length) + 1024
                
            }

            if(Bottom.length > Top.length && Bottom.length > Middle.length){

                //Top
                if(Bottom.length < 5) width = (1024 * Bottom.length) + 1024
                else width = (512 * Bottom.length) + 1024
                
            }

            //creating height
            var height = 3060

            //inilizing x, y
            var x = 0
            var y = 512

            //register fonts
            Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
            Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.otf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

            //canvas
            const canvas = Canvas.createCanvas(width, height)
            const ctx = canvas.getContext('2d')

            //background
            const background = await Canvas.loadImage('./assets/Itemshop/background.png')
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

            //add the top playlists
            if(Top.length > 5) x = ((Top.length * 512) - width) / 2
            else x = ((Top.length * 1024) - width) / 2

            //loop throw every top mode
            for(let i = 0; i < Top.length; i++){

                //512 image
                if(Top.length > 5){

                    //add the playlist index i
                    const playlist = await Canvas.loadImage(Top[i].image)
                    ctx.drawImage(playlist, x, y, 512, 512)

                    x += 512 + 100
                }
            }

            //send the img
            const att = new Discord.MessageAttachment(canvas.toBuffer(), 'playlists.png')
            await message.channel.send(att)
            
        })
    }
}