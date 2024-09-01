const axios = require('axios')
const { parse } = require("node-html-parser");

module.exports = {
    commands: 'hand',
    type: 'Fortnite',
    minArgs: 0,
    maxArgs: 0,
    cooldown: -1,
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        fetch("https://osirion.gg/app/seasonal-events/titan-hand", {
            "headers": {
                "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "max-age=0",
                "sec-ch-ua": "\"Chromium\";v=\"122\", \"Not(A:Brand\";v=\"24\", \"Microsoft Edge\";v=\"122\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "cookie": "auth_session=jdfyk56egz4vuyuzghx4awgqe8z6a1vwij3e788o"
            },
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET"
        }).then(async res => {

            const jsonResponse = await res.text()
            const root = parse(jsonResponse);
            const scriptTags = root.querySelectorAll('script');
            scriptTags.forEach(script => {
                const scriptContent = script.innerHTML;
                const firstSub = scriptContent.substring(scriptContent.search("titanData") + 10)
                const secondSub = firstSub.substring(0, firstSub.search(",id:"))
                const jsonData = secondSub.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":').replace(/:\s*([a-zA-Z0-9_]+?)\s*([,}])/g, ':"$1"$2');
                const parsedJSON = JSON.parse(jsonData)
                const latestUpdate = parsedJSON.healthUpdates[parsedJSON.healthUpdates.length - 1]
    
                // Calculate the percentage
                const trillionNumber = 5 * Math.pow(10, 12); // 5 trillion
    
                const percentage = Number(latestUpdate.health) / trillionNumber;
                const progress = Math.round((10 * percentage));
                const emptyProgress = 10 - progress;
    
                const progressText = '▇'.repeat(progress);
                const emptyProgressText = '—'.repeat(emptyProgress);
                const percentageText = Math.round(percentage * 100) + '%';
    
                const bar = '```[' + progressText + emptyProgressText + ']' + percentageText + '```';
    
                const embed = new Discord.EmbedBuilder()
                embed.setImage("https://i.ibb.co/tx5QWsQ/GHl-WQNLWo-AAhm-WV-1.jpg")
                embed.setColor("FF5100")
                embed.addFields(
                    { name: 'Start Health', value: '5,000,000,000,000', inline: true },
                    { name: 'Current Health', value: Number(latestUpdate.health).toLocaleString('en-US'), inline: true },
                    { name: 'Damage Dealt', value: (trillionNumber - Number(latestUpdate.health)).toLocaleString('en-US'), inline: true },
                    { name: 'Damage Multiplier', value: latestUpdate.damageMultiplier + 'x' },
                    { name: 'Percentage', value: bar },
    
                )
    
                let numberAsString = latestUpdate.timestamp.toString();
                let modifiedNumber = Number(numberAsString.slice(0, -3));
                embed.setTimestamp(modifiedNumber)
    
                message.reply({ embeds: [embed] })
            });

        }).catch(err => {
            console.log(err)

        })
    }
}