const wrap = require('word-wrap')
const Canvas = require('canvas')

module.exports = {
    commands: 'playlist',
    type: 'Fortnite',
    descriptionEN: 'Use this command to extract an image for any playlist of your choice with the playlist data',
    descriptionAR: 'أستخدم الأمر لأستخراج صورةلأي طور باللعبة مع معلومات الطور',
    expectedArgsEN: 'Use this command then type playlist name.',
    expectedArgsAR: 'أستعمل الأمر ثم اكتب أسم الطور.',
    argsExample: ['Solo', 'Pro 100'],
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        //register fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic', weight: "700", style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "bold"})

        //applytext
        const applyText = (canvas, text, font, width, type) => {
            const ctx = canvas.getContext('2d');
            let fontSize = font;
            do {
                if(userData.lang === "en" && type === 'title') ctx.font = `${fontSize -= 1}px Burbank Big Condensed`
                else if(userData.lang === "en" && type === 'description') ctx.font = `${fontSize -= 1}px Arial`
                else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`
            } while (ctx.measureText(text).width > width)
            return ctx.font;
        }

        FNBRMENA.Playlist(userData.lang)
        .then(async res => {
            var playlistData = await res.data.modes.filter(found => {
                if(text.includes("_")) if(`playlist_${found.id}`.toLowerCase() === text.toLowerCase()) return found.id
            }), playlistData = playlistData[0]

            //checking if there is a response found!
            if(playlistData){

                const canvas = Canvas.createCanvas(1400, 3000) //creating a canvas
                const ctx = canvas.getContext('2d') //ctx context

                //add the background
                const background = await Canvas.loadImage('./assets/Playlists/bg.png')
                ctx.drawImage(background, 0, 0 , canvas.width, canvas.height)

                const playlistImage = await Canvas.loadImage(playlistData.image)
                ctx.drawImage(playlistImage, 0, 0 , canvas.width, canvas.height) //adding the playlist image to the canvas

                //sending the image
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `Playlist_${playlistData.id}.png`})
                await message.reply({files: [att]})
            }

        })
    }
}