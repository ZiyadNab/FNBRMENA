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

        .addStringOption(option =>
            option.setName('captions')
            .setDescription('Input a caption'))

        .addBooleanOption(option =>
            option.setName('spoiler')
            .setDescription('Whether or not the media contains spoilers'))

        .addBooleanOption(option =>
            option.setName('includecaptions')
            .setDescription('Whether or not to include the actual media captions')),

	async execute(FNBRMENA, interaction, A, client, admin, userData, emojisObject) {
        await interaction.deferReply()
		
        axios.get(`https://fnbrmena.com/api/v1/dl?url=${interaction.options.getString('url')}`)
        .then(res => {
            
            const files = []
            if(res.data.data.video.length){
                for(const v of res.data.data.video){
                    if(v.qualities) files.push(new Discord.AttachmentBuilder(v.qualities[v.qualities.reduce((highestIndex, currentQuality, currentIndex) => {
                        const currentQualityValue = parseInt(currentQuality.quality); // Assuming quality values are integers
                        const highestQualityValue = parseInt(v.qualities[highestIndex].quality);
                    
                        if (currentQualityValue > highestQualityValue) {
                            return currentIndex;
                        } else {
                            return highestIndex;
                        }
                    }, 0)].url, {name: `${res.data.data.id}.mp4`}).setSpoiler(interaction.options.getBoolean('spoiler')))
                    else files.push(new Discord.AttachmentBuilder(v.url, {name: `${res.data.data.id}.mp4`}).setSpoiler(interaction.options.getBoolean('spoiler')))
                }

            }else for(const i of res.data.data.images) if(files.length < 10) files.push(new Discord.AttachmentBuilder(i, {name: `${res.data.data.id}.png`}).setSpoiler(interaction.options.getBoolean('spoiler')))

            if(res.data.data.audio){
                if(res.data.data.audio.url){
                    shortUrl.shorten(res.data.data.audio.url)
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
                        interaction.editReply({content: interaction.options.getBoolean('includecaptions') ? res.data.data.title : interaction.options.getString('captions') ? interaction.options.getString('captions') : '', embeds: [], components: [row], files: files})
                        .catch(err => {
                            
                        })

                    }).catch((err) => {
                        console.log(err);
                    })
                }

            }else{

                // Send the outfit video
                interaction.editReply({content: interaction.options.getBoolean('includecaptions') ? res.data.data.title : interaction.options.getString('captions') ? interaction.options.getString('captions') : '', embeds: [], components: [], files: files})
                .catch(err => {
                    
                })
            }
        }).catch(err => {
            console.log(err)

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