const axios = require('axios')
const Discord = require('discord.js')
const moment = require('moment')
const config = require('../Coinfigs/config.json')

module.exports = (client, admin) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.Bundles)

    //result
    var response = []
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

                axios.get('https://fortniteapi.io/v2/bundles?lang=' + lang, { headers: {'Content-Type': 'application/json','Authorization': "d4ce1562-839ff66b-3946ccb6-438eb9cf",} })
                .then(async res => {

                    //store data when the bot if on
                    if(number === 0){

                        //filter and store only available bundles
                        response = await res.data.bundles.filter(bundle => {
                            return bundle.available === true
                        })

                        number++
                    }

                    //if the client wants to pust data
                    if(push === "true"){
                        response = []
                    }

                    //get the avaliable bundles att
                    available = await res.data.bundles.filter(bundle => {
                        return bundle.available === true
                    })

                    //compare diff
                    if(JSON.stringify(available) !== JSON.stringify(response)){

                        //diff has been found now loop throw all the available bundles
                        for(let i = 0; i < available.length; i++){

                            //if there is a new avaliable bundle
                            if(!response.includes(available[i])){

                                //creating embed
                                const bundle = new Discord.MessageEmbed()

                                //add color
                                bundle.setColor('#BB00EE')

                                //add title
                                bundle.setTitle(available[i].name)

                                //add description
                                bundle.setDescription(available[i].description)

                                //moment language
                                moment.locale(lang)

                                //add the dates
                                if(lang === "en"){
                                    if(available[i].expiryDate !== null){
                                        bundle.addFields(
                                            {name: "Available", value: "Yes!"},
                                            {name: "Available Since", value: moment(available[i].viewableDate).format("dddd, MMMM Do of YYYY")},
                                            {name: "Will be gone at", value: moment(available[i].expiryDate).format("dddd, MMMM Do of YYYY")}
                                        )
                                    }else{
                                        bundle.addFields(
                                            {name: "Available", value: "Yes!"},
                                            {name: "Available Since", value: moment(available[i].viewableDate).format("dddd, MMMM Do of YYYY")},
                                            {name: "Will be gone at", value: "No yet known"}
                                        )
                                    }
                                }else if(lang === "ar"){
                                    if(available[i].expiryDate !== null){
                                        bundle.addFields(
                                            {name: "متاحة للشراء", value: "نعم"},
                                            {name: "متاحة منذ", value: moment(available[i].viewableDate).format("dddd, MMMM Do من YYYY")},
                                            {name: "سوف تغادر في", value: moment(available[i].expiryDate).format("dddd, MMMM Do من YYYY")}
                                        )
                                    }else{
                                        bundle.addFields(
                                            {name: "متاحة للشراء", value: "نعم"},
                                            {name: "متاحة منذ", value: moment(available[i].viewableDate).format("dddd, MMMM Do من YYYY")},
                                            {name: "سوف تغادر في", value: "لا يوجد تاريخ معلوم حتى الان"}
                                        )
                                    }
                                }

                                //prices
                                for(let p = 0; p < available[i].prices.length; p++){
                                    bundle.addFields(
                                        {name: available[i].prices[p].paymentCurrencyCode, value: available[i].prices[i].paymentCurrencyAmountNatural + available[i].prices[i].paymentCurrencySymbol, inline: true}
                                    )
                                }

                                //tumbnail and image
                                if(available[i].displayAssets.length !== 0){

                                    //add thumbnail
                                    bundle.setThumbnail(available[i].displayAssets[0].url)

                                    //add the image
                                    if(available[i].thumbnail !== null){
                                        bundle.setImage(available[i].thumbnail)
                                    }else{
                                        available[i].displayAssets[0].background
                                    }
                                }else{

                                    //add the image
                                    if(available[i].thumbnail !== null){
                                        bundle.setImage(available[i].thumbnail)
                                    }
                                }

                                await message.send(bundle)
                            
                            }
                        }
                        response = await available

                        //trun off push if enabled
                        admin.database().ref("ERA's").child("Events").child("bundles").update({
                            Push: "false"
                        })
                    }
                })
            }
        })
    }
    setInterval(Bundle, 0.5 * 60000)
}