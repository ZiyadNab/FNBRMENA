const fs = require('fs')

module.exports = {
    commands: 's',
    type: 'Fortnite Private Server Athena File',
    minArgs: 1,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        FNBRMENA.Search("en", "set", text)
        .then(async res => {

            
            const catalogTemplate = {
                "name": "BRSpecialFeatured",
                "catalogEntries": []
            }

            //loop through every item
            for(const i of res.data.items){
                console.log(i)

                if(i.gameplayTags.includes("Cosmetics.Source.ItemShop") && i.type.id !== "backpack" && i.type.id !== "loadingscreen"){

                    //itemGrants
                    if(i.type.id === "outfit") var itemGrantType = "AthenaCharacter"
                    else if(i.type.id === "backpack") var itemGrantType = "AthenaBackpack"
                    else if(i.type.id === "pickaxe") var itemGrantType = "AthenaPickaxe"
                    else if(i.type.id === "glider") var itemGrantType = "AthenaGlider"
                    else if(i.type.id === "contrail") var itemGrantType = "AthenaSkyDiveContrail"
                    else if(i.type.id === "emote") var itemGrantType = "AthenaDance"
                    else if(i.type.id === "wrap") var itemGrantType = "AthenaItemWrap"
                    else if(i.type.id === "music") var itemGrantType = "AthenaMusicPack"
                    else if(i.type.id === "loadingscreen") var itemGrantType = "AthenaLoadingScreen"
                    const itemGrants = [
                        {
                            "templateId": `${itemGrantType}:${i.id}`,
                            "quantity": 1
                        }
                    ]
                    for(const p of i.grants){

                        if(p.type.id === "outfit") var itemGrantType = "AthenaCharacter"
                        else if(p.type.id === "backpack") var itemGrantType = "AthenaBackpack"
                        else if(p.type.id === "pickaxe") var itemGrantType = "AthenaPickaxe"
                        else if(p.type.id === "glider") var itemGrantType = "AthenaGlider"
                        else if(p.type.id === "contrail") var itemGrantType = "AthenaSkyDiveContrail"
                        else if(p.type.id === "emote") var itemGrantType = "AthenaDance"
                        else if(p.type.id === "wrap") var itemGrantType = "AthenaItemWrap"
                        else if(p.type.id === "music") var itemGrantType = "AthenaMusicPack"
                        else if(p.type.id === "loadingscreen") var itemGrantType = "AthenaLoadingScreen"
                        itemGrants.push({
                            "templateId": `${itemGrantType}:${p.id}`,
                            "quantity": 1
                        })
                    }

                    catalogTemplate.catalogEntries.push({
                        "devName": i.name,
                        //"offerId": "v2:/060192a39078ad65004a528909b0c8430af14ffc6f64a2baea23de1466e72426",
                        "fulfillmentIds": [],
                        "dailyLimit": -1,
                        "weeklyLimit": -1,
                        "monthlyLimit": -1,
                        "categories": [
                            "Panel 1"
                        ],
                        "prices": [
                            {
                                "currencyType": "MtxCurrency",
                                "currencySubType": "",
                                "regularPrice": i.price,
                                "dynamicRegularPrice": i.price,
                                "finalPrice": i.price,
                                "saleExpiration": "9999-12-31T23:59:59.999Z",
                                "basePrice": i.price
                            }
                        ],
                        "meta": {
                            "NewDisplayAssetPath": `/Game/Catalog/NewDisplayAssets/DAv2_${i.id}.DAv2_${i.id}`,
                            "SectionId": "fnbrmena",
                            "TileSize": "Normal",
                            "AnalyticOfferGroupId": "18",
                            "FirstSeen": i.releaseDate
                        },
                        "matchFilter": "",
                        "filterWeight": 0.0,
                        "appStoreId": [],
                        "requirements": [
                            {
                                "requirementType": "DenyOnItemOwnership",
                                "requiredId": `${itemGrantType}:${i.id.toLowerCase()}`,
                                "minQuantity": 1
                            }
                        ],
                        "offerType": "StaticPrice",
                        "giftInfo": {
                            "bIsEnabled": true,
                            "forcedGiftBoxTemplateId": "",
                            "purchaseRequirements": [],
                            "giftRecordIds": []
                        },
                        "refundable": true,
                        "metaInfo": [
                            {
                                "key": "NewDisplayAssetPath",
                                "value": `/Game/Catalog/NewDisplayAssets/DAv2_${i.id}.DAv2_${i.id}`
                            },
                            {
                                "key": "SectionId",
                                "value": "fnbrmena"
                            },
                            {
                                "key": "TileSize",
                                "value": "Normal"
                            },
                            {
                                "key": "AnalyticOfferGroupId",
                                "value": "18"
                            },
                            {
                                "key": "FirstSeen",
                                "value": i.releaseDate
                            }
                        ],
                        "itemGrants": itemGrants,
                        "additionalGrants": [],
                        "sortPriority": -1,
                        "catalogGroupPriority": 0
                    })
                }
            }

            fs.writeFileSync('./Shop.json', JSON.stringify(catalogTemplate, null, 2))
        })
    }
}