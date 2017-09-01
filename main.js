const os = require('os')
  , fs = require('fs')
  , readDir = fs.readdir
  , pathBKP = '/media/pantro/DOCS/Logistick/BKP/bkp/'
  , fileBKP = '/media/pantro/DOCS/Logistick/BKP/bkp/_ReIns.sql'
  , fileStructure = '/media/pantro/DOCS/Logistick/BKP/logistick.sql'

readDir(pathBKP, (err, files) => {
  if (err) {
    (console.log(err.message))
  } else {
    fs.open(fileBKP, 'w', (err, fd) => {
      if (err) {
        console.log('Falha ao abrir arquivo: ' + err)
      } else {
        fs.close(fd, (err) => {
          if (err)
            console.log('Falha ao fechar arquivo: ' + err)
        })
      }
    })
    fs.appendFileSync(fileBKP, fs.readFileSync(fileStructure, 'utf8').toString())
    files.forEach(file => {
      if (file.indexOf('.sql') > 0) {
        console.log(file)
        data = fs.readFileSync(pathBKP + file, 'utf8')
        data = data.toString()
        let lines = data.split(os.EOL), reg = 0, i = 0, line
        for (; i < lines.length; i++) {
          line = lines[i].split(' VALUES ')
          if (line.length === 2) {
            if (reg % 1000 === 0) {
              fs.appendFileSync(fileBKP, `${line[0]} VALUES ${os.EOL}${line[1].substr(0, line[1].length - 1)},${os.EOL}`)
            } else {
              fs.appendFileSync(fileBKP, line[1].substr(0, line[1].length - 1) + ((((reg + 1) % 1000 === 0) || (lines[i + 1] === '')) ? ';' : ',') + os.EOL)
            }
            reg += 1
          }
        }
      }
    })
    fs.appendFileSync(fileBKP, 'SET FOREIGN_KEY_CHECKS = 1;')
  }
})