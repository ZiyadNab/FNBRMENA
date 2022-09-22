const Canvas = require('canvas');

module.exports = {
    commands: 'weapon',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Weapon Image BuilderS
        const weaponImageBuilder = async (res) => {

            //send the generating message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading ${res.data.data.name} weapon ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل سلاح ${res.data.data.name} ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then( async msg => {
            
                // Create canvas
                const canvas = Canvas.createCanvas(850, 1700);
                const ctx = canvas.getContext('2d');

                // Load background
                const background = await Canvas.loadImage(`./assets/Rarities/weapons/${res.data.data.rarity}.png`)
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                // Drop shadow
                ctx.shadowOffsetY = 90
                ctx.shadowOffsetX = 90
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                ctx.shadowBlur = 50;

                // Load the weapon iamge
                const weaponImg = await Canvas.loadImage(res.data.data.images.icon)
                ctx.drawImage(weaponImg, 100, 100, 650, 650)

                // Reset shadows
                ctx.shadowColor = 'rgba(0,0,0,0)';

                // Send message
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.data.data.id}.png`})
                await message.reply({files: [att]})
                msg.delete()

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })
        }

        // Variables
        var weaponId = text
        
        // Request a weapon
        await FNBRMENA.Weapon("en", "", false)
        .then(async res => {

            // Check if the user searched using an id or a name
            if(weaponId.includes("_")){

                // Filter for wids
                weaponId = await res.data.weapons.filter(wid => {
                    return wid.id.toLowerCase() === weaponId.toLowerCase()
                })

            }else{

                // Filter for names
                weaponId = await res.data.weapons.filter(wid => {
                    return wid.name.toLowerCase().includes(weaponId.toLowerCase())
                })
            }
        }).catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
        })
        
        // Check if there is an item found
        if(weaponId.length > 1){

            // Create an embed
            const listWeaponsEmbed = new Discord.EmbedBuilder()
            listWeaponsEmbed.setColor(FNBRMENA.Colors("embed"))

            //set Author
            if(userData.lang === "en"){
                listWeaponsEmbed.setAuthor({name: `Weapons`, iconURL: 'https://imgur.com/mvFcjNF.png'})
                listWeaponsEmbed.setDescription('Please click on the Drop-Down menu and choose a weapons.\n`You have only 30 seconds until this operation ends, Make it quick`!')
            }else if(userData.lang === "ar"){
                listWeaponsEmbed.setAuthor({name: `الأسلحة`, iconURL: 'https://imgur.com/mvFcjNF.png'})
                listWeaponsEmbed.setDescription('الرجاء الضغط على السهم لاختيار سلاح.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
            }

            // Create a row for buttons
            const buttonDataRow = new Discord.ActionRowBuilder()
            
            // Add buttons
            if(userData.lang === "en") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("Cancel")
                )

            else if(userData.lang === "ar") buttonDataRow.addComponents(
                new Discord.ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setLabel("اغلاق")
                )

            // Force int
            var size = (weaponId.length / 25), components = [], limit = 0
            if(size % 2 !== 0 && size != 1){
                size += 1;
                size = size | 0
            }

            // Loop trough every weapon found
            for(let i = 1; i <= size; i++){

                var weapons = []
                for(let x = limit; x < 25 * i; x++){

                    if(weaponId[x]) weapons.push({
                        label: `${weaponId[x].name}`,
                        value: `${weaponId[x].id}`,
                        emoji: `${emojisObject[weaponId[x].rarity].name}:${emojisObject[weaponId[x].rarity].id}`
                    })
                }

                // Create a drop menu
                var listWeaponsDropMenu = new Discord.SelectMenuBuilder()
                listWeaponsDropMenu.setCustomId(`${i}`)
                if(userData.lang === "en") listWeaponsDropMenu.setPlaceholder('Nothing selected!')
                else if(userData.lang === "ar") listWeaponsDropMenu.setPlaceholder('لم يتم اختيار شيء بعد!')
                listWeaponsDropMenu.addOptions(weapons)

                // Add the drop menu to the categoryDropMenu
                components.push(new Discord.ActionRowBuilder().addComponents(listWeaponsDropMenu))
                limit = 25 * i

            } components.push(buttonDataRow)

            // Send the message
            const dropMenuMessage = await message.reply({embeds: [listWeaponsEmbed], components: components})

            // Filtering the user clicker
            const filter = (i => {
                return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
            })

            // Await for the user
            await message.channel.awaitMessageComponent({filter, time: 30000})
            .then(async collected => {
                collected.deferUpdate();

                // If cancel button has been clicked
                if(collected.customId === "Cancel") dropMenuMessage.delete()
                else if(collected.type === Discord.ComponentType.SelectMenu){

                    // Request the weapon data
                    FNBRMENA.Weapon(userData.lang, collected.values[0], true)
                    .then(async res => {

                        // Call the weapon image builder
                        await dropMenuMessage.delete()
                        weaponImageBuilder(res)

                    }).catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                    })
                }
            
            }).catch(async err => {
                dropMenuMessage.delete()
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })
            
        }else if(weaponId.length === 1){

            // Request the weapon data
            FNBRMENA.Weapon(userData.lang, weaponId[0].id, true)
            .then(async res => {

                // Call the weapon image builder
                weaponImageBuilder(res)

            }).catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
            })

        }else if(weaponId.length === 0){
            
            // No weapons has been found
            const noWeaponsFoundError = new Discord.EmbedBuilder()
            noWeaponsFoundError.setColor(FNBRMENA.Colors("embedError"))
            if(userData.lang === "en") noWeaponsFoundError.setTitle(`No weapons has been found ${emojisObject.errorEmoji}.`)
            else if(userData.lang === "ar") noWeaponsFoundError.setTitle(`لم يتم العثور على اسلحه ${emojisObject.errorEmoji}.`)
            message.reply({embeds: [noWeaponsFoundError]})
        }
    }
}    