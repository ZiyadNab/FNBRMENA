module.exports = {
    commands: 'link',
    type: 'User Data',
    descriptionEN: 'Links your Fortnite account with FNBRMENA bot.',
    descriptionAR: 'ربط حسابك Fortnite مع خوادم الروبوت FNBRMENA.',
    minArgs: 0,
    maxArgs: 0,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // User input
        var userInput = {
            id: null,
            epic: userData.lang === "en" ? "Epic Games" : "ايبك قيمز",
            psn: userData.lang === "en" ? "Playstation" : "بلايستيشن",
            xbl: userData.lang === "en" ? "Xbox" : "اكسبوكس",
        }

        const roleIds = [
            "1206993258715021322",
            "1206987505916706928",
            "1206989070165876816",
            "1206989192991866960",
            "1206989274017169408",
            "1206989526946283560",
            "1206989617857826856",
            "1206989703795179561",
            "1206989864290099220",
            "1206989911354507364",
            "1206991129153634374",
            "1206993216168136746",
            "1206993436079685683",
            "1206994609155219516",
            "1206995200585633863",
            "1206995959255670794",
            "1206996982774894603",
            "1206997072587264041",
            "1206997161477414993",
            "1007326574594494524"
        ]

        // Seeting up the db firestore
        var db = await admin.firestore()

        // Read server collection
        const rankedRoles = await db.collection("Server").doc("rankedRoles").get()

        // Get user linked account
        var account = null
        const hasLinked = rankedRoles.data().accounts.filter(e => {
            return (e.userId === message.author.id)
        })
        if(hasLinked.length) account = await FNBRMENA.AccountExternalAuths(hasLinked[0].epicId)

        // Create an embed
        const linkAccountEmbed = new Discord.EmbedBuilder()
        linkAccountEmbed.setColor(FNBRMENA.Colors("embed"))
        if(userData.lang === "en"){
            linkAccountEmbed.setTitle(`ACCOUNT LINK, ${message.author.username}`.toUpperCase())
            linkAccountEmbed.setDescription('This command lets you link your Epic Games, Playstation or Xbox account to your current discord profile in the bot servers. It will help to easily use commands that requires your account and many more features.\n\n\`You have only 30 seconds until this operation ends, Make it quick\`!')
            if(account){

                userInput.id = account.data.accounts[0].id
                for(const auth of account.data.accounts[0].externalAuths) linkAccountEmbed.addFields({
                    name: auth.type === "epic" ? "Epic Games" : auth.type === "psn" ? "Playstation" : auth.type === "xbl" ? "Xbox" : auth.type === "steam" ? "Steam" : auth.type === "nintendo" ? "Nintendo" : "UNKNOWN",
                    value: auth.username !== undefined ? auth.username : "UNKNOWN"
                })
            }
        }else if(userData.lang === "ar"){
            linkAccountEmbed.setTitle(`اربط حسابك, ${message.author.username}`)
            linkAccountEmbed.setDescription('يتيح لك هذا الأمر ربط حساب Epic Games أو Playstation أو Xbox بملف تعريف دسكورد الحالي في خوادم الروبوت. سيساعدك على استخدام الأوامر التي تتطلب حسابك والعديد من الميزات الأخرى بسهولة.\n\n\`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل\`!')
            if(account){
                
                userInput.id = account.data.accounts[0].id
                for(const auth of account.data.accounts[0].externalAuths) if(auth.type !== "nintendo") linkAccountEmbed.addFields({
                    name: auth.type === "epic" ? "Epic Games" : auth.type === "psn" ? "Playstation" : auth.type === "xbl" ? "Xbox" : auth.type === "steam" ? "Steam" : "UNKNOWN",
                    value: auth.username !== undefined ? auth.username : "UNKNOWN"
                })
            }
        }

        // Create a row for cancel button
        const ButtonDataRow = new Discord.ActionRowBuilder()
        
        // Add buttons
        if(userData.lang === "en"){
            ButtonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`Link`)
                .setStyle(Discord.ButtonStyle.Success)
                .setLabel("Link")
                .setDisabled(hasLinked.length > 0)
            )

            ButtonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`Unlink`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("Unlink")
                .setDisabled(hasLinked.length === 0)
            )

            ButtonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`Cancel`)
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("Cancel")
            )

        }else if(userData.lang === "ar"){
            ButtonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`Link`)
                .setStyle(Discord.ButtonStyle.Success)
                .setLabel("ربط")
                .setDisabled(hasLinked.length > 0)
            )

            ButtonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`Unlink`)
                .setStyle(Discord.ButtonStyle.Primary)
                .setLabel("الغاء الربط")
                .setDisabled(hasLinked.length === 0)
            )

            ButtonDataRow.addComponents(
                new Discord.ButtonBuilder()
                .setCustomId(`Cancel`)
                .setStyle(Discord.ButtonStyle.Danger)
                .setLabel("اغلاق")
            )
        }

        // Send the message
        const dropMenuMessage = await message.reply({embeds: [linkAccountEmbed], components: [ButtonDataRow], files: []})
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        // Filtering the user clicker
        const filter = (i => {
            return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
        })

        // Await for user input
        const colllector = await message.channel.createMessageComponentCollector({filter, time: 6 * 60000, errors: ['time'] })
        colllector.on('collect', async collected => {

            // If cancel button has been clicked
            if(collected.customId === `Cancel`) colllector.stop()

            // If link button has been clicked
            if(collected.customId === `Link`){
                collected.deferUpdate();

                // Create an embed
                const statsPlatformEmbed = new Discord.EmbedBuilder()
                statsPlatformEmbed.setColor(FNBRMENA.Colors("embed"))
                if(userData.lang === "en"){
                    statsPlatformEmbed.setTitle(`Select a Platform, ${message.author.username}`)
                    statsPlatformEmbed.setDescription('Please click on the Drop-Down menu and select a platform.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    statsPlatformEmbed.setTitle(`اختر منصه , ${message.author.username}`)
                    statsPlatformEmbed.setDescription('الرجاء الضغط على السهم لاختيار نوع المنصه.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                // Create a row for cancel button
                const cancelButtonDataRow = new Discord.ActionRowBuilder()
                
                // Add buttons
                if(userData.lang === "en") cancelButtonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Cancel`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )

                else if(userData.lang === "ar") cancelButtonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`Cancel`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )

                // Create a row for drop down menu for categories
                const statsPlatformRow = new Discord.ActionRowBuilder()

                const statsPlatformDropMenu = new Discord.StringSelectMenuBuilder()
                statsPlatformDropMenu.setCustomId(`Platform-${alias}`)
                if(userData.lang === "en") statsPlatformDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") statsPlatformDropMenu.setPlaceholder('الرجاء الأختيار!')

                // Add English options
                if(userData.lang === "en") statsPlatformDropMenu.addOptions(
                    {
                        label: `Epic Games`,
                        value: `epic`,
                        default: false,
                        emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
                    },
                    {
                        label: `Playstation`,
                        value: `psn`,
                        default: false,
                        emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
                    },
                    {
                        label: `Xbox`,
                        value: `xbl`,
                        default: false,
                        emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
                    }
                )

                // Add Arabic options
                else if(userData.lang === "ar") statsPlatformDropMenu.addOptions(
                    {
                        label: `ايبك قيمز`,
                        value: `epic`,
                        default: false,
                        emoji: `${emojisObject.epicgames.name}:${emojisObject.epicgames.id}`
                    },
                    {
                        label: `بلايستيشن`,
                        value: `psn`,
                        default: false,
                        emoji: `${emojisObject.playstation.name}:${emojisObject.playstation.id}`
                    },
                    {
                        label: `اكسبوكس`,
                        value: `xbl`,
                        default: false,
                        emoji: `${emojisObject.xbox.name}:${emojisObject.xbox.id}`
                    }
                )

                // Add the drop menu to the categoryDropMenu
                statsPlatformRow.addComponents(statsPlatformDropMenu)

                // Edit the message
                dropMenuMessage.edit({embeds: [statsPlatformEmbed], components: [statsPlatformRow, cancelButtonDataRow], files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }
            
            // If the user selected a platform
            if(collected.customId === `Platform-${alias}`){

                // Create the modal and add text fields
                const date = new Date()
                const usernameModal = new Discord.ModalBuilder()
                usernameModal.setCustomId(`username-${message.id}-${date}`)
                if(userData.lang === "en"){
                    usernameModal.setTitle(`${userInput[collected.values[0]]} Username`) // Set modal title
                    usernameModal.addComponents( // Add fields
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.TextInputBuilder()
                            .setCustomId('tag')
                            .setLabel(`Please type your ${userInput[collected.values[0]].toLowerCase()} tag`)
                            .setStyle(Discord.TextInputStyle.Short)
                        )
                    )
                }else if(userData.lang === "ar"){
                    usernameModal.setTitle(`معرف ${userInput[collected.values[0]]}`) // Set modal title
                    usernameModal.addComponents( // Add fields
                        new Discord.ActionRowBuilder().addComponents(
                            new Discord.TextInputBuilder()
                            .setCustomId('tag')
                            .setLabel(`الرجاء اكتب معرف حساب ${userInput[collected.values[0]].toLowerCase()}`)
                            .setStyle(Discord.TextInputStyle.Short)
                        )
                    )
                }

                // showModal
                collected.showModal(usernameModal)

                // Listen for modal submission
                const filter = (i => {
                    return i.customId === `username-${message.id}-${date}` && i.user.id === message.author.id && i.guild.id === message.guild.id
                })
                await collected.awaitModalSubmit({filter, time: 1 * 60000})
                .then(async modalCollect => {
                    modalCollect.deferUpdate()

                    // Get the user's account
                    const accountTag = modalCollect.fields.getTextInputValue('tag')

                    // Check if its exists
                    FNBRMENA.AccountID(accountTag, collected.values[0])
                    .then(res => {

                        // Check results
                        if(!res.data.result){

                            // No results
                            const noAccountsMatchingError = new Discord.EmbedBuilder()
                            noAccountsMatchingError.setColor(FNBRMENA.Colors("embedError"))
                            if(userData.lang === "en") noAccountsMatchingError.setTitle(`There is no accounts matching your entry ${emojisObject.errorEmoji}.`)
                            else if(userData.lang === "ar") noAccountsMatchingError.setTitle(`لا يوجد حسابات تطابق مدخلاتك ${emojisObject.errorEmoji}.`)
                            return dropMenuMessage.edit({embeds: [noAccountsMatchingError], components: [], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                            })
                        }
                        
                        // Request all account data
                        FNBRMENA.AccountExternalAuths(res.data.account_id)
                        .then(account => {

                            // Check results
                            if(!account.data.result){

                                // No results
                                const fetchingAccountError = new Discord.EmbedBuilder()
                                fetchingAccountError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") fetchingAccountError.setTitle(`An error occoured while fetching your account, Please try again ${emojisObject.errorEmoji}.`)
                                else if(userData.lang === "ar") fetchingAccountError.setTitle(`حدثت مشكلة اثناء استخراج معلومات الحساب , حاول مجددا ${emojisObject.errorEmoji}.`)
                                return dropMenuMessage.edit({embeds: [fetchingAccountError], components: [], files: []})
                                .catch(err => {
                                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                                })
                            }

                            // Add the user account to userInput
                            userInput.id = account.data.accounts[0].id

                            // Account Found
                            const accountFoundEmbed = new Discord.EmbedBuilder()
                            accountFoundEmbed.setColor(FNBRMENA.Colors("embedLink"))
                            accountFoundEmbed.setThumbnail('https://i.ibb.co/QcfScLd/jKXrAOb.png')
                            for(const auth of account.data.accounts[0].externalAuths) {
                                accountFoundEmbed.addFields({
                                    name: auth.type === "epic" ? "Epic Games" : auth.type === "psn" ? "Playstation" : auth.type === "xbl" ? "Xbox" : auth.type === "steam" ? "Steam" : auth.type === "nintendo" ? "Nintendo" : "UNKNOWN",
                                    value: auth.username !== undefined || auth.username !== null ? auth.username : "UNKNOWN"
                                })
                            }
                            if(userData.lang === "en"){
                                accountFoundEmbed.setTitle(`Hello ${account.data.accounts[0].username.toUpperCase()},`)
                                accountFoundEmbed.setDescription('To complete your account link process please click on confirm button, Keep in mind you can unlink whenever you want.')
                            }else if(userData.lang === "ar"){
                                accountFoundEmbed.setTitle(`اهلا بك ${account.data.accounts[0].username.toUpperCase()},`)
                                accountFoundEmbed.setDescription('لإكمال عملية ربط حسابك ، يرجى النقر على زر التأكيد ، ضع في اعتبارك أنه يمكنك إلغاء الربط وقتما تشاء.')
                            }

                            // Create a row for buttons
                            const buttonDataRow = new Discord.ActionRowBuilder()
                            
                            // Add buttons
                            if(userData.lang === "en"){
                                buttonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Confirm')
                                    .setStyle(Discord.ButtonStyle.Success)
                                    .setLabel("Confirm")
                                )

                                buttonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Cancel')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("Cancel")
                                )
                            }

                            else if(userData.lang === "ar"){
                                buttonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Confirm')
                                    .setStyle(Discord.ButtonStyle.Success)
                                    .setLabel("تأكيد")
                                )

                                buttonDataRow.addComponents(
                                    new Discord.ButtonBuilder()
                                    .setCustomId('Cancel')
                                    .setStyle(Discord.ButtonStyle.Danger)
                                    .setLabel("اغلاق")
                                )
                            }

                            // Edit the message
                            dropMenuMessage.edit({embeds: [accountFoundEmbed], components: [buttonDataRow], files: []})
                            .catch(err => {
                                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                            })

                        }).catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                    })

                }).catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }

            // If confirm button has been clicked
            if(collected.customId === `Confirm`){
                colllector.stop()
                
                // Add the account id to the user database profile
                await db.collection("Server").doc('rankedRoles').update({
                    'accounts': admin.firestore.FieldValue.arrayUnion({
                        epicId: userInput.id,
                        userId: `${message.author.id}`
                    })
                })

                // Successfully updated
                const accountHasBeenLinkedEmbed = new Discord.EmbedBuilder()
                accountHasBeenLinkedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                accountHasBeenLinkedEmbed.setTitle(`Your account has been linked successfully ${emojisObject.checkEmoji}.`)
                dropMenuMessage.edit({embeds: [accountHasBeenLinkedEmbed], components: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })

            }

            // If unlink button has been clicked
            if(collected.customId === `Unlink`){
                colllector.stop()

                console.log({
                    epicId: userInput.id,
                    userId: `${message.author.id}`
                })
                
                // Add the account id to the user database profile
                await db.collection("Server").doc('rankedRoles').update({
                    'accounts': admin.firestore.FieldValue.arrayRemove({
                        epicId: userInput.id,
                        userId: `${message.author.id}`
                    })
                })

                await message.member.roles.remove(roleIds)

                // Successfully updated
                const accountHasBeenUnlinkedEmbed = new Discord.EmbedBuilder()
                accountHasBeenUnlinkedEmbed.setColor(FNBRMENA.Colors("embedSuccess"))
                accountHasBeenUnlinkedEmbed.setTitle(`Your account has been unlinked successfully ${emojisObject.checkEmoji}.`)
                dropMenuMessage.edit({embeds: [accountHasBeenUnlinkedEmbed], components: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })

            }
        })

        // When time ends
        colllector.on('end', async (e) => {

            const map = []
            e.map(interaction => map.push(interaction.customId))

            if(map.includes("Cancel") || map.length === 0) try {
                dropMenuMessage.delete()
            } catch {
                    
            }

        })
    }
}