const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('outfit')
        .setDescription('Get a video for any outfit in-game.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Specify the outfit name or ID')
                .setRequired(true)),
    async execute(FNBRMENA, interaction, Discord, client, admin, userData, emojisObject) {
        const userData = {}; // Assuming you have a way to retrieve userData
        const text = interaction.options.getString('name');
        let searchType = text.includes("_") ? "id" : "name";

        const res = await FNBRMENA.SearchByType(userData.lang, text, 'outfit', searchType);

        if (res.data.items.length <= 0) {
            const noItemHasBeenFoundError = new Discord.EmbedBuilder()
                .setColor(FNBRMENA.Colors("embedError"))
                .setTitle(userData.lang === "en"
                    ? `No outfit has been found, check your spelling and try again ${emojisObject.errorEmoji}.`
                    : `لا يمكنني العثور على الزي، الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}.`);
            return interaction.reply({ embeds: [noItemHasBeenFoundError] });
        }

        if (!res.data.items[0].previewVideos.length) {
            const noVideoFoundError = new Discord.EmbedBuilder()
                .setColor(FNBRMENA.Colors("embedError"))
                .setTitle(userData.lang === "en"
                    ? `There is no video for ${res.data.items[0].name} yet ${emojisObject.errorEmoji}.`
                    : `لا يوجد فيديو لزي ${res.data.items[0].name} ${emojisObject.errorEmoji}.`);
            return interaction.reply({ embeds: [noVideoFoundError] });
        }

        if (res.data.items[0].previewVideos.length > 125) {
            const exceeded125StylesError = new Discord.EmbedBuilder()
                .setColor(FNBRMENA.Colors("embedError"))
                .setTitle(userData.lang === "en"
                    ? `The ${res.data.items[0].name} outfit has more than 125 styles ${emojisObject.errorEmoji}.`
                    : `زي ${res.data.items[0].name} يحتوي على اكثر من 125 نمط ${emojisObject.errorEmoji}.`);
            return interaction.reply({ embeds: [exceeded125StylesError] });
        }

        if (res.data.items[0].previewVideos.length > 1) {
            const itemVariantsEmbed = new Discord.EmbedBuilder()
                .setColor(res.data.items[0].series === null
                    ? FNBRMENA.Colors(res.data.items[0].rarity.id)
                    : FNBRMENA.Colors(res.data.items[0].series.id))
                .setAuthor({
                    name: userData.lang === "en"
                        ? `Variants, ${res.data.items[0].name}`
                        : `الأنماط, ${res.data.items[0].name}`,
                    iconURL: res.data.items[0].images.icon
                })
                .setDescription(userData.lang === "en"
                    ? 'Please click on the Drop-Down menu and choose a variant.\n`You have only 30 seconds until this operation ends, Make it quick`!'
                    : 'الرجاء الضغط على السهم لاختيار نمط.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!');

            const buttonDataRow = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                        .setCustomId('Cancel')
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setLabel(userData.lang === "en" ? "Cancel" : "اغلاق")
                );

            let size = Math.ceil(res.data.items[0].previewVideos.length / 25);
            let components = [];

            for (let i = 1; i <= size; i++) {
                let variant = [];
                for (let x = (i - 1) * 25; x < Math.min(i * 25, res.data.items[0].previewVideos.length); x++) {
                    const item = res.data.items[0].previewVideos[x];
                    let styleId = res.data.items[0].styles.length
                        ? res.data.items[0].styles.find(variantData => variantData.tag === item.styles[0].tag)?.name
                        : res.data.items[0].name;

                    variant.push({
                        label: styleId,
                        value: `${x}`,
                    });
                }

                const itemVariantsDropMenu = new Discord.StringSelectMenuBuilder()
                    .setCustomId(`${i}`)
                    .setPlaceholder(userData.lang === "en" ? 'Nothing selected!' : 'لم يتم اختيار شيء بعد!')
                    .addOptions(variant);

                components.push(new Discord.ActionRowBuilder().addComponents(itemVariantsDropMenu));
            }

            components.push(buttonDataRow);
            const dropMenuMessage = await interaction.reply({ embeds: [itemVariantsEmbed], components: components, fetchReply: true });

            const filter = i => i.user.id === interaction.user.id && i.message.id === dropMenuMessage.id;

            const collector = dropMenuMessage.createMessageComponentCollector({ filter, time: 30000 });

            collector.on('collect', async collected => {
                collected.deferUpdate();

                if (collected.customId === "Cancel") {
                    dropMenuMessage.delete();
                } else {
                    const generating = new Discord.EmbedBuilder()
                        .setColor(FNBRMENA.Colors("embed"))
                        .setTitle(userData.lang === "en"
                            ? `Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`
                            : `جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`);
                    await interaction.editReply({ embeds: [generating], components: [] });

                    const att = new Discord.AttachmentBuilder(res.data.items[0].previewVideos[collected.values[0]].url);
                    await interaction.editReply({ embeds: [], components: [], files: [att] });
                }
            });

            collector.on('end', collected => {
                if (collected.size === 0) interaction.editReply({ components: [] });
            });
        } else {
            const generating = new Discord.EmbedBuilder()
                .setColor(FNBRMENA.Colors("embed"))
                .setTitle(userData.lang === "en"
                    ? `Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`
                    : `جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`);
            const msg = await interaction.reply({ embeds: [generating], components: [], fetchReply: true });

            const att = new Discord.AttachmentBuilder(res.data.items[0].previewVideos[0].url);
            await msg.edit({ embeds: [], files: [att] });
        }
    }
};
