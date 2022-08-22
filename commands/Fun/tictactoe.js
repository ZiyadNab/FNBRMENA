
module.exports = {
    commands: 'xo',
    type: 'Fun',
    minArgs: 1,
    maxArgs: 1,
    cooldown: -1,
    permissionError: 'Sorry you do not have acccess to this command',
    callback: async (FNBRMENA, message, args, text, Discord, client, admin, userData, alias, emojisObject) => {

        // Get the last message sent
        const games = await FNBRMENA.Admin(admin, message, "", "Games")

        // Get the mentioned player (opponent)
        var _a;
        let opponent = (_a = message.mentions.members.first()) === null || _a === void 0 ? void 0 : _a.user;

        // Check if player 2 is valid
        if(!opponent) return message.reply({content: 'You didnt mention an opponent'}) // No mentions error
        if(opponent.bot) return message.reply({content: "You can't play with bots !"}) // Bot mentioned error
        if(opponent.id === message.member.user.id) return message.reply({content: 'You cannot play with yourself!'}) // Mentioned same user error

        // Send an acception button to the opponent
        const acceptEmbed = new Discord.EmbedBuilder()
        acceptEmbed.setDescription('Waiting for the opponent to accept/deny')
        acceptEmbed.setAuthor({name: message.member.user.tag, iconURL: message.member.user.displayAvatarURL()})
        acceptEmbed.setColor(`#075fff`)

        // Accept Button
        const acceptButton = new Discord.ButtonBuilder()
        acceptButton.setLabel('Accept')
        acceptButton.setStyle(Discord.ButtonStyle.Success)
        acceptButton.setCustomId('accept-ttt');

        // Decline Button
        const declineButton = new Discord.ButtonBuilder()
        declineButton.setLabel('Deny')
        declineButton.setStyle(Discord.ButtonStyle.Danger)
        declineButton.setCustomId('deny-ttt');

        // Buttons Row
        const accepRow = new Discord.ActionRowBuilder().addComponents([acceptButton, declineButton]);

        // Send the message to the opponent
        const acceptionMessage = await message.reply({content: `<@${opponent.id}>, You got a tictactoe request from ${message.member.user.tag}`, components: [accepRow]});

        // Create a collector
        const collector = await acceptionMessage.createMessageComponentCollector({
            componentType: Discord.ComponentType.Button,
            time: 30000
        })

        // Listen for results
        collector.on('collect', async (button) => {
            if (button.user.id !== opponent.id)
            return button.reply({
                content: 'You cannot play the game.',
                ephemeral: true
            })
            if (button.customId == 'deny-ttt') {
                button.deferUpdate();
                return collector.stop('decline');
            }
            else if (button.customId == 'accept-ttt') {
                collector.stop();
                //button.message.delete();
                
                // Define variables
                const players = [message.member.user.id, opponent.id].sort(() => Math.random() > 0.5 ? 1 : -1);
                const x_emoji = '✖️';
                const o_emoji = '⭕';
                const dashmoji = '➖';
                const idleClr = Discord.ButtonStyle.Secondary
                const XClr = Discord.ButtonStyle.Danger
                const OClr = Discord.ButtonStyle.Primary

                const Plrs = {
                    user: 0,
                    userid: '1234567890123',
                    a1: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    a2: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    a3: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    b1: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    b2: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    b3: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    c1: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    c2: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    },
                    c3: {
                        style: idleClr,
                        emoji: dashmoji,
                        disabled: false
                    }
                }
                
                //waiting for input message
                const msg = await button.message.edit({
                    content: `Waiting for Input | <@!${players}>, Your Emoji: ⭕`,
                    embeds: [
                        
                    ]
                })
                ttt(msg)
                async function ttt(m){

                    Plrs.userid = players[Plrs.user];
                    const won = {
                        'O-Player': false,
                        'X-Player': false
                    };
                    const a1 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.a1.style)
                        .setEmoji(Plrs.a1.emoji)
                        .setCustomId('a1')
                        .setDisabled(Plrs.a1.disabled);
                    const a2 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.a2.style)
                        .setEmoji(Plrs.a2.emoji)
                        .setCustomId('a2')
                        .setDisabled(Plrs.a2.disabled);
                    const a3 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.a3.style)
                        .setEmoji(Plrs.a3.emoji)
                        .setCustomId('a3')
                        .setDisabled(Plrs.a3.disabled);
                    const b1 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.b1.style)
                        .setEmoji(Plrs.b1.emoji)
                        .setCustomId('b1')
                        .setDisabled(Plrs.b1.disabled);
                    const b2 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.b2.style)
                        .setEmoji(Plrs.b2.emoji)
                        .setCustomId('b2')
                        .setDisabled(Plrs.b2.disabled);
                    const b3 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.b3.style)
                        .setEmoji(Plrs.b3.emoji)
                        .setCustomId('b3')
                        .setDisabled(Plrs.b3.disabled);
                    const c1 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.c1.style)
                        .setEmoji(Plrs.c1.emoji)
                        .setCustomId('c1')
                        .setDisabled(Plrs.c1.disabled);
                    const c2 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.c2.style)
                        .setEmoji(Plrs.c2.emoji)
                        .setCustomId('c2')
                        .setDisabled(Plrs.c2.disabled);
                    const c3 = new Discord.ButtonBuilder()
                        .setStyle(Plrs.c3.style)
                        .setEmoji(Plrs.c3.emoji)
                        .setCustomId('c3')
                        .setDisabled(Plrs.c3.disabled);
                    const a = new Discord.ActionRowBuilder().addComponents([a1, a2, a3]);
                    const b = new Discord.ActionRowBuilder().addComponents([b1, b2, b3]);
                    const c = new Discord.ActionRowBuilder().addComponents([c1, c2, c3]);
                    const buttons = [a, b, c];
                    if (Plrs.a1.emoji == o_emoji &&
                        Plrs.b1.emoji == o_emoji &&
                        Plrs.c1.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.a2.emoji == o_emoji &&
                        Plrs.b2.emoji == o_emoji &&
                        Plrs.c2.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.a3.emoji == o_emoji &&
                        Plrs.b3.emoji == o_emoji &&
                        Plrs.c3.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.a1.emoji == o_emoji &&
                        Plrs.b2.emoji == o_emoji &&
                        Plrs.c3.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.a3.emoji == o_emoji &&
                        Plrs.b2.emoji == o_emoji &&
                        Plrs.c1.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.a1.emoji == o_emoji &&
                        Plrs.a2.emoji == o_emoji &&
                        Plrs.a3.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.b1.emoji == o_emoji &&
                        Plrs.b2.emoji == o_emoji &&
                        Plrs.b3.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (Plrs.c1.emoji == o_emoji &&
                        Plrs.c2.emoji == o_emoji &&
                        Plrs.c3.emoji == o_emoji)
                        won['O-Player'] = true;
                    if (won['O-Player'] != false) {

                        //update totalMatchesPlayed
                        await admin.database().ref("ERA's").child("Games").child("tictactoe").update({
                            totalMatchesPlayed: ++games.tictactoe.totalMatchesPlayed
                        })

                        //get the user wins
                        if(games.tictactoe.leaderboard[players[Plrs.user === 0 ? 1 : 0]] != undefined) var newWins = ++games.tictactoe.leaderboard[players[Plrs.user === 0 ? 1 : 0]].wins
                        else var newWins = 1

                        //update the user wins
                        await admin.database().ref("ERA's").child("Games").child("tictactoe").child("leaderboard").child(players[Plrs.user === 0 ? 1 : 0]).update({
                            wins: newWins
                        })

                        return m
                                .edit({
                                content: `<@!${players[Plrs.user === 0 ? 1 : 0]}> (⭕) won, That was a nice game.`,
                                components: buttons,
                                embeds: [
                                    
                                ]
                            })
                                .then((m) => {
                                m.react('⭕');
                            });
                    }
                    if (Plrs.a1.emoji == x_emoji &&
                        Plrs.b1.emoji == x_emoji &&
                        Plrs.c1.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.a2.emoji == x_emoji &&
                        Plrs.b2.emoji == x_emoji &&
                        Plrs.c2.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.a3.emoji == x_emoji &&
                        Plrs.b3.emoji == x_emoji &&
                        Plrs.c3.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.a1.emoji == x_emoji &&
                        Plrs.b2.emoji == x_emoji &&
                        Plrs.c3.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.a3.emoji == x_emoji &&
                        Plrs.b2.emoji == x_emoji &&
                        Plrs.c1.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.a1.emoji == x_emoji &&
                        Plrs.a2.emoji == x_emoji &&
                        Plrs.a3.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.b1.emoji == x_emoji &&
                        Plrs.b2.emoji == x_emoji &&
                        Plrs.b3.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (Plrs.c1.emoji == x_emoji &&
                        Plrs.c2.emoji == x_emoji &&
                        Plrs.c3.emoji == x_emoji)
                        won['X-Player'] = true;
                    if (won['X-Player'] != false) {

                        //update totalMatchesPlayed
                        await admin.database().ref("ERA's").child("Games").child("tictactoe").update({
                            totalMatchesPlayed: ++games.tictactoe.totalMatchesPlayed
                        })

                        //get the user wins
                        if(games.tictactoe.leaderboard[players[Plrs.user === 0 ? 1 : 0]] != undefined) var newWins = ++games.tictactoe.leaderboard[players[Plrs.user === 0 ? 1 : 0]].wins
                        else var newWins = 1

                        //update the user wins
                        await admin.database().ref("ERA's").child("Games").child("tictactoe").child("leaderboard").child(players[Plrs.user === 0 ? 1 : 0]).update({
                            wins: newWins
                        })

                        return m
                                .edit({
                                content: `<@!${players[Plrs.user === 0 ? 1 : 0]}> (❌) won, That was a nice game.`,
                                components: buttons,
                                embeds: [

                                ]
                            })
                                .then((m) => {
                                m.react('❌');
                            });
                    }
                    m.edit({
                        content: `Waiting for Input | <@!${Plrs.userid}> | Your Emoji: ${Plrs.user == 0
                            ? `⭕`
                            : `❌`}`,
                        embeds: [
                            
                        ],
                        components: [a, b, c]
                    });
                    const collector2nd = m.createMessageComponentCollector({
                        componentType: Discord.ComponentType.Button,
                        max: 1,
                        time: 30000
                    });
                    collector2nd.on('collect', async (b) =>  {
                        if (b.user.id !== Plrs.userid) {
                            b.reply({
                                content: 'You cannot play now',
                                ephemeral: true
                            })

                            ttt(m)
                        }
                        else {
                            b.deferUpdate();
                            if (Plrs.user == 0) {
                                Plrs.user = 1;
                                // @ts-ignore
                                Plrs[b.customId] = {
                                    style: OClr,
                                    emoji: o_emoji,
                                    disabled: true
                                };
                            }
                            else {
                                Plrs.user = 0;
                                // @ts-ignore
                                Plrs[b.customId] = {
                                    style: XClr,
                                    emoji: x_emoji,
                                    disabled: true
                                };
                            }
                            const map = (obj, func) => Object.entries(obj).reduce((prev, [key, value]) => (Object.assign(Object.assign({}, prev), { [key]: func(key, value) })), {});
                            const objectFilter = (obj, predicate) => Object.keys(obj)
                                .filter((key) => predicate(obj[key])) // @ts-ignore
                                .reduce((res, key) => ((res[key] = obj[key]), res), {});
                            const Filer = objectFilter(map(Plrs, (_, elem) => elem.emoji == dashmoji), (num) => num == true);
                            if (Object.keys(Filer).length == 0) {
                                if (!won['X-Player'] && !won['O-Player']) {
                                    ttt(m)
                                    collector2nd.stop()
                                    return m
                                            .edit({
                                            content: `You have tied. Play again to see who wins.`,
                                            embeds: [
                                                
                                            ]
                                        })
                                            .then((m) => {
                                            m.react(dashmoji);
                                        });
                                }
                            }
                            ttt(m)
                        }
                    })
                    
                    collector2nd.on('end', (collected, reason) => {
                        if (collected.size === 0 && reason == 'time')
                            m.edit({
                                content: `<@!${Plrs.userid}> didn\'t react in time! (30s)`,
                                components: []
                            })
                    })
                }
            }
        })

        collector.on('end', (collected, reason) => {
            let embed;
            if (reason == 'time') {
                embed = new Discord.EmbedBuilder()
                    .setTitle(`${message.member.user.username}'s challenge was not accepted in time ${emojisObject.errorEmoji}`)
                    .setColor(FNBRMENA.Colors("embedError"))
                acceptionMessage.edit({
                    content: `<@${opponent.id}> did not accept in time!`,
                    embeds: [embed],
                    components: []
                });
            }
            else if (reason == 'decline') {
                embed = new Discord.EmbedBuilder()
                    .setTitle(`${opponent.username} has denied the game! ${emojisObject.errorEmoji}`)
                    .setColor(FNBRMENA.Colors("embedError"))
                acceptionMessage.edit({
                    embeds: [embed],
                    components: []
                });
            }
        });
    }
}