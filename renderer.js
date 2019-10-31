const loki = require('lokijs')
const db = new loki(__dirname + '/db.json')
const read = require('read-file-utf8')
const fs = require('fs')
const data={}

if(fs.existsSync(__dirname + '/db.json')){
    data = read(__dirname + '/db.json')
    db.loadJSON(data);
}else{
    // fs.writeFile('db.json','', (err)=>{
    //     if(err)  throw err;
    // })

    db.addCollection('clientes')
    db.addCollection('funcionarios')
    db.addCollection('animais')
    db.addCollection('servicos')
    db.addCollection('estoque')
    db.addCollection('agendamentos')
    db.addCollection('financiamentos')
    db.save()
}
var fun = {
    nome: "Maxwell Olliver",
    senha: "123456",
    cargo: "Gerente",
    nivelDeAcesso: "admin"
}

var funcionarios = db.getCollection('funcionarios')
funcionarios.insert(fun)

db.save()

// new Vue({
//     el: "#app",
//     data: {
//         login: {
//             nome: "",
//             senha: "",
//         }
//     },
//     methods: {
//         loginValidation: function(nome, senha){

//         }
//     }
// })