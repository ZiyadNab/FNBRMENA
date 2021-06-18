const axios = require('axios')
const Discord = require('discord.js')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)
    //result
    var response = []
    var number = 0

    const Comp = async () => {

      //checking if the bot on or off
      admin.database().ref("ERA's").child("Events").child("blogposts").once('value', async function (data) {

        //store aceess
        var status = data.val().Active;
        var lang = data.val().Lang;
        var push = data.val().Push

        //if the event is set to be true [ON]
        if(status === "true"){

          //request data
          axios.get('https://www.epicgames.com/fortnite/competitive/api/blog/getPosts?category=&postsPerPage=0&offset=0&rootPageSlug=news&locale='+lang)
          .then(async res => {
            
            //store the first time when the bot turns on
            if(number === 0){
              for(let i = 0; i < res.data.blogList.length; i++){
                response[i] = res.data.blogList[i]
              }
              number++
            }

            //compare diff
            if(JSON.stringify(res.data.blogList) !== JSON.stringify(response)){

              for(let i = 0; i < res.data.blogList.length; i++){
                
                //finding the new blog
                if(!response.includes(res.data.blogList[i])){

                  //create embed
                  const posts = new Discord.MessageEmbed()

                  //set color
                  posts.setColor('#BB00EE')

                  //set title
                  posts.setTitle(res.data.blogList[i].title.replace("\">",''))

                  //description custom
                  if(res.data.blogList[i]._metaTags !== undefined){

                    //add description via metaTags
                    var description = res.data.blogList[i]._metaTags

                    //cut the string
                    description = description.substring(description.indexOf("content=\""), description.indexOf("\">"))

                    //remone content="
                    description = description.replace('content="', '')

                    //spliting to remove html things
                    var array = description.split(" ")
                    for(let i = 0; i < array.length; i++){
                      if(await array[i].includes("&nbsp;")){
                        description = description.replace("&nbsp;", ' ')
                      }
                    }

                  }else{

                    //add no description
                    if(lang === "en"){
                      var description = "No description!"
                    }else if(lang === "ar"){
                      var description = "لا يوجد وصف!"
                    }
                  }

                  //check the language
                  if(lang === "en"){

                    //add fields
                    posts.addFields(
                      {name: "Description", value: description},
                      {name: "Link", value: "https://www.epicgames.com/fortnite/competitive" + res.data.blogList[0].urlPattern}
                    )
                  }else if(lang === "ar"){

                    //add fields in ar
                    posts.addFields(
                      {name: "**الوصف**", value: description},
                      {name: "**الرابط**", value: "https://www.epicgames.com/fortnite/competitive" + res.data.blogList[0].urlPattern}
                    )
                  }
                  

                  //add the image
                  if(res.data.blogList[i].shareImage !== undefined){
                    posts.setImage(res.data.blogList[i].shareImage)
                  }else if(res.data.blogList[i].trendingImage !== undefined){
                    posts.setImage(res.data.blogList[i].trendingImage)
                  }else if(res.data.blogList[i].image !== undefined){
                    posts.setImage(res.data.blogList[i].image)
                  }

                  //add the thumbnail
                  posts.setThumbnail(res.data.blogList[i].image)

                  //set footer
                  posts.setFooter(res.data.blogList[i].author)

                  //send
                  message.send(posts)
                  
                }

                //storing
                response[i] = res.data.blogList[i]
              }
            }

          }).catch(err => {
            console.log("The issue is in Comp Blog Events ", err)
        })
        }
      })
    }
    setInterval(Comp, 1 * 3000)
}