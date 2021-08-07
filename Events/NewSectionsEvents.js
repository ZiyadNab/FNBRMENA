const Discord = require('discord.js')
const key = require('../Coinfigs/config.json');
const axios = require("axios");

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Section)

    //result
    var lastModified = ""
    var response = []
    var sections = []
    var number = 0
    var counter = 0

    const Sections = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("newsections").once('value', async function (data) {

            //store the data
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().Push.Status

            //if the event is set to be true [ON]
            if(status === true){

                //request data
                axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=${lang}`)
                .then(async res => {

                    //constant to make woring easy
                    var sections = await res.data.shopSections.sectionList.sections

                    if(number === 0){

                        //store data
                        lastModified = await res.data.shopSections.lastModified
                        for(let i = 0; i < sections.length; i++){
                            response[i] = await sections[i]
                        }

                        //add sets names
                        number++
                    }

                    //if push was enabled
                    if(push){

                        //remove data
                        lastModified = ""
                        for(let i = 0; i < data.val().Push.Number; i++){
                            response[i] = null
                        }
                    }
                
                    //check data
                    if(res.data.shopSections.lastModified !== lastModified){

                        //defin added string
                        if(lang === "en") var stringAdded = "New sections just got added\n\n"
                        else if(lang === "ar") var stringAdded = "تم اضافة اقسام جديدة\n\n"

                        //defin removed string
                        if(lang === "en") var stringRemoved = "Sections that just got removed\n\n"
                        else if(lang === "ar") var stringRemoved = "اقسام تم حذفها\n\n"

                        //added
                        var added = []
                        counter = 0
                        for(let i = 0; i < sections.length; i++){

                            //if the section at index i is new
                            if(!response.includes(sections[i]) && sections[i] !== undefined && sections[i] !== null){

                                //add the new sections to added array
                                added[counter] = await sections[i]
                                counter++
                            }
                        }

                        //removed
                        var removed = []
                        counter = 0
                        for(let i = 0; i < response.length; i++){

                            //if the section at index i is removed
                            if(!sections.includes(response[i]) && response[i] !== undefined && response[i] !== null){

                                //add the removed sections to removed array
                                removed[counter] = await response[i]
                                counter++
                            }
                        }

                        //print all the added sections
                        const printSections = async (Sections, String) => {

                            //get the section tabs and add them to a string
                            while(Sections.length !== 0){

                                //defined tabs and i index
                                var tabs = 0
                                var i = 0
                                
                                //see what is the index 0 is and how many tabs for the same section
                                const firstIndex = await Sections[0]

                                //loop throw all of the modified section
                                while(i !== Sections.length){

                                    //if there is another tab for the section at index 0
                                    if(firstIndex.sectionDisplayName === Sections[i].sectionDisplayName){

                                        //remove the section from the section array
                                        const index = Sections.indexOf(Sections[i])
                                        if(index > -1) Sections.splice(index, 1)

                                        //add new tab
                                        tabs++

                                    } else i++
                                }

                                //add the tabs string
                                if(firstIndex.sectionDisplayName !== undefined){

                                    if(lang === "en") String += `${firstIndex.sectionDisplayName} | ${tabs} Tabs\n`
                                    else if(lang === "ar") String += `${firstIndex.sectionDisplayName} | ${tabs} صفحة\n`
                                }else{
                                    
                                    if(lang === "en") String += `${firstIndex.sectionId} | ${tabs} Tabs\n`
                                    else if(lang === "ar") String += `${firstIndex.sectionId} | ${tabs} صفحة\n`
                                }
                            }
                                
                            //create an embed for just added sections
                            const addedEmbed = new Discord.MessageEmbed()

                            //set the color
                            addedEmbed.setColor('#00ffff')

                            //set the description
                            addedEmbed.setDescription(String)

                            //send the new sections
                            message.send(addedEmbed)
                        }

                        //if there is a new sections
                        if(added.length > 0) await printSections(added, stringAdded)
                        if(removed.length > 0) await printSections(removed, stringRemoved)

                        //store data
                        lastModified = await res.data.shopSections.lastModified
                        for(let i = 0; i < sections.length; i++){
                            response[i] = await sections[i]
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("newsections").child("Push").update({
                            Status: false
                        })

                    }
                    
                }).catch(err => {
                    console.log("The issue is in New Sections Events ", err)
                })
            }
        })
    }
    setInterval(Sections, 1 * 20000)
}