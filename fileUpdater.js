const fs = require("fs")
const path = require("path")

function updateFile() {
  let filename = path.join(__dirname, "index.js")
  
  let num = Date.now()
  
  let code = `
let p = document.createElement("p")
let time = ${num}
p.innerHTML = "This code file was generated at ${num}. That is " + Math.floor((Date.now()-time)/1000/60) + " minutes ago. "
document.body.appendChild(p)
`
  
  fs.writeFileSync(filename, code)
  console.log("File updated to " + num)
}

setInterval(updateFile, 1000*60*5) //Update every five minutes.
updateFile()
