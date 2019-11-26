// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

const mongoose = require("mongoose");

window.addEventListener('DOMContentLoaded', () => {
  mongoose.connect("mongodb+srv://maxuser:maol963662339@omnistack-pqlxe.mongodb.net/PetsCao", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((err)=>{
    console.log("Conectado")
  })

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  } 
  
  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

})
