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

var funcionarios = db.getCollection('funcionarios');

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
            const funcionario = funcionarios.find({'nome': this.login.nome})[0] || {nome: "vazio", senha: "vazio"};

            if(funcionario.nome === this.login.nome && funcionario.senha === this.login.senha){
                window.location.href = "../homePage/index.html"
            }else{
                var text;
                if(funcionario.nome === this.login.nome && funcionario.senha !== this.login.senha) {
                    text = "A senha de usuário está incorreta."
                }
                if(this.login.nome === "" || this.login.senha === ""){
                    text = "Por favor, preencha todos os campos."
                } 
                if(funcionario.nome === "vazio"){
                    text = "Este usuário não existe."
                }
                let err = document.querySelector("div#err-msg");
                err.className = ("err-msg");
                err.innerHTML = `${text}`         
            }
        }
    }
})