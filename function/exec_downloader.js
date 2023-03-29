const fs = require('fs')
exports.downFb = async (conn, from, msg, res) => {
    var judul = res.title.split(',')
    var k = judul[5].split(':')
    var akun = k[0].split('from')[1]
    const hjk = `*FACEBOOK DOWNLOAD*
                    
  ↤↤{ *INFO* }↦↦
☆ *Akun*  »  _${akun.trim()}_
☆ *Judul*  »  _${k[1].trim()}_
☆ *Ditonton*  »  _${judul[0].trim()}_
☆ *Disukai*  »  _${judul[1].trim()}_
☆ *Loves*  »  _${judul[2].trim()}_
☆ *Komentar*  »  _${judul[3].trim()}_
☆ *Dibagikan*  »  _${judul[4].trim()}_
`

    const buttons = [
        { buttonId: `#unduhfb ${res.hd}`, buttonText: { displayText: 'Resolusi HD' }, type: 1 },
        { buttonId: `#unduhfb ${res.sd}`, buttonText: { displayText: 'Resolusi Normal' }, type: 1 }
    ]

    const buttonMessage = {
        image: { url: res.thumbnail },
        caption: hjk,
        footer: 'Asb-Downloader',
        buttons: buttons,
        headerType: 1
    }
    await conn.sendMessage(from, buttonMessage, { quoted: msg })
}

exports.downYt = async (conn, from, msg, res, resp) => {
    let srr = []
    resp.filter(v => {
        srr.push({
            title: v.resol,
            rowId: `#unduhyt ${v.link}!@${v.size}!@${v.resol}`,
            description: v.size
        })
    })
    var cap = `    
- *_JUDUL_* : ${res.title}
`
    const listMessage = {
        text: cap,
        title: 'YOUTUBE DOWNLOAD',
        buttonText: "Lihat Resolusi",
        footer: 'Asb-Downloader',
        sections: [{
            title: `RESOLUSI`,
            rows: srr
        }]
    }
    await conn.sendMessage(from, listMessage, { quoted: msg })
}