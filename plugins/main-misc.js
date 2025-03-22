// SUBZERO PROPERTY






const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
const util = require("util");
const { getAnti, setAnti, initializeAntiDeleteSettings } = require('../data/antidel');

initializeAntiDeleteSettings();

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'ad'],
    react: '🚀',
    desc: "Sets up the Antidelete",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, q, text, isCreator, fromMe }) => {
    if (!isCreator) return reply('This command is only for the bot owner');
    try {
        const command = q?.toLowerCase();

        switch (command) {
            case 'on':
                await setAnti('gc', false);
                await setAnti('dm', false);
                return reply('_AntiDelete is now off for Group Chats and Direct Messages._');

            case 'off gc':
                await setAnti('gc', false);
                return reply('_AntiDelete for Group Chats is now disabled._');

            case 'off dm':
                await setAnti('dm', false);
                return reply('_AntiDelete for Direct Messages is now disabled._');

            case 'set gc':
                const gcStatus = await getAnti('gc');
                await setAnti('gc', !gcStatus);
                return reply(`_AntiDelete for Group Chats ${!gcStatus ? 'enabled' : 'disabled'}._`);

            case 'set dm':
                const dmStatus = await getAnti('dm');
                await setAnti('dm', !dmStatus);
                return reply(`_AntiDelete for Direct Messages ${!dmStatus ? 'enabled' : 'disabled'}._`);

            case 'on':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete set for true/on all chats._');

            case 'all':
                await setAnti('gc', true);
                await setAnti('dm', true);
                return reply('_AntiDelete set for true/on all chats._');

            case 'status':
                const currentDmStatus = await getAnti('dm');
                const currentGcStatus = await getAnti('gc');
                return reply(`*⛔ AntiDelete Status ⛔*\n\n*👤 Inbox AntiDelete:* ${currentDmStatus ? 'Enabled' : 'Disabled'}\n*👥 Group Chat AntiDelete:* ${currentGcStatus ? 'Enabled' : 'Disabled'}`);

            default:
                const helpMessage = `*━❮  \`ANTIDELETE SETTINGS\`  ❯━ *\n\n
➪ \`\`\`.antidelete on\`\`\`\n - Reset AntiDelete for all chats (disabled by default)\n
➪ \`\`\`.antidelete off gc\`\`\`\n - Disable AntiDelete for Group Chats\n
➪ \`\`\`.antidelete off dm\`\`\`\n - Disable AntiDelete for Direct Messages\n
➪ \`\`\`.antidelete set gc\`\`\`\n - Toggle AntiDelete for Group Chats\n
➪ \`\`\`.antidelete set dm\`\`\`\n - Toggle AntiDelete for Direct Messages\n
➪ \`\`\`.antidelete true\`\`\`\n - Enable AntiDelete for all chats\n
➪ \`\`\`.antidelete status\`\`\`\n - Check current AntiDelete status`;

                return reply(helpMessage);
        }
    } catch (e) {
        console.error("Error in antidelete command:", e);
        return reply("An error occurred while processing your request.");
    }
});


cmd({
    pattern: "vv2",
    alias: ['viewonce2', '👀2'],
    desc: "Fetch and resend a ViewOnce message content (image/video).",
    category: "misc",
    use: '<query>',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const quotedMessage = m.msg.contextInfo.quotedMessage; // Get quoted message

        if (quotedMessage && quotedMessage.viewOnceMessageV2) {
            const quot = quotedMessage.viewOnceMessageV2;
            if (quot.message.imageMessage) {
                let cap = quot.message.imageMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.imageMessage);
                return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
            }
            if (quot.message.videoMessage) {
                let cap = quot.message.videoMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.videoMessage);
                return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
            }
            if (quot.message.audioMessage) {
                let anu = await conn.downloadAndSaveMediaMessage(quot.message.audioMessage);
                return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
            }
        }

        // If there is no quoted message or it's not a ViewOnce message
        if (!m.quoted) return reply("Please reply to a ViewOnce message.");
        if (m.quoted.mtype === "viewOnceMessage") {
            if (m.quoted.message.imageMessage) {
                let cap = m.quoted.message.imageMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.imageMessage);
                return conn.sendMessage(from, { image: { url: anu }, caption: cap }, { quoted: mek });
            }
            else if (m.quoted.message.videoMessage) {
                let cap = m.quoted.message.videoMessage.caption;
                let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.videoMessage);
                return conn.sendMessage(from, { video: { url: anu }, caption: cap }, { quoted: mek });
            }
        } else if (m.quoted.message.audioMessage) {
            let anu = await conn.downloadAndSaveMediaMessage(m.quoted.message.audioMessage);
            return conn.sendMessage(from, { audio: { url: anu } }, { quoted: mek });
        } else {
            return reply("This is not a ViewOnce message.");
        }
    } catch (e) {
        console.log("Error:", e);
        reply("ℹ⚠️ An error occurred while fetching the ViewOnce message.");
    }
});

// if you want use the codes give me credit on your channel and repo in this file and my all files 
