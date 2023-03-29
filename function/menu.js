exports.menu = async (conn, msg, from, jam, tanggal, runtime, prefix) => {
    var tx = `↤↤↤↤↤{ａｓｂ－ｂｏｔ}↦↦↦↦↦

 *Jam* : _${jam} WIB_
 *Tanggal* : _${tanggal}_
 *Runtime* : _${runtime(process.uptime())}_
 
╭─「 *MENU GRUP* 」
│↦  ${prefix}ping
│↦  ${prefix}hidetag/h
│↦  ${prefix}tagall
╰─────────⭓

╭─「 *MENU MAKER* 」
│↦  ${prefix}toqr (text/link/nomor)
│↦  ${prefix}readqr (gambar qr)
│↦  ${prefix}s/stiker (gambar)
│↦  ${prefix}emojimix (emoji1 + emoji2)
╰─────────⭓

╭─「 *MENU DOWNLOAD* 」
│↦  ${prefix}ytmp4/youtubemp4 (link)
│↦  ${prefix}ytmp3/youtubemp3 (link)
│↦  ${prefix}ig/instagram (link)
│↦  ${prefix}fb/facebook (link)
│↦  ${prefix}tt/tiktok (link)
│↦  ${prefix}twit/twitter (link)
╰─────────⭓

╭─「 *MENU GAME* 」
│↦  ${prefix}caklontong
│↦  ${prefix}tebakgambar
│↦  ${prefix}tebakkata
│↦  ${prefix}asahotak
│↦  ${prefix}siapakahaku
╰─────────⭓

╭─「 *MENU SEARCH* 」
│↦  ${prefix}quotesanime
│↦  ${prefix}pin/pinterest (query)
│↦  ${prefix}lirik (judul)
╰─────────⭓
`

    var teks = `↤↤↤↤↤{ａｓｂ－ｂｏｔ}↦↦↦↦↦

    𝗕𝗢𝗧 𝗜𝗡𝗙𝗢
 *Library* : _Baileys-MD_
 *Jam* : _${jam} WIB_
 *Tanggal* : _${tanggal}_
 *Runtime* : _${runtime(process.uptime())}_
 `

    const sections = [
    {
        title: "MENU SEARCH",
        rows: [
            { title: "Youtube Search", rowId: "#ytsearch" },
            { title: "Pinterest", rowId: "#pinterest" },
            { title: "Ringtones", rowId: "#ringtones" },
            { title: "Style Font", rowId: "#styletext" },
        ]
    }
    ]
    await conn.sendMessage(from, {text : tx}, { quoted: msg })
}