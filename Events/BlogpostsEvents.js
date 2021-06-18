const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)

    //result
    var response = []
    var number = 0
    var num = 1

    const Blogposts = async () => {

      //checking if the bot on or off
      admin.database().ref("ERA's").child("Events").child("blogposts").once('value', async function (data) {

        //store aceess
        var status = data.val().Active;
        var lang = data.val().Lang;
        var push = data.val().Push

        //if the event is set to be true [ON]
        if(status === "true"){

          //request data
          axios.get('https://fn-api.com/api/blogposts?lang='+lang)
          .then(async res => {

            //store the first time when the bot turns on
            if(number === 0){
              //response = res.data.data[num]
              number++
            }

            //compare diff
            if(JSON.stringify(res.data.data[num]) !== JSON.stringify(response)){

              //create embed
              const posts = new Discord.MessageEmbed()

              //set color
              posts.setColor('#BB00EE')

              //set title
              posts.setTitle(res.data.data[num].title)

              //set author
              if(lang === "en"){
                posts.setAuthor("Click Here",res.data.data[num].iconImage ,res.data.data[num].url)
              }else if(lang === "ar"){
                posts.setAuthor("اضغط هنا",res.data.data[num].iconImage ,res.data.data[num].url)
              }

              //add the image
              if(res.data.data[num].image !== undefined){
                posts.setImage(res.data.data[num].image)

              }else if(res.data.data[num].trendingImage !== undefined){
                posts.setImage(res.data.data[num].trendingImage)

              }else{
                posts.setImage(res.data.data[num].iconImage)
              }

              //set footer
              posts.setFooter("Fortnite")

              //send
              message.send(posts)
              response = await res.data.data[num]

            }
          }).catch(err => {
            console.log("The issue is in Blogposts Events ", err)
        })
        }
      })
    }
    setInterval(Blogposts, 1 * 60000)
}