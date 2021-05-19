module.exports = {
    commands: 'role',
    expectedArgs: '[ Name Of the command, The role ]',
    minArgs: 2,
    maxArgs: null,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (message, args, text, Discord, client, admin, alias, errorEmoji, checkEmoji) => {

        admin.database().ref("ERA's").child("Users").child(message.author.id).once('value', async function (data) {
            var lang = data.val().lang;

            var command = args[0]
            args.shift()

            text = text.replace(command,'');

            var role = []
            var Counter = 0
            while(text.indexOf("+") !== -1){

                //getting the index of the + in text string
                var stringNumber = text.indexOf("+")
                //substring the cosmetic name and store it
                var cosmetic = text.substring(0,stringNumber)
                //trimming every space
                cosmetic = cosmetic.trim()
                //store it into the array
                role[Counter] = cosmetic
                //remove the cosmetic from text to start again if the while statment !== -1
                text = text.replace(cosmetic + ' +','')
                //remove every space in text
                text = text.trim()
                //add the counter index
                Counter++
                //end of wile lets try aagin
            }
            //still there is the last cosmetic name so lets trim text
            text = text.trim()
            //add the what text holds in the last index
            role[Counter++] = text

            const method = new Discord.MessageEmbed()
            method.setColor('#BB00EE')
            if(lang === "en"){
                method.setTitle('Choose a method')
                method.addFields(
                    {name: 'Add Role', value: 'React to :white_check_mark:'},
                    {name: 'Delete Role', value: 'React to :negative_squared_cross_mark:'}
                )
            }else if(lang === "ar"){
                method.setTitle('اختر طريقة')
                method.addFields(
                    {name: 'اضافة رول', value: 'اختر العلامة :white_check_mark:'},
                    {name: 'حذف رول', value: 'اختر العلامة :negative_squared_cross_mark:'}
                )
            }
            const msgReact = await message.channel.send(method)
            await msgReact.react('✅')
            msgReact.react('❎')
            const filter = (reaction, user) => {
                return ['✅', '❎'].includes(reaction.emoji.name) && user.id === message.author.id;
            };
            await msgReact.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then( async collected => {
                const reaction = collected.first();
                if(reaction.emoji.name === '✅'){
                    await admin.database().ref("ERA's").child("Commands").child(command).once('value', async data => {
                        if(data.exists()){
                            await admin.database().ref("ERA's").child("Commands").child(command).child("Roles").set([
                                role
                            ])
                            if(lang === "en"){
                                const done = new Discord.MessageEmbed()
                                done.setColor('#BB00EE')
                                done.setTitle(`The ${command} role(s) has been addedd ${checkEmoji}`)
                                message.channel.send(done)
                            }else if(lang === "ar"){
                                const done = new Discord.MessageEmbed()
                                done.setColor('#BB00EE')
                                done.setTitle(`تم اضافة الرول لأمر ${command} ${checkEmoji}`)
                                message.channel.send(done)
                            }
                        }else{
                            if(lang === "en"){
                                const errCommand = new Discord.MessageEmbed()
                                errCommand.setColor('#BB00EE')
                                errCommand.setTitle(`The ${command} is not a valid command ${errorEmoji}`)
                                message.channel.send(errCommand)
                            }else if(lang === "ar"){
                                const errCommand = new Discord.MessageEmbed()
                                errCommand.setColor('#BB00EE')
                                errCommand.setTitle(`الامر ${command} ليس صحيح ${errorEmoji}`)
                                message.channel.send(errCommand)
                            }
                        }
                    })
                }
                if(reaction.emoji.name === '❎'){
                    admin.database().ref("ERA's").child("Commands").child(command).child("Roles").once('value', async data => {
                        if(data.exists()){
                            admin.database().ref("ERA's").child("Commands").child(command).child("Roles").remove()
                            if(lang === "en"){
                                const secCommand = new Discord.MessageEmbed()
                                secCommand.setColor('#BB00EE')
                                secCommand.setTitle(`All the ${command} Roles has been removed ${errorEmoji}`)
                                message.channel.send(secCommand)
                            }else if(lang === "ar"){
                                const secCommand = new Discord.MessageEmbed()
                                secCommand.setColor('#BB00EE')
                                secCommand.setTitle(`تم حذف جميع الرولات من الامر ${command} ${checkEmoji}`)
                                message.channel.send(secCommand)
                            }
                        }else{
                            if(lang === "en"){
                                const errCommand = new Discord.MessageEmbed()
                                errCommand.setColor('#BB00EE')
                                errCommand.setTitle(`The ${command} doesn't have Roles ${errorEmoji}`)
                                message.channel.send(errCommand)
                            }else if(lang === "ar"){
                                const errCommand = new Discord.MessageEmbed()
                                errCommand.setColor('#BB00EE')
                                errCommand.setTitle(`لا يوجد رول لأمر ${command} ${errorEmoji}`)
                                message.channel.send(errCommand)
                            }
                        }
                    })
                }
                msgReact.delete()
            }).catch(err => {
                msgReact.delete()
                if(lang === "en"){
                    const error = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`Sorry we canceled your process becuase no action has taken ${errorEmoji}`)
                    message.reply(error)
                }else if(lang === "ar"){
                    const error = new Discord.MessageEmbed()
                    .setColor('#BB00EE')
                    .setTitle(`لقد تم ايقاف الامر لعدم اختيار طريقة ${errorEmoji}`)
                    message.reply(error)
                }
            })
        })
    },
}