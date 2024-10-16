
module.exports = {
    commands: 'athena',
    type: 'Fortnite Private Server Athena File',
    minArgs: 0,
    maxArgs: 0,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //creating initial message and its buttons
        const row = new Discord.ActionRowBuilder()
        const info = new Discord.EmbedBuilder()
        info.setColor(FNBRMENA.Colors("embed"))

        //set the message title and description
        if(userData.lang === "en"){
            info.setDescription("Please click on start button to preform the action.\n`You have only 30 seconds until this operation ends`!")

            //add the button for fortnite-api
            row.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('start')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("Start")
            )

            //add the button for Cancel button
            row.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel this process")
            )
        }

        //set the message title and description
        else if(userData.lang === "ar"){
            info.setDescription("الرجاء الضغط على الزر المناسب لاجراء العملية.\n`لديك فقط 30 ثانية لأتمام العملية`!")

            //add the All button for fortnite-api
            row.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('start')
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("ابدأ")
            )

            //add the Cancel button
            row.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId('cancel')
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("ايقاف العملية")
            )
        }

        //send the message
        const athenaGen = await message.reply({embeds: [info], components: [row], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
        })

        //filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === athenaGen.id && i.guild.id === message.guild.id)
        })

        //await for the user
        await message.channel.awaitMessageComponent({filter, time: 30000})
        .then(async collected => {
            collected.deferUpdate();

            //when cancel is clicked
            if(collected.customId === "cancel") athenaGen.delete()
            else{

                var profile_athena = require('../../assets/AthenaTemplate/template.json')

                const waitingMessage = new Discord.EmbedBuilder()
                waitingMessage.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en") waitingMessage.setTitle(`File will be sent in a few seconds please wait... ${emojisObject.loadingEmoji}`)
                else if(userData.lang === "ar") waitingMessage.setTitle(`سوف يتم ارسال الملف خلال ثواني الرجاء الانتظار... ${emojisObject.loadingEmoji}`)
                athenaGen.edit({embeds: [waitingMessage], components: [], files: []}) // edit the message
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })

                //when Fortnite-Api is clicked
                if(collected.customId === "start"){

                    //request all the items in-game
                    await FNBRMENA.Request('https://fortnite-api.com/v2/cosmetics/br')
                    .then(async allItems => {

                        //here request only new items from the latest patch
                        await FNBRMENA.Request('https://fortnite-api.com/v2/cosmetics/br/new')
                        .then(async newItems => {

                            //store every new item id
                            const newItemsIDs = []
                            for(const item of newItems.data.data.items) newItemsIDs.push(item.id)
                        
                            //loop thrw every item
                            for(let i = 0; i < allItems.data.data.length; i++){
                                
                                if(newItemsIDs.includes(allItems.data.data[i].id)) var favorite = true
                                else var favorite = false
                                var templateId = `${allItems.data.data[i].type.backendValue}:${allItems.data.data[i].id}`
                                
                                profile_athena.items[templateId] = {
                                    'attributes': {
                                        "favorite": favorite,
                                        "item_seen": true,
                                        "level": 1,
                                        "max_level_bonus": 0,
                                        "rnd_sel_cnt": 0,
                                        "variants": [],
                                        "xp": 0
                                    },
                                    'templateId': templateId,
                                }

                                //add the variantsData and grant each style
                                if(allItems.data.data[i].variants !== null){
                                    var variantsData = []

                                    //loop thrw variantsData field
                                    for(let v = 0; v < allItems.data.data[i].variants.length; v++){

                                        //check if the variant has a channel if not abort
                                        if(allItems.data.data[i].variants[v].channel != null){
                                            var channel = allItems.data.data[i].variants[v].channel

                                            //check if the variant has a tag if not abort
                                            if(allItems.data.data[i].variants[v].options.length != 0){
                                                var active = allItems.data.data[i].variants[v].options[0].tag

                                                //add to the variantsData array
                                                variantsData[v] = {
                                                    channel: channel,
                                                    active: active,
                                                    owned: [

                                                    ]
                                                }

                                                for(let o = 0; o < allItems.data.data[i].variants[v].options.length; o++){
                                                    variantsData[v].owned.push(allItems.data.data[i].variants[v].options[o].tag)
                                                }
                                            }
                                        }
                                    }

                                    profile_athena.items[templateId].attributes.variants = variantsData
                                }
                            }

                        }).catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, athenaGen)
                        })

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, athenaGen)
                    })
                }

                //send the file
                const att = new Discord.AttachmentBuilder(Buffer.from(JSON.stringify(profile_athena, null, 2)), {name: `profile_athena.json`})
                await athenaGen.edit({embeds: [], components: [], files: [att]})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, athenaGen)
        })
    }
}