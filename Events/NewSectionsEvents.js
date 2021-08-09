const Discord = require('discord.js')
const key = require('../Coinfigs/config.json');
const axios = require("axios");

module.exports = (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Section)

    //result
    var response = []
    var sections = []
    var number = 0
    var counter = 0

    const Sections = async () => {

        //checking if the bot on or off
        await admin.database().ref("ERA's").child("Events").child("newsections").once('value', async function (data) {

            //store the data
            var status = data.val().Active
            var lang = data.val().Lang
            var push = data.val().Push.Status
            var type = data.val().Push.Type

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    if(number === 0){

                        //store data
                        for(let i = 0; i < res.data.shopSections.sectionList.sections.length; i++){
                            response[i] = await res.data.shopSections.sectionList.sections[i].sectionId
                        }

                        //add sets names
                        number++
                    }

                    //up to date sections data
                    for(let i = 0; i < res.data.shopSections.sectionList.sections.length; i++){
                        sections[i] = await res.data.shopSections.sectionList.sections[i].sectionId
                    }

                    //if push was enabled
                    if(push && type.toLowerCase() === "removed"){

                        //remove data
                        lastModified = ""
                        for(let i = 0; i < data.val().Push.Number; i++){
                            await sections.shift()
                        }
                        
                    }else if(push && type.toLowerCase() === "added"){

                        //remove data
                        lastModified = ""
                        for(let i = 0; i < data.val().Push.Number; i++){
                            await response.shift()
                        }
                    }
                
                    //check data
                    if(JSON.stringify(sections) !== JSON.stringify(response)){

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
                            if(!response.includes(sections[i])){

                                //add the new sections to added array
                                for(let x = 0; x < res.data.shopSections.sectionList.sections.length; x++){

                                    //catch the searched sectionId
                                    if(res.data.shopSections.sectionList.sections[i].sectionId === sections[i])
                                    added[counter] = await res.data.shopSections.sectionList.sections[i]
                                }

                                //change the index
                                counter++
                            }
                        }

                        //removed
                        var removed = []
                        counter = 0
                        for(let i = 0; i < response.length; i++){

                            //if the section at index i is removed
                            if(!sections.includes(response[i])){

                                //add the removed sections to removed array
                                for(let x = 0; x < res.data.shopSections.sectionList.sections.length; x++){

                                    //catch the searched sectionId
                                    if(res.data.shopSections.sectionList.sections[i].sectionId === response[i])
                                    removed[counter] = await res.data.shopSections.sectionList.sections[i]
                                }

                                //change the index
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
                            addedEmbed.setColor(FNBRMENA.Colors("embed"))

                            //set the description
                            addedEmbed.setDescription(String)

                            //send the new sections
                            await message.send(addedEmbed)
                        }

                        //if there is a new sections
                        if(added.length > 0) await printSections(added, stringAdded)
                        if(removed.length > 0) await printSections(removed, stringRemoved)

                        //store data
                        for(let i = 0; i < res.data.shopSections.sectionList.sections.length; i++){
                            response[i] = await res.data.shopSections.sectionList.sections[i].sectionId
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