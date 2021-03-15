const fs = require('fs')

module.exports = {
    commands: 'status',
    expectedArgs: '',
    minArgs: 0,
    maxArgs: 0,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, arguments, text, Discord, client) => {
        message.channel.send(message.author.id)
    },
    
    requiredRoles: []
}