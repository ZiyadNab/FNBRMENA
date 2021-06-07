const Data = require('../../FNBRMENA')
const FNBRMENA = new Data()
const FortniteAPI = require("fortniteapi.io-api");
const moment = require("moment");
const fortniteAPI = new FortniteAPI(FNBRMENA.APIKeys("FortniteAPI.io"));

module.exports = {
    commands: 'bundle',
    expectedArgs: '',
    minArgs: 1,
    maxArgs: null,
    cooldown: 10,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        const offerID = await fortniteAPI.getBundles()
        .then(async res => {

            //filtering
            const id = res.bundles.filter(obj => {
                return obj.name.toLowerCase() === text.toLowerCase()
            })

            return id[0].offerId
        })

        if(offerID.length !== 0){

            //message
            var mess

            if(lang === "en"){
                mess = "Give just a sec to get the bundle data"
            }else if(lang === "ar"){
                mess = "عطني وقت بس قاعد اجيب معلومات الحزمة"
            }

            const generating = new Discord.MessageEmbed()
            generating.setColor('#BB00EE')
            const emoji = client.emojis.cache.get("805690920157970442")
            generating.setTitle(`${mess} ${emoji}`)
            message.channel.send(generating)
            .then( async msg => {

                fortniteAPI.getBundles(options = {lang: lang})
                .then(async res => {

                    //filtering
                    const found = res.bundles.filter(obj => {
                        return obj.offerId === offerID
                    })

                    if(found.length !== 0){

                        //creating embed
                        const bundle = new Discord.MessageEmbed()

                        //add color
                        bundle.setColor('#BB00EE')

                        //add title
                        bundle.setTitle(found[0].name)

                        //add description
                        bundle.setDescription(found[0].description)

                        //payable? and dates
                        moment.locale(lang)
                        if(lang === "en"){
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "Available", value: "Yes!"},
                                    {name: "Available Since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Will be gone at", value: moment(found[0].expiryDate).format("dddd, MMMM Do of YYYY")}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "Available", value: "No!"},
                                    {name: "Available since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Gone since", value: moment(found[0].expiryDate).format("dddd, MMMM Do of YYYY")}
                                )
                            }
                        }else if(lang === "ar"){
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "نعم"},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "سوف تغادر في", value: moment(found[0].expiryDate).format("dddd, MMMM Do من YYYY")}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "لا",},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "غادرت منذ", value: moment(found[0].expiryDate).format("dddd, MMMM Do من YYYY")}
                                )
                            }
                        }

                        //prices
                        for(let i = 0; i < found[0].prices.length; i++){
                            bundle.addFields(
                                {name: found[0].prices[i].paymentCurrencyCode, value: found[0].prices[i].paymentCurrencyAmountNatural + found[0].prices[i].paymentCurrencySymbol, inline: true}
                            )
                        }

                        //tumbnail
                        if(found[0].displayAssets.length !== 0){
                            bundle.setThumbnail(found[0].displayAssets[0].url)
                        }

                        //set the image
                        bundle.setImage(found[0].thumbnail)

                        message.channel.send(bundle)
                        msg.delete()
                    }else{
                        console.log("err")
                    }
                })
            })
        }else{
            if(lang === "en"){
                const Err = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(`No bundle has been found check your speling and try again ${errorEmoji}`)
                message.reply(Err)
            }else if(lang === "ar"){
                const Err = new Discord.MessageEmbed()
                .setColor('#BB00EE')
                .setTitle(`لا يمكنني العثور على الحزمة الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(Err)
            }
        }
    }
}