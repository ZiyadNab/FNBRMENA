const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weapon')
        .setDescription('Return an image about any weapon.')
        .addStringOption(option =>
            option.setName('weapon')
                .setDescription('Specify the weapon name or ID.')
                .setRequired(true)
        ),

    async execute(FNBRMENA, interaction, Discord, client, admin, userData, emojisObject) {

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
        Canvas.registerFont('./assets/font/BurbankBigCondensed-Black.ttf', {
            family: 'Burbank Big Condensed',
            style: "bold"
        })

        //aplyText
        const applyText = (canvas, text, width, font) => {
            const ctx = canvas.getContext('2d');
            let fontSize = font;
            do {
                if (userData.lang === "en") ctx.font = `${fontSize -= 1}px Burbank Big Condensed`;
                else if (userData.lang === "ar") ctx.font = `${fontSize -= 1}px Arabic`;
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
            if (userData.lang === "en") {

                // Layer name
                ctx.textAlign = 'left'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(obj.nameEN.toUpperCase(), xy.x + obj.x, xy.y + obj.y)

                // Layer value
                ctx.textAlign = 'right'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(value, (xy.x + 850) - obj.x, xy.y + obj.y)

                // Add the line range
                if (line.w <= w) ctx.fillRect(xy.x + line.x, xy.y + line.y, line.w, line.h)
                else ctx.fillRect(xy.x + line.x, xy.y + line.y, w, line.h)

            } else if (userData.lang === "ar") {

                // Layer name
                ctx.textAlign = 'right'
                ctx.font = `${obj.font}px Arabic`
                ctx.fillText(obj.nameAR, (xy.x + 850) - obj.x, xy.y + obj.y)

                // Layer value
                ctx.textAlign = 'left'
                ctx.font = `${obj.font}px Burbank Big Condensed`
                ctx.fillText(value, xy.x + obj.x, xy.y + obj.y)

                // Add the line range
                if (-line.w >= -w) ctx.fillRect((xy.x + 850) - line.x, xy.y + line.y, -line.w, line.h)
                else ctx.fillRect((xy.x + 850) - line.x, xy.y + line.y, -w, line.h)
            }
        }

        // Weapon Image Builder
        const weaponImageBuilder = async (interaction, res) => {
            // Send the generating message
            const generating = new Discord.EmbedBuilder()
                .setColor(FNBRMENA.Colors("embed"));
            if (userData.lang === "en")
                generating.setTitle(`Loading ${res.length} weapons ${emojisObject.loadingEmoji}.`);
            else if (userData.lang === "ar")
                generating.setTitle(`جاري تحميل ${res.length} اسلحه ${emojisObject.loadingEmoji}.`);

            const msg = await interaction.reply({ embeds: [generating], components: [], files: [], fetchReply: true })
                .catch(err => {
                    console.log(err)
                });

            try {
                // Canvas variables
                var length = res.length;
                var width = 0;
                var height = 1700;
                var newline = 0;
                var x = 0;
                var y = 0;

                // Logic for determining length
                if (length <= 5) length = length;
                else if (length >= 6 && length <= 7) length = length / 2;
                else if (length >= 8 && length <= 12) length = length / 2;
                else length = length / 4;

                // Forcing to be int
                if (length % 2 !== 0 && length != 1) {
                    length = length | 0;
                }

                // Creating width
                if (res.length === 1) width = 850;
                else width += (length * 850) + (length * 10) - 10;

                // Creating height
                for (let i = 0; i < res.length; i++) {
                    if (newline === length) {
                        height += 1700 + 10;
                        newline = 0;
                    }
                    newline++;
                }

                // Reset newline
                newline = 0;

                // Create canvas
                const canvas = Canvas.createCanvas(width, height);
                const ctx = canvas.getContext('2d');

                // Load background
                const background = await Canvas.loadImage('./assets/backgroundwhite.jpg');
                ctx.drawImage(background, 0, 0, width, height);

                // Loop through all weapons
                for (let i = 0; i < res.length; i++) {
                    newline++;

                    // Load weapon background rarity
                    const rarityBackground = await Canvas.loadImage(`./assets/Rarities/weapons/${res[i].rarity}.png`);
                    ctx.drawImage(rarityBackground, x, y, 850, 1700);

                    // Add weapon name
                    ctx.fillStyle = '#ffffff';
                    ctx.textAlign = 'center';
                    ctx.font = applyText(canvas, res[i].name.toUpperCase(), 800, 80);
                    if (userData.lang === "en")
                        ctx.fillText(res[i].name.toUpperCase(), x + (850 / 2), y + 850);
                    else if (userData.lang === "ar")
                        ctx.fillText(res[i].name, x + (850 / 2), y + 830);

                    // Drop shadow
                    ctx.shadowOffsetY = 20;
                    ctx.shadowOffsetX = 20;
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
                    ctx.shadowBlur = 40;

                    // Load the weapon image
                    const weaponImg = await Canvas.loadImage(res[i].images.icon);
                    ctx.drawImage(weaponImg, x + 100, y + 100, 650, 650);

                    // Change the shadow blur
                    ctx.shadowBlur = 60;

                    // Add 6 background layers
                    ctx.fillStyle = '#000000';

                    // Add layer
                    ctx.shadowColor = "rgba(0, 0, 0, 0.4)"; // Add a shadow color (BLACK)
                    ctx.globalAlpha = 0.2; // Change opacity
                    ctx.fillRect(x + 55, y + 870, 740, 116);
                    ctx.shadowColor = 'rgba(0,0,0,0)'; // Reset shadows
                    ctx.globalAlpha = 1; // Reset transparency

                    // Add layer name
                    ctx.fillStyle = '#ffffff';
                    if (userData.lang === "en") {
                        // Layer name
                        ctx.textAlign = 'left';
                        ctx.font = `72px Burbank Big Condensed`;
                        ctx.fillStyle = colors[res[i].rarity];

                        // Get rarity width
                        const rarityW = ctx.measureText(`${res[i].rarity.toUpperCase()} RARITY`).width;
                        const text = `${res[i].rarity.toUpperCase()} RARITY`;

                        // Draw the rarity
                        var r = (850 / 2) - (rarityW / 2);
                        for (let i = 0; i < text.length; i++) {
                            if (text[i] === ' ') ctx.fillStyle = '#ffffff';
                            ctx.fillText(`${text[i]}`, x + r, y + 953);
                            r += ctx.measureText(text[i]).width;
                        }

                    } else if (userData.lang === "ar") {
                        ctx.textAlign = 'center';
                        ctx.font = `72px Arabic`;
                        ctx.fillText(`الندرة ${translation[res[i].rarity]}`, x + (850 / 2), y + 953);
                    }

                    // Change to white color
                    ctx.fillStyle = '#ffffff';

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
                    });

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
                    });

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
                    });

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
                    });

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
                    });

                    // Check new line
                    if (newline === length) {
                        y += 1710;
                        x = 0;
                        newline = 0;
                    } else {
                        x += 860;
                    }
                }

                // Send the image
                const attachment = new Discord.AttachmentBuilder(await canvas.toBuffer(), { name: 'weapon.png' });
                await interaction.editReply({ files: [attachment] });
            } catch (err) {
                console.log(err)
            }
        };

        const text = interaction.options.getString('name');
        var list = [];
        var listCounter = 0;

        // Storing the items from the input
        while (text.indexOf("+") !== -1) {
            var stringNumber = text.indexOf("+");
            var cosmetic = text.substring(0, stringNumber).trim();
            list[listCounter++] = cosmetic;
            text = text.replace(cosmetic + ' +', '').trim();
        }

        // Add the last cosmetic name
        text = text.trim();
        list[listCounter++] = text;

        var listOfWeapons = [];

        // Loop through every item
        for (let i = 0; i < list.length; i++) {
            let weaponId;

            // Check if the user searched using an id or a name
            if (list[i].includes("_")) {
                // Filter for ids
                weaponId = await rquestedWeapons.data.weapons.filter(wid => {
                    return wid.id.toLowerCase() === list[i].toLowerCase();
                });
            } else {
                // Filter for names
                weaponId = await rquestedWeapons.data.weapons.filter(wid => {
                    return wid.name.toLowerCase().includes(list[i].toLowerCase());
                });
            }

            // Check if there is an item found
            if (weaponId.length === 0) {
                // No weapons have been found
                const noWeaponsFoundError = new EmbedBuilder()
                    .setColor(FNBRMENA.Colors("embedError"))
                    .setTitle(userData.lang === "en" ? `No weapons have been found ${emojisObject.errorEmoji}.` : `لم يتم العثور على اسلحه ${emojisObject.errorEmoji}.`);
                await interaction.reply({ embeds: [noWeaponsFoundError], ephemeral: true });
                continue;
            }

            // If only one item has been found
            if (weaponId.length === 1) {
                // Request a weapon
                await FNBRMENA.Weapon(userData.lang, "", false)
                    .then(async res => {
                        if (!res.data.result) {
                            const noResultFoundError = new EmbedBuilder()
                                .setColor(FNBRMENA.Colors("embedError"))
                                .setTitle(userData.lang === "en" ? `No result found (API Error) ${emojisObject.errorEmoji}.` : `لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}.`);
                            return await interaction.reply({ embeds: [noResultFoundError], ephemeral: true });
                        }

                        // Filter for names
                        res.data.weapons.filter(wid => {
                            if (wid.id === weaponId[0].id) listOfWeapons.push(wid);
                        });
                    }).catch(err => {
                        FNBRMENA.Logs(admin, null, Discord, interaction, null, userData.lang, text, err, emojisObject, null);
                    });
            }

            // If more than one item has been found
            if (weaponId.length > 1) {
                // Create an embed
                const listWeaponsEmbed = new EmbedBuilder()
                    .setColor(FNBRMENA.Colors("embed"))
                    .setAuthor({ name: userData.lang === "en" ? `Weapons` : `الأسلحة`, iconURL: 'https://i.ibb.co/YNKLKN5/mvFcjNF.png' })
                    .setDescription(userData.lang === "en" ? 'Please select a weapon from the dropdown menu.' : 'الرجاء اختيار سلاح من القائمة المنسدلة.');

                // Create a row for buttons
                const buttonDataRow = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId(`Cancel`)
                            .setStyle(ButtonStyle.Danger)
                            .setLabel(userData.lang === "en" ? "Cancel" : "اغلاق")
                    );

                // Create select menu options
                const weapons = weaponId.map(wid => ({
                    label: wid.name,
                    value: wid.id,
                    emoji: `${emojisObject[wid.rarity].name}:${emojisObject[wid.rarity].id}`
                }));

                const listWeaponsDropMenu = new StringSelectMenuBuilder()
                    .setCustomId(`weapons-select`)
                    .setPlaceholder(userData.lang === "en" ? 'Select a weapon...' : 'اختر سلاحًا...')
                    .addOptions(weapons);

                const selectMenuRow = new ActionRowBuilder().addComponents(listWeaponsDropMenu).addComponents(buttonDataRow);

                // Send the message
                await interaction.reply({ embeds: [listWeaponsEmbed], components: [selectMenuRow] });

                // Filtering the user interaction
                const filter = (i) => i.user.id === interaction.user.id;

                // Await for the user
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

                collector.on('collect', async (i) => {
                    if (i.customId === 'Cancel') {
                        await interaction.followUp({ content: 'Operation cancelled.', ephemeral: true });
                        collector.stop();
                    } else if (i.customId === 'weapons-select') {
                        await FNBRMENA.Weapon(userData.lang, "", false)
                            .then(async res => {
                                if (!res.data.result) {
                                    const noResultFoundError = new EmbedBuilder()
                                        .setColor(FNBRMENA.Colors("embedError"))
                                        .setTitle(userData.lang === "en" ? `No result found (API Error) ${emojisObject.errorEmoji}.` : `لم يتم العثور على نتائج (مشكلة API) ${emojisObject.errorEmoji}.`);
                                    return await interaction.editReply({ embeds: [noResultFoundError], components: [] });
                                }

                                // Call the weapon image builder
                                listOfWeapons.push(res.data.weapons.find(wid => wid.id === i.values[0]));
                                await weaponImageBuilder(listOfWeapons);
                            }).catch(err => {
                                FNBRMENA.Logs(admin, null, Discord, interaction, null, userData.lang, text, err, emojisObject, null);
                            });
                    }
                });

                collector.on('end', collected => {
                    if (collected.size === 0) {
                        interaction.followUp({ content: 'No selection made, operation timed out.', ephemeral: true });
                    }
                });
            }
        }

        // Call the weapon image builder
        if (listOfWeapons.length > 0) weaponImageBuilder(listOfWeapons);
    }
};
