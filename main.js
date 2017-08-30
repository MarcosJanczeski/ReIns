const os = require('os')
  , fs = require('fs')
  , readDir = fs.readdir
  , path = '/media/pantro/DOCS/Logistick/BKP/bkp/'
  , schema = 'logistick'
readDir(path, (err, files) => {
  if (err) {
    (console.log(err.message))
  } else {
    fs.open(path+'_ReIns.sql', 'w', (err)=>{if(err) console.log('Falha ao deletar arquivo: '+err)})
    files.forEach(file => {
      if (file.indexOf('.sql') > 0) {
        fs.readFile(path + file, (err, data) => {
          if (err)
            console.log(err.message)
          else {
            data = data.toString()
            let lines = data.split(os.EOL), reg = 0, i = 0, line
            for (; i < lines.length; i++) {
              line = lines[i].split(' VALUES ')
              if (line.length === 2) {
                if (reg % 1000 === 0) {
                  fs.appendFileSync(path + '_ReIns.sql', line[0] + ' VALUES ' + os.EOL + line[1].substr(0, line[1].length - 1) + ',\r\n')
                  reg += 1
                } else {
                  fs.appendFileSync(path + '_ReIns.sql', line[1].substr(0, line[1].length - 1) + ((((reg + 1) % 1000 === 0) || (lines[i+1]==='')) ? ';' : ',') + os.EOL)
                  reg += 1
                }
              }
            }
          }
        })
      }
    })
  }
})