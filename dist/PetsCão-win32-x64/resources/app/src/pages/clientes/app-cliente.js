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
        cpfValidate: true,
        errorModal: false,
        searchModal: false,
        searchResult: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
            status: "",
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
            status: "",
        }
    },
    methods: {
        validarCPF: function(strCPF) {
            var Soma;
            var Resto;
            Soma = 0;
            if (strCPF == "00000000000") return false;
             
            for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
            Resto = (Soma * 10) % 11;
           
            if ((Resto == 10) || (Resto == 11))  Resto = 0;
            if (Resto != parseInt(strCPF.substring(9, 10)) ) return false;
           
            Soma = 0;
            for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;
           
            if ((Resto == 10) || (Resto == 11))  Resto = 0;
            if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false;
            return true;
        },
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
            // if(this.mode === "update"){
            //     window.location.reload()
            // }
        },
        updateClient: function(client){
            this.mode = "update"
            this.cliente = client
            this.openModal = true
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
            let cpf = this.cliente.cpf
                .split('.')
                .join("")
                .split("-")
                .join("")
            let validate = this.validarCPF(cpf);
            if(this.cliente.nome != "" && this.cliente.email != "" && this.cliente.cpf != "" && this.cliente.telefone != "" && this.cliente.status != ""){
                if(validate){
                    if(typeof this.cliente.$loki != "undefined"){
                        clientes.update(this.cliente);
                    }else{
                        clientes.insert(this.cliente);
                    }
                    db.saveDatabase()
                }else{
                    this.cpfValidate = false;
                }

                
            }else{
                this.errorModal = true
            }
            this.openModal = false;
        }
    }
})