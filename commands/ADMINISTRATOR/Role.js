module.exports = {
    commands: 'role',
    type: 'Administrators Only',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        //seeting up the db firestore
        const db = await admin.firestore()

        //commands collection
        const commandData = await db.collection("Commands").doc(text)
        const snapshot = await commandData.get()

        //check if the given command does exists
        if(snapshot.exists){

            //create an embed
            const roleSelectionEmbed = new Discord.EmbedBuilder()
            roleSelectionEmbed.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en"){
                roleSelectionEmbed.setTitle(`Role Selection`)
                roleSelectionEmbed.setDescription('Click on the drop-down menu to specifiy a role.\n\`You have only 30 seconds until this operation ends, Make it quick\`')
            }else if(userData.lang === "ar"){
                roleSelectionEmbed.setTitle(`اختيار الرول`)
                roleSelectionEmbed.setDescription('الرجاء الضغط على السهم لاختيار رول.\n\n \`لديك 30 ثانية فقط حتى تنتهي هذه العملية ، اجعلها سريعة \`')
            }

            //create a row for cancel button
            const buttonDataRow = new Discord.ActionRowBuilder()
            
            //add EN buttons
            if(userData.lang === "en"){
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('add')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("Add")
                )
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('remove')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setLabel("Remove")
                )
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('removeAll')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Remove All Roles")
                )
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )
            }
            
            //add AR buttons
            else if(userData.lang === "ar"){
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('add')
                    .setStyle(Discord.ButtonStyle.Primary)
                    .setLabel("اضافة")
                )
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('remove')
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setLabel("حذف")
                )
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('removeAll')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("حذف الكل")
                )
                buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )
            }

            var size = message.guild.roles.cache.size / 25, components = [], limit = 0, counter = 0
            if (size % 2 !== 0){
                size += 1;
                size = size | 0;
            }

            for(let i = 1; i <= size; i++){
                var roles = []

                message.guild.roles.cache.forEach(role => {
                    if(limit < 25 * i && limit <= counter++){
                        roles.push({
                            label: `${role.name}`,
                            value: `${role.id}`
                        })
                    }
                })

                console.log(roles.length)

                //create a select menu
                var roleSelectionDropMenu = new Discord.SelectMenuBuilder()
                roleSelectionDropMenu.setCustomId(`${i}`)
                if(userData.lang === "en") roleSelectionDropMenu.setPlaceholder('Select a role!')
                else if(userData.lang === "ar") roleSelectionDropMenu.setPlaceholder('اختر رول!')
                roleSelectionDropMenu.addOptions(roles)

                //add the drop menu to the categoryDropMenu
                components.push(new Discord.ActionRowBuilder().addComponents(roleSelectionDropMenu))
                limit = 25 * i

            } components.push(buttonDataRow) //add the button component

            //send the message
            const dropMenuMessage = await message.reply({embeds: [roleSelectionEmbed], components: components})

            //filtering the user clicker
            const filter = i => i.user.id === message.author.id

            //await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                //if cancel button has been clicked
                if(collected.customId === "Cancel") dropMenuMessage.delete()
                else{
                    
                }

                
            })
        }
    }
}