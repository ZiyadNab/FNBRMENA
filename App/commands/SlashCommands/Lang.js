const { ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lang')
        .setDescription('Change your language'),
    async execute(FNBRMENA, interaction, Discord, client, admin, userData, emojisObject) {
        // Setting up the db firestore
        var db = await admin.firestore();

        // Create an embed
        const languageEmbed = new EmbedBuilder()
            .setColor(FNBRMENA.Colors("embed"))
            .setTitle(userData.lang === "en" ? 'Language' : 'تعديل اللغة')
            .setDescription(userData.lang === "en" 
                ? 'Please click on the Drop-Down menu and choose a language.\n`You have only 30 seconds until this operation ends, Make it quick`!'
                : 'الرجاء الضغط على السهم لاختيار لغة.\n`لديك فقط 30 ثانية حتى تنتهي العملية, استعجل`!'
            );

        // Create a row for the cancel button
        const buttonDataRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('Cancel')
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(userData.lang === "en" ? "Cancel" : "اغلاق")
            );

        // Create a row for the drop-down menu for languages
        const languageRow = new ActionRowBuilder();

        // Create a select menu
        const languageDropMenu = new StringSelectMenuBuilder()
            .setCustomId('language')
            .setPlaceholder(userData.lang === "en" ? 'Select a language!' : 'اختر لغة!');

        // Add options
        languageDropMenu.addOptions(
            { label: userData.lang === "en" ? 'Arabic' : 'العربية', emoji: '🇸🇦', value: 'ar' },
            { label: userData.lang === "en" ? 'English' : 'الانجليزية', emoji: '🇺🇸', value: 'en' }
        );

        // Add the drop menu to the language row
        languageRow.addComponents(languageDropMenu);

        // Send the message
        await interaction.reply({ embeds: [languageEmbed], components: [languageRow, buttonDataRow] });

        // Filtering the user clicker
        const filter = (i) => {
            return (i.user.id === interaction.user.id && i.guild.id === interaction.guild.id);
        };

        // Await for the user interaction
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (collected) => {
            await collected.deferUpdate();

            // Cancel button has been selected
            if (collected.customId === "Cancel") {
                await interaction.deleteReply();
                collector.stop(); // Stop the collector
            }

            // Language has been selected
            if (collected.customId === "language") {
                // Update the user's language
                await db.collection("Users").doc(interaction.user.id).update({
                    lang: collected.values[0]
                });

                // Create success embed
                const successfullyUpdatedEmbed = new EmbedBuilder()
                    .setColor(FNBRMENA.Colors("embedSuccess"))
                    .setTitle(userData.lang === "en" 
                        ? `You have successfully changed your language ${emojisObject.checkEmoji}.`
                        : `تم تغير اللغة الخاصه بك بنجاح ${emojisObject.checkEmoji}.`
                    );

                await interaction.editReply({ embeds: [successfullyUpdatedEmbed], components: [] });
                collector.stop(); // Stop the collector
            }
        });

        collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
                await interaction.followUp({ content: 'Time is up! Please try again.', ephemeral: true });
            }
        });
    }
};
