const Canvas = require('canvas');

module.exports = {
    commands: 'weapon',
    type: 'Fortnite',
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Set of rarity colors
        const colors = {
            mythic: '#ffbe00',
            exotic: '#00FF69',
            legendary: '#ff8800',
            epic: '#bc4afd',
            rare: '#2cc1ff',
            uncommon: '#87e339',
            common: '#bebebe'
        }

        // Translations
        const translation = {
            mythic: 'خرافي',
            exotic: 'عجيب',
            legendary: 'الأسطوري',
            epic: 'ملحمي',
            rare: 'نادر',
            uncommon: 'غير شائع',
            common: 'شائع'
        }

        // Registering fonts
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {family: 'Arabic',weight: "700",style: "bold"});
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{family: 'Burbank Big Condensed',weight: "700",style: "bold"})

        // Layer
        const layer = async (ctx, canvas, x, y, w, h, obj, value, line) => {

            // Add layer
            ctx.shadowColor = "rgba(0, 0, 0, 0.4)" // Add a shadow color (BLACK)
            ctx.globalAlpha = 0.2 // Change opacity
            ctx.fillRect(x, y, w, h)
            ctx.shadowColor = 'rgba(0,0,0,0)' // Reset shadows
            ctx.globalAlpha = 1 // Reset transparency

            // Add layer name
            if(userData.lang === "en"){

                // Layer name
                ctx.textAlign = 'left'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(obj.nameEN.toUpperCase(), obj.x, obj.y)

                // Layer value
                ctx.textAlign = 'right'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(value, canvas.width - obj.x, obj.y)

                // Add the line range
                if(line.w <= w) ctx.fillRect(line.x, line.y, line.w, line.h)
                else ctx.fillRect(line.x, line.y, w, line.h)

            }else if(userData.lang === "ar"){

                // Layer name
                ctx.textAlign = 'right'
                ctx.font = `${obj.font}px Arabic`
                ctx.fillText(obj.nameAR, canvas.width - obj.x, obj.y)

                // Layer value
                ctx.textAlign = 'left'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(value, obj.x, obj.y)

                // Add the line range
                if(-line.w >= -w) ctx.fillRect(canvas.width - line.x, line.y, -line.w, line.h)
                else ctx.fillRect(canvas.width - line.x, line.y, -w, line.h)
            }
        }

        // Weapon Image BuilderS
        const weaponImageBuilder = async (res) => {

            //send the generating message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading ${res.name} weapon ${emojisObject.loadingEmoji}`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل سلاح ${res.name} ${emojisObject.loadingEmoji}`)
            message.reply({embeds: [generating]})
            .then( async msg => {
            
                // Create canvas
                const canvas = Canvas.createCanvas(850, 1700);
                const ctx = canvas.getContext('2d');

                // Load background
                const background = await Canvas.loadImage(`./assets/Rarities/weapons/${res.rarity}.png`)
                ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

                // Weapon status
                if(res.enabled) var status = await Canvas.loadImage('https://i.imgur.com/j2VNlek.png')
                else var sataus = await Canvas.loadImage('https://imgur.com/LlfZAAy.png')
                ctx.drawImage(status, 10, 10, 10, 10)

                // Add weapon name
                ctx.fillStyle = '#ffffff'
                ctx.textAlign = 'center'
                if(userData.lang === "en"){
                    ctx.font = '80px Burbank Big Condensed'
                    ctx.fillText(res.name.toUpperCase(), canvas.width / 2, 850)
                }else if(userData.lang === "ar"){
                    ctx.font = '80px Arabic'
                    ctx.fillText(res.name.toUpperCase(), canvas.width / 2, 830)
                }
                

                // Drop shadow
                ctx.shadowOffsetY = 20
                ctx.shadowOffsetX = 20
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                ctx.shadowBlur = 40;

                // Load the weapon iamge
                const weaponImg = await Canvas.loadImage(res.images.icon)
                ctx.drawImage(weaponImg, 100, 100, 650, 650)

                // Change the shadow blur
                ctx.shadowBlur = 60;

                // Add 6 background layers
                ctx.fillStyle = '#000000'

                // Add layer
                ctx.shadowColor = "rgba(0, 0, 0, 0.4)" // Add a shadow color (BLACK)
                ctx.globalAlpha = 0.2 // Change opacity
                ctx.fillRect(55, 870, 740, 116)
                ctx.shadowColor = 'rgba(0,0,0,0)' // Reset shadows
                ctx.globalAlpha = 1 // Reset transparency

                // Add layer name
                ctx.fillStyle = '#ffffff'
                if(userData.lang === "en"){

                    // Layer name
                    ctx.textAlign = 'left'
                    ctx.font = `72px Burbank Big Condensed`
                    ctx.fillStyle = colors[res.rarity]

                    // Get rarity width
                    const rarityW = ctx.measureText(`${res.rarity.toUpperCase()} RARITY`).width
                    const text = `${res.rarity.toUpperCase()} RARITY`

                    // Draw the rarity
                    var x = (canvas.width / 2) - (rarityW / 2)
                    for(let i = 0; i < text.length; i++){
                        if(text[i] === ' ') ctx.fillStyle = '#ffffff'
                        ctx.fillText(`${text[i]}`, x, 953)
                        x += ctx.measureText(text[i]).width
                    }

                }else if(userData.lang === "ar"){
                    ctx.textAlign = 'center'
                    ctx.font = `72px Arabic`
                    ctx.fillText(`الندرة ${translation[res.rarity]}`, canvas.width / 2, 953)
                }
                
                // Change to white color
                ctx.fillStyle = '#ffffff'

                // Damage layer
                layer(ctx, canvas, 55, 1004, 740, 116, {
                    nameEN: "damage",
                    nameAR: 'الضرر',
                    x: 85,
                    y: 1087,
                    font: 72
                }, res.mainStats.DmgPB ? res.mainStats.DmgPB | 0 : "?", {
                    x: 55,
                    y: 1120,
                    w: (res.mainStats.DmgPB / 200) * 740,
                    h: 9
                })

                // Headshot damage layer
                layer(ctx, canvas, 55, 1138, 740, 116, {
                    nameEN: "headshot damage",
                    nameAR: 'ضرر الرأس',
                    x: 85,
                    y: 1221,
                    font: 72
                }, res.mainStats.DmgPB && res.mainStats.DamageZone_Critical ? (res.mainStats.DmgPB * res.mainStats.DamageZone_Critical) | 0 : "?", {
                    x: 55,
                    y: 1254,
                    w: (res.mainStats.DmgPB * res.mainStats.DamageZone_Critical / 250) * 740,
                    h: 9
                })

                // Clip Size layer
                layer(ctx, canvas, 55, 1272, 740, 116, {
                    nameEN: "clip size",
                    nameAR: 'حجم الذخيرة',
                    x: 85,
                    y: 1355,
                    font: 72
                }, res.mainStats.ClipSize ? res.mainStats.ClipSize : "?", {
                    x: 55,
                    y: 1388,
                    w: (res.mainStats.ClipSize / 75) * 740,
                    h: 9
                })

                // Fire Rate layer
                layer(ctx, canvas, 55, 1406, 740, 116, {
                    nameEN: "fire rate",
                    nameAR: 'معدل الاطلاق',
                    x: 85,
                    y: 1489,
                    font: 72
                }, res.mainStats.FiringRate ? res.mainStats.FiringRate : "?", {
                    x: 55,
                    y: 1522,
                    w: (res.mainStats.FiringRate / 15) * 740,
                    h: 9
                })

                // Reload Time layer
                layer(ctx, canvas, 55, 1540, 740, 116, {
                    nameEN: "reload time",
                    nameAR: 'وقت إعادة التحميل',
                    x: 85,
                    y: 1623,
                    font: 72
                }, res.mainStats.ReloadTime ? res.mainStats.ReloadTime : "?", {
                    x: 55,
                    y: 1656,
                    w: (res.mainStats.ReloadTime / 12) * 740,
                    h: 9
                })

                // Send message
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${res.id}.png`})
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

            // Check if out of range
            if(weaponId.length <= 120){

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

                        // Request a weapon
                        await FNBRMENA.Weapon(userData.lang, "", false)
                        .then(async res => {

                            // Call the weapon image builder
                            await dropMenuMessage.delete()
                            
                            // Filter for names
                            await res.data.weapons.filter(wid => {
                                if(wid.id === collected.values[0]) // Find the weapon
                                
                                // Call the weapon image builder
                                weaponImageBuilder(wid)
                            })
                        }).catch(async err => {
                            dropMenuMessage.delete()
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                        })
                    }
                
                }).catch(async err => {
                    dropMenuMessage.delete()
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject)
                })

            }else{

                // Too large entry
                const requestEntryTooLargeError = new Discord.EmbedBuilder()
                requestEntryTooLargeError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") requestEntryTooLargeError.setTitle(`Request entry too large ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") requestEntryTooLargeError.setTitle(`تم تخطي الكميه المحدودة ${emojisObject.errorEmoji}`)
                message.reply({embeds: [requestEntryTooLargeError]})
            }
            
        }else if(weaponId.length === 1){

            // Request a weapon
            await FNBRMENA.Weapon(userData.lang, "", false)
            .then(async res => {

                // Filter for names
                await res.data.weapons.filter(wid => {
                    if(wid.id === weaponId[0].id) // Find the weapon
                    
                    // Call the weapon image builder
                    weaponImageBuilder(wid)
                })
            }).catch(async err => {
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