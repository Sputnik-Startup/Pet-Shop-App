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

const animais = db.getCollection("animais")
const clientes = db.getCollection("clientes");
new Vue({
    el: "#app",
    data: {
        ready: true,
        infoOwnerModal: false,
        clientes: clientes.data,
        animais: animais.data,
        owner: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
        },
        mode: "",
        openModal: false,
        animal: {
            nome: "",
            tipo: "",
            raca: "",
            dono: "",
        }
    },
    methods: {
        closeModal: function(){
            this.openModal = false;
            window.location.reload()
        },
        ownerInfo: function(ani){
            const ownerInfo = clientes.find({'$loki': ani.dono})[0];
            this.owner = ownerInfo
            this.infoOwnerModal = true
        },
        updateAnimal: function(animal){
            this.mode = "update"
            this.animal = animal
            this.openModal = true
        },
        destroyAnimal: function(animal){
            animais.remove({'$loki': animal.$loki})
            db.save()
        },
        storeAnimal: function(){
            this.mode = "store"
            this.animal = {
                nome: "",
                tipo: "",
                raca: "",
                dono: "",
            }
            this.openModal = true
        },
        animalStoreOrUpdate: function(){
            if(typeof this.animal.$loki != "undefined"){
                animais.update(this.animal)
            }else{
                animais.insert(this.animal)
            }
            db.save()
            this.openModal = false;
        }
    }
})