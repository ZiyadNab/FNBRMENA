const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)

    //result
    var orignalResponse = []
    var orignalNumber = 0
    var orignalNum = 0
    var compResponse = []
    var compNumber = 0
    var compNum = 0

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
            if(orignalNumber === 0){
              orignalResponse = await res.data.data.fortnite.posts[orignalNum].id
              orignalNumber++
            }

            if(push === "true"){
              orignalResponse = []
            }

            //compare diff
            if(JSON.stringify(res.data.data.fortnite.posts[orignalNum].id) !== JSON.stringify(orignalResponse)){

              //create embed
              const posts = new Discord.MessageEmbed()

              //set color
              posts.setColor('#00ffff')

              //set title
              posts.setTitle(res.data.data.fortnite.posts[orignalNum].title)

              //set author
              if(lang === "en"){
                posts.setAuthor("Click Here",res.data.data.fortnite.posts[orignalNum].images.image ,res.data.data.fortnite.posts[orignalNum].url)
              }else if(lang === "ar"){
                posts.setAuthor("اضغط هنا",res.data.data.fortnite.posts[orignalNum].images.image ,res.data.data.fortnite.posts[orignalNum].url)
              }

              //add the image
              if(res.data.data.fortnite.posts[orignalNum].images.share !== undefined || res.data.data.fortnite.posts[orignalNum].images.share !== null){
                posts.setImage(res.data.data.fortnite.posts[orignalNum].images.share)

              }else if(res.data.data.fortnite.posts[orignalNum].images.trending !== undefined || res.data.data.fortnite.posts[orignalNum].images.trending !== null){
                posts.setImage(res.data.data.fortnite.posts[orignalNum].trending)

              }else{
                posts.setImage(res.data.data.fortnite.posts[orignalNum].image)
              }

              //set footer
              if(res.data.data.fortnite.posts[orignalNum].author !== null){
                posts.setFooter(res.data.data.fortnite.posts[orignalNum].author)
              }

              //send
              message.send(posts)
              orignalResponse = await res.data.data.fortnite.posts[orignalNum].id

              //trun off push if enabled
              admin.database().ref("ERA's").child("Events").child("blogposts").update({
                Push: "false"
              })

            }

            //store the first time when the bot turns on
            if(compNumber === 0){
              compResponse = await res.data.data.competitive.posts[compNum].id
              compNumber++
            }

            if(push === "true"){
              compResponse = []
            }

            //compare diff
            if(JSON.stringify(res.data.data.competitive.posts[compNum].id) !== JSON.stringify(compResponse)){

              //create embed
              const posts = new Discord.MessageEmbed()

              //set color
              posts.setColor('#00ffff')

              //set title
              posts.setTitle(res.data.data.competitive.posts[compNum].title)

              //set author
              if(lang === "en"){
                posts.setAuthor("Click Here",res.data.data.competitive.posts[compNum].images.image ,res.data.data.competitive.posts[compNum].url)
              }else if(lang === "ar"){
                posts.setAuthor("اضغط هنا",res.data.data.competitive.posts[compNum].images.image ,res.data.data.competitive.posts[compNum].url)
              }

              //add the image
              if(res.data.data.competitive.posts[compNum].images.share !== undefined || res.data.data.competitive.posts[compNum].images.share !== null){
                posts.setImage(res.data.data.competitive.posts[compNum].images.share)

              }else if(res.data.data.competitive.posts[compNum].images.trending !== undefined || res.data.data.competitive.posts[compNum].images.trending !== null){
                posts.setImage(res.data.data.competitive.posts[compNum].trending)

              }else{
                posts.setImage(res.data.data.competitive.posts[compNum].image)
              }

              //set footer
              if(res.data.data.competitive.posts[compNum].author !== null){
                posts.setFooter(res.data.data.competitive.posts[compNum].author)
              }

              //send
              message.send(posts)
              compResponse = await res.data.data.competitive.posts[compNum].id
            }
          }).catch(err => {
            console.log("The issue is in Blogposts Events ", err)
        })
        }
      })
    }
    setInterval(Blogposts, 2 * 60000)
}