const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Blogposts)

    //result
    var blogs = []
    var response = []
    var number = 0

    //handle the blogs
    const CompBlogposts = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("compblogposts").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push

            //if the event is set to be true [ON]
            if(status){

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
                    if(true) blogs[3] = []

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
                                blogEmbed.setColor("#00ffff")

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
                                const row = new Discord.MessageActionRow()

                                //creating button
                                if(lang === "en") row.addComponents(
                                    new Discord.EmbedBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("Blogpost Link")
                                    .setURL(`https://www.epicgames.com/fortnite/competitive${newBlog.urlPattern}`)
                                )

                                //creating button
                                else if(lang === "ar") row.addComponents(
                                    new Discord.EmbedBuilder()
                                    .setStyle(Discord.ButtonStyle.Link)
                                    .setLabel("رابط المدونة")
                                    .setURL(`https://www.epicgames.com/fortnite/competitive${newBlog.urlPattern}`)
                                )

                                //gather blog lings
                                if(newBlog.content.includes("<div class=\"embed-responsive")){

                                    // a yt video
                                    if(newBlog.content.includes("https://www.youtube.com/embed/")){
                                        var links = []
                                        var linksIndex = 0
                                        var contentYoutubeLinksFinder = newBlog.content
                                        while(contentYoutubeLinksFinder.includes("https://www.youtube.com/embed/")){

                                            contentYoutubeLinksFinder = contentYoutubeLinksFinder.replace(contentYoutubeLinksFinder.substring(0, contentYoutubeLinksFinder.indexOf('https://www.youtube.com/embed/')), "")
                                            links[linksIndex++] = contentYoutubeLinksFinder.substring(0, contentYoutubeLinksFinder.indexOf('"'))
                                            contentYoutubeLinksFinder = contentYoutubeLinksFinder.replace(contentYoutubeLinksFinder.substring(0, contentYoutubeLinksFinder.indexOf('"')), "")
                                        }

                                        //loop through all gathered links
                                        for(let i = 0; i < links.length; i++){
                                            await ytdl.getInfo(links[i])
                                            .then(async info => {
                                                row.addComponents(
                                                    new Discord.EmbedBuilder()
                                                    .setStyle(Discord.ButtonStyle.Link)
                                                    .setLabel(info.videoDetails.title)
                                                    .setURL(links[i])
                                                )
                                            })
                                        }
                                    }

                                    // an epicgames video
                                    if(newBlog.content.includes(".mp4")){
                                        var videoLinkFinder = newBlog.content
                                        videoLinkFinder = videoLinkFinder.substring(0, videoLinkFinder.indexOf('.mp4') + 4)
                                        videoLinkFinder = videoLinkFinder.replace(videoLinkFinder.substring(0, videoLinkFinder.lastIndexOf('https:')), "")
                                        if(lang === "en") row.addComponents(
                                            new Discord.EmbedBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("Video")
                                            .setURL(videoLinkFinder)
                                        ) 
                                        else if(lang === "ar") row.addComponents(
                                            new Discord.EmbedBuilder()
                                            .setStyle(Discord.ButtonStyle.Link)
                                            .setLabel("فيديو")
                                            .setURL(videoLinkFinder)
                                        )
                                    }
                                }

                                //set image
                                if(newBlog.shareImage !== undefined) blogEmbed.setImage(newBlog.shareImage)
                                else if(newBlog.trendingImage !== undefined) blogEmbed.setImage(newBlog.trendingImage)
                                else blogEmbed.setImage("https://i.imgur.com/Dg7jrFV.jpeg")

                                //set author
                                if(lang === "en") blogEmbed.setFooter(`${newBlog.author} | ${moment(newBlog.date).format("dddd, MMMM Do of YYYY")}`)
                                else if(lang === "ar") blogEmbed.setFooter(`${newBlog.author} | ${moment(newBlog.date).format("dddd, MMMM Do من YYYY")}`)

                                //send the message
                                message.send({embeds: [blogEmbed], components: [row]})
                                
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
                
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'blogposts (comp)')
        
                })
            }
        })
    }
    setInterval(CompBlogposts, 1 * 20000)
}