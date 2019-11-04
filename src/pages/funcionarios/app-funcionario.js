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
        funcionarios: funcionarios.data,
        mode: "",
        openModal: false,
        funcionario: {
            nome: "",
            senha: "",
            cargo: "",
            nivelDeAcesso: "",
        }
    },
    methods: {
        closeModal: function(){
            this.openModal = false;
            window.location.reload()
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
                senha: "",
                cargo: "",
                nivelDeAcesso: "",
            }
            this.openModal = true
        },
        funStoreOrUpdate: function(){
            if(typeof this.funcionario.$loki != "undefined"){
                funcionarios.update(this.funcionario)
            }else{
                funcionarios.insert(this.funcionario)
            }
            db.save()
            this.openModal = false;
        }
    }
})