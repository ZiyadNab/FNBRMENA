const { SlashCommandBuilder } = require('discord.js')
const axios = require('axios')
var shortUrl = require("turl");
const Discord = require('discord.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dl')
		.setDescription('Downloads videos from servral platforms')

        .addStringOption(option =>
            option.setName('url')
            .setDescription('Input the video url')
            .setRequired(true))

        .addBooleanOption(option =>
            option.setName('spoiler')
            .setDescription('Whether or not the media contains spoilers')),

	async execute(FNBRMENA, interaction, A, client, admin, userData, emojisObject) {
        await interaction.deferReply()
		
        axios.get(`https://fnbrmena.com/api/v1/dl?url=${interaction.options.getString('url')}`)
        .then(res => {

            // Send attatchment
            const att = new Discord.AttachmentBuilder(res.data.data.videoUrl, {name: `${res.data.data.id}.mp4`})
            att.setSpoiler(interaction.options.getBoolean('spoiler'))

            if(res.data.data.audioUrl){

                shortUrl.shorten(res.data.data.audioUrl)
                .then(audioUrl => {

                    // Creating a row
                    const row = new Discord.ActionRowBuilder()

                    // Add the aduio link
                    row.addComponents(
                        new Discord.ButtonBuilder()
                        .setStyle(Discord.ButtonStyle.Link)
                        .setLabel("Audio")
                        .setURL(audioUrl)
                    )

                    // Send the outfit video
                    interaction.editReply({embeds: [], components: [row], files: [att]})
                    .catch(err => {
                        console.log(err)
                        
                        // Try sending it as a content message
                        interaction.editReply({content: res.data.data.videoUrl})
                        .catch(err => {
                            FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                        })
                    })

                }).catch((err) => {
                    console.log(err);
                })

            }else{

                // Send the outfit video
                interaction.editReply({embeds: [], components: [], files: [att]})
                .catch(err => {
                    
                    // Try sending it as a content message
                    interaction.editReply({content: res.data.data.videoUrl})
                    .catch(err => {
                        FNBRMENA.Logs(admin, client, Discord, message, alias, userData.lang, text, err, emojisObject, null)
                    })
                })
            }
        }).catch(err => {

            if(err.isAxiosError){

                // Error
                const errorFound = new Discord.EmbedBuilder()
                errorFound.setColor(FNBRMENA.Colors("embedError"))
                errorFound.setTitle(`${err.response.data.error} ${emojisObject.errorEmoji}`)
                interaction.editReply({embeds: [errorFound], components: [], files: []})

            }else interaction.editReply({content: `An error has occured, please contact the support ${emojisObject.errorEmoji}.`, embeds: [], components: [], files: []})
        })
	}
}