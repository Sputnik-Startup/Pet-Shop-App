const loki = require("lokijs");
const db = new loki(__dirname + "/db.json");
const read = require("read-file-utf8");
const fs = require("fs");
var data = {};
const mongo = require("mongoose")

mongo.connect("mongodb+srv://maxuser:maol963662339@omnistack-pqlxe.mongodb.net/PetsCao", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((err)=>{
  console.log("conectado")
})

const Pendente = require("../../models/Pendente");
const Cliente = require("../../models/Cliente");
const Animal = require("../../models/Animal");

if (fs.existsSync(__dirname + "/db.json")) {
  data = read(__dirname + "/db.json");
  db.loadJSON(data);
} else {
  // fs.writeFile('db.json','', (err)=>{
  //     if(err)  throw err;
  // })

  db.addCollection("clientes");
  db.addCollection("funcionarios");
  db.addCollection("animais");
  db.addCollection("servicos");
  db.addCollection("estoque");
  db.addCollection("agendamentos");
  db.addCollection("financeiro");
  db.addCollection("materialDeConsumo");
  db.addCollection("vendas");
  db.addCollection("pendentes");
  db.save();
}
setTimeout(function() {
  var element = document.getElementById("loading");
  element.classList += " hidden";
}, 2000);

var fun = {
  nome: "Maxwell Olliver",
  nomeDeUsuario: "mo2019",
  senha: "123456",
  cargo: "Gerente",
  nivelDeAcesso: "admin"
};

var funcionarios = db.getCollection("funcionarios");
var pendentesdb = db.getCollection("pendentes");

window.addEventListener("DOMContentLoaded", async function(){

  let pendentes = await Pendente.find().populate("cliente", Cliente).populate("animal", Animal);
  for(let c = 0; c < pendentes.length; c++){
    let pending = {
      idMongo: pendentes[c].id,
      agendamento: pendentes[c].agendamento,
      cliente: {
        nome: pendentes[c].cliente.nome,
        email: pendentes[c].cliente.email,
        cpf: pendentes[c].cliente.cpf,
        telefone: pendentes[c].cliente.telefone,
      },
      animal: {
        nome: pendentes[c].animal.nome,
        raca: pendentes[c].animal.raca,
        tipo: pendentes[c].animal.tipo,
      },
      data: pendentes[c].data,
      hora: pendentes[c].hora,
      servico: pendentes[c].servico,
      pending: true,
    }
    console.log(pendentes)
    let alreadyExists = pendentesdb.find({ 'idMongo': pendentes[c].id})[0];
    
    if(!alreadyExists){
      pendentesdb.insert(pending);
      db.save()
    }
  }

})

new Vue({
  el: "#app",
  data: {
    login: {
      nomeDeUsuario: "",
      senha: ""
    }
  },
  methods: {
    loginValidation: function() {
      const funcionario = funcionarios.find({
        nomeDeUsuario: this.login.nomeDeUsuario
      })[0] || { nomeDeUsuario: "vazio", senha: "vazio" };

      if (
        funcionario.nomeDeUsuario === this.login.nomeDeUsuario &&
        funcionario.senha === this.login.senha
      ) {
        localStorage.setItem("access", funcionario.nivelDeAcesso);
        window.location.href = "../homePage/index.html";
      } else {
        var text;
        if (
          funcionario.nomeDeUsuario === this.login.nomeDeUsuario &&
          funcionario.senha !== this.login.senha
        ) {
          text = "A senha de usuário está incorreta.";
        }
        if (this.login.nomeDeUsuario === "" || this.login.senha === "") {
          text = "Por favor, preencha todos os campos.";
        } else if (funcionario.nomeDeUsuario === "vazio") {
          text = "Este usuário não existe.";
        }
        let err = document.querySelector("div#err-msg");
        err.className = "err-msg";
        err.innerHTML = `${text}`;
      }
    }
  }
});
