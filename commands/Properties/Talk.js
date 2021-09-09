module.exports = {
    commands: 'talk',
    type: 'Administrator',
    minArgs: 1,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: (FNBRMENA, message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji, loadingEmoji, greenStatus, redStatus) => {
        const messages = client.channels.cache.find(channel => channel.id === args[0])
        args.shift()
        messages.send(args.join(' '))
    }
}