const fs = require("fs")
const path = require("path")

function updateFile() {
  let filename = path.join(__dirname, "test.js")
  let num = Number(fs.readFileSync(filename, {encoding: "utf-8"}))
  
  num += 1
  
  fs.writeFileSync(filename, num)
}

setInterval(updateFile, 1000*60*5) //Update every five minutes.
