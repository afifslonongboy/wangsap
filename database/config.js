"use strict";

const { verify } = require("crypto");

module.exports = {
    dataBot: {
        sesionName: "asb-session",
        ownerNumber: '6281333399425@s.whatsapp.net',
        ownerName: "Asb Official",
        gamewaktu: 40
    },
    mess: {
        wait: "_Tunggu, permintaan sedang diproses..._",
        done: "_Sukses.._",
        OnlyGrup: "Perintah ini hanya bisa digunakan di grup",
        GrupAdmin: "Lu bukan admin, sat...!!!",
        BotAdmin: "Bot Harus menjadi admin",
        OnlyOwner: "Lu bukan owner, SAT...!!!!",
        OnlyPrem: "Perintah ini khusus member premium\nMinat jadi premium? hubungi owner",
        OnlyVerif: "Untuk Mengakses Menu Ini Anda Harus Verifikasi Terlebih Dahulu.",
        verify: "Anda Sudah Terverifikasi.."
    },
    modul: {
        baileys: require("@adiwajshing/baileys"),
        bocil: require("@bochilteam/scraper"),
        boom: require('@hapi/boom'),
        axios: require("axios"),
        cfonts: require("cfonts"),
        crypto: require("crypto"),
        express: require("express"),
        fileupload: require("express-fileupload"),
        validator: require("express-validator"),
        ffmpeg: require("fluent-ffmpeg"),
        fs: require('fs'),
        http: require("http"),
        jimp: require("jimp"),
        kyouka: require("kyouka-api"),
        moment: require("moment-timezone"),
        nodemon: require("nodemon"),
        performance: require("performance-now"),
        pino: require("pino"),
        qrcode: require("qrcode"),
        qrread: require('qrcode-reader'),
        qrTerminal: require("qrcode-terminal"),
        socketIO: require("socket.io"),
        yts: require('yt-search')
    },
    function: {
        funcServer: require('../function/func_server.js'),
        statusConnect: require('../function/Data_Server_bot/Status_connect.js'),
        memoryStore: require('../function/Data_Server_bot/Memory_Store.js'),
        web: require('../function/Data_Server_bot/web.js'),
        menu: require('../function/menu.js'),
        exif: require('../function/exif.js'),
        func_game: require('../function/func_game'),
        jawabanGame: require('../function/func_jawaban'),
        scrap: require('../function/scraper'),
    }
}