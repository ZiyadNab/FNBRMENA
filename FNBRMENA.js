const BlogpostsEvents = require('./Events/BlogpostsEvents')
const PAKEvents = require('./Events/PAKEvents.js')
const SetEvents = require('./Events/SetEvents.js')
const ShopSectionEvents = require('./Events/ShopSectionEvents.js')
const PlaylistsEvents = require('./Events/PlaylistsEvents.js')
const NoticeEvents = require('./Events/NoticeEvents.js')
const UserJoined = require('./Events/User.js')
const ServersEvents = require('./Events/ServersEvents.js')
const Crew = require('./Events/CrewEvents.js')
const AvailableBundle = require('./Events/AvailableBundleEvents.js')
const Commands = require('./Events/Commands.js')
const ItemshopEvents = require('./Events/ItemshopEvents')
const axios = require('axios')

class FNBRMENA {

    constructor(){

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

    async Sections(Lang, Active){

        //if i want a full list or just the active once
        if(Active === "Yes"){

            //return active section
            return await axios.get(`https://fn-api.com/api/shop/sections?lang=${Lang}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
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
     async SearchByType(Lang, Name, Type){

        //return active section
        return await axios.get(`ttps://fortniteapi.io/v2/items/list?lang=${Lang}&type=${Type}&name=${Name}`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
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
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&name=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'id'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&id=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'set'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&set.name=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'season'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'series'){

            //return the item searched by id
            return await axios.get(`https://fortniteapi.io/v2/items/list?lang=${Lang}&series.name=${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`, { headers: {'Content-Type': 'application/json','Authorization': this.APIKeys("FortniteAPI.io"),} })
        
        }else if(Type === 'langType'){

            var url = `https://fortniteapi.io/v2/items/list?lang=${Lang}${Name}&fields=id,name,description,price,reactive,copyrightedAudio,builtInEmote,upcoming,releaseDate,lastAppearance,rarity,series,added,type,images,gameplayTags,battlepass,set,introduction,shopHistory`

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
    Events(Client, Admin, array, Type){
        
        //return Blogposts access
        if(Type === "Blogposts"){
            BlogpostsEvents(Client, Admin)
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
            SetEvents(Client, Admin)
        }

        //return ShopSection access
        if(Type === "ShopSection"){
            ShopSectionEvents(Client, Admin)
        }

        //return ShopSection access
        if(Type === "Crew"){
            Crew(Client, Admin)
        }

        //return Notice access
        if(Type === "Notice"){
            NoticeEvents(Client, Admin)
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
    }
}

module.exports = FNBRMENA