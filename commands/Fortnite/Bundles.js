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
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji) => {

        //get the user language from the database
        const lang = await FNBRMENA.Admin(admin, message, "", "Lang")

        //inisilizing number
        var num = null

        const offerID = await fortniteAPI.getBundles()
        .then(async res => {

            //filtering
            const id = res.bundles.filter(obj => {
                return obj.name.toLowerCase().includes(text.toLowerCase())
            })

            //ask the user what bundles he means
            if(await id.length > 1){

                //create embed
                const bundles = new Discord.MessageEmbed()

                //add the color
                bundles.setColor(FNBRMENA.Colors("embed"))

                //create and fill a string of names
                var str = ""
                for(let i = 0; i < id.length; i++){
                    str += '• ' + i + ': ' + id[i].name + '\n'
                }

                //add description
                bundles.setDescription(str)

                //send the choices
                await message.channel.send(bundles)
                .then( async msg => {

                    //filtering
                    const filter = m => m.author.id === message.author.id

                    //send the reply to the user
                    if(lang === "en") reply = "please choose from above list the command will stop listen in 20 sec"
                    else if(lang === "ar") reply = "الرجاء الاختيار من القائمة بالاعلى، سوف ينتهي الامر خلال ٢٠ ثانية"

                    //send the reply
                    await message.reply(reply)
                    .then( async notify => {

                        //await messages
                        await message.channel.awaitMessages(filter, {max: 1, time: 20000})
                        .then( async collected => {

                            //deleting messages
                            msg.delete()
                            notify.delete()

                            //if the user input in range
                            if(await collected.first().content >= 0 && collected.first().content < id.length){

                                //store user input
                                num = await collected.first().content

                            }else{

                                const error = new Discord.MessageEmbed()
                                error.setColor(FNBRMENA.Colors("embed"))
                                if(lang === "en") error.setTitle(`Sorry we canceled your process becuase u selected a number out of range ${errorEmoji}`)
                                else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق ${errorEmoji}`)
                                message.reply(error)
                                
                            }
                        }).catch(err => {
                            notify.delete()
                            msg.delete()
                            const error = new Discord.MessageEmbed()
                            error.setColor(FNBRMENA.Colors("embed"))
                            if(lang === "en") error.setTitle(`Sorry we canceled your process becuase no method has been selected ${errorEmoji}`)
                            else if(lang === "ar") error.setTitle(`تم ايقاف الامر بسبب عدم اختيارك لطريقة ${errorEmoji}`)
                            message.reply(error)
                        })
                    })
                })
                if(num !== null){
                    return id[num].offerId
                }
            }

            //there is onle one bundle
            if(id.length === 1){
                return id[0].offerId
            }
            
            //no bundle has been found
            if(id.length === 0){
                const Err = new Discord.MessageEmbed()
                Err.setColor(FNBRMENA.Colors("embed"))
                if(lang === "en") Err.setTitle(`No bundle has been found check your speling and try again ${errorEmoji}`)
                else if(lang === "ar") Err.setTitle(`لا يمكنني العثور على الحزمة الرجاء التأكد من كتابة الاسم بشكل صحيح ${errorEmoji}`)
                message.reply(Err)
            }
        })

        if(offerID){

            const generating = new Discord.MessageEmbed()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(lang === "en") generating.setTitle(`Give just a sec to get the bundle data ${loadingEmoji}`)
            else if(lang === "ar") generating.setTitle(`عطني وقت بس قاعد اجيب معلومات الحزمة ${loadingEmoji}`)
            message.channel.send(generating)
            .then( async msg => {

                fortniteAPI.getBundles(options = {lang: lang})
                .then(async res => {

                    //filtering
                    const found = await res.bundles.filter(obj => {
                        return obj.offerId === offerID
                    })

                    //creating embed
                    const bundle = new Discord.MessageEmbed()

                    //add color
                    bundle.setColor(FNBRMENA.Colors("embed"))

                    //add title
                    bundle.setTitle(found[0].name)

                    //add description
                    bundle.setDescription(found[0].description)

                    //payable? and dates
                    moment.locale(lang)
                    if(lang === "en"){

                        //if there is no expire date
                        if(found[0].expiryDate !== null){

                            //if the bundle is available
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
                        }else{
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "Available", value: "Yes!"},
                                    {name: "Available Since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Will be gone at", value: "Not yet known"}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "Available", value: "No!"},
                                    {name: "Available since", value: moment(found[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                    {name: "Gone since", value: "Not yet known"}
                                )
                            }
                        }
                    }else if(lang === "ar"){

                        //if there is no expire date
                        if(found[0].expiryDate !== null){

                            //if the bundle is available
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
                        }else{
                            if(found[0].available === true){
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "نعم"},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "سوف تغادر في", value: "لا يوجد تاريخ معلوم حتى الان"}
                                )
                            }else{
                                bundle.addFields(
                                    {name: "متاحة للشراء", value: "لا",},
                                    {name: "متاحة منذ", value: moment(found[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                    {name: "غادرت منذ", value: "لا يوجد تاريخ معلوم حتى الان"}
                                )
                            }
                        }
                    }

                    if(found[0].prices.length !== 0){

                        //add cutsom prices SAR
                        var pricesSA = {
                            "paymentCurrencyCode": "SAR",
                            "paymentCurrencySymbol": "SR",
                            "paymentCurrencyAmountNatural": parseFloat(found[0].prices[1].paymentCurrencyAmountNatural * 3.75).toFixed(2)
                        }

                        //add sar
                        bundle.addFields(
                            {name: pricesSA.paymentCurrencyCode, value: pricesSA.paymentCurrencyAmountNatural + pricesSA.paymentCurrencySymbol, inline: true}
                        )

                        //add cutsom prices KWD
                        var pricesKWD = {
                            "paymentCurrencyCode": "KWD",
                            "paymentCurrencySymbol": "KD",
                            "paymentCurrencyAmountNatural": parseFloat(found[0].prices[1].paymentCurrencyAmountNatural * 0.30).toFixed(2)
                        }

                        //add kwd
                        bundle.addFields(
                            {name: pricesKWD.paymentCurrencyCode, value: pricesKWD.paymentCurrencyAmountNatural + pricesKWD.paymentCurrencySymbol, inline: true}
                        )

                        //prices
                        for(let i = 0; i < found[0].prices.length - 1; i++){
                            bundle.addFields(
                                {name: found[0].prices[i].paymentCurrencyCode, value: found[0].prices[i].paymentCurrencyAmountNatural + found[0].prices[i].paymentCurrencySymbol, inline: true}
                            )
                        }
                    }else{
                        if(lang === "en"){
                            bundle.addFields(
                                {name: 'Prices', value: 'There is no prices yet'}
                            )
                        }else if(lang === "ar"){
                            bundle.addFields(
                                {name: 'الاسعار', value: 'لا يوجد اسعار حاليا'}
                            )
                        }
                    }

                    //tumbnail and image
                    if(found[0].displayAssets.length !== 0){

                        //store the url
                        var url = found[0].displayAssets[0].url
                            
                        //decode and encode
                        url = decodeURI(url);
                        url = encodeURI(url);

                        //add thumbnail
                        bundle.setThumbnail(url)

                        //add the image
                        if(found[0].thumbnail !== null){

                            //store the url
                            var url = found[0].thumbnail
                            
                            //decode and encode
                            url = decodeURI(url);
                            url = encodeURI(url);

                            //set the image
                            bundle.setImage(url)
                        }else{

                            //store the url
                            var url = found[0].displayAssets[0].background
                            
                            //decode and encode
                            url = decodeURI(url);
                            url = encodeURI(url);

                            //set the image
                            bundle.setImage(url)
                        }
                    }else{

                        //add the image
                        if(found[0].thumbnail !== null){

                            //store the url
                            var url = found[0].thumbnail
                            
                            //decode and encode
                            url = decodeURI(url);
                            url = encodeURI(url);

                            //set the image
                            bundle.setImage(url)
                        }
                    }

                    message.channel.send(bundle)
                    msg.delete()

                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
    }
}