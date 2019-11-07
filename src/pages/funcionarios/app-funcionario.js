const loki = require("lokijs");
var path = require('path');
const db = new loki(path.join(__dirname, '..', 'loginPage', 'db.json'));
const read = require('read-file-utf8');
let data = {}

data = read(__dirname + "/../loginPage/db.json")
db.loadJSON(data);

const funcionarios = db.getCollection("funcionarios");

setTimeout(function() {
    var element = document.getElementById('loading');
    element.classList += " hidden";
}, 300);

new Vue({
    el: "#app",
    data: {
        searchModal: false,
        searchResult: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
        },
        search: "",
        searchErr: false,
        errorModal: false,
        funcionarios: funcionarios.data,
        mode: "",
        openModal: false,
        funcionario: {
            nome: "",
            nomeDeUsuario: "",
            senha: "",
            cargo: "",
            nivelDeAcesso: "",
        }
    },
    methods: {
        searchFun: function(){
            const result = funcionarios.find({'nomeDeUsuario': this.search})[0];

            if(typeof result == "undefined"){
                this.searchErr = true;
            }else{
                this.searchErr = false;
                this.searchResult = result;
            }
            this.searchModal = true;

        },
        closeModal: function(){
            this.openModal = false;
            if(this.mode === "update"){
                window.location.reload()
            }
        },
        updateFun: function(fun){
            this.mode = "update"
            this.funcionario = fun
            this.openModal = true
        },
        destroyFun: function(fun){
            funcionarios.remove({'$loki': fun.$loki})
            db.save()
        },
        storeFun: function(){
            this.mode = "store"
            this.funcionario = {
                nome: "",
                nomeDeUsuario: "",
                senha: "",
                cargo: "",
                nivelDeAcesso: "",
            }
            this.openModal = true
        },
        funStoreOrUpdate: function(){
            if(this.funcionario.nome != "" && this.funcionario.tipo != "" && this.funcionario.raca != "" && this.funcionario.dono != "" && this.funcionario.nomeDeUsuario != "undefined"){
                if(typeof this.funcionario.$loki != "undefined"){
                    funcionarios.update(this.funcionario)
                }else{
                    funcionarios.insert(this.funcionario)
                }
                db.save()
            }else{
                this.errorModal = true
            }
            this.openModal = false;
        }
    }
})