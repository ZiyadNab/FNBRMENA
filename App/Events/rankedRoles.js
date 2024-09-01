const Discord = require('discord.js')
const axios = require('axios')
const config = require('../Configs/config.json')

module.exports = (FNBRMENA, client, admin, emojisObject) => {

    const roleIds = [
        "1206993258715021322",
        "1206987505916706928",
        "1206989070165876816",
        "1206989192991866960",
        "1206989274017169408",
        "1206989526946283560",
        "1206989617857826856",
        "1206989703795179561",
        "1206989864290099220",
        "1206989911354507364",
        "1206991129153634374",
        "1206993216168136746",
        "1206993436079685683",
        "1206994609155219516",
        "1206995200585633863",
        "1206995959255670794",
        "1206996982774894603",
        "1206997072587264041",
        "1206997161477414993",
        "1007326574594494524"
    ]

    const rankedRoles = async () => {
        try {
            const data = await admin.database().ref("ERA's").child("Events").child("rankedRoles").once('value')
            const status = data.val().Active
            const snapshot = await admin.firestore().collection("Server").doc("rankedRoles").get()
            const accounts = snapshot.data().accounts

            if (status) {

                await Promise.all(accounts.map(async player => {
                    const res = await axios({
                        method: "GET",
                        url: "https://www.fnbrmena.com/api/auth/get/ios"
                    })

                    const tracks = await axios({
                        method: "GET",
                        url: "https://fn-service-habanero-live-public.ogs.live.on.epicgames.com/api/v1/games/fortnite/tracks/query?rankingType=ranked-br",
                        headers: {
                            'Authorization': `${res.data.data.token_type} ${res.data.data.access_token}`,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0)'
                        }
                    })

                    const latestTrack = tracks.data.reduce((prev, current) =>
                        (new Date(prev.endTime) > new Date(current.endTime)) ? prev : current
                    )

                    const progress = await axios({
                        method: "GET",
                        url: `https://fn-service-habanero-live-public.ogs.live.on.epicgames.com/api/v1/games/fortnite/trackprogress/${player.epicId}/byTrack/${latestTrack.trackguid}`,
                        headers: {
                            'Authorization': `${res.data.data.token_type} ${res.data.data.access_token}`,
                            'User-Agent': 'Mozilla/5.0 (Windows NT 6.2; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0)'
                        }
                    })

                    client.guilds.cache.forEach(async guild => {
                        const member = guild.members.cache.get(player.userId)
                        
                        if(member){

                            // Add the specific role if the user doesn't already have it
                            const desiredRole = progress.data.lastUpdated !== "1970-01-01T00:00:00Z" + 1 ? roleIds[progress.data.currentDivision + 1] : roleIds[0];
                            if (!member.roles.cache.has(desiredRole)) {

                                const rolesToRemove = member.roles.cache.filter(role => roleIds.includes(role.id));
                                if(rolesToRemove.size > 0) {
                                    await member.roles.remove(rolesToRemove)
                                }

                                await member.roles.add(desiredRole);

                            }
                        }
                        
                    })
                    
                }))
            } else {

                accounts.map(async player => {
                    await client.guilds.cache.forEach(async guild => {
                        const member = guild.members.cache.get(player.userId);
                        if (member) {
                            await member.roles.remove(roleIds);
                        }
                    })
                })
                
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    setInterval(rankedRoles, 2 * 60000)
}
