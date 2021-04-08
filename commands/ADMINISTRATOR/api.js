module.exports = {
    commands: 'api',
    expectedArgs: '[ Name Of the Command ] [ The Permission ]',
    minArgs: 2,
    maxArgs: 2,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin) => {

        admin.database().ref("ERA's").child("Commands").child(args[0]).update({
            API: args[1]
        })

    },
    requiredRoles: []
}