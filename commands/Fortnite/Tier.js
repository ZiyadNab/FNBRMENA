const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api")
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"))
const { MessageButton } = require('discord-buttons');

module.exports = {
    commands: 'tier',
    descriptionEN: 'A command that will return a tier of any season\'s information of a battlepass of your choice from season 2 till current season.',
    descriptionAR: 'أمر راح يسترجع لك معلومات اي تاير من عناصر الباتل باس بإختيارك من الموسم 2 الى الموسم الحالي.',
    expectedArgsEN: 'To use the command you need to specifiy a season number from season 2 to latest season.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد موسم معين من الموسم الثاني الى الموسم الحالي.',
    hintEN: 'You can add + then type any tier to start with. \nFor example: tier 2 + 68 that will give you the black knight from season 2',
    hintAR: 'يمكنك اضافة + ثم رقم المستى للبداية.\nعلى سبيل المثال: tier 2 + 68 راح يعطيك عنصر بلاك نيات من سيزون 2',
    argsExample: ['2', '14'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 40,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //tier index
        let tierIndex = 0

        //stars emoji
        const stars = client.emojis.cache.get("879823941428973598")
        const bpstars = client.emojis.cache.get("879859225059287040")

         //if the user added a tier to start
         if(text.includes("+")){

            //extract the season from the text string
            var season = text.substring(0, text.indexOf("+"))
            tierIndex = text.substring(text.indexOf("+") + 1, text.length).trim()

        }else var season = text

        //request data
        fortniteAPI.getBattlepassRewards(season = season, options = {lang: lang})
        .then(async res => {

            //if the started index above the rewards length
            if(Number(tierIndex) < res.rewards.length){

                //inisilizing next tier button
                const NEXT = new MessageButton()
                NEXT.setStyle('blurple')

                //button label
                if(lang === "en") NEXT.setLabel(`Next Tier >>`)
                else if(lang === "ar") NEXT.setLabel(`الى التاير التالي >>>`)

                //button id
                NEXT.setID('NEXT')

                //inisilizing back tier button
                const BACK = new MessageButton()
                BACK.setStyle('blurple')

                //button label
                if(lang === "en") BACK.setLabel(`<<< Back Tier`)
                else if(lang === "ar") BACK.setLabel(`<<< رجوع تاير`)

                //button id
                BACK.setID('BACK')

                //inisilizing skip 20 tier button
                const SKIP20 = new MessageButton()
                SKIP20.setStyle('blurple')

                //button label
                if(lang === "en") SKIP20.setLabel(`Skip 20 Tier`)
                else if(lang === "ar") SKIP20.setLabel(`تقدم 20 تاير`)

                //button id
                SKIP20.setID('SKIP20')

                //inisilizing back 20 tier button
                const BACK20 = new MessageButton()
                BACK20.setStyle('blurple')

                //button label
                if(lang === "en") BACK20.setLabel(`Back 20 Tier`)
                else if(lang === "ar") BACK20.setLabel(`ارجع 20 تاير`)

                //button id
                BACK20.setID('BACK20')

                //inisilizing stop button
                const STOP = new MessageButton()
                STOP.setStyle('red')

                //button label
                if(lang === "en") STOP.setLabel('Stop!')
                else if(lang === "ar") STOP.setLabel('ايقاف!')

                //button id
                STOP.setID('STOP')

                //preview tier details based on the given index
                const tierViewer = async () => {

                    //get tier data by filtering
                    const TierData = res.rewards[tierIndex]

                    //inisilizing tierDATA
                    const tierDataEmbed = new Discord.MessageEmbed()
                    tierDataEmbed.setColor(FNBRMENA.Colors(TierData.item.series.id))

                    //if the index is not -1
                    if(tierIndex !== -1){

                        //set title
                        if(await TierData.page !== null){
                            if(lang === "en") await tierDataEmbed.setAuthor(`${res.displayInfo.chapterSeason} | Page ${TierData.page}`, TierData.item.images.icon)
                            else if(lang === "ar") await tierDataEmbed.setAuthor(`${res.displayInfo.chapterSeason} | صفحة ${TierData.page}`, TierData.item.images.icon)
                        }else{
                            if(lang === "en") await tierDataEmbed.setAuthor(`${res.displayInfo.chapterSeason} | Tier ${tierIndex}`, TierData.item.images.icon)
                            else if(lang === "ar") await tierDataEmbed.setAuthor(`${res.displayInfo.chapterSeason} | مستوى ${tierIndex}`, TierData.item.images.icon)
                        }
                        
                        //set title
                        tierDataEmbed.setTitle(`${bpstars} ${TierData.item.name}`)

                        //set description
                        tierDataEmbed.setDescription(TierData.item.description)

                        //set thumbnail
                        tierDataEmbed.setThumbnail(TierData.item.images.icon)

                        //add styles
                        var Styles = ``
                        if(TierData.item.styles.length !== 0){
                            for(let i = 0; i < TierData.item.styles.length; i++){
                                Styles += `\`${TierData.item.styles[i].name}\`\n`
                            }
                        }else if(lang === "en") Styles = `\`No styles for ${TierData.item.name}\``
                        else if(lang === "ar") Styles = `\`لا يوجد ستايلات لـ ${TierData.item.name}\``

                        //add gameplayTags
                        var gameplayTags = ``
                        if(TierData.item.gameplayTags.length !== 0){
                            for(let i = 0; i < TierData.item.gameplayTags.length; i++){
                                gameplayTags += `\`${TierData.item.gameplayTags[i]}\`\n`
                            }
                        }else if(lang === "en") gameplayTags = `\`No gameplayTags for ${TierData.item.name}\``
                        else if(lang === "ar") gameplayTags = `\`لا يوجد شعارات لـ ${TierData.item.name}\``

                        //add rarity
                        var rarity = ``
                        if(TierData.item.series !== null) rarity = TierData.item.series.name
                        else rarity = TierData.item.rarity.name

                        //add set
                        if(lang === "en") var set = `\`No set for ${TierData.item.name}\``
                        else if(lang === "ar") var set = `\`لا يوجد مجموعة للعنصر ${TierData.item.name}\``
                        if(TierData.item.set !== null) set = TierData.item.set.partOf

                        //add introduction
                        if(lang === "en") var introduction = `No introduction for ${TierData.item.name}`
                        else if(lang === "ar") var introduction = `لا يوجد تقديم للعنصر ${TierData.item.name}`
                        if(TierData.item.introduction !== null) introduction = TierData.item.introduction.text

                        //add price
                        if(lang === "en") var price = `\`No prices for ${TierData.item.name}\``
                        else if(lang === "ar") var price = `\`لا يوجد اسعار لـ ${TierData.item.name}\``
                        if(TierData.price !== null) price = `${TierData.price.amount} ${stars}`

                        //add fields
                        if(lang === "en"){

                            //battlepass type
                            const battlepassType = TierData.battlepass.charAt(0).toUpperCase() + TierData.battlepass.slice(1)

                            tierDataEmbed.addFields(
                                {name: `Battlepass Type`, value: `\`${battlepassType}\``, inline: true},
                                {name: `Quantity`, value: `\`${TierData.quantity}\``, inline: true},
                                {name: `Item Price`, value: `${price}`, inline: true},
                                {name: `Item Type`, value: `\`${TierData.item.type.name}\``, inline: true},
                                {name: `Rarity`, value: `\`${rarity}\``, inline: true},
                                {name: `Set`, value: `\`${set}\``, inline: true},
                                {name: `Introduction`, value: `\`${introduction}\``, inline: true},
                                {name: `Added`, value: `\`Date: ${TierData.item.added.date}\`\n\`Version: ${TierData.item.added.version}\``, inline: true},
                                {name: `Item ID`, value: `\`${TierData.item.id}\``, inline: true},
                                {name: `Styles`, value: `${Styles}`},
                                {name: `gameplayTags`, value: `${gameplayTags}`},
                            )
                        }else if(lang === "ar"){

                            //battlepass type
                            let battlepassType = `مدفوع`
                            if(TierData.battlepass === 'free') battlepassType = `مجاني`

                            tierDataEmbed.addFields(
                                {name: `نوع الباتل باس`, value: `\`${battlepassType}\``, inline: true},
                                {name: `الكمية`, value: `\`${TierData.quantity}\``, inline: true},
                                {name: `سعر العنصر`, value: `${price}`, inline: true},
                                {name: `نوع العنصر`, value: `\`${TierData.item.type.name}\``, inline: true},
                                {name: `الندرة`, value: `\`${rarity}\``, inline: true},
                                {name: `المجموعة`, value: `\`${set}\``, inline: true},
                                {name: `تم تقديمة`, value: `\`${introduction}\``, inline: true},
                                {name: `تم اضافتة`, value: `\`التاريخ: ${TierData.item.added.date}\`\n\`التحديث: ${TierData.item.added.version}\``, inline: true},
                                {name: `معرف العنصر`, value: `\`${TierData.item.id}\``, inline: true},
                                {name: `ستايلات`, value: `${Styles}`},
                                {name: `شعارات`, value: `${gameplayTags}`},
                            )
                        }
                    }else{
                        //set description
                        if(lang === "en") tierDataEmbed.setDescription(`You are the the last page please use backward or stop button to continue ${errorEmoji}`)
                        else if(lang === "ar") tierDataEmbed.setDescription(`انت الأن في اخر صفحه الرجاء استعمال زر الرجوع او الإيقاف للأستمرار ${errorEmoji}`)
                    }

                    //send the data
                    const sendTierDataViewer = await message.channel.send("", {buttons: [BACK20, BACK, NEXT, SKIP20, STOP], embed: tierDataEmbed})

                    //filtering the user clicker
                    const filter = (button) => button.clicker.user.id === message.author.id

                    //await the user click
                    await sendTierDataViewer.awaitButtons(filter, { max: 1, time: 2 * 60000, errors: ['time'] })
                    .then(async collected => {

                        //back 20 button clicked
                        if(collected.first().id === "BACK20"){

                            if(tierIndex === -1) tierIndex = res.rewards.length

                            //if there is no more tiers
                            if(tierIndex - 20 > 0){

                                //move to the 20 back index
                                tierIndex -= 20

                                //delete the start message
                                await sendTierDataViewer.delete()

                                //call the tierViewer function
                                await tierViewer()
                            }else{

                                tierIndex = 0

                                //delete the start message
                                await sendTierDataViewer.delete()

                                //call the tierViewer function
                                await tierViewer()

                            }
                        }

                        //back button clicked
                        if(collected.first().id === "BACK"){

                            if(tierIndex === -1) tierIndex = res.rewards.length

                            //if there is no more tiers
                            if(tierIndex - 1 > 0){

                                //move to the back index
                                tierIndex--

                                //delete the start message
                                await sendTierDataViewer.delete()

                                //call the tierViewer function
                                await tierViewer()

                            }else{

                                tierIndex = 0

                                //delete the start message
                                await sendTierDataViewer.delete()

                                //call the tierViewer function
                                await tierViewer()

                            }
                        }

                        //next button clicked
                        if(collected.first().id === "NEXT"){

                            //if there is no more tiers
                            if(tierIndex + 1 < res.rewards.length){

                                if(tierIndex !== -1){
                                    
                                    //move to the next index
                                    tierIndex++

                                    //delete the start message
                                    await sendTierDataViewer.delete()

                                    //call the tierViewer function
                                    await tierViewer()
                                }

                            }else{

                                tierIndex = -1

                                //delete the start message
                                await sendTierDataViewer.delete()

                                //call the tierViewer function
                                await tierViewer()

                            }
                        }

                        //next button clicked
                        if(collected.first().id === "SKIP20"){

                            //if there is no more tiers
                            if(tierIndex + 20 < res.rewards.length){

                                if(tierIndex !== -1){

                                    //move to the next index
                                    tierIndex += 20

                                    //delete the start message
                                    await sendTierDataViewer.delete()

                                    //call the tierViewer function
                                    await tierViewer()
                                }

                            }else{

                                tierIndex = -1

                                //delete the start message
                                await sendTierDataViewer.delete()

                                //call the tierViewer function
                                await tierViewer()

                            }
                        }

                        //stop
                        if(collected.first().id === "STOP"){

                            //delete the start message
                            sendTierDataViewer.delete()
                            return
                        }
                    }).catch(async err => {
                        await sendTierDataViewer.delete()
                    })
                }

                //call the preview function
                await tierViewer()
            }else{

                //create error embed
                const err = new Discord.MessageEmbed()
                err.setColor(FNBRMENA.Colors("embed"))

                //set title
                if(lang === "en") err.setTitle(`The given tier is incorrect ${errorEmoji}`)
                else if(lang === "ar") err.setTitle(`المستوى غير صحيح ${errorEmoji}`)

                //send
                message.channel.send(err)
            }
        })
    }
}