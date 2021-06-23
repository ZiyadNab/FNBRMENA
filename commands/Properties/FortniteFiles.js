const fs = require('fs')
const axios = require('axios')

module.exports = {
    commands: 'export',
    expectedArgs: '[ The file path ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        axios.get(`https://benbot.app/api/v1/exportAsset?path=${text}`)
        .then(async res => {

            message.channel.send(res.data)
        })
    }
}