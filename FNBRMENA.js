const BlogpostsEvents = require('./Events/BlogpostsEvents.js')
const CompBlogpostsEvents = require('./Events/CompBlogpostsEvents.js')
const PAKEvents = require('./Events/PAKEvents.js')
const TwitchDropsEvents = require('./Events/TwitchDropsEvents.js')
const SetEvents = require('./Events/SetEvents.js')
const ShopSectionEvents = require('./Events/ShopSectionEvents.js')
const NewSectionsEvents = require('./Events/ModifiedSectionsEvents.js')
const DynamicBackgroundsEvents = require('./Events/DynamicBackgroundsEvents.js')
const PlaylistsEvents = require('./Events/PlaylistsEvents.js')
const NoticeEvents = require('./Events/NoticeEvents.js')
const UserJoined = require('./Events/User.js')
const ServersEvents = require('./Events/ServersEvents.js')
const Crew = require('./Events/CrewEvents.js')
const AvailableBundle = require('./Events/AvailableBundleEvents.js')
const Commands = require('./Events/Commands.js')
const ItemshopEvents = require('./Events/ItemshopEvents')
const axios = require('axios')
const SubGameInfoEvents = require('./Events/SubGameInfoEvents.js')
const tslib_1 = require("tslib");
const RemindersEvents = require('./Events/RemindersEvents.js')
const zlib_1 = (0, tslib_1.__importDefault)(require("zlib"));
const Discord = require('discord.js')

class FNBRMENA {

    constructor(){

    }

    Colors(Type){

        if(Type === "embed") return "#00ffff"
        if(Type === "embedError") return "#FF0000"
        if(Type === "embedSuccess") return "#0CFF00"
        if(Type === "syntaxError") return "#0000fe"

        //api.ip
        if(Type === "Legendary") return "#e98d4b"
        if(Type === "Epic") return "#e95eff"
        if(Type === "Rare") return "#37d1ff" 
        if(Type === "Uncommon") return "#87e339"
        if(Type === "Common") return "#b1b1b1"
        if(Type === "MarvelSeries") return "#ef3537"
        if(Type === "DCUSeries") return "#6094ce"
        if(Type === "CUBESeries") return "#ff42e7"
        if(Type === "CreatorCollabSeries") return "#52e0e0"
        if(Type === "ColumbusSeries") return "#e7c413"
        if(Type === "ShadowSeries") return "#949494"
        if(Type === "SlurpSeries") return "#53f0ff"
        if(Type === "FrozenSeries") return "#c4dff7"
        if(Type === "LavaSeries") return "#d19635"
        if(Type === "PlatformSeries") return "#8e5eff"

        //fortnite-api.com
        if(Type === "legendary") return "#e98d4b"
        if(Type === "epic") return "#e95eff"
        if(Type === "rare") return "#37d1ff"
        if(Type === "uncommon") return "#87e339"
        if(Type === "common") return "#b1b1b1"
        if(Type === "marvel") return "#ef3537"
        if(Type === "dc") return "#6094ce"
        if(Type === "dark") return "#ff42e7"
        if(Type === "icon") return "#52e0e0"
        if(Type === "starwars") return "#e7c413"
        if(Type === "shadow") return "#949494"
        if(Type === "slurp") return "#53f0ff"
        if(Type === "frozen") return "#c4dff7"
        if(Type === "lava") return "#d19635"
        if(Type === "gaminglegends") return "#8e5eff"
        
    }

    /**
     * Return data about the crew
     * 
     * @param {String} Headers
     * @param {String} Body
     * 
     */
    async Auth(Headers, Body){

        //request token from epicgames servers
        const token = await axios.post("https://account-public-service-prod.ol.epicgames.com/account/api/oauth/token", Body, { headers: Headers })
        .then(res => {
            return res
        }).catch(err => {
            return Promise.reject(err)
        })
        return token

    }

    /**
     * Return the fish history
     * 
     * @param {String} Season
     * @param {String} Lang
     * @example
     * FNBRMENA.listFish(Season, Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async listFish(Season, Lang){

        //request the data and return the response
        return await axios.get(`https://fortniteapi.io/v1/loot/fish?lang=${Lang}&season=${Season}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return the current sets
     * 
     * @param {String} Lang
     * @example
     * FNBRMENA.listSets(Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async listSets(Lang){

        //request the data and return the response
        return await axios.get(`https://fortniteapi.io/v2/items/sets?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return the user fish history
     * 
     * @param {String} playerID
     * @param {String} Lang
     * @example
     * FNBRMENA.getPlayerFishStats(playerID, Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async getPlayerFishStats(playerID, Lang){

        //request the data and return the response
        return await axios.get(`https://fortniteapi.io/v1/stats/fish?accountId=${playerID}&lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return searched user ID
     * 
     * @param {String} PlayerTag
     * @example
     * FNBRMENA.getAccountIdByUsername(PlayerTag)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async getAccountIdByUsername(playerTag){

        var Url = `https://fortniteapi.io/v1/lookup?username=${playerTag}`
        Url = decodeURI(Url);
        Url = encodeURI(Url);

        //request the data and return the response
        return await axios.get(Url, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the tournaments sessions
     * 
     * @param {String} SessionID
     * @example
     * FNBRMENA.Replays(text)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Sessions(SessionID){

        //request the data and return the response
        return await axios.get(`https://fortniteapi.io/v1/events/replay?session=${SessionID}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }
    
    /**
     * Return data about the twitch drops
     * 
     * @example
     * FNBRMENA.TwitchCampaign()
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async TwitchCampaign(){

        //request the data and return the response
        return await axios.post(`https://gql.twitch.tv/gql`, 
        {
            "operationName": "ViewerDropsDashboard",
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "e8b98b52bbd7ccd37d0b671ad0d47be5238caa5bea637d2a65776175b4a23a64"
                }
            }
        },
        { 
            headers: {
                'Content-Type': 'text/plain',
                'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
                'Authorization': 'OAuth ooxgt5r4wa1x151lxaf6pucwrrzhl0'
            }
        }).catch(err => console.log(err))
    }
    
    /**
     * Return data about detailed twitch drops
     * 
     * @param {String} DropID
     * @example
     * FNBRMENA.TwitchDropsDetailed(DropID)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async TwitchDropsDetailed(DropID){

        //request the data and return the response
        return await axios.post(`https://gql.twitch.tv/gql`, 
        {
            "operationName": "DropCampaignDetails",
            "extensions": {
                "persistedQuery": {
                    "version": 1,
                    "sha256Hash": "14b5e8a50777165cfc3971e1d93b4758613fe1c817d5542c398dce70b7a45c05"
                }
            },
            "variables": {
                "dropID": `${DropID}`,
                "channelLogin": "208783238"
            }
        },
        { 
            headers: {
                'Content-Type': 'text/plain',
                'Client-Id': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
                'Authorization': 'OAuth ooxgt5r4wa1x151lxaf6pucwrrzhl0'
            }
        })
    }

    /**
     * Return data about the crew
     * 
     * @param {String} Type
     * @param {String} Lang
     * @example
     * FNBRMENA.Crew(text)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Crew(Type, Lang){

        //request the data and return the response
        if(Type === "list") //return all the crew data
        return await axios.get(`https://fortniteapi.io/v2/crew/history?lang=${Lang}&fields=name,rarity,series,description,id,reactive,type,added,builtInEmote,copyrightedAudio,images,video,audio,gameplayTags,introduction,styles,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        else if(Type === "active") //return the active crew
        return await axios.get(`https://fortniteapi.io/v2/crew?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the crew
     * 
     * @param {String} apiUrl
     * @example
     * FNBRMENA.Request(text)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Request(apiUrl){

        //request the data and return the response
        const response = await axios.get(apiUrl)
        .then(res => {
            return res
        }).catch(err => {
            return Promise.reject(err)
        })
        return response

    }

    /**
     * Return data about the user stats
     * 
     * @param {String} playerTag
     * @param {String} Platform
     * @param {String} Period
     * @example
     * FNBRMENA.Stats(playerTag, Platform, Period)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Stats(playerTag, Platform, Period){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortnite-api.com/v2/stats/br/v2?name=${playerTag}&accountType=${Platform}&timeWindow=${Period}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("Fortnite-Api.com"),} })

    }

    /**
     * Return data about the new cosmetice after an update
     * 
     * @param {String} Lang
     * @example
     * FNBRMENA.CosmeticsNew(Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async CosmeticsNew(Lang){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortnite-api.com/v2/cosmetics/br/new?language=${Lang}`))

    }

    /**
     * Return data about searched sac
     * 
     * @param {String} playerTag
     * @param {String} Platform
     * @param {String} Period
     * @example
     * FNBRMENA.CreatorCodeSearch(SAC)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async CreatorCodeSearch(SAC){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortnite-api.com/v2/creatorcode/search?name=${SAC}`))

    }

    /**
     * Return data about the battlepass
     * 
     * @param {String} Lang
     * @param {String} Season
     * @example
     * FNBRMENA.getBattlepassRewards(Lang, Season)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async getBattlepassRewards(Lang, Season){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortniteapi.io/v2/battlepass?lang=${Lang}&season=${Season}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about all seasons
     * 
     * @param {String} Lang
     * @example
     * FNBRMENA.Seasons(Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Seasons(Lang){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortniteapi.io/v1/seasons/list?lang=${Lang}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the bundles
     * 
     * @param {String} Lang
     * @example
     * FNBRMENA.getBundles(Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async getBundles(Lang){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortniteapi.io/v2/bundles?lang=${Lang}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the itemshop
     * 
     * @param {String} Lang
     * @example
     * FNBRMENA.itemshop(Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async itemshop(Lang){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortniteapi.io/v2/shop?lang=${Lang}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the listCurrentPOI
     * 
     * @param {String} Lang
     * @param {String} Version
     * @example
     * FNBRMENA.listCurrentPOI(Lang, Version)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async listCurrentPOI(Lang, Version){

        //request the data and return the response
        if(Version === "current") return await axios.get(encodeURI(`https://fortniteapi.io/v2/game/poi?lang=${Lang}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        else return await axios.get(encodeURI(`https://fortniteapi.io/v2/game/poi?lang=${Lang}&gameVersion=${Version}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the quests
     * 
     * @param {String} Lang
     * @param {String} Season
     * @example
     * FNBRMENA.listChallenges(Season, Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async listChallenges(Season, Lang){

        //request the data and return the response
        return await axios.get(encodeURI(`https://fortniteapi.io/v3/challenges?season=${Season}&lang=${Lang}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about the quests
     * 
     * @param {String} Coordinates MAP/RAW
     * @example
     * FNBRMENA.listLocations(Season, Lang)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async listLocations(Coordinates){

        //request the data and return the response
        return await axios.get(`https://fortniteapi.io/v2/maps/items/list?coordinates=${Coordinates}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * Return data about a stream using the stream id
     * 
     * @param {String} StreamID the stream id
     * @example
     * FNBRMENA.Streams('pnoHsKsyUcTnFDoDQC')
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Streams(StreamID){

        //blurl to JSON convertor
        const parseBlurlStream = async (stream) => new Promise((res) => {
            zlib_1.default.inflate(stream.slice(8), (err, buffer) => {
                const data = JSON.parse(buffer.toString());
                return res(data);
            })
        })

        //request the data and return the response
        return await axios.get(`https://fortnite-vod.akamaized.net/${StreamID}/master.blurl`,{
            responseType: 'arraybuffer'
        }).then(async res => {
            return await parseBlurlStream(res.data)

        }).catch(async err => {
            return Promise.reject(err)

        })
    }

    /**
     * Return data about a stream using the stream id
     * 
     * @param {String} Lang
     * @param {String} Text
     * @example
     * FNBRMENA.Set(Lang, Text)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async Set(Lang, Text){
        return axios.get(`https://fortnite-api.com/v2/cosmetics/br/search/all?language=${Lang}&set=${Text}`)
    }

    /**
     * Return data about a stream using the stream id
     * 
     * @param {String} Lang
     * @param {String} Options
     * @example
     * FNBRMENA.PAK(Lang, Options)
     * .then(async res => {
     * 
     *        //you will get a response weather the requested data has been found or not
     * 
     * })
     * 
     */
     async PAK(Lang, Options){
        return axios.get(`https://fortnite-api.com/v2/cosmetics/br/search/all?language=${Lang}&${Options}`)
    }

    /**
     * Return data about the playlist
     * 
     * @param {String} Lang
     * @example
     * FNBRMENA.Playlist(lang)
     * .then(async res => {
     * 
     *      //playlist data will be shown if the given parms are valid
     * 
     * })
     * 
     */
     async Playlist(Lang){
        return axios.get(`https://fortniteapi.io/v1/game/modes?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io")}})
    }

    /**
     * Return data about the crew
     * 
     * @param {Access} Token
     * 
     */
     async EpicCalandar(Token){

        //request header
        const Headers = {
            'Content-Type':'application/x-www-form-urlencoded',     
            'Authorization': `bearer ${Token}`   
        }

        //request token from epicgames servers
        const token = await axios.get("https://fortnite-public-service-prod11.ol.epicgames.com/fortnite/api/calendar/v1/timeline", { headers: Headers })
        .then(res => {
            return res
        }).catch(err => {
            return Promise.reject(err)
        })
        return token

    }

    /**
     * Return data about the mapio
     * 
     * 
     */
     async MapIO(){

        //return the crew data
        return await axios.get(`https://fortniteapi.io/v1/maps/list`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * Return data about the map
     * 
     * @param {String} Lang
     * 
     */
     async Map(Lang){

        //return the crew data
        return await axios.get(`https://fortnite-api.com/v1/map?language=${Lang}`)
    }

    /**
     * Return data about the current aes
     * 
     * 
     */
     async AES(){

        //return the crew data
        return await axios.get(`https://fortnite-api.com/v2/aes`)
    }

    /**
     * Return data about the crew
     * 
     * @param {String} Lang
     * 
     */
     async News(Lang){

        //return the crew data
        return await axios.get(`https://fortnite-api.com/v2/news?language=${Lang}`)
    }

    /**
     * Return data about the crew
     * 
     * @param {String} Lang
     * 
     */
     async ActivePlayLists(Lang){

        //return the crew data
        return await axios.get(`https://fortniteapi.io/v1/game/modes?lang=${Lang}&enabled=true`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} Lang 
     * @param {String} Active 
     */
    async Sections(Lang, Active){

        //if i want a full list or just the active once
        if(Active === "Yes"){

            //return active section
            return await axios.get(`https://fortniteapi.io/v2/shop/sections/active?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        }else if(Active === "No"){

            //return all the sections
            return await axios.get(`https://fortniteapi.io/v2/shop/sections/list?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        }
    }

    /**
     * 
     * @param {String} Lang 
     * @param {String} Name 
     * @param {String} Type 
     */
    async SearchByType(Lang, Name, Type, SearchType){

        if(SearchType === "name"){
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,apiTags,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets&type=${Type}&name=${Name}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        }else if(SearchType === "id"){
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,apiTags,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets&type=${Type}&id=${Name}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        }
    }

    /**
     * 
     * @param {String} Lang 
     * @param {String} Type 
     */
     async SearchType(Lang, Type){

        //return the items
        return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,apiTags,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets&type=${Type}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} windowID 
     */
     async tournamentSessions(windowID){

        //return the items
        return await axios.get(`https://fortniteapi.io/v1/events/window?windowId=${windowID}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} Lang 
     */
     async EpicContentEndpoint(Lang){

        //return the items
        return await axios.get(`https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game?lang=${Lang}`)
    }

    /**
     * 
     * @param {String} Lang 
     */
     async CompCalendarEndpoint(Lang){

        //return the items
        return await axios.post(`https://www.epicgames.com/fortnite/competitive/api/${Lang}/calendar`)
    }
    
    /**
     * 
     * @param {String} Lang 
     * @param {String} Type 
     */
     async NPC(Lang, Enabled){

        if(Enabled){
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/game/npc/list?lang=${Lang}&scale=2024&enabled=true`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        }else return await axios.get(`https://fortniteapi.io/v2/game/npc/list?lang=en&scale=2024`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} Lang
     * @param {String} Type
     */
     async List(Lang, Type){

        if(Type === "") //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
            
        else //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&type=${Type}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,previewVideos,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} Lang
     * @param {String} Name
     */
     async SearchNPCDATA(Lang, searchLang, Name){

        //return the item searched by name
        return await axios.get(encodeURI(`https://fortniteapi.io/v2/items/list?searchLang=${searchLang}&lang=${Lang}&name=${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,displayAssets,styles`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

     /**
     * Return data about the an item
     * 
     * @param {String} Lang
     * @param {String} ID
     * 
     */
      async searchByID(Lang, ID){

        //return the item searched by name
        return await axios.get(encodeURI(`https://fortniteapi.io/v2/items/get?id=${ID}&lang=${Lang}`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

    }

    /**
     * 
     * @param {String} Lang
     * @param {String} Type
     * @param {String} Name
     */
     async Search(Lang, Type, Name){

        if(Type === 'name'){

            //return the item searched by name
            return await axios.get(encodeURI(`https://fortniteapi.io/v2/items/list?lang=${Lang}&name=${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,displayAssets,styles`), { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'id'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&id=${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,displayAssets,styles`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'set'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&set.name=${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,displayAssets,styles`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'season'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,styles`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'series'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&series.name=${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,styles`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'langType'){

            var url = `https://fortniteapi.io/v2/items/list?lang=${Lang}${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,grants,styles`

            url = decodeURI(url);
            url = encodeURI(url);

            //return the item searched by id
            return await axios.get(url, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        }else if(Type === 'custom'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}${Name}&fields=id,name,description,price,reactive,previewVideos,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }
    }

    /** 
     * Return access to every event
     * 
     * @param {String} [Client]
     * @param {String} [Admin]
     * @param {String} [array]
     * @param {String} [Type]
     * 
    */
    Events(FNBRMENA, Client, Admin, array, emojisObject, Type){
        
        //return Blogposts access
        if(Type === "Blogposts"){
            BlogpostsEvents(FNBRMENA, Client, Admin, emojisObject)
            CompBlogpostsEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Itemshop access
        if(Type === "Itemshop"){
            ItemshopEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Playlists access
        if(Type === "Playlists"){
            PlaylistsEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Pak access
        if(Type === "Pak"){
            PAKEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Set access
        if(Type === "Set"){
            SetEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return DynamicBackgrounds access
        if(Type === "DynamicBackgrounds"){
            DynamicBackgroundsEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return SubGameInfo access
        if(Type === "SubGameInfo"){
            SubGameInfoEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return ShopSection access
        if(Type === "ShopSection"){
            ShopSectionEvents(FNBRMENA, Client, Admin, emojisObject)
            NewSectionsEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Crew access
        if(Type === "Crew"){
            Crew(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Notice access
        if(Type === "Notice"){
            NoticeEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Bundles access
        if(Type === "AvailableBundle"){
            AvailableBundle(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Servers access
        if(Type === "Servers"){
            ServersEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return Reminders access
        if(Type === "Reminders"){
            RemindersEvents(FNBRMENA, Client, Admin, emojisObject)
        }
        
        //return Reminders access
        if(Type === "Twitch"){
            TwitchDropsEvents(FNBRMENA, Client, Admin, emojisObject)
        }

        //return UserJoined access
        if(Type === "UserJoined"){
            UserJoined(Client, Admin)
        }

        //return Commands access
        if(Type === "Commands"){
            Commands(Client, Admin, array)
        }
    }

    /**
     * 
     * @param {
     * } Type 
     * @param {*} Lang 
     * @returns 
     */
    Logs(admin, client, Discord, message, alias, lang, text, err, emojisObject){

        //if user took to long to excute the command
        if(err.message.includes("time")){
                        
            const outOfTimeError = new Discord.EmbedBuilder()
            outOfTimeError.setColor(this.Colors("embedError"))
            outOfTimeError.setTitle(`${this.Errors("Time", lang)} ${emojisObject.errorEmoji}`)
            message.reply({embeds: [outOfTimeError], components: []})

        }else{

            //logs channel
            const logsChannel = client.channels.cache.find(channel => channel.id === require('./Configs/config.json').events.Logs)

            //create error embed
            const anErrorHappened = new Discord.EmbedBuilder()
            anErrorHappened.setColor(this.Colors("embedError"))
            anErrorHappened.setThumbnail('https://imgur.com/yjMpDe3.png')
            if(lang === "en"){
                anErrorHappened.setTitle(`Ouch, Errr thats awkward ${emojisObject.errorEmoji}`)
                anErrorHappened.setDescription(`An error occurred while getting data for the \`${alias}\` command. A complete log has been sent to the developer and a fix is being worked on right now. If this issue took longer than necessary, please [__CONTACT OUR SUPPORT TEAM__](https://discord.com/channels/746143287383031878) ASAP.\n\nWe're sorry for the inconvenience\n\`\`\`yaml\n${err.message}\`\`\``)
            }
            else if(lang === "ar"){
                anErrorHappened.setTitle(`عذرا لقد حصلت مشكلة ${emojisObject.errorEmoji}`)
                anErrorHappened.setDescription(`لقد حدثت مشكلة ما اثناء جمع بيانات امر \`${alias}\`. تم ارسال ملف تسجيل يحتوي على جميع المعلومات المهمه للمطورين و المشكلة يتم حلها حاليا. في حال المشكلة اخذت وقت اكثر من المعتاد, من فضلك [__تواصل مع فريق الدعم__](https://discord.com/channels/746143287383031878) في اسرع وقت ممكن.\n\nنأسف على الإزعاج\n\`\`\`yaml\n${err.message}\`\`\``)
            }
            message.reply({embeds: [anErrorHappened]})

            //logs
            const logs = new Discord.EmbedBuilder()
            logs.setColor(this.Colors("embedError"))
            logs.setTitle(`Error happened in ${alias.toUpperCase()}`)
            if(err.isAxiosError) logs.setDescription(`Command: \`${alias}\`\nUser: \`${message.author.tag}\`\nDate: \`${new Date()}\`\nLanguage: \`${lang}\`\nMessageID: \`${message.id}\`\nChannel: \`${message.channel.name} | ${message.channel.id}\`\nMessage Content: \`${message.content}\n\`Request Status: \`${err.response.data.status}\`\n\nError:\`\`\`json\n${JSON.stringify(err.response.data)}\`\`\``)
            else logs.setDescription(`Command: \`${alias}\`\nUser: \`${message.author.tag}\`\nDate: \`${new Date()}\`\nLanguage: \`${lang}\`\nMessageID: \`${message.id}\`\nChannel: \`${message.channel.name} | ${message.channel.id}\`\nMessage Content: \`${message.content}\`\n\nError:\`\`\`yaml\n${err.stack}\`\`\``)
            logsChannel.send({embeds: [logs]})
        }
    }

    /**
     * 
     * @param {
     * } Type 
     * @param {*} Lang 
     * @returns 
     */
    eventsLogs(admin, client, err, event){

        //logs channel
        const logsChannel = client.channels.cache.find(channel => channel.id === require('./Configs/config.json').events.Logs)

        //logs
        const logs = new Discord.EmbedBuilder()
        logs.setColor(this.Colors("embedError"))
        logs.setTitle(`Error happened in ${event.toUpperCase()} event`)
        if(err.isAxiosError) logs.setDescription(`Event: \`${event}\`\nDate: \`${new Date()}\`\nRequest Status: \`${err.response.data.status}\`\n\nError:\`\`\`json\n${JSON.stringify(err.response.data)}\`\`\``)
        else logs.setDescription(`Event: \`${event}\`\nDate: \`${new Date()}\`\n\nError:\`\`\`json\n${JSON.stringify(err.stack)}\`\`\``)
        logsChannel.send({embeds: [logs]})
    }

    /**
     * Return all the errors messages 
     * 
     * @param {String} Type 
     * @param {String [EN || AR]} Lang 
     * 
     */
    Errors(Type, Lang){

        //Time error
        if(Type === "Time"){
            if(Lang === "en") return `Sorry we canceled your process becuase no action has been taken`
            else if(Lang === "ar") return `لقد تم ايقاف الامر لعدم اختيار طريقة`
        }

        //Out of range error
        if(Type === "outOfRange"){
            if(Lang === "en") return `Sorry we canceled your process becuase u selected a number out of range`
            else if(Lang === "ar") return `تم ايقاف الامر بسبب اختيارك لرقم خارج النطاق`
        }
    }

    /**
     * Important and risky data for all APIKeys that FNBRMENA use
     * 
     * @param {String} Type  
     * 
     */
    APIKeys(Type){
        if(Type === "FortniteAPI.io"){
            return "d4ce1562-839ff66b-3946ccb6-438eb9cf"
        }

        if(Type === "Fortnite-Api.com"){
            return "0b0ba03b-1452-4dc1-b48e-09e6c34726f3"
        }

        if(Type === "DiscordBotToken"){
            return 'Nzk5OTkxNDQ2MDY0MDcwNjU4.YALoFw.9Y3FeQRPrkWTMPzWE1oCSs88O-g'
        }

        if(Type === "FNBRJS"){
            return "964da610-56e8-4e52-8ec1-8d0bdc6f9892"
        }
    }

    /**
     * 
     * @param {Servers Access} Admin 
     * @param {Message} Message 
     * @param {Command} Alias
     * @param {String} Type 
     * 
     */
    async Admin(Admin, Message, Alias, Type){

        //seeting up the db firestore
        var db = await Admin.firestore()
        
        //get the prefix from the database
        if(Type === "Prefix"){
            var prefix = await Admin.database().ref("ERA's").child("Prefix").once('value')
            .then(async data => {
                return data.val()
            })
            return prefix
        }

        //get the user timezone
        if(Type === "Timezone"){
            var Timezone = await Admin.database().ref("ERA's").child("Users").child(Message.author.id).once('value')
            .then(async data => {
                return data.val().timezone;
            })
            
            if(Timezone !== undefined) return Timezone
            else return "America/Los_Angeles"
        }

        //get the user language
        if(Type === "Lang"){
            var Lang = await Admin.database().ref("ERA's").child("Users").child(Message.author.id).once('value')
            .then(async data => {
                return data.val().lang;
            })
            return Lang
        }

        //get the user data
        if(Type === "User"){
            var User = await db.collection("Users").doc(Message.author.id).get()
            .then(async data => {
                return data.data();
            })
            return User
        }

        //get the bot status
        if(Type === "Status"){
            var status = await Admin.database().ref("ERA's").child("Server").child("Status").once('value')
            .then(async data => {
                return data.val().Bot;
            })
            return status
        }

        //get the command data
        if(Type === "Command"){
            var command = await db.collection("Commands").doc(Alias).get()
            .then(async data => {
                return data.data();
            })
            return command
        }

        //get the moderation data
        if(Type === "Moderation"){
            var command = await db.collection("Moderation").doc("Roles").get()
            .then(async data => {
                return data.data();
            })
            return command
        }

        //check perms for an a command
        if(Type === "Perms"){
            var perms = await db.collection("Commands").doc(Alias).get()
            .then(async data => {
                return data.data().commandData.permissions
            })
            return perms
        }

        //get the events status
        if(Type === "Events"){
            var events = await Admin.database().ref("ERA's").child("Events").once('value')
            .then(async data => {
                if(data.val() !== null){
                    return events = data.val()
                }else{
                    return []
                }
            })
            return events
        }

        //get the progress status
        if(Type === "Progress"){
            var progress = await Admin.database().ref("ERA's").child("Progress").once('value')
            .then(async data => {
                if(data.val() !== null){
                    return progress = data.val()
                }else{
                    return []
                }
            })
            return progress
        }

        //get the shopsections status
        if(Type === "ShopSections"){
            var sectionsGradient = await Admin.database().ref("ERA's").child("ShopSections").once('value')
            .then(async data => {
                if(data.val() !== null){
                    return sectionsGradient = data.val()
                }else{
                    return []
                }
            })
            return sectionsGradient
        }

        //get the Games status
        if(Type === "Games"){
            var Games = await Admin.database().ref("ERA's").child("Games").once('value')
            .then(async data => {
                return data.val()
            })
            return Games
        }
    }
}

module.exports = FNBRMENA
