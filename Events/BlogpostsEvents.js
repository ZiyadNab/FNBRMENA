const axios = require('axios')
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)
    //result
    var data = []
    var number = 0

    const Blogposts = async () => {
      axios.get('https://fn-api.com/api/blogposts')
      .then(async res => {
        if(number === 0){
          data = res.data.blogposts[0].title
          number ++
        }
        if(JSON.stringify(res.data.blogposts[0].title) !== JSON.stringify(data)){
          const posts = new Discord.MessageEmbed()
          posts.setColor('#BB00EE')
          posts.setTitle(res.data.blogposts[0].title)
          posts.setURL(res.data.blogposts[0].url)
          if(res.data.blogposts[0].image !== undefined){
            posts.setImage(res.data.blogposts[0].image)
          }else if(res.data.blogposts[0].iconImage !== undefined){
            posts.setImage(res.data.blogposts[0].iconImage)
          }
          message.send(posts)

          data = res.data.blogposts[0].title
        }
      })
    }
    setInterval(Blogposts, 1 * 30000)
}