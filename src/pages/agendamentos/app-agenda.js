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
const agendamentos = db.getCollection("agendamentos")

new Vue({
    el: "#app",
    data: {
        existsClient: false,
        existsAnimal: false,
        errorModal: false,
        infoClientModal: false,
        infoAnimalModal: false,
        clientes: clientes.data,
        animais: animais.data,
        agendamentos: agendamentos.data,
        agenda: {
            cliente: "",
            animal: "",
            datetime: "",
            tipoDeServico: "",
        },
        client: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
        },
        animal: {
            nome: "",
            tipo: "",
            raca: "",
            dono: ""
        },
        mode: "",
        openModal: false,
    },
    methods: {
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
        clienteInfo: function(agenda){
            const clientInfo = clientes.find({'$loki': agenda.cliente})[0];
            
            if(typeof clientInfo != "undefined"){
                this.client = clientInfo
                this.existsClient = true
            }else{
                this.existsClient= false
            }
            this.searchModal = false;
            this.infoClientModal = true
        },
        animalInfo: function(agenda){
            const animalInfo = animais.find({'$loki': agenda.animal})[0];
            if(typeof animalInfo != "undefined" ){
                const clientName = clientes.find({'$loki': animalInfo.dono})[0] || {nome:"Cliente removido."};
                console.log(clientName.nome)
                this.animal = {
                    nome: animalInfo.nome,
                    tipo: animalInfo.tipo,
                    raca: animalInfo.raca,
                    dono: clientName.nome,
                }
                this.existsAnimal = true
            }else{
                this.existsAnimal = false
            }
            this.infoAnimalModal = true
        },
        updateAgenda: function(agenda){
            this.mode = "update"
            this.agenda = agenda
            this.openModal = true
        },
        destroyAgenda: function(agenda){
            agendamentos.remove({'$loki': agenda.$loki});
            db.save()
        },
        storeAgenda: function(){
            this.mode = "store"
            this.agenda = {
                cliente: "",
                animal: "",
                datetime: "",
                tipoDeServico: "",
            },
            this.openModal = true
        },
        agendaStoreOrUpdate: function(){
            if(this.agenda.cliente != "" && this.agenda.animal != "" && this.agenda.datetime != "" && this.agenda.tipoDeServico != ""){
                if(typeof this.agenda.$loki != "undefined"){
                    agendamentos.update(this.agenda);
                }else{
                    agendamentos.insert(this.agenda);
                }
            }else{
                this.errorModal = true
            }
            db.save();
            this.openModal = false;
        }
    }
})