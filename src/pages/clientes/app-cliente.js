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
        errorModal: false,
        searchModal: false,
        searchResult: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
        },
        search: "",
        searchErr: false,
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
        searchClient: function(){
            const result = clientes.find({'cpf': this.search})[0] || clientes.find({'email': this.search})[0];

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
            window.location.reload()
        },
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
            if(this.cliente.nome != "" && this.cliente.email != "" && this.cliente.cpf != "" && this.cliente.telefone != ""){
                if(typeof this.cliente.$loki != "undefined"){
                    clientes.update(this.cliente)
                }else{
                    clientes.insert(this.cliente)
                }
                db.save()
            }else{
                this.errorModal = true
            }
            this.openModal = false;
        }
    }
})