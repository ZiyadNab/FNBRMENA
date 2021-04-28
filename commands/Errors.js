const things = require('../Coinfigs/config.json')

module.exports = async (err, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

  admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
    var lang = data.val().lang;
    const error = new Discord.MessageEmbed()
    error.setColor('#BB00EE')
    if(lang === "en"){
      error.setTitle("There was an error so we will trun this command off until it gets fixed :x:")
    }else if(lang === "ar"){
      error.setTitle("لقد حصلت مشكلة ما و تم اغلاق الامر حتى يتم اصلاحه :x:")
    }
    message.reply(error)
    const mess = client.channels.cache.find(channel => channel.id === things.channels.fnbrmena)
    const errorType = new Discord.MessageEmbed()
    errorType.setColor('#BB00EE')
    errorType.setTitle('An error occurred in command '+alias)
    errorType.addFields(
      {name: "By" ,value: message.author.username},
      {name: "Discriminator", value: message.author.discriminator},
      {name: "Content" ,value: message.content},
      {name: "Status" ,value: "OFF"},
      {name: "Reason" ,value: "An error has occurred in this command please try again when the comman i back to its functionality :x:"},
      {name: "Error" ,value: "`"+err.stack+"`"},
     )
    mess.send(errorType)
    admin.database().ref("ERA's").child("Commands").child(alias).child("Active").update({
      Status: "false",
      ReasonEN: "An error has occurred in this command please try again when the comman i back to its functionality :x:",
      ReasonAR: "تم ايقاف امر " + alias +" بسبب مشكلة معينة الرجاء المحاولة اخرى بعد اصلاح الامر :x:"
      })
    })
}