const axios = require('axios')
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)
    //result
    var data = []
    var number = 0
    var lang = "ar"

    const Blogposts = async () => {

      //checking if the bot on or off
      admin.database().ref("ERA's").child("Events").child("blogposts").once('value', async function (data) {
        var status = data.val().Active;
        if(status === "true"){
          axios.get('https://www.epicgames.com/fortnite/api/blog/getPosts?category=&postsPerPage=0&offset=0&rootPageSlug=blog&locale='+lang)
          .then(async res => {
            if(number === 0){
              data = res.data.blogList[0].title
              number ++
            }
            if(JSON.stringify(res.data.blogList[0].title) !== JSON.stringify(data)){
              const posts = new Discord.MessageEmbed()
              posts.setColor('#BB00EE')
              posts.setTitle(res.data.blogList[0].title)
              posts.setURL("https://www.epicgames.com/fortnite" + res.data.blogList[0].urlPattern)
              if(res.data.blogList[0].shareImage !== undefined){
                posts.setImage(res.data.blogList[0].shareImage)
              }else if(res.data.blogList[0].image !== undefined){
                posts.setImage(res.data.blogList[0].image)
              }else if(res.data.blogList[0].trendingImage !== undefined){
                posts.setImage(res.data.blogList[0].trendingImage)
              }
              posts.setFooter(res.data.blogList[0].author)
              message.send(posts)

              data = res.data.blogList[0].title
            }
          })
        }
      })
    }
    setInterval(Blogposts, 1 * 3000)
}