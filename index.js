"use strict";
//module
const SETTING = require('./database/config.js')
const MODULE = SETTING.modul
const FUNCTION = SETTING.function
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = MODULE.baileys
const { Boom } = MODULE.boom
const moment = MODULE.moment
const express = MODULE.express
const socketIO = MODULE.socketIO
const qrcode = MODULE.qrcode
const http = MODULE.http
const fileUpload = MODULE.fileupload

//function
const { serialize, sleep } = FUNCTION.funcServer
const { status_Connection } = FUNCTION.statusConnect
const { Memory_Store } = FUNCTION.memoryStore
const { getQr, open } = FUNCTION.web

//create Server
const port = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

//DataBot
const setting = SETTING.dataBot
const session = `./${setting.sesionName}.json`
const { state, saveState } = useSingleFileAuthState(session)
moment.tz.setDefault("Asia/Jakarta").locale("id");

//Server Running
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(fileUpload({
    debug: false
}));
app.get('/', (req, res) => {
    res.sendFile('index.html', {
        root: __dirname
    });
});
server.listen(port, function () {
    console.log('App berjalan di port *: ' + port);
});
//connect to wa 
async function connectToWhatsApp() {

    const sock = makeWASocket({
        printQRInTerminal: true,
        browser: ['Bot_Asb', 'Edge', '1.0.0'],
        auth: state,
        syncFullHistory: true,
    patchMessageBeforeSending: (message) => {
        const requiresPatch = !!(
            message.buttonsMessage ||
            message.listMessage
        );

        if (requiresPatch) {
            message = {
                viewOnceMessage: {
                    message: {
                        messageContextInfo: {
                            deviceListMetadataVersion: 2,
                            deviceListMetadata: {},
                        },
                        ...message,
                    },
                },
            };
        }
        return message;
    }
})
    Memory_Store.bind(sock.ev)

    sock.ev.on('creds.update', () => saveState)

    sock.ev.on('connection.update', (update) => {
        status_Connection(Boom, update, connectToWhatsApp, DisconnectReason, io)
        if (update.qr != '') {
            let qr = `${update.qr}`
            qrcode.toDataURL(qr, (err, url) => {
                getQr(url, io)
                sleep(20000)
                open(io)
            })
        }
    })

    //Update Pesan
    sock.ev.on('messages.upsert', async m => {
        var msg = m.messages[0]
        if (!m.messages) return;
        if (msg.key && msg.key.remoteJid == "status@broadcast") return
        if (msg.key.fromMe === true) return
        if (msg.message != null) {
            var pesan = msg.message.conversation
            var aran = msg.pushName
            var no = msg.key.remoteJid.split('@')[0]
        } else { }
        msg = serialize(sock, msg)
        require('./message/pesan.js')(sock, msg, m, setting, Memory_Store)
    })

    //Update Grup
    sock.ev.on('group-participants.update', async (update) => {
        console.log(update);
    })
}
connectToWhatsApp().catch(err => console.log("penemuan error: " + err))
