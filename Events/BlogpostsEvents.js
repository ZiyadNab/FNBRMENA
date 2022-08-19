const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Configs/config.json')
const ytdl = require("ytdl-core")

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)

    //result
    var blogs = []
    var response = []
    var number = 0

    //handle the blogs
    const Blogposts = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("blogposts").once('value', async function (data) {
            const status = data.val().Active;
            const lang = data.val().Lang;
            const push = data.val().Push

            //if the event is set to be true [ON]
            if(status){

                //request data
                axios.get(`https://www.epicgames.com/fortnite/api/blog/getPosts?category=&postsPerPage=0&offset=0&rootPageSlug=blog&locale=${lang}`)
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
                    if(push.Status){
                        if(push.pushType.toLowerCase() === "index") blogs[push.Index] = []
                        else{

                            //remove a slug from blogs array
                            blogs.splice(blogs.findIndex(slugIDs => {
                                return slugIDs === push.Slug
                            }), 1)
                        }
                    }

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
                                var newBlog
                                await res.data.blogList.filter(blog => {
                                    if(blog.slug === response[i]) newBlog = blog
                                })

                                //create embed
                                const blogEmbed = new Discord.EmbedBuilder()
                                blogEmbed.setColor(FNBRMENA.Colors("embed"))

                                //set title
                                blogEmbed.setTitle(newBlog.title)
                                blogEmbed.setThumbnail(newBlog.image)

                                //seting up the description
                                if(newBlog._metaTags !== undefined) {

                                    //add description variable
                                    var description = newBlog._metaTags
                                    description = description.replace(description.substring(0, description.indexOf("<meta name=\"description\" content=\"")), "")
                                    description = description.replace('<meta name="description" content="', "")
                                    description = description.substring(0, description.indexOf("\">"))
                                    blogEmbed.setDescription(`${description}`)
                                    
                                }else if(lang === "en") blogEmbed.setDescription(`No description.`)
                                else if(lang === "ar") blogEmbed.setDescription(`لا يوجد وصف.`)

                                //moment language
                                moment.locale(lang)

                                //creating a row
                                const row = new Discord.ActionRowBuilder()

                                //creating button
                                if(lang === "en") row.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("Blogpost Link")
                                    .setURL(`https://www.epicgames.com/fortnite${newBlog.urlPattern}`)
                                )

                                //creating button
                                else if(lang === "ar") row.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("رابط المدونة")
                                    .setURL(`https://www.epicgames.com/fortnite${newBlog.urlPattern}`)
                                )

                                //set image
                                if(newBlog.shareImage !== undefined) blogEmbed.setImage(newBlog.shareImage)
                                else if(newBlog.trendingImage !== undefined) blogEmbed.setImage(newBlog.trendingImage)
                                else blogEmbed.setImage("https://i.imgur.com/Dg7jrFV.jpeg")

                                //set author
                                if(lang === "en") blogEmbed.setFooter({text: `${newBlog.author} | ${moment(newBlog.date).format("dddd, MMMM Do of YYYY")}`})
                                else if(lang === "ar") blogEmbed.setFooter({text: `${newBlog.author} | ${moment(newBlog.date).format("dddd, MMMM Do من YYYY")}`})

                                //send the message
                                message.send({embeds: [blogEmbed], components: [row]})
                                
                            }
                        }

                        //store the new data
                        for(let i = 0; i < res.data.blogList.length; i++){
                            blogs[i] = await res.data.blogList[i].slug
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("blogposts").child("Push").update({
                            Status: false
                        })

                    }
                
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'blogposts')
        
                })
            }
        })
    }
    setInterval(Blogposts, 1 * 20000)
}