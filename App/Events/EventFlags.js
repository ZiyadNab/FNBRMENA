const Discord = require('discord.js')
const config = require('../Configs/config.json')
const axios = require('axios')
const moment = require('moment')

module.exports = (FNBRMENA, client, admin, emojisObject) => {
    const message = client.channels.cache.find(channel => channel.id === config.events.eventflag);

    // Results
    let tag = false;

    const EventsFlags = async () => {
        const data = (await admin.database().ref("ERA's").child("Events").child("eventsflags").once('value')).val();

        if (data.Active) {
            try {
                const res = await axios({ method: 'GET', url: `https://api.nitestats.com/v1/epic/modes-smart` });

                if (data.Push) {
                    tag = true;
                }

                if (res.data.channels['client-events'].states.length === 2 && tag) {

                    const prevState = res.data.channels['client-events'].states[0].activeEvents;
                    const newState = res.data.channels['client-events'].states[1].activeEvents;

                    for (const state of newState) {
                        if (!prevState.some(prevStateItem => prevStateItem.eventType === state.eventType)) {
                            const embed = new Discord.EmbedBuilder()
                                .setColor(FNBRMENA.Colors("embedSuccess"))
                                .setTimestamp(parseFloat(moment().format("x")))
                                .addFields(
                                    { name: 'Event Flag Type', value: state.eventType },
                                    { name: 'Active Until', value: moment(state.activeUntil).format('dddd, Do MMMM YYYY [at] hh:mm A') },
                                    { name: 'Active Since', value: moment(state.activeSince).format('dddd, Do MMMM YYYY [at] hh:mm A') }
                                );

                            const targetMessage = data.Role.Status ? `<@&${data.Role.roleID}>` : undefined;
                            await message.send({ content: targetMessage, embeds: [embed] });
                        }
                    }

                    for (const state of prevState) {
                        if (!newState.some(newStateItem => newStateItem.eventType === state.eventType)) {
                            const embed = new Discord.EmbedBuilder()
                                .setColor(FNBRMENA.Colors("embedError"))
                                .setTimestamp(parseFloat(moment().format("x")))
                                .addFields(
                                    { name: 'Event Flag Type', value: state.eventType },
                                    { name: 'Active Until', value: state.activeUntil },
                                    { name: 'Active Since', value: state.activeSince }
                                );

                            const targetMessage = data.Role.Status ? `<@&${data.Role.roleID}>` : undefined;
                            await message.send({ content: targetMessage, embeds: [embed] });
                        }
                    }

                    tag = false;
                    await admin.database().ref("ERA's").child("Events").child("eventsflags").update({
                        Push: false
                    });

                } else if (res.data.channels['client-events'].states.length === 1) tag = true

            } catch (err) {
                FNBRMENA.eventsLogs(admin, client, err, 'eventsflags');
            }
        }
    };

    setInterval(EventsFlags, 1 * 30000);
};
