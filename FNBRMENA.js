const BlogpostsEvents = require('./Events/BlogpostsEvents.js')
const CompBlogpostsEvents = require('./Events/CompBlogpostsEvents.js')
const PAKEvents = require('./Events/PAKEvents.js')
const SetEvents = require('./Events/SetEvents.js')
const ShopSectionEvents = require('./Events/ShopSectionEvents.js')
const NewSectionsEvents = require('./Events/ModifiedSectionsEvents.js')
const DynamicBackgroundsEvents = require('./Events/DynamicBackgroundsEvents.js')
const NewTournamentsEvents = require('./Events/NewTournamentsEvents.js')
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
const AuthHandler = require('./Events/AuthHandler.js')

class FNBRMENA {

    constructor(){

    }

    Colors(Type){

        if(Type === "embed") return "#00ffff"
        if(Type === "embedError") return "#00ffff"

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
     * Return data about the crew
     * 
     * @param {String} Lang
     * @param {String} Type
     * @param {String} Name
     * 
     */
     async PlayList(Lang, Type, Name){

        if(Type === "All") //return the crew data
        return await axios.get(`https://fortniteapi.io/v1/game/modes?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        if(Type === "Name") //return the crew data
        return await axios.get(`https://fortniteapi.io/v1/game/modes?lang=${Lang}&name=${Name}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

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
     * @param {Access} Token
     * 
     */
     async EpicCalandar(Token){

        //request header
        const Headers = {
            'Content-Type':'application/json',     
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
     * Return data about the crew
     * 
     * @param {String} Lang
     * 
     */
     async Map(Lang){

        //return the crew data
        return await axios.get(`https://fortnite-api.com/v1/map?language=${Lang}`)
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
     * Return data about the crew
     * 
     * @param {String} Lang
     * 
     */
    async Crew(Lang){
        return await axios.get(`https://fortniteapi.io/v2/game/crew?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
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
     * @param {String} Name 
     * @param {String} Type 
     */
     async SearchByType(Lang, Name, Type, SearchType){

        if(SearchType === "name"){
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets&type=${Type}&name=${Name}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        }else if(SearchType === "id"){
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets&type=${Type}&id=${Name}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        }
    }

    /**
     * 
     * @param {String} Lang 
     * @param {String} Type 
     */
     async NPC(Lang, Enabled){

        if(Enabled === "true"){
            //return the items
            return await axios.get(`https://fortniteapi.io/v1/game/npc/list?lang=${Lang}&coordinates=map&enabled=true`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        }else return await axios.get(`https://fortniteapi.io/v1/game/npc/list?lang=${Lang}&coordinates=map`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} Lang 
     * @param {String} Type 
     */
     async SearchType(Lang, Type){

        //return the items
        return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets&type=${Type}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
    }

    /**
     * 
     * @param {String} Lang
     * @param {String} Type
     */
     async List(Lang, Type){

        if(Type === ""){
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        }else{
            //return the items
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&type=${Type}&fields=name,rarity,series,description,id,price,reactive,type,added,builtInEmote,copyrightedAudio,upcoming,releaseDate,lastAppearance,images,video,audio,gameplayTags,apiTags,battlepass,set,introduction,shopHistory,styles,grants,grantedBy,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        }
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
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&name=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory,grants,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'id'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&id=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory,grants,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'set'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&set.name=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory,grants,displayAssets`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'season'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory,grants`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'series'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&series.name=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory,grants`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'langType'){

            var url = `https://fortniteapi.io/v2/items/list?lang=${Lang}${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory,grants`

            url = decodeURI(url);
            url = encodeURI(url);

            //return the item searched by id
            return await axios.get(url, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })

        }else if(Type === 'custom'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
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
    Events(FNBRMENA, Client, Admin, array, Type){
        
        //return Blogposts access
        if(Type === "Blogposts"){
            BlogpostsEvents(Client, Admin)
            CompBlogpostsEvents(Client, Admin)
        }

        //return Itemshop access
        if(Type === "Itemshop"){
            ItemshopEvents(Client, Admin)
        }

        //return Playlists access
        if(Type === "Playlists"){
            PlaylistsEvents(Client, Admin)
        }

        //return Pak access
        if(Type === "Pak"){
            PAKEvents(Client, Admin)
        }

        //return Set access
        if(Type === "Set"){
            SetEvents(FNBRMENA, Client, Admin)
        }

        //return Set access
        if(Type === "DynamicBackgrounds"){
            DynamicBackgroundsEvents(FNBRMENA, Client, Admin)
        }

        //return Set access
        if(Type === "SubGameInfo"){
            SubGameInfoEvents(FNBRMENA, Client, Admin)
        }

        //return ShopSection access
        if(Type === "ShopSection"){
            ShopSectionEvents(FNBRMENA, Client, Admin)
            NewSectionsEvents(FNBRMENA, Client, Admin)
        }

        //return ShopSection access
        if(Type === "Crew"){
            Crew(Client, Admin)
        }

        //return ShopSection access
        if(Type === "NewTournaments"){
            NewTournamentsEvents(FNBRMENA, Client, Admin)
        }

        //return Notice access
        if(Type === "Notice"){
            NoticeEvents(FNBRMENA, Client, Admin)
        }

        //return Bundles access
        if(Type === "AvailableBundle"){
            AvailableBundle(Client, Admin)
        }

        //return Bundles access
        if(Type === "Servers"){
            ServersEvents(Client, Admin)
        }

        //return UserJoined access
        if(Type === "UserJoined"){
            UserJoined(Client, Admin)
        }

        //return ShopSCommandsection access
        if(Type === "Commands"){
            Commands(Client, Admin, array)
        }

         //return Itemshop access
         if(Type === "Auth"){
            AuthHandler(FNBRMENA, Client, Admin)
        }
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
            if(Lang === "en"){
                return `Sorry we canceled your process becuase no action has been taken`
            }else if(Lang === "ar"){
                return `لقد تم ايقاف الامر لعدم اختيار طريقة`
            }
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

        if(Type === "FortniteAPI.com"){
            return "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea"
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
        
        //get the prefix from the database
        if(Type === "Prefix"){
            var prefix = await Admin.database().ref("ERA's").child("Prefix").once('value')
            .then(async data => {
                return data.val()
            })
            return prefix
        }

        //get the user language
        if(Type === "Lang"){
            var Lang = await Admin.database().ref("ERA's").child("Users").child(Message.author.id).once('value')
            .then(async data => {
                return data.val().lang;
            })
            return Lang
        }

        //get the bot status
        if(Type === "Status"){
            var status = await Admin.database().ref("ERA's").child("Server").child("Status").once('value')
            .then(async data => {
                return data.val().Bot;
            })
            return status
        }

        //get the command status
        if(Type === "Command"){
            var status = await Admin.database().ref("ERA's").child("Commands").child(Alias).child("Active").once('value')
            .then(async data => {
                return data.val().Status;
            })
            return status
        }

        //check perms for an a command
        if(Type === "Perms"){
            var perms = await Admin.database().ref("ERA's").child("Commands").child(Alias).child("Perms").child("0").once('value')
            .then(async data => {
                if(data.val() !== null){
                    return perms = data.val()
                }else{
                    return []
                }
            })
            return perms
        }

        //check roles for an a command
        if(Type === "Roles"){
            var roles = await Admin.database().ref("ERA's").child("Commands").child(Alias).child("Roles").child("0").once('value')
            .then(async data => {
                if(data.val() !== null){
                    return roles = data.val()
                }else{
                    return []
                }
            })
            return roles
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
    }
}

module.exports = FNBRMENA