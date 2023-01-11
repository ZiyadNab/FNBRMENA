const moment = require('moment')

module.exports = async (client, admin, commandsDataList) => {

    // Seeting up the db firestore
    var db = await admin.firestore()

    // Commands collection
    const firestoreCommands = await db.collection("Commands")
    const commandList = await firestoreCommands.get()
    const commands = []

    // Add all the commands to an array
    for(var command of commandsDataList){

        if(typeof command.commands === 'string') {
            command.commands = [command.commands]
        }

        commands.push(command.commands[0])
    }

    // If the command in database doesn't have a file then delete it
    for(const data of commandList.docs)
        if(!commands.includes(data.id)){

            // Get the user usersBanned
            const usersBanned = await firestoreCommands.doc(data.id).collection("usersBanned").get()

            // Batch
            const batch = await admin.firestore().batch()
            
            // Delete all usersBanned if there is any
            await usersBanned.forEach(async doc => {
                batch.delete(doc.ref)
            })

            // Commit all changes
            await batch.commit()

            await firestoreCommands.doc(data.id).delete()
        }

    // Loop through every command from the bot
    for(var data of commandsDataList){

        if(typeof data.commands === 'string') {
            data.commands = [data.commands]
        }

        // Default data
        const {
            type = null,
            descriptionEN = 'There is no explaination for this command YET',
            descriptionAR = 'لايوجد تعليمات على هذا الأمر للأن',
            expectedArgsEN = 'Just use the command its self no arguments needed',
            hintEN = false,
            hintAR = false,
            expectedArgsAR = 'فقط استعمل الأمر بدون اي شي اضافي',
            argsExample = [false],
            minArgs = 0,
            maxArgs = null,
            cooldown = -1,
        } = data

        // A json object to store in firestore database 
        const commandData = {
            aliases: data.commands,
            added: `${moment().format()}`,
            commandData: {
                type: type,
                descriptionEN: descriptionEN,
                descriptionAR: descriptionAR,
                expectedArgsEN: expectedArgsEN,
                expectedArgsAR: expectedArgsAR,
                hintEN: hintEN,
                hintAR: hintAR,
                argsExample: argsExample,
                minArgs: minArgs,
                maxArgs: maxArgs,
                showInCommands: false,
                premium: false,
                cooldown: {
                    filesSource: true,
                    filesCooldown: cooldown,
                    serversCooldown: -1
                },
                commandStatus: {
                    status: true,
                    by: null,
                    date: null,
                    reasonEN: null,
                    reasonAR: null,
                },
                permissions: [],
                roles: [],
            },
            allowedChats: [],
        }

        // Get the path for a command in firestore
        const commandDoc = await firestoreCommands.doc(data.commands[0])
        const snapshot = await commandDoc.get()

        // Check if the command data exists or not
        if(!snapshot.exists) await commandDoc.set(commandData)  // Add the commandData object to the database
        else{

            // Check if the aliases has been changed
            if(data.commands !== snapshot.data().aliases){

                // Json object to store in firestore database 
                const updatedCommandData = {
                    aliases: data.commands
                }

                // Update aliases
                await commandDoc.update(updatedCommandData); 
            }

            if(argsExample !== snapshot.data().commandData.argsExample) await commandDoc.update({
                'commandData.argsExample': argsExample
            })

            if(cooldown !== snapshot.data().commandData.cooldown) await commandDoc.update({
                'commandData.cooldown.filesCooldown': cooldown
            })

            if(descriptionAR !== snapshot.data().commandData.descriptionAR) await commandDoc.update({
                'commandData.descriptionAR': descriptionAR
            })

            if(descriptionEN !== snapshot.data().commandData.descriptionEN) await commandDoc.update({
                'commandData.descriptionEN': descriptionEN
            })

            if(expectedArgsAR !== snapshot.data().commandData.expectedArgsAR) await commandDoc.update({
                'commandData.expectedArgsAR': expectedArgsAR
            })

            if(expectedArgsEN !== snapshot.data().commandData.expectedArgsEN) await commandDoc.update({
                'commandData.expectedArgsEN': expectedArgsEN
            })

            if(hintAR !== snapshot.data().commandData.hintAR) await commandDoc.update({
                'commandData.hintAR': hintAR
            })

            if(hintEN !== snapshot.data().commandData.hintEN) await commandDoc.update({
                'commandData.hintEN': hintEN
            })

            if(maxArgs !== snapshot.data().commandData.maxArgs) await commandDoc.update({
                'commandData.maxArgs': maxArgs
            })

            if(minArgs !== snapshot.data().commandData.minArgs) await commandDoc.update({
                'commandData.minArgs': minArgs
            })

            if(type !== snapshot.data().commandData.type) await commandDoc.update({
                'commandData.type': type
            })
        }
    }
}