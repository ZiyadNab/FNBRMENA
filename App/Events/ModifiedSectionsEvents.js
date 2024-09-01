const Discord = require('discord.js')
const key = require('../Configs/config.json')
const { translate } = require('bing-translate-api')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
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
            const role = data.val().Role

            //if the event is set to be true [ON]
            if(status){

                //request data
                await FNBRMENA.EpicContentEndpoint(lang)
                .then(async res => {

                    if(counter === 1){

                        //store data
                        for(let i = 0; i < res.data.mpItemShop.shopData.sections.length; i++){
                            sectionsResponseData[i] = await res.data.mpItemShop.shopData.sections[i]
                            responseSectionId[i] = await res.data.mpItemShop.shopData.sections[i].sectionID
                        }

                        //add sets names
                        counter--
                    }

                    //up to date sections data
                    for(let i = 0; i < res.data.mpItemShop.shopData.sections.length; i++){
                        sectionsIdData[i] = await res.data.mpItemShop.shopData.sections[i].sectionID
                    }

                    //if push was enabled
                    if(true){

                        //remove data
                        for(let i = 0; i < 100; i++){
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
                                for(let x = 0; x < res.data.mpItemShop.shopData.sections.length; x++){

                                    //catch the searched sectionID
                                    if(res.data.mpItemShop.shopData.sections[x].sectionID === sectionsIdData[i])
                                    added[counter++] = await res.data.mpItemShop.shopData.sections[x]
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

                                    //catch the searched sectionID
                                    if(sectionsResponseData[x].sectionID === responseSectionId[i])
                                    removed[counter++] = await sectionsResponseData[x]
                                }
                            }
                        }

                        //print all the added sections
                        const printSections = async (Sections, String) => {
                            console.log(Sections)
                            var regExp = /[a-zA-Z]/g;

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
                                    if(firstIndex.displayName === Sections[i].displayName){

                                        //remove the section from the section array
                                        const index = Sections.indexOf(Sections[i])
                                        if(index > -1) Sections.splice(index, 1)

                                        //add new tab
                                        tabs++

                                    } else i++
                                }

                                //add the tabs string
                                if(firstIndex.displayName !== undefined){

                                    if(lang === "en") String += `${firstIndex.displayName} | ${tabs} Tabs\n`
                                    else if(lang === "ar") String += `القسم ${firstIndex.displayName} | ${tabs} صفحة\n`
                                }else{
                                    
                                    if(lang === "en") String += `${firstIndex.sectionID} | ${tabs} Tabs\n`
                                    else if(lang === "ar") String += `${firstIndex.sectionID} | ${tabs} صفحة\n`
                                }
                            }
                                
                            //create an embed for just added sections
                            const addedEmbed = new Discord.EmbedBuilder()

                            //set the color
                            addedEmbed.setColor(FNBRMENA.Colors("embed"))

                            //set the description
                            addedEmbed.setDescription(String)

                            //send the new sections
                            if(role.Status) await message.send({content: `<@&${role.roleID}>`, embeds: [addedEmbed]})
                            else await message.send({embeds: [addedEmbed]})
                        }

                        //if there is a new sections
                        if(added.length > 0) await printSections(added, stringAdded)
                        if(removed.length > 0) await printSections(removed, stringRemoved)

                        //store data
                        for(let i = 0; i < res.data.mpItemShop.shopData.sections.length; i++){
                            sectionsResponseData[i] = await res.data.mpItemShop.shopData.sections[i]
                            responseSectionId[i] = await res.data.mpItemShop.shopData.sections[i].sectionID
                        }

                        //trun off push if enabled
                        await admin.database().ref("ERA's").child("Events").child("modifiedsections").child("Push").update({
                            Status: false
                        })

                    }
                    
                }).catch(async err => {
                    FNBRMENA.eventsLogs(admin, client, err, 'modified sections')
        
                })
            }
        })
    }
    setInterval(modifiedSectionsHandler, 1 * 10000)
}