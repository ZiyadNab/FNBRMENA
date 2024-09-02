const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emote')
        .setDescription('Get a video for any emote in-game.')
        .addStringOption(option =>
            option.setName('emote')
                .setDescription('Specify the emote name or ID.')
                .setRequired(true)
        ),

    async execute(FNBRMENA, interaction, Discord, client, admin, userData, emojisObject) {

        // Initializing data
        const text = interaction.options.getString('emote');
        let searchType = "name";

        // If input is an ID
        if (text.includes("_")) searchType = "id";

        // Request the emote video
        try {
            const res = await FNBRMENA.SearchByType(userData.lang, text, 'emote', searchType);

            // Check if the user entered a valid emote name
            if (res.data.items.length <= 0) {
                const noEmoteFoundError = new Discord.EmbedBuilder()
                    .setColor(FNBRMENA.Colors("embedError"));
                if (userData.lang === "en") {
                    noEmoteFoundError.setTitle(`No emote found. Check your spelling and try again ${emojisObject.errorEmoji}`);
                } else if (userData.lang === "ar") {
                    noEmoteFoundError.setTitle(`لا يمكنني العثور على الرقصه. الرجاء التأكد من كتابة الاسم بشكل صحيح ${emojisObject.errorEmoji}`);
                }
                return interaction.reply({ embeds: [noEmoteFoundError], ephemeral: true });
            }

            // Check if the emote has a video
            if (res.data.items[0].video === null) {
                const noVideoFoundError = new Discord.EmbedBuilder()
                    .setColor(FNBRMENA.Colors("embedError"));
                if (userData.lang === "en") {
                    noVideoFoundError.setTitle(`There is no video for ${res.data.items[0].name} yet ${emojisObject.errorEmoji}`);
                } else if (userData.lang === "ar") {
                    noVideoFoundError.setTitle(`لا يوجد فيديو لرقصة ${res.data.items[0].name} ${emojisObject.errorEmoji}`);
                }
                return interaction.reply({ embeds: [noVideoFoundError], ephemeral: true });
            }

            // Send the generating message
            const generating = new Discord.EmbedBuilder()
                .setColor(FNBRMENA.Colors("embed"));
            if (userData.lang === "en") {
                generating.setTitle(`Loading the ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`);
            } else if (userData.lang === "ar") {
                generating.setTitle(`جاري تحميل بيانات ${res.data.items[0].name}... ${emojisObject.loadingEmoji}`);
            }

            await interaction.deferReply();

            // Send attachment
            const att = new Discord.AttachmentBuilder(res.data.items[0].video);

            // Send the emote video
            await interaction.editReply({ embeds: [], files: [att] });

        } catch (err) {

            // Try sending it as a content message
            await interaction.editReply({ content: res.data.items[0].video, embeds: [], components: [], files: [] });
        }
    }
};
