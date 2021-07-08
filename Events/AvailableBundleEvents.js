const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Bundles)

    //result
    var response = []
    var offer = []
    var available = []
    var number = 0

    const Bundle = async () => {

        //checking if the bot on or off
        admin.database().ref("ERA's").child("Events").child("bundles").once('value', async function (data) {
            var status = data.val().Active;
            var lang = data.val().Lang;
            var push = data.val().Push

            //if the event is set to be true [ON]
            if(status === "true"){

                axios.get(`https://fortniteapi.io/v2/bundles?lang=${lang}&available=true`, { headers: {'Content-Type': 'application/json','Authorization': "d4ce1562-839ff66b-3946ccb6-438eb9cf",} })
                .then(async res => {

                    //store data when the bot if on
                    if(number === 0){

                        //store only available bundles
                        for(let i = 0; i < res.data.bundles.length; i++){
                            response[i] = await res.data.bundles[i].offerId
                        }

                        number++
                    }

                    //if the client wants to pust data
                    if(push === "true"){
                        response = []
                    }

                    //store only available bundles
                    for(let i = 0; i < res.data.bundles.length; i++){
                        offer[i] = await res.data.bundles[i].offerId
                    }

                    //compare diff
                    if(JSON.stringify(offer) !== JSON.stringify(response)){

                        //diff has been found now loop throw all the available bundles
                        for(let i = 0; i < offer.length; i++){

                            //if there is a new avaliable bundle
                            if(!response.includes(offer[i])){

                                available = await res.data.bundles.filter(id => {
                                    return id.offerId === offer[i]
                                })

                                //creating embed
                                const bundle = new Discord.MessageEmbed()

                                //add color
                                bundle.setColor('#00ffff')

                                //add title
                                bundle.setTitle(available[0].name)

                                //add description
                                bundle.setDescription(available[0].description)

                                //moment language
                                moment.locale(lang)

                                //add the dates
                                if(lang === "en"){
                                    if(available[0].expiryDate !== null){
                                        bundle.addFields(
                                            {name: "Available", value: "Yes!"},
                                            {name: "Available Since", value: moment(available[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                            {name: "Will be gone at", value: moment(available[0].expiryDate).format("dddd, MMMM Do of YYYY")}
                                        )
                                    }else{
                                        bundle.addFields(
                                            {name: "Available", value: "Yes!"},
                                            {name: "Available Since", value: moment(available[0].viewableDate).format("dddd, MMMM Do of YYYY")},
                                            {name: "Will be gone at", value: "Not yet known"}
                                        )
                                    }
                                }else if(lang === "ar"){
                                    if(available[0].expiryDate !== null){
                                        bundle.addFields(
                                            {name: "متاحة للشراء", value: "نعم"},
                                            {name: "متاحة منذ", value: moment(available[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                            {name: "سوف تغادر في", value: moment(available[0].expiryDate).format("dddd, MMMM Do من YYYY")}
                                        )
                                    }else{
                                        bundle.addFields(
                                            {name: "متاحة للشراء", value: "نعم"},
                                            {name: "متاحة منذ", value: moment(available[0].viewableDate).format("dddd, MMMM Do من YYYY")},
                                            {name: "سوف تغادر في", value: "لا يوجد تاريخ معلوم حتى الان"}
                                        )
                                    }
                                }

                                //add cutsom prices SAR
                                var pricesSA = {
                                    "paymentCurrencyCode": "SAR",
                                    "paymentCurrencySymbol": "SR",
                                    "paymentCurrencyAmountNatural": parseFloat(available[0].prices[1].paymentCurrencyAmountNatural * 3.75).toFixed(2)
                                }

                                //add sar
                                bundle.addFields(
                                    {name: pricesSA.paymentCurrencyCode, value: pricesSA.paymentCurrencyAmountNatural + pricesSA.paymentCurrencySymbol, inline: true}
                                )

                                //add cutsom prices KWD
                                var pricesKWD = {
                                    "paymentCurrencyCode": "KWD",
                                    "paymentCurrencySymbol": "KD",
                                    "paymentCurrencyAmountNatural": parseFloat(available[0].prices[1].paymentCurrencyAmountNatural * 0.30).toFixed(2)
                                }

                                //add kwd
                                bundle.addFields(
                                    {name: pricesKWD.paymentCurrencyCode, value: pricesKWD.paymentCurrencyAmountNatural + pricesKWD.paymentCurrencySymbol, inline: true}
                                )

                                //prices
                                for(let p = 0; p < available[0].prices.length - 1; p++){
                                    bundle.addFields(
                                        {name: available[0].prices[p].paymentCurrencyCode, value: available[0].prices[p].paymentCurrencyAmountNatural + available[0].prices[p].paymentCurrencySymbol, inline: true}
                                    )
                                }

                                //tumbnail and image
                                if(available[0].displayAssets.length !== 0){

                                    //store the url
                                    var url = available[0].displayAssets[0].url
                                        
                                    //decode and encode
                                    url = decodeURI(url);
                                    url = encodeURI(url);

                                    //add thumbnail
                                    bundle.setThumbnail(url)

                                    //add the image
                                    if(available[0].thumbnail !== null){

                                        //store the url
                                        var url = available[0].thumbnail
                                        
                                        //decode and encode
                                        url = decodeURI(url);
                                        url = encodeURI(url);

                                        //set the image
                                        bundle.setImage(url)
                                    }else{

                                        //store the url
                                        var url = available[0].displayAssets[0].background
                                        
                                        //decode and encode
                                        url = decodeURI(url);
                                        url = encodeURI(url);

                                        //set the image
                                        bundle.setImage(url)
                                    }
                                }else{

                                    //add the image
                                    if(available[0].thumbnail !== null){

                                        //store the url
                                        var url = available[0].thumbnail
                                        
                                        //decode and encode
                                        url = decodeURI(url);
                                        url = encodeURI(url);

                                        //set the image
                                        bundle.setImage(url)
                                    }
                                }

                                await message.send(bundle)
                            
                            }
                        }

                        //store only available bundles
                        for(let i = 0; i < res.data.bundles.length; i++){
                            response[i] = await res.data.bundles[i].offerId
                        }

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("bundles").update({
                            Push: "false"
                        })
                    }
                })
            }
        })
    }
    setInterval(Bundle, 2 * 60000)
}