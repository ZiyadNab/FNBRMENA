const lang = require('../../Coinfigs/User.json')

module.exports = {
    commands: 'commands',
    expectedArgs: '<commands>',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, arguments, text, Discord, client, admin) => {
        
        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;
            if(lang === "en"){
                const commandsEN = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle('Commands')
                .addFields(
                    {name: '-Help', value: 'If you neeed help simply just ask'},
                    {name: '-Social', value: 'You can get all my Social Medial Accounts'},
                    {name: '-AES', value: 'Get the current AES of the update'},
                    {name: '-Server', value: 'Get the current status of the server'},
                    {name: '-Battlepass', value: 'Get the battlepass items as a picture'},
                    {name: '-Notice', value: 'Get the current issues in the game'},
                    {name: '-DLC', value: 'Get the current DLCs in the game'},
                    {name: '-Map', value: 'Generate a picture of the current map'},
                    {name: '-Playlists', value: 'You can see what playlist is active In-Game right now'},
                    {name: '-Section', value: 'You can see what are the itemshop sections'},
                    {name: '-Progress', value: 'You can see how many days left until this season ends'},
                    {name: '-Stats', value: 'Get any user info of all or any platform'},
                    {name: '-New', value: 'You can generate a leaked cosmetic list image'},
                    {name: '-Itemshop', value: 'You can generate a picture of the current itemshop'},
                    {name: '-SAC', value: 'Return a Support a Creator code informaitions'},
                    {name: '-PAK', value: 'Get every cosmetic in a single pak file'},
                    {name: '-Search', value: 'You can search whatever cosmetic you want'},
                    {name: '-Upcoming', value: 'Return a picture of every unrealesed item'},
                    {name: '-News', value: 'You can see what news is active In-Game right now'},
                )
                .setDescription('Here is all the current commands enjoy (=')
                .setFooter('Generated By FNBR_MENA Bot')
                .setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                message.reply(commandsEN);
            } 
            
            if(lang === "ar"){
                const commandsEN = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle('Commands')
                .addFields(
                    {name: 'امر [ Help- ]:', value: 'اذا تحتاج مساعدة فقط اطلب من الدعم'},
                    {name: 'امر [ Social- ]:', value: 'تقدر تحصل على جميع روابط التواصل الاجتمعي حقتي'},
                    {name: 'امر [ AES- ]:', value: 'احصل على مفتاح الـ AES الخاص بالتحديث الحالي'},
                    {name: 'امر [ Server- ]:', value: 'احصل على حالة السيرفر'},
                    {name: 'امر [ Battlepass- ]:', value: 'احصل على صورة الباتل باس كاملة'},
                    {name: 'امر [ Notice- ]:', value: 'احصل على جميع العناصر المعطله باللعبة الان'},
                    {name: 'امر [ DLC- ]:', value: 'احصل على جميع عناصر الستور'},
                    {name: 'امر [ Map- ]:', value: 'انشاء صورة للماب'},
                    {name: 'امر [ Playlists- ]:', value: 'يمكنك رؤية جميع الاطوار المفعله باللعبة الان'},
                    {name: 'امر [ Section- ]:', value: 'احصل على عناصر الشوب'},
                    {name: 'امر [ Stats- ]:', value: 'احصل على جميع معلومات اي حساب في اي منصه'},
                    {name: 'امر [ Progress- ]:', value: 'احصل على معلومات السيزون'},
                    {name: 'امر [ New- ]:', value: 'احصل على جميل العناصر المسربة'},
                    {name: 'امر [ Itemshop- ]:', value: 'احصل على صورة الايتم شوب'},
                    {name: 'امر [ SAC- ]', value: 'استخرج معلومات اي كود ايتم شوب'},
                    {name: 'امر [ PAK- ]', value: 'استخرج جميع العناصر في PAK معين'},
                    {name: 'امر [ Search- ]', value: 'ابحث عن اي عنصر باللعبة'},
                    {name: 'امر [ Upcoming- ]', value: 'يستخرج لك البوت صورة بجميع العناصر الي للان ما نزلت'},
                    {name: 'امر [ News- ]', value: 'تقدر تحصل على الاخبار المتاحه باللعبة الان'},
                )
                .setDescription('هنا تقدر تحصل جميع اوامر البوت استمتع (=')
                .setFooter('Generated By FNBR_MENA Bot')
                .setAuthor('FNBR_MENA Bot', 'https://i.imgur.com/LfotEkZ.jpg', 'https://twitter.com/FNBR_MENA')
                message.reply(commandsEN);
                
            }
        })

    },
    
    requiredRoles: []
}