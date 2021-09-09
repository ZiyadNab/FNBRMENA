const moment = require('moment')

module.exports = async (client, admin, commandsDataList) => {

    //seeting up the db firestore
    var db = await admin.firestore()

    //commands collection
    const firestoreCommands = await db.collection("Commands")
    const commandList = await firestoreCommands.get()
    const commands = []

    //add all the commands to an array
    for(const command of commandsDataList) commands.push(command.commands)

    //loop throw every command from the database
    for(const data of commandList.docs)
        if(!commands.includes(data.id)) await firestoreCommands.doc(data.id).delete()

    //loop throw every command from the bot
    for(var data of commandsDataList){

        if(typeof data.commands === 'string') {
            data.commands = [data.commands]
        }

        //default data
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

        //json object to store in firestore database 
        const commandData = {
            commandStatus: {
                Status: true,
                by: null,
                date: null,
                reasonEN: null,
                reasonAR: null,
            },
            Aliases: data.commands,

            //add the command data stuff inside commandData
            commandData: {
                showInCommands: true,
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
                cooldown: cooldown,
            },
            permissions: [],
            roles: [],
            added: `${moment().format()}`,
        }

        //loop throw every aliases
        for(let a = 0; a < data.commands.length; a++){

            //get the path for commands in firestore
            const commandDoc = await firestoreCommands.doc(data.commands[a])
            const snapshot = await commandDoc.get()

            //check if the command data exists or not
            if(!snapshot.exists) await commandDoc.set(commandData)  //add the commandData object to the database
            else{

                //loop throw every 
                for(let i = 0; i < Object.keys(snapshot.data()).length; i++){

                    //check the field data for Aliases
                    if(Object.keys(snapshot.data())[i] === "Aliases"){

                        //check if the aliases has been changed
                        if(data.commands !== Object.values(snapshot.data())[i]){

                            //json object to store in firestore database 
                            const updatedCommandData = {
                                Aliases: data.commands
                            }

                            //update aliases
                            await commandDoc.update(updatedCommandData); 
                        }
                    }

                    //check the field data for commandData
                    if(Object.keys(snapshot.data())[i] === "commandData"){

                        if(argsExample !== Object.values(snapshot.data())[i].argsExample) await commandDoc.update({
                            'commandData.argsExample': argsExample
                        })

                        if(cooldown !== Object.values(snapshot.data())[i].cooldown) await commandDoc.update({
                            'commandData.cooldown': cooldown
                        })

                        if(descriptionAR !== Object.values(snapshot.data())[i].descriptionAR) await commandDoc.update({
                            'commandData.descriptionAR': descriptionAR
                        })

                        if(descriptionEN !== Object.values(snapshot.data())[i].descriptionEN) await commandDoc.update({
                            'commandData.descriptionEN': descriptionEN
                        })

                        if(expectedArgsAR !== Object.values(snapshot.data())[i].expectedArgsAR) await commandDoc.update({
                            'commandData.expectedArgsAR': expectedArgsAR
                        })

                        if(expectedArgsEN !== Object.values(snapshot.data())[i].expectedArgsEN) await commandDoc.update({
                            'commandData.expectedArgsEN': expectedArgsEN
                        })

                        if(hintAR !== Object.values(snapshot.data())[i].hintAR) await commandDoc.update({
                            'commandData.hintAR': hintAR
                        })

                        if(hintEN !== Object.values(snapshot.data())[i].hintEN) await commandDoc.update({
                            'commandData.hintEN': hintEN
                        })

                        if(maxArgs !== Object.values(snapshot.data())[i].maxArgs) await commandDoc.update({
                            'commandData.maxArgs': maxArgs
                        })

                        if(minArgs !== Object.values(snapshot.data())[i].minArgs) await commandDoc.update({
                            'commandData.minArgs': minArgs
                        })

                        if(type !== Object.values(snapshot.data())[i].type) await commandDoc.update({
                            'commandData.type': type
                        })
                    }
                }
            }
        }
    }
}