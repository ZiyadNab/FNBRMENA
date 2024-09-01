const { SlashCommandBuilder } = require('discord.js')
const moment = require('moment')
const Discord = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('codestatus')
        .setDescription('Check status for any code.')

        .addStringOption(option =>
            option.setName('code')
                .setDescription('Insert your code here.')
                .setRequired(true)),

    async execute(FNBRMENA, interaction, A, client, admin, userData, emojisObject) {
        await interaction.deferReply()
        moment.locale(userData.lang)

        FNBRMENA.codeVerify(interaction.options.getString('code'), userData.lang)
        .then(async res => {

            // Set embed
            const codeStatus = new Discord.EmbedBuilder()
            codeStatus.setColor(FNBRMENA.Colors("embed"))
            codeStatus.setTitle(res.data.codeStatus.itemDetails.title)
            codeStatus.setDescription(res.data.codeStatus.itemDetails.longDescription)
            codeStatus.setFields(
                {
                    name: userData.lang === "en" ? 'Code' : 'الكود',
                    value: res.data.codeStatus.code,
                },
                {
                    name: userData.lang === "en" ? 'Max Uses' : 'اعلى عدد استخدام',
                    value: `${res.data.codeStatus.maxNumberOfUses}`,
                    inline: true
                },
                {
                    name: userData.lang === "en" ? 'Current Uses' : 'الاستخدامات الحالية',
                    value: `${res.data.codeStatus.useCount}`,
                    inline: true
                },
                {
                    name: userData.lang === "en" ? 'Complete Uses' : 'الاستخدامات الكاملة',
                    value: `${res.data.codeStatus.completedCount}`,
                    inline: true
                },
                {
                    name: userData.lang === "en" ? 'Start Date' : 'تاريخ البدء',
                    value: moment(res.data.codeStatus.startDate).format(userData.lang === "en" ? "dddd, MMMM Do of YYYY" : "dddd, MMMM Do من YYYY"),
                    inline: true
                },
                {
                    name: userData.lang === "en" ? 'End Date' : 'تاريخ الانتهاء',
                    value: moment(res.data.codeStatus.endDate).format(userData.lang === "en" ? "dddd, MMMM Do of YYYY" : "dddd, MMMM Do من YYYY"),
                    inline: true
                },
            )
            interaction.editReply({ embeds: [codeStatus], components: [], files: [] })

        }).catch(err => {
            console.log(err)

            // Error
            const errorFound = new Discord.EmbedBuilder()
            errorFound.setColor(FNBRMENA.Colors("embedError"))
            errorFound.setTitle(`An error has occured ${emojisObject.errorEmoji}`)
            interaction.editReply({ embeds: [errorFound], components: [], files: [] })
        })
    }
}