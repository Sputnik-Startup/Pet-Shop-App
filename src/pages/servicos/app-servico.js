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

const servicos = db.getCollection("servicos");
const clientes = db.getCollection("clientes")

new Vue({
    el: "#app",
    data: {
        errorModal: false,
        existsClient: false,
        infoClientModal: false,
        servicos: servicos.data,
        clientes: clientes.data,
        mode: "",
        openModal: false,
        servico: {
            tipoDeServico: "",
            data: "",
            precoFixo: "",
            precoDesconto: "",
            cliente: "",
        },
        cliente: {
            nome: "",
            email: "",
            cpf: "",
            telefone: "",
        }
    },
    methods: {
        clienteInfo: function(servico){
            const clientInfo = clientes.find({'$loki': servico.cliente})[0];
            
            if(typeof clientInfo != "undefined"){
                this.cliente = clientInfo
                this.existsClient = true
            }else{
                this.existsClient= false
            }
            this.searchModal = false;
            this.infoClientModal = true
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
        updateServico: function(servico){
            this.mode = "update"
            this.servico = servico
            this.openModal = true

        },
        destroyServico: function(servico){
            servicos.remove({'$loki': servico.$loki})
            db.save()
        },
        storeServico: function(){
            this.mode = "store"
            this.servico = {
                tipoDeServico: "",
                data: "",
                precoFixo: "",
                precoDesconto: "",
                cliente: "",
            }
            this.openModal = true
        },
        servicoStoreOrUpdate: function(){
            // var slp = this.servico.data.split('T') || this.servico.data;
            // slp[0] = new Date(slp[0]).toLocaleDateString("pt-BR", {timeZone: "UTC"})
            // this.servico.data = slp
            if(this.servico.tipoDeServico != "" && this.servico.data != "" && this.servico.precoFixo!= "" && this.servico.precoDesconto != "" && this.servico.cliente != ""){
                if(typeof this.servico.$loki != "undefined"){
                    servicos.update(this.servico)
                }else{
                    servicos.insert(this.servico)
                }
                db.save()
            }else{
                this.errorModal = true
            }
            this.openModal = false;
        }
    }
})