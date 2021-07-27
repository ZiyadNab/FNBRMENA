const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)

    //result
    var blogs = []
    var response = []
    var number = 0

    //handle the blogs
    const CompBlogposts = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("compblogposts").once('value', async function (data) {

            //store aceess
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === true){

                //request data
                axios.get(`https://www.epicgames.com/fortnite/competitive/api/blog/getPosts?category=&postsPerPage=0&offset=0&rootPageSlug=news&locale=${lang}`)
                .then(async res => {

                    //storing the first start up
                    if(number === 0){

                        //storing
                        for(let i = 0; i < res.data.blogList.length; i++){
                            blogs[i] = await res.data.blogList[i].slug
                        }

                        //stop from storing again
                        number++
                    }

                    //if push is enabled
                    if(push === true) blogs[0] = []

                    //storing the new blog to compare
                    for(let i = 0; i < res.data.blogList.length; i++){
                        response[i] = await res.data.blogList[i].slug
                    }

                    //check if there is a new blog
                    if(JSON.stringify(response) !== JSON.stringify(blogs)){

                        //new blog has been registerd lets find it
                        for(let i = 0; i < response.length; i++){
                            
                            //compare if its the index i includes or not
                            if(!blogs.includes(response[i])){

                                //filtering to get the new blog
                                var newBlog = await res.data.blogList.filter(blog => {
                                    return blog.slug === response[i]
                                })

                                //create embed
                                const blogEmbed = new Discord.MessageEmbed()

                                //set the color
                                blogEmbed.setColor("#00ffff")

                                //set title
                                blogEmbed.setAuthor(newBlog[0].title, newBlog[0].image)

                                //seting up the description
                                if(newBlog[0].shareDescription !== "" && newBlog[0].shareDescription !== undefined) blogEmbed.setDescription(newBlog[0].shareDescription)
                                else if(newBlog[0]._metaTags !== undefined) {

                                    //add description variable
                                    var description = await newBlog[0]._metaTags
                                    description = await description.replace(description.substring(0, description.indexOf("<meta name=\"description\" content=\"")), "")
                                    description = await description.replace('<meta name="description" content="', "")
                                    description = await description.substring(0, description.indexOf("\">"))
                                    blogEmbed.setDescription(description)
                                    
                                }else if(lang === "en") blogEmbed.setDescription("No description.")
                                else if(lang === "ar") blogEmbed.setDescription("لا يوجد وصف.")

                                //moment language
                                moment.locale(lang)

                                //add fields
                                if(lang === "en"){
                                    blogEmbed.addFields(
                                        {name: "Date:", value: moment(newBlog[0].date).format("dddd, MMMM Do of YYYY")},
                                        {name: "Link:", value: `https://www.epicgames.com/fortnite/competitive${newBlog[0].urlPattern}`},
                                    )
                                }else if(lang === "ar"){
                                    blogEmbed.addFields(
                                        {name: "التاريخ:", value: moment(newBlog[0].date).format("dddd, MMMM Do من YYYY")},
                                        {name: "الرابط:", value: `https://www.epicgames.com/fortnite/competitive${newBlog[0].urlPattern}`},
                                    )
                                }

                                //set image
                                if(newBlog[0].shareImage !== undefined) blogEmbed.setImage(newBlog[0].shareImage)
                                else if(newBlog[0].trendingImage !== undefined) blogEmbed.setImage(newBlog[0].trendingImage)
                                else if(newBlog[0].image !== undefined) blogEmbed.setImage(newBlog[0].image)
                                else blogEmbed.setImage("https://i.imgur.com/Dg7jrFV.jpeg")

                                //set author
                                blogEmbed.setFooter(newBlog[0].author)

                                //send the message
                                message.send(blogEmbed)
                                
                            }
                        }

                        //store the new data
                        for(let i = 0; i < res.data.blogList.length; i++){
                            blogs[i] = await res.data.blogList[i].slug
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("compblogposts").update({
                            Push: false
                        })

                    }
                
                }).catch(err => {
                    console.log("The issue is in Blogposts Events ", err)
                })
            }
        })
    }
    setInterval(CompBlogposts, 1 * 20000)
}