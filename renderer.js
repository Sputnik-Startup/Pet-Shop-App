const loki = require('lokijs')
const db = new loki(__dirname + '/db.json')
const read = require('read-file-utf8')
const fs = require('fs')
var data={}

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


new Vue({
    el: "#app",
    data: {
        login: {
            nome: "",
            senha: "",
        }
    },
    methods: {
        loginValidation: function(){
            const funcionario = funcionarios.find({'senha': this.login.senha})[0] || {nome: "", senha: ""};

            if(funcionario.nome === this.login.nome && funcionario.senha === this.login.senha){
                console.log("OK!")
            }
        }
    }
})