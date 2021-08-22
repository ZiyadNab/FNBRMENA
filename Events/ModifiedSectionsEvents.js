const Discord = require('discord.js')
const key = require('../Coinfigs/config.json')

module.exports = (FNBRMENA, client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === key.events.Section)

    //result
    var sectionsResponseData = []
    var responseSectionId = []
    var sectionsIdData = []
    var counter = 1
    
    const modifiedSectionsHandler = async () => {

        //checking if the bot on or off
        await admin.database().ref("ERA's").child("Events").child("modifiedsections").once('value', async function (data) {
            const status = data.val().Active
            const lang = data.val().Lang
            const push = data.val().Push.Status
            const type = data.val().Push.Type

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    if(counter === 1){

                        //store data
                        for(let i = 0; i < res.data.shopSections.sectionList.sections.length; i++){
                            sectionsResponseData[i] = await res.data.shopSections.sectionList.sections[i]
                            responseSectionId[i] = await res.data.shopSections.sectionList.sections[i].sectionId
                        }

                        //add sets names
                        counter--
                    }

                    //up to date sections data
                    for(let i = 0; i < res.data.shopSections.sectionList.sections.length; i++){
                        sectionsIdData[i] = await res.data.shopSections.sectionList.sections[i].sectionId
                    }

                    //if push was enabled
                    if(push){

                        //remove data
                        for(let i = 0; i < data.val().Push.Number; i++){
                            if(type.toLowerCase() === "removed") await sectionsIdData.shift()
                            if(type.toLowerCase() === "added") await responseSectionId.shift()
                        }
                    }
                
                    //check data
                    if(JSON.stringify(sectionsIdData) !== JSON.stringify(responseSectionId)){

                        //defin added string
                        if(lang === "en") var stringAdded = "New sections just got added\n\n"
                        else if(lang === "ar") var stringAdded = "تم اضافة اقسام جديدة\n\n"

                        //defin removed string
                        if(lang === "en") var stringRemoved = "Sections that just got removed\n\n"
                        else if(lang === "ar") var stringRemoved = "اقسام تم حذفها\n\n"

                        //added
                        var added = []
                        counter = 0
                        for(let i = 0; i < sectionsIdData.length; i++){

                            //if the section at index i is new
                            if(!responseSectionId.includes(sectionsIdData[i])){

                                //add the new sections to added array
                                for(let x = 0; x < res.data.shopSections.sectionList.sections.length; x++){

                                    //catch the searched sectionId
                                    if(res.data.shopSections.sectionList.sections[x].sectionId === sectionsIdData[i])
                                    added[counter++] = await res.data.shopSections.sectionList.sections[x]
                                }
                            }
                        }

                        //removed
                        var removed = []
                        counter = 0
                        for(let i = 0; i < responseSectionId.length; i++){

                            //if the section at index i is removed
                            if(!sectionsIdData.includes(responseSectionId[i])){

                                //add the removed sections to removed array
                                for(let x = 0; x < sectionsResponseData.length; x++){

                                    //catch the searched sectionId
                                    if(sectionsResponseData[x].sectionId === responseSectionId[i])
                                    removed[counter++] = await sectionsResponseData[x]
                                }
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
                            sectionsResponseData[i] = await res.data.shopSections.sectionList.sections[i]
                            responseSectionId[i] = await res.data.shopSections.sectionList.sections[i].sectionId
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("modifiedsections").child("Push").update({
                            Status: false
                        })

                    }
                    
                }).catch(err => {
                    console.log("The issue is in Modified Sections Events ", err)
                })
            }
        })
    }
    setInterval(modifiedSectionsHandler, 1 * 10000)
}