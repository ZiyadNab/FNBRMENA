const Canvas = require('canvas');
const fs = require('fs');
const axios = require('axios')
const fnbrjs = require('fnbr.js');
const fnbrco = new fnbrjs('964da610-56e8-4e52-8ec1-8d0bdc6f9892');
const FortniteAPI = require("fortniteapi.io-api");
const fortniteAPI = new FortniteAPI('d4ce1562-839ff66b-3946ccb6-438eb9cf');
const fort = require("fortnite-api-com");
const config = {
  apikey: "a7eabb1fa5a6e59cbcda3a6885d42f02be0d76ea",
  language: "en",
  debug: true
};
var query = {
    matchMethod: "contains",
    name: "flash",
    language:"en"
  };

  var settings = {
    lang: "ar"
  }

var Fortnite = new fort(config);

module.exports = {
    commands: 't',
    expectedArgs: '<Test>',
    minArgs: 0,
    maxArgs: null,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord) => {

      axios.get("https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game").then(res => {
        console.log(res.data)
      })
        
    },
    
    requiredRoles: []
}