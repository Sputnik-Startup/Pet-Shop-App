const loki = require("lokijs");
var path = require('path');
const db = new loki(path.join(__dirname, '..', 'loginPage', 'db.json'));
const read = require('read-file-utf8');
let data = {}

data = read(__dirname + "/../loginPage/db.json")
db.loadJSON(data);

setTimeout(function() {
    var element = document.getElementById('loading');
    element.classList += " hidden";
}, 300);

const estoquedb = db.getCollection("estoque")

new Vue({
    el: "#app",
    data: {
        estoqueAtivo: estoquedb.data,
        mode: "",
        openModal: false,
        estoque: {
            nomeProduto: "",
            valorUnit: "",
            qtd: "",
            validade: "",
        }
    },
    methods: {
        closeModal: function(){
            this.openModal = false;
            if(this.mode === "update"){
                window.location.reload()
            }
        },
        updateEstoque: function(estoque){
            this.mode = "update"
            this.estoque = estoque
            this.openModal = true
        },
        destroyEstoque: function(estoque){
            estoquedb.remove({'$loki': estoque.$loki})
            db.save()
        },
        storeEstoque: function(){
            this.mode = "store"
            this.estoque = {
                nomeProduto: "",
                valorUnit: "",
                qtd: "",
                validade: "",
            }
            this.openModal = true
        },
        estoqueStoreOrUpdate: function(){
            let data = new Date(this.estoque.validade);
            this.estoque.validade = data.toLocaleDateString("pt-BR", {timeZone: "UTC"});
            

            if(typeof this.estoque.$loki != "undefined"){
                estoquedb.update(this.estoque)
            }else{
                estoquedb.insert(this.estoque)
            }
            db.save()
            this.openModal = false;
        }
    }
})