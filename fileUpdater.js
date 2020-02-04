const fs = require("fs")
const path = require("path")

function updateFile() {
  let filename = path.join(__dirname, "test.js")
  
  let num = Date.now()
  
  let code = `
let p = document.createElement("p")
p.innerHTML = "This is code file ${num}"
document.body.appendChild(p)
`
  
  fs.writeFileSync(filename, code)
}

setInterval(updateFile, 1000*60*5) //Update every five minutes.
updateFile()
