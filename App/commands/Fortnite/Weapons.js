const Canvas = require('canvas');

module.exports = {
    commands: 'weapon',
    type: 'Fortnite',
    descriptionEN: 'Return an image about any weapon.',
    descriptionAR: 'استرجاع صورة عن أي سلاح..',
    expectedArgsEN: 'To use the command you need to specify a weapon name.',
    expectedArgsAR: 'من اجل استخدام الأمر يجب عليك تحديد أسم سلاح.',
    hintEN: 'You can search for a weapon with just one word. You don\'t need to spell the weapon\'s full name. Just type the words you know. For example, search by (Roc), (Rocket), or by its full name (Rocket Launcher), And the bot will list all possible weapons that match your input.',
    hintAR: 'يمكنك البحث عن سلاح بكلمة واحدة فقط. لست بحاجة إلى تهجئة الاسم الكامل للسلاح. فقط اكتب الكلمات التي تعرفها. على سبيل المثال ، ابحث عن طريق (Roc) ، (Rocket) ، أو باسمه الكامل (Rocket Launcher) ، وسوف يسرد الروبوت جميع الأسلحة الممكنة التي تطابق إدخالك.',
    argsExample: ['Rocket Launcher', 'Rocket', 'Roc'],
    minArgs: 1,
    maxArgs: null,
    cooldown: 5,
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
        Canvas.registerFont('./assets/font/Lalezar-Regular.ttf', {
            family: 'Arabic',
            style: "bold"
        });
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf' ,{
            family: 'Burbank Big Condensed',
            style: "bold"
        })

        //aplyText
        const applyText = (canvas, text, width, font) => {
            const ctx = canvas.getContext('2d');
            let fontSize = font;
            do {
                if(userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                else if(userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
            } while (ctx.measureText(text).width > width);
            return ctx.font;
        }

        // Layer
        const layer = async (ctx, canvas, x, y, w, h, obj, value, line, xy) => {

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
                ctx.fillText(obj.nameEN.toUpperCase(), xy.x + obj.x, xy.y + obj.y)

                // Layer value
                ctx.textAlign = 'right'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(value, (xy.x + 850) - obj.x, xy.y + obj.y)

                // Add the line range
                if(line.w <= w) ctx.fillRect(xy.x + line.x, xy.y + line.y, line.w, line.h)
                else ctx.fillRect(xy.x + line.x, xy.y + line.y, w, line.h)

            }else if(userData.lang === "ar"){

                // Layer name
                ctx.textAlign = 'right'
                ctx.font = `${obj.font}px Arabic`
                ctx.fillText(obj.nameAR, (xy.x + 850) - obj.x, xy.y + obj.y)

                // Layer value
                ctx.textAlign = 'left'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(value, xy.x + obj.x, xy.y + obj.y)

                // Add the line range
                if(-line.w >= -w) ctx.fillRect((xy.x + 850) - line.x, xy.y + line.y, -line.w, line.h)
                else ctx.fillRect((xy.x + 850) - line.x, xy.y + line.y, -w, line.h)
            }
        }

        // Weapon Image BuilderS
        const weaponImageBuilder = async (res) => {

            // Send the generating message
            const generating = new Discord.EmbedBuilder()
            generating.setColor(FNBRMENA.Colors("embed"))
            if(userData.lang === "en") generating.setTitle(`Loading ${res.length} weapons ${emojisObject.loadingEmoji}.`)
            else if(userData.lang === "ar") generating.setTitle(`جاري تحميل ${res.length} اسلحه ${emojisObject.loadingEmoji}.`)
            const msg = await message.reply({embeds: [generating], components: [], files: []})
            .catch(err => {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            })

            try {

                // Canvas variables
                var length = res.length
                var width = 0
                var height = 1700
                var newline = 0
                var x = 0
                var y = 0

                if(length <= 5) length = length
                else if(length >= 6 && length <= 7) length = length / 2
                else if(length >= 8 && length <= 12) length = length / 2
                else length = length / 4

                // Forcing to be int
                if (length % 2 !== 0 && length != 1){
                    length = length | 0;
                }

                // Creating width
                if(res.length === 1) width = 850
                else width += (length * 850) + (length * 10) - 10

                // Creating height
                for(let i = 0; i < res.length; i++){
                    
                    if(newline === length){
                        height += 1700 + 10
                        newline = 0
                    }
                    newline++
                }

                // Reset newline
                newline = 0
            
                // Create canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                // Load background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg')
                ctx.drawImage(background, 0, 0, width, height)

                // Loop through all weapons
                for(let i = 0; i < res.length; i++){
                    newline++

                    // Load weapon background rarity
                    const background = await Canvas.loadImage(`./assets/Rarities/weapons/${res[i].rarity}.png`)
                    ctx.drawImage(background, x, y, 850, 1700)

                    // Add weapon name
                    ctx.fillStyle = '#ffffff'
                    ctx.textAlign = 'center'
                    ctx.font = applyText(canvas, res[i].name.toUpperCase(), 800, 80)
                    if(userData.lang === "en") ctx.fillText(res[i].name.toUpperCase(), x + (850 / 2), y + 850)
                    else if(userData.lang === "ar") ctx.fillText(res[i].name, x + (850 / 2), y + 830)

                    // Drop shadow
                    ctx.shadowOffsetY = 20
                    ctx.shadowOffsetX = 20
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                    ctx.shadowBlur = 40;

                    // Load the weapon iamge
                    const weaponImg = await Canvas.loadImage(res[i].images.icon)
                    ctx.drawImage(weaponImg, x + 100, y + 100, 650, 650)

                    // Change the shadow blur
                    ctx.shadowBlur = 60;

                    // Add 6 background layers
                    ctx.fillStyle = '#000000'

                    // Add layer
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)" // Add a shadow color (BLACK)
                    ctx.globalAlpha = 0.2 // Change opacity
                    ctx.fillRect(x + 55, y + 870, 740, 116)
                    ctx.shadowColor = 'rgba(0,0,0,0)' // Reset shadows
                    ctx.globalAlpha = 1 // Reset transparency

                    // Add layer name
                    ctx.fillStyle = '#ffffff'
                    if(userData.lang === "en"){

                        // Layer name
                        ctx.textAlign = 'left'
                        ctx.font = `72px Burbank Big Condensed`
                        ctx.fillStyle = colors[res[i].rarity]

                        // Get rarity width
                        const rarityW = ctx.measureText(`${res[i].rarity.toUpperCase()} RARITY`).width
                        const text = `${res[i].rarity.toUpperCase()} RARITY`

                        // Draw the rarity
                        var r = (850 / 2) - (rarityW / 2)
                        for(let i = 0; i < text.length; i++){
                            if(text[i] === ' ') ctx.fillStyle = '#ffffff'
                            ctx.fillText(`${text[i]}`, x + r, y + 953)
                            r += ctx.measureText(text[i]).width
                        }

                    }else if(userData.lang === "ar"){
                        ctx.textAlign = 'center'
                        ctx.font = `72px Arabic`
                        ctx.fillText(`الندرة ${translation[res[i].rarity]}`, x + (850 / 2), y + 953)
                    }
                    
                    // Change to white color
                    ctx.fillStyle = '#ffffff'

                    // Damage layer
                    layer(ctx, canvas, x + 55, y + 1004, 740, 116, {
                        nameEN: "damage",
                        nameAR: 'الضرر',
                        x: 85,
                        y: 1087,
                        font: 72
                    }, res[i].mainStats.DmgPB ? res[i].mainStats.DmgPB | 0 : "?", {
                        x: 55,
                        y: 1120,
                        w: (res[i].mainStats.DmgPB / 200) * 740,
                        h: 9
                    }, {
                        x: x,
                        y: y
                    })

                    // Headshot damage layer
                    layer(ctx, canvas, x + 55, y + 1138, 740, 116, {
                        nameEN: "headshot damage",
                        nameAR: 'ضرر الرأس',
                        x: 85,
                        y: 1221,
                        font: 72
                    }, res[i].mainStats.DmgPB && res[i].mainStats.DamageZone_Critical ? (res[i].mainStats.DmgPB * res[i].mainStats.DamageZone_Critical) | 0 : "?", {
                        x: 55,
                        y: 1254,
                        w: (res[i].mainStats.DmgPB * res[i].mainStats.DamageZone_Critical / 250) * 740,
                        h: 9
                    }, {
                        x: x,
                        y: y
                    })

                    // Clip Size layer
                    layer(ctx, canvas, x + 55, y + 1272, 740, 116, {
                        nameEN: "clip size",
                        nameAR: 'حجم الذخيرة',
                        x: 85,
                        y: 1355,
                        font: 72
                    }, res[i].mainStats.ClipSize ? res[i].mainStats.ClipSize : "?", {
                        x: 55,
                        y: 1388,
                        w: (res[i].mainStats.ClipSize / 75) * 740,
                        h: 9
                    }, {
                        x: x,
                        y: y
                    })

                    // Fire Rate layer
                    layer(ctx, canvas, x + 55, y + 1406, 740, 116, {
                        nameEN: "fire rate",
                        nameAR: 'معدل الاطلاق',
                        x: 85,
                        y: 1489,
                        font: 72
                    }, res[i].mainStats.FiringRate ? res[i].mainStats.FiringRate : "?", {
                        x: 55,
                        y: 1522,
                        w: (res[i].mainStats.FiringRate / 15) * 740,
                        h: 9
                    }, {
                        x: x,
                        y: y
                    })

                    // Reload Time layer
                    layer(ctx, canvas, x + 55, y + 1540, 740, 116, {
                        nameEN: "reload time",
                        nameAR: 'وقت إعادة التحميل',
                        x: 85,
                        y: 1623,
                        font: 72
                    }, res[i].mainStats.ReloadTime ? res[i].mainStats.ReloadTime : "?", {
                        x: 55,
                        y: 1656,
                        w: (res[i].mainStats.ReloadTime / 12) * 740,
                        h: 9
                    }, {
                        x: x,
                        y: y
                    })

                    // Changing x and y
                    x = x + 10 + 850; 
                    if(length === newline){
                        y = y + 10 + 1700;
                        x = 0;
                        newline = 0;
                    }
                }

                // Send message
                const att = new Discord.AttachmentBuilder(canvas.toBuffer(), {name: `${message.author.id}-${res.length}weapons.png`})
                msg.edit({embeds: [], components: [], files: [att]})
                .catch(err => {
                    
                    // Try sending it on jpg file format [LOWER QUALITY]
                    var att = new Discord.AttachmentBuilder(canvas.toBuffer('image/jpeg'), {name: `${message.author.id}-${res.length}weapons.jpg`})
                    msg.edit({embeds: [], components: [], files: [att]})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                })

            }catch(err) {
                FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
            }
        }

        // Variables
        var weaponId = []
        const listOfWeapons = []
        
        // Request a weapon
        const rquestedWeapons = await FNBRMENA.Weapon("en", "", false)
        .catch(err => {
            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
        })

        // Storing the items
        var list = []
        var listCounter = 0
        while(text.indexOf("+") !== -1){

            // Getting the index of the + in text string
            var stringNumber = text.indexOf("+")
            // Substring the cosmetic name and store it
            var cosmetic = text.substring(0,stringNumber)
            // Trimming every space
            cosmetic = cosmetic.trim()
            // Store it into the array
            list[listCounter] = cosmetic
            // Remove the cosmetic from text to start again if the while statment !== -1
            text = text.replace(cosmetic + ' +','')
            // Remove every space in text
            text = text.trim()
            // Add the listCounter index
            listCounter++
            // End of wile lets try aagin
        }

        // Still there is the last cosmetic name so lets trim text
        text = text.trim()
        // Add the what text holds in the last index
        list[listCounter++] = text

        // Loop through every item
        for(let i = 0; i < list.length; i++){

            // Check if the user searched using an id or a name
            if(list[i].includes("_")){

                // Filter for wids
                weaponId = await rquestedWeapons.data.weapons.filter(wid => {
                    return wid.id.toLowerCase() === list[i].toLowerCase()
                })

            }else{

                // Filter for names
                weaponId = await rquestedWeapons.data.weapons.filter(wid => {
                    return wid.name.toLowerCase().includes(list[i].toLowerCase())
                })
            }
            
            // Check if there is an item found
            if(weaponId.length === 0){
                
                // No weapons has been found
                const noWeaponsFoundError = new Discord.EmbedBuilder()
                noWeaponsFoundError.setColor(FNBRMENA.Colors("embedError"))
                if(list.length === 1){
                    if(userData.lang === "en") noWeaponsFoundError.setTitle(`No weapons has been found ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") noWeaponsFoundError.setTitle(`لم يتم العثور على اسلحه ${emojisObject.errorEmoji}.`)
                    return message.reply({embeds: [noWeaponsFoundError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }else{
                    if(userData.lang === "en") noWeaponsFoundError.setTitle(`Can't find ${list[i]}, Attempting to skip ${emojisObject.errorEmoji}.`)
                    else if(userData.lang === "ar") noWeaponsFoundError.setTitle(`لا يمكنني العثور على ${list[i]} , سوف يتم تخطي العنصر ${emojisObject.errorEmoji}.`)
                    message.reply({embeds: [noWeaponsFoundError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })
                }
            }

            // If only one item has been found
            if(weaponId.length === 1){

                // Request a weapon
               await FNBRMENA.Weapon(userData.lang, "", false)
                .then(async res => {

                    // Check if there is a data
                    if(!res.data.result){

                        // No result found
                        const noResultFoundError = new Discord.EmbedBuilder()
                        noResultFoundError.setColor(FNBRMENA.Colors("embedError"))
                        if(userData.lang === "en") noResultFoundError.setTitle(`No result found (API Error) ${emojisObject.errorEmoji}.`)
                        else if(userData.lang === "ar") noResultFoundError.setTitle(`لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}.`)
                        return message.reply({embeds: [noResultFoundError], components: [], files: []})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                        })
                    }

                    // Filter for names
                    res.data.weapons.filter(wid => {
                        if(wid.id === weaponId[0].id) // Find the weapon
                        listOfWeapons.push(wid)
                        
                    })
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

            }

            // If more than one item has been found
            if(weaponId.length > 1){

                // Check if out of range
                if(weaponId.length >= 120){

                    // Too large entry
                    const requestEntryTooLargeError = new Discord.EmbedBuilder()
                    requestEntryTooLargeError.setColor(FNBRMENA.Colors("embedError"))
                    if(userData.lang === "en") requestEntryTooLargeError.setTitle(`Request entry too large ${emojisObject.errorEmoji}`)
                    else if(userData.lang === "ar") requestEntryTooLargeError.setTitle(`تم تخطي الكميه المحدودة ${emojisObject.errorEmoji}`)
                    return message.reply({embeds: [requestEntryTooLargeError], components: [], files: []})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, msg)
                    })

                }

                // Create an embed
                const listWeaponsEmbed = new Discord.EmbedBuilder()
                listWeaponsEmbed.setColor(FNBRMENA.Colors("embed"))

                //set Author
                if(userData.lang === "en"){
                    listWeaponsEmbed.setAuthor({name: `Weapons`, iconURL: 'https://i.ibb.co/YNKLKN5/mvFcjNF.png'})
                    listWeaponsEmbed.setDescription('Please click on the Drop-Down menu and choose a weapons.\n`You have only 30 seconds until this operation ends, Make it quick`!')
                }else if(userData.lang === "ar"){
                    listWeaponsEmbed.setAuthor({name: `الأسلحة`, iconURL: 'https://i.ibb.co/YNKLKN5/mvFcjNF.png'})
                    listWeaponsEmbed.setDescription('الرجاء الضغط على السهم لاختيار سلاح.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!')
                }

                // Create a row for buttons
                const buttonDataRow = new Discord.ActionRowBuilder()
                
                // Add buttons
                if(userData.lang === "en") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`Cancel-${alias}`)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel("Cancel")
                    )

                else if(userData.lang === "ar") buttonDataRow.addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId(`Cancel-${alias}`)
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
                    var listWeaponsDropMenu = new Discord.StringSelectMenuBuilder()
                    listWeaponsDropMenu.setCustomId(`${i}`)
                    listWeaponsDropMenu.setMinValues(1)
                    listWeaponsDropMenu.setMaxValues(weapons.length)
                    if(userData.lang === "en") listWeaponsDropMenu.setPlaceholder('Nothing selected!')
                    else if(userData.lang === "ar") listWeaponsDropMenu.setPlaceholder('لم يتم اختيار شيء بعد!')
                    listWeaponsDropMenu.addOptions(weapons)

                    // Add the drop menu to the categoryDropMenu
                    components.push(new Discord.ActionRowBuilder().addComponents(listWeaponsDropMenu))
                    limit = 25 * i

                } components.push(buttonDataRow)

                // Send the message
                const dropMenuMessage = await message.reply({embeds: [listWeaponsEmbed], components: components, files: []})
                .catch(err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                })

                // Filtering the user clicker
                const filter = (i => {
                    return (i.user.id === message.author.id && i.message.id === dropMenuMessage.id && i.guild.id === message.guild.id)
                })

                // Await for the user
                await message.channel.awaitMessageComponent({filter, time: 30000})
                .then(async collected => {
                    collected.deferUpdate()

                    // If cancel button has been clicked
                    if(collected.customId === `Cancel-${alias}`) dropMenuMessage.delete()
                    else if(collected.type === Discord.ComponentType.SelectMenu){

                        // Request a weapon
                        await FNBRMENA.Weapon(userData.lang, "", false)
                        .then(async res => {

                            // Check if there is a data
                            if(!res.data.result){

                                // No result found
                                const noResultFoundError = new Discord.EmbedBuilder()
                                noResultFoundError.setColor(FNBRMENA.Colors("embedError"))
                                if(userData.lang === "en") noResultFoundError.setTitle(`No result found (API Error) ${emojisObject.errorEmoji}.`)
                                else if(userData.lang === "ar") noResultFoundError.setTitle(`لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}.`)
                                return dropMenuMessage.edit({embeds: [noResultFoundError], components: [], files: []})
                                
                            }

                            // Call the weapon image builder
                            await dropMenuMessage.delete()
                                
                            // Filter for names
                            res.data.weapons.filter(wid => {
                                if(collected.values.includes(wid.id)) // Find the weapon
                                listOfWeapons.push(wid)
                                
                            })

                        }).catch(async err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                        })
                    }
                
                }).catch(async err => {
                    FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, dropMenuMessage)
                })
            }
        }

        // Call the weapon image builder
        if(listOfWeapons.length > 0) weaponImageBuilder(listOfWeapons)
    }
}    