module.exports = {
    commands: 'talk',
    expectedArgs: '[ chat id + message ]',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {
        const messages = client.channels.cache.find(channel => channel.id === args[0])
        args.shift()
        messages.send(args.join(' '))
    }
}