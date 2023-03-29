const fs = require('fs')
let pathLink = './pathSave/link/'

exports.deleteLink = (sender) => {
    var no = sender.split('@')[0]
    if (fs.existsSync(pathLink + no + `-720p.json`)) {
        fs.unlinkSync(pathLink + no + "-720p.json")
    }
    if (fs.existsSync(pathLink + no + `-480p.json`)) {
        fs.unlinkSync(pathLink + no + "-480p.json")
    }
    if (fs.existsSync(pathLink + no + `-360p.json`)) {
        fs.unlinkSync(pathLink + no + "-360p.json")
    }
    if (fs.existsSync(pathLink + no + `-hd.json`)) {
        fs.unlinkSync(pathLink + no + "-hd.json")
    }
    if (fs.existsSync(pathLink + no + `-normal.json`)) {
        fs.unlinkSync(pathLink + no + "-normal.json")
    }
}