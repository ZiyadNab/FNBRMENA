const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('findstring')
		.setDescription('Return any match to a given string.')

        .addStringOption(option =>
            option.setName('string')
            .setDescription('Input the string')
            .setRequired(true)),

	async execute(FNBRMENA, interaction, A, client, admin, userData, emojisObject) {
        await interaction.deferReply()
		
        var t = Date.now()
        FNBRMENA.allAssets()
        .then(async res => {

            const foundStringts = await res.data.filter(e => {
                return e.contains(interaction.options.getString('string'))
            })

            const foundStringsEmbed = new Discord.EmbedBuilder()
            foundStringsEmbed.setColor(FNBRMENA.Colors("embedError"))
            if(foundStringts) foundStringsEmbed.setDescription(`\`\`\`yaml\n${foundStringsEmbed}\`\`\``)
            interaction.editReply({content: `Found ${foundStringts.length} asstets in ${t - Date.now()}ms`, embeds: [foundStringsEmbed], components: [], files: []})
            
            
        }).catch(err => {
            console.log(err)

            // Error
            const errorFound = new Discord.EmbedBuilder()
            errorFound.setColor(FNBRMENA.Colors("embedError"))
            errorFound.setTitle(`An error has occured ${emojisObject.errorEmoji}`)
            interaction.editReply({embeds: [errorFound], components: [], files: []})
        })
	}
}