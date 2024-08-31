const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('export')
		.setDescription('Export any file from the game files.')

        .addStringOption(option =>
            option.setName('path')
            .setDescription('Input the path to the file.')
            .setRequired(true)),

	async execute(FNBRMENA, interaction, A, client, admin, userData, emojisObject) {
        await interaction.deferReply()
		
        var time = Date.now()
        FNBRMENA.Export(interaction.options.getString('path'))
        .then(async res => {
            
            // File type is json
            if(res.headers['content-type'].includes('application/json')){
                
                // Send the file
                const att = new Discord.AttachmentBuilder(Buffer.from(JSON.stringify(res.data.jsonOutput[0], null, 2)), {name: `${res.data.jsonOutput[0].Name}.json`})
                interaction.editReply({embeds: [], components: [], files: [att]})
            }

            // File type is an image
            else if(res.headers['content-type'].includes('image')){

                // Send the file
                FNBRMENA.arrayBufferExport(interaction.options.getString('path'))
                .then(async resArrayBuf => {

                    const att = new Discord.AttachmentBuilder(Buffer.from(resArrayBuf.data), {name: `${interaction.options.getString('path').substring(interaction.options.getString('path').lastIndexOf('/'), interaction.options.getString('path').length)}.png`})
                    interaction.editReply({embeds: [], components: [], files: [att]})
                })
            }

            // File type is an image
            else if(res.headers['content-type'].includes('audio')){

                // Send the file
                FNBRMENA.arrayBufferExport(interaction.options.getString('path'))
                .then(async resArrayBuf => {

                    const att = new Discord.AttachmentBuilder(Buffer.from(resArrayBuf.data), {name: `${interaction.options.getString('path').substring(interaction.options.getString('path').lastIndexOf('/'), interaction.options.getString('path').length)}.ogg`})
                    interaction.editReply({embeds: [], components: [], files: [att]})
                })

                // Not supported file type
            }else{

                const noSupportedFileTypeError = new Discord.EmbedBuilder()
                noSupportedFileTypeError.setColor(FNBRMENA.Colors("embedError"))
                if(userData.lang === "en") noSupportedFileTypeError.setTitle(`The file type ${res.headers['content-type']} isn't supported. ${emojisObject.errorEmoji}`)
                else if(userData.lang === "ar") noSupportedFileTypeError.setTitle(`نوع الملف ${res.headers['content-type']} ليس مدعوم${emojisObject.errorEmoji}`)
                interaction.editReply({embeds: [noSupportedFileTypeError], components: [], files: []})
            }
            
        }).catch(err => {

            // Error
            const errorFound = new Discord.EmbedBuilder()
            errorFound.setColor(FNBRMENA.Colors("embedError"))
            errorFound.setTitle(`An error has occured ${emojisObject.errorEmoji}`)
            interaction.editReply({embeds: [errorFound], components: [], files: []})
        })
	}
}