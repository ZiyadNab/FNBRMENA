const error = require('../Errors')
const FortniteAPI = require("fortnite-api-com");
const config = {
  apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
  language: "en",
  debug: true
};
var f;

var Fortnite = new FortniteAPI(config);

module.exports = {
    commands: 'sac',
    expectedArgs: '[ Name of the SAC ]',
    minArgs: 1,
    maxArgs: 1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', function (data) {
            var lang = data.val().lang;

            Fortnite.CreatorCodeSearch(text)
                .then( async res => {
                    const info = new Discord.MessageEmbed()
                    info.setColor('#BB00EE')
                    var str
                    if(lang === "en"){
                        info.setTitle("Info about "+text+" SAC")
                        str = "• Name: "+res.data.account.name+"\n• ID: "+res.data.account.id+"\n• Code: "
                        +res.data.code+"\n• Status: "+res.data.status
                    }else if(lang === "ar"){
                        info.setTitle("معلومات عن كود "+text)
                        str = "• الآسم: "+res.data.account.name+"\n• الآيدي: "+res.data.account.id+"\n• الكود: "
                        +res.data.code+"\n• حالة الكود: "+res.data.status
                    }
                    info.setDescription(str)
                    message.channel.send(info)

                }).catch(err => {
                    console.log(err);
            });

        })
    },
    
    requiredRoles: []
}