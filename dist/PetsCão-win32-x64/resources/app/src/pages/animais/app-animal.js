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
        existsOwner: false,
        errorModal: false,
        searchModal: false,
        searchResult: {
            nome: "",
            tipo: "",
            raca: "",
            dono: "",
        },
        search: "",
        searchErr: false,
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
        searchAnimal: function(){
            const ownerResult = clientes.find({'cpf': this.search})[0]
            if(typeof ownerResult != "undefined"){
                const result = animais.find({'dono': ownerResult.$loki})[0]
                if(typeof result == "undefined"){
                    this.searchErr = true;
                }else{
                    this.searchErr = false;
                    this.searchResult = result;
                }
            }else{
                this.searchErr = true;
            }
            this.searchModal = true;

            //434.660.310-60

        },
        copyText: function(){
            document.getElementById("copy").title = "CPF copiado!"
            document.getElementById("text").select()
            document.execCommand("copy")
        },
        closeModal: function(){
            this.openModal = false;
            if(this.mode === "update"){
                window.location.reload()
            }
        },
        ownerInfo: function(ani){
            const ownerInfo = clientes.find({'$loki': ani.dono})[0];
            
            if(typeof ownerInfo != "undefined"){
                this.owner = ownerInfo
                this.existsOwner = true
            }else{
                this.existsOwner= false
            }
            this.searchModal = false;
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
            if(this.animal.nome != "" && this.animal.tipo != "" && this.animal.raca != "" && this.animal.dono != ""){
                if(typeof this.animal.$loki != "undefined"){
                    animais.update(this.animal)
                }else{
                    animais.insert(this.animal)
                }
                db.save()
            }else{
                this.errorModal = true
            }
            this.openModal = false;
        }
    }
})