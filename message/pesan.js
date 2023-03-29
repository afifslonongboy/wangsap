"use strict";

//module
const SETTING = require('../database/config.js')
const MODULE = SETTING.modul
const { downloadContentFromMessage, downloadMediaMessage } = MODULE.baileys
const {  instagramdlv2, tiktokdlv2 } = MODULE.bocil
const { lirik, youtube, twitter} = MODULE.kyouka
const getFBInfo = require("fb-downloader");
const fs = MODULE.fs
const moment = MODULE.moment
const qrcode = MODULE.qrcode
const QrCode = MODULE.qrread

//MODUL GAME
const { tebakgambar, tebakkata, caklontong, asahotak, siapakahaku } = MODULE.bocil

//function
const FUNCTION = SETTING.function
const { getGroupAdmins, runtime, sleep, getBuffer, getRandom, fetchJson } = FUNCTION.funcServer
const { menu } = FUNCTION.menu
const { writeExifImg } = FUNCTION.exif
const { pinterest, quotesAnime, styletext } = FUNCTION.scrap

//function game
const { addPlayGame, isPlayGame, cekWaktuGame } = FUNCTION.func_game
const { getJawaban } = FUNCTION.jawabanGame

//Db
const mess = SETTING.mess;
const tbkGmbr = []
const tbkKata = []
const caklon = []
const ashotak = []
const siapaaku = []

moment.tz.setDefault("Asia/Jakarta").locale("id");
module.exports = async (conn, msg, m, setting, store) => {
    try {
        let { gamewaktu } = setting
        const { type, quotedMsg, mentioned, now, fromMe, isBaileys } = msg;
        const tanggal = moment().tz("Asia/Jakarta").format("ll");
        const time = moment(new Date()).format("HH:mm");
        let dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
        const ucapanWaktu = "Selamat " + dt.charAt(0).toUpperCase() + dt.slice(1)
        if (msg.isBaileys) return
        var chats = (type === 'conversation' && msg.message.conversation) ? msg.message.conversation : (type === 'imageMessage') && msg.message.imageMessage.caption ? msg.message.imageMessage.caption : (type === 'videoMessage') && msg.message.videoMessage.caption ? msg.message.videoMessage.caption : (type === 'extendedTextMessage') && msg.message.extendedTextMessage.text ? msg.message.extendedTextMessage.text : (type === 'buttonsResponseMessage') && quotedMsg.fromMe && msg.message.buttonsResponseMessage.selectedButtonId ? msg.message.buttonsResponseMessage.selectedButtonId : (type === 'templateButtonReplyMessage') && quotedMsg.fromMe && msg.message.templateButtonReplyMessage.selectedId ? msg.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : (type == 'listResponseMessage') && quotedMsg.fromMe && msg.message.listResponseMessage.singleSelectReply.selectedRowId ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ""
        if (chats == undefined) { chats = '' }
        const prefix = /^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/.test(chats) ? chats.match(/^[°•π÷×¶∆£¢€¥®™✓_=|~!?#$%^&.+-,\/\\©^]/gi) : '#';
        const quoted = msg.quoted ? msg.quoted : msg;

        //INITIAL
        const content = JSON.stringify(msg.message);
        const from = msg.key.remoteJid;
        const pushname = msg.pushName;
        const body = chats.startsWith(prefix) ? chats : '';
        const args = body.trim().split(/ +/).slice(1);
        const q = args.join(" ");
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';

        //IYA atau TIDAK
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        const sender = isGroup ? (msg.key.participant ? msg.key.participant : msg.participant) : msg.key.remoteJid;
        const isOwner = [`${setting.ownerNumber}`].includes(sender) ? true : false;
        const isCommand = body.startsWith(prefix);

        //GRUP INITIAL
        const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupId = isGroup ? groupMetadata.id : ''
        const participants = isGroup ? await groupMetadata.participants : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''

        //GRUP IYA atau TIDAK
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const isGroupAdmins = groupAdmins.includes(sender)

        //RESPONSE LIST, BUTTON DLL
        var dataGroup = (type === 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : ''
        var dataPrivate = (type === "messageContextInfo") ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''
        var dataListG = (type === "listResponseMessage") ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : ''
        var dataList = (type === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId) : ''

        //RESPONSE IYA atau TIDAK
        const isButton = dataGroup.length !== 0 ? dataGroup : dataPrivate
        const isListMessage = dataListG.length !== 0 ? dataListG : dataList
        const isImage = (type == 'imageMessage')
        const isQuotedMsg = (type == 'extendedTextMessage')
        const isMedia = (type === 'imageMessage' || type === 'videoMessage');
        const isQuotedImage = isQuotedMsg ? content.includes('imageMessage') ? true : false : false
        const isVideo = (type == 'videoMessage')
        const isQuotedVideo = isQuotedMsg ? content.includes('videoMessage') ? true : false : false
        const isSticker = (type == 'stickerMessage')
        const isQuotedSticker = isQuotedMsg ? content.includes('stickerMessage') ? true : false : false
        const isQuotedAudio = isQuotedMsg ? content.includes('audioMessage') ? true : false : false

        //MENTIONS
        const mentionByTag = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && msg.message.extendedTextMessage.contextInfo != null ? msg.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof (mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []

        //FUNCTION

        function rubah(angka) {
            var reverse = angka.toString().split('').reverse().join(''),
                ribuan = reverse.match(/\d{1,3}/g);
            ribuan = ribuan.join('.').split('').reverse().join('');
            return "Rp " + ribuan;
        };

        function ganti(angka) {
            var reverse = angka.toString().split('').reverse().join(''),
                ribuan = reverse.match(/\d{1,3}/g);
            ribuan = ribuan.join('').split('').reverse().join('');
            return ribuan;
        };

        function monospace(string) {
            return '```' + string + '```'
        };
        const reply = (teks) => { conn.sendMessage(from, { text: teks }, { quoted: msg }) }

        // Game
        cekWaktuGame(conn, tbkGmbr)
        cekWaktuGame(conn, tbkKata)
        cekWaktuGame(conn, caklon)
        cekWaktuGame(conn, ashotak)
        cekWaktuGame(conn, siapaaku)
        getJawaban(conn, from, msg, sender, chats, tbkGmbr, tbkKata, caklon, ashotak,siapaaku)

        //PESAN
        conn.readMessages([msg.key])
        const pathUser = './database/user/'
        const pathShop = './path_shop/'
        switch (command) {
            //MENU BOT
            case 'menu': case 'm':
                menu( conn, msg, from, time, tanggal, runtime,prefix)
                break
            case 'ping':
                const speed = require('performance-now')
                let timestampe = speed();
                let latensie = speed() - timestampe
                reply(`Kecepatan = ${latensie.toFixed(4)} detik`)
                break
            case 'tagall':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!q) return reply(`Teks?`)
                let teks_tagall = `══✪〘 *👥 Tag All* 〙✪══\n\n${q ? q : ''}\n\n`
                for (let mem of participants) {
                    teks_tagall += `➲ @${mem.id.split('@')[0]}\n`
                }
                conn.sendMessage(from, { text: teks_tagall, mentions: participants.map(a => a.id) }, { quoted: msg })
                break
            case 'hidetag': case 'h':
                if (!isGroup) return reply(mess.OnlyGrup)
                if (!isGroupAdmins && !isOwner) return reply(mess.GrupAdmin)
                if (!q) return reply('pesan nya apa.?')
                let mem = [];
                groupMembers.map(i => mem.push(i.id))
                conn.sendMessage(from, { text: q ? q : '', mentions: mem }, { quoted: msg })
                break

            //MENU GAME
            case 'tebakgambar':
                if (isPlayGame(from, tbkGmbr)) return reply(`Masih ada game yang belum diselesaikan`)
                tebakgambar().then(data => {
                    console.log(data);
                    var teks = `*TEBAK GAMBAR*\n\n` + monospace(`Petunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : 60s`)
                    conn.sendMessage(from, { image: { url: data.img }, caption: teks }, { quoted: msg })
                        .then(res => {
                            var jawab = data.jawaban.toLowerCase()
                            addPlayGame(from, 'TEBAK GAMBAR', jawab, 60, res, tbkGmbr, sender)
                        })
                })
                break
            case 'tebakkata':
                if (isPlayGame(from, tbkKata)) return reply(`Masih ada game yang belum diselesaikan`)
                tebakkata().then(data => {
                    console.log(data);
                    var teks = `*TEBAK KATA*\n\n` + monospace(`Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                    conn.sendMessage(from, { text: teks }, { quoted: msg })
                        .then(res => {
                            var jawab = data.jawaban.toLowerCase()
                            addPlayGame(from, 'TEBAK KATA', jawab, gamewaktu, res, tbkKata, sender)
                        })
                })
                break
            case 'caklontong':
                if (isPlayGame(from, caklon)) return reply(`Masih ada game yang belum diselesaikan`)
                caklontong().then(data => {
                    console.log(data);
                    var teks = `*TEKA-TEKI CAK LONTONG*\n\n` + monospace(`Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                    conn.sendMessage(from, { text: teks }, { quoted: msg })
                        .then(res => {
                            var jawab = data.jawaban.toLowerCase()
                            var desk = data.deskripsi
                            addPlayGame(from, 'TEKA-TEKI CAK LONTONG', jawab, gamewaktu, res, caklon, sender, desk)
                        })
                })
                break
            case 'asahotak':
                if (isPlayGame(from, ashotak)) return reply(`Masih ada game yang belum diselesaikan`)
                asahotak().then(data => {
                    console.log(data);
                    var teks = `*ASAH OTAK*\n\n` + monospace(`Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                    conn.sendMessage(from, { text: teks }, { quoted: msg })
                        .then(res => {
                            var jawab = data.jawaban.toLowerCase()
                            addPlayGame(from, 'ASAH OTAK', jawab, gamewaktu, res, ashotak, sender)
                        })
                })
                break
            case 'siapakahaku':
                if (isPlayGame(from, siapaaku)) return reply(`Masih ada game yang belum diselesaikan`)
                siapakahaku().then(data => {
                    console.log(data);
                    var teks = `*SIAPAKAH AKU?*\n\n` + monospace(`Soal : ${data.soal}\nPetunjuk : ${data.jawaban.replace(/[b|c|d|f|g|h|j|k|l|m|n|p|q|r|s|t|v|w|x|y|z]/gi, '_')}\nWaktu : ${gamewaktu}s`)
                    conn.sendMessage(from, { text: teks }, { quoted: msg })
                        .then(res => {
                            var jawab = data.jawaban.toLowerCase()
                            addPlayGame(from, 'SIAPAKAH AKU?', jawab, gamewaktu, res, siapaaku, sender)
                        })
                })
                break
            //MENU SEARCH
            case 'pinterest': case 'pin':
                if (!q) return reply('*Contoh*: _#pin kanao_')
                pinterest(q).then(data => {
                    console.log(data.length);
                    let lunk = data[Math.floor(Math.random() * data.length)]
                    var but = {
                        image: { url: lunk },
                        caption: `*PINTEREST*\nHasil pencarian ${q}\n`
                    }
                    conn.sendMessage(from, but, { quoted: msg })
                })
                break

            case 'quotestnime':
                quotesAnime().then(res => {
                    var dat = res[Math.floor(Math.random() * res.length)]
                    var pes = `*QUOTES ANIME*
                    
_*"${dat.quotes}"*_

_Anime_ : ${dat.anime}
_Karakter_ : ${dat.karakter}
_Episode_ : ${dat.episode}`
                    reply(pes)
                })
                break
            case 'font':
                styletext(q).then((res) => {
                    var pes = `HASIL\n\n`
                    for (const resp of res) {
                        pes += `${resp.name} => ${resp.result}\n`
                    }
                    reply(pes)
                })
                break
            case 'lirik':
                lirik(q).then(res => {
                    conn.sendMessage(from, { image: { url: res.thumb }, caption: res.lirik }, { quoted: msg })
                })
                break
            
            //MENU DOWNLOAD
            case 'ytmp4': case 'youtubemp4':
                if (!q) return reply('Silakan sertakan Linknya.!!!')
                youtube(q).then(res => {
                    var capti = `╭─「 *YOUTUBE MP4* 」
 ↦ *_JUDUL_* => ${res.title}
 ↦  *_SIZE_* => ${res.size}
 ↦  *_QUALITY_* => ${res.quality}
╰─────────⭓`
                    console.log(res);
                    conn.sendMessage(from, {video: {url: res.link}, caption: capti},{quoted:msg})
                })
                break
            case 'ytmp3': case 'youtubemp3':
                if (!q) return reply('Silakan sertakan Linknya.!!!')
                youtube(q).then(res => {
                    console.log(res);
                    conn.sendMessage(from, { audio: { url: res.mp3 }, mimetype: 'audio/mp4' }, { quoted: msg })
                })
                break
            case 'tt': case 'tiktok':
                if (!q) return reply('Silakan sertakan Linknya.!!!')
                tiktokdlv2(q).then(res => {
                    conn.sendMessage(from, { video: { url: res.video.no_watermark_hd},caption: `DONE....`}, {quoted:msg})
                })
                break
            case 'fb': case 'facebook':
                if (!q) return reply('Silakan sertakan Linknya.!!!')
                getFBInfo(q).then(res => {
                    console.log(res);
                    var judul = res.title.split(',')
                    var k = judul[5].split(':')
                    var akun = k[0].split('from')[1]
                    const hjk = `*FACEBOOK DOWNLOAD*
         
☆ *Akun*  »  _${akun.trim()}_
☆ *Judul*  »  _${k[1].trim()}_
☆ *Ditonton*  »  _${judul[0].trim()}_
☆ *Disukai*  »  _${judul[1].trim()}_
☆ *Loves*  »  _${judul[2].trim()}_
☆ *Komentar*  »  _${judul[3].trim()}_
☆ *Dibagikan*  »  _${judul[4].trim()}_
`
                    if (res.hd != undefined) {
                     conn.sendMessage(from, { video: { url: res.hd }, caption: hjk }, { quoted: msg })
                    } else {
                     conn.sendMessage(from, { video: { url: res.sd }, caption: hjk }, { quoted: msg }) 
                    }
                    
                })
                break
            case 'ig': case 'instagram':
                if(!q) return reply('Silakan sertakan Linknya.!!!')
                instagramdlv2(q).then(res => {
                    conn.sendMessage(from, { video: { url: res.url }, caption: `DONE....` }, { quoted: msg })
                })
                break
            case 'twitter': case 'twit':
                if (!q) return reply('Silakan sertakan Linknya.!!!')
                twitter(q).then(res => {
                    console.log(res);
                    var captio = `
_Deskripsi_ -> ${res.desc}`
                    if (res.HD != undefined) {
                        conn.sendMessage(from, { video: { url: res.HD }, caption: captio }, { quoted: msg })
                    } else {
                        conn.sendMessage(from, { video: { url: res.SD }, caption: captio }, { quoted: msg })
                    }
                })
                break
            //MENU MAKER
            case 'toqr': case 'jadiqr':
                if (!q) return reply('Harap sertakan teks/link!')
                let qyuer = await qrcode.toDataURL(q, { scale: 35 })
                let data = new Buffer.from(qyuer.replace('data:image/png;base64,', ''), 'base64')
                let buff = getRandom('.jpg')
                await fs.writeFileSync('./' + buff, data)
                let medi = fs.readFileSync('./' + buff)
                await conn.sendMessage(from, { image: medi, caption: "Success✓!" }, { quoted: msg })
                setTimeout(() => { fs.unlinkSync(buff) }, 10000)

                break
            case 'readqr':
                if (!isMedia) return reply('Kirim Gambar QRCODE Dengan Caption #readqr')
                try {
                    downloadMediaMessage(msg, 'buffer', {}).then((res) => {
                        var Jimp = require("jimp");
                        Jimp.read(res, (err, image) => {
                            if (err) {
                                console.log('ah');
                                // TODO handle error
                            } else {

                            }
                            var qr = new QrCode();
                            qr.callback = function (err, value) {
                                if (err) {
                                    console.error(err);
                                    // TODO handle error
                                }
                                reply(value.result)
                            };
                            qr.decode(image.bitmap);
                        });
                    })
                } catch (error) {
                    console.log(error);
                }

                break

            case 'emojimix':
                let text = q
                let [emoji1, emoji2] = text.split`+`
                if (!emoji1) msg.reply(`Example : ${prefix + command} 😅+🤔`)
                if (!emoji2) msg.reply(`Example : ${prefix + command} 😅+🤔`)
                let anu = await fetchJson(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`)
                for (let res of anu.results) {
                    let xm_za = res.url;
                    console.log(xm_za)
                    let hek = await getBuffer(xm_za)
                    let buffers = await writeExifImg(hek, { packname: SETTING.packname, author: SETTING.author })
                    await conn.sendMessage(from, { sticker: { url: buffers } }, { quoted: msg })
                }
                break
            case 's': case 'stiker': case 'setiker': case 'sticker':
                if ((isMedia && !msg.message.videoMessage || msg.isQuotedImage) && args.length == 0) {
                    conn.sendMessage(from, { react: { text: "⏱️", key: msg.key } })
                    var stream = await downloadContentFromMessage(msg.message.imageMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.imageMessage, 'image')
                    var buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }
                    let buffers = await writeExifImg(buffer, { packname: 'afif', author: 'asb' })
                    conn.sendMessage(from, { sticker: { url: buffers } }, { quoted: msg })
                } else if ((isMedia && msg.message.videoMessage.seconds < 11 || msg.isQuotedVideo && msg.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0) {
                    conn.sendMessage(from, { react: { text: "⏱️", key: msg.key } })
                    var stream = await downloadContentFromMessage(msg.message.videoMessage || msg.message.extendedTextMessage?.contextInfo.quotedMessage.videoMessage, 'video')
                    var buffer = Buffer.from([])
                    for await (const chunk of stream) {
                        buffer = Buffer.concat([buffer, chunk])
                    }
                    let buffers = await writeExifVid(buffer, { packname: 'afif', author: 'asb' })
                    await conn.sendMessage(from, { sticker: { url: buffers } }, { quoted: msg })
                } else { reply(`Reply gambar/video/sticker dengan caption ${prefix + 'sticker'} \n*(MAKSIMAL 10 DETIK!)*`) }
                break
        }
    } catch (error) {
        console.log(error);
    }
}