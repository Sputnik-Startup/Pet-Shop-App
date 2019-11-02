const loki = require("lokijs");
var path = require('path');
const db = new loki(path.join(__dirname, '..', 'loginPage', 'db.json'));
const read = require('read-file-utf8');
let data = {}

data = read(__dirname + "/../loginPage/db.json")
db.loadJSON(data);

const clientes = db.getCollection("clientes");

setTimeout(function() {
    var element = document.getElementById('loading');
    element.classList += " hidden";
}, 300);

new Vue({
    el: "#app",
    data: {
        clientes: clientes.data,
        mode: "",
        openModal: false,
        cliente: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
        }
    },
    methods: {
        updateClient: function(client){
            this.mode = "update"
            this.cliente = client
            this.openModal = true
        },
        destroyClient: function(client){
            clientes.remove({'$loki': client.$loki})
            db.save()
        },
        storeClient: function(){
            this.mode = "store"
            this.cliente = {
                nome: "",
                email: "",
                cpf: "",
                telefone: "",
            }
            this.openModal = true
        },
        clientStoreOrUpdate: function(){
            if(typeof this.cliente.$loki != "undefined"){
                clientes.update(this.cliente)
            }else{
                clientes.insert(this.cliente)
            }
            db.save()
            this.openModal = false;
        }
    }
})