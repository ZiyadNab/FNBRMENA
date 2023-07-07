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
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {
        
        // Register fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic', weight: "700", style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {family: 'Burbank Big Condensed', weight: "700", style: "bold"})

        // Request data
        FNBRMENA.Playlist(userData.lang, text)
        .then(async res => {
            console.log(res)

        })
    }
}