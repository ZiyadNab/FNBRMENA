const axios = require('axios')
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)
    //result
    var data = []
    var number = 0
    var lang = "ar"

    const Comp = async () => {
      axios.get('https://www.epicgames.com/fortnite/competitive/api/blog/getPosts?category=&postsPerPage=0&offset=0&rootPageSlug=news&locale='+lang)
      .then(async res => {
        if(number === 0){
          data = res.data.blogList[0]
          number++
        }
        if(JSON.stringify(res.data.blogList[0].title) !== JSON.stringify(data)){
          const comp = new Discord.MessageEmbed()
          comp.setColor('#BB00EE')
          if(res.data.blogList[0].title.includes("<br />")){
            var title = res.data.blogList[0].title.replace("<br />",'')
            comp.setTitle(title)
          }else{
            comp.setTitle(res.data.blogList[0].title)
          }
          comp.setURL("https://www.epicgames.com/fortnite/competitive" + res.data.blogList[0].urlPattern)
          if(res.data.blogList[0].trendingImage !== undefined){
            comp.setImage(res.data.blogList[0].trendingImage)
          }else if(res.data.blogList[0].image !== undefined){
            comp.setImage(res.data.blogList[0].image)
          }
          comp.setFooter(res.data.blogList[0].author)
          message.send(comp)

          data = res.data.blogList[0].title
        }
      })
    }
    setInterval(Comp, 1 * 3000)
}