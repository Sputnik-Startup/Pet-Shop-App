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

const financeirodb = db.getCollection("financeiro");

new Vue({
    el: "#app",
    data: {
        errorModal: false,
        financeirodata: financeirodb.data,
        mode: "",
        openModal: false,
        financeiro: {
            valorServico: "",
            gastosPet: "",
            gastosLocal: "",
            data: "",
        },
    },
    methods: {
        printReport: function(){
            print();
        },
        closeModal: function(){
            this.openModal = false;
            if(this.mode === "update"){
                window.location.reload()
            }
        },
        updateFinanceiro: function(financeiro){
            this.mode = "update"
            this.financeiro = financeiro
            this.openModal = true

        },
        destroyFinanceiro: function(financeiro){
            financeirodb.remove({'$loki': financeiro.$loki})
            db.save()
        },
        storeFinanceiro: function(){
            this.mode = "store"
            this.financeiro = {
                valorServico: "",
                gastosPet: "",
                gastosLocal: "",
                data: "",
            }
            this.openModal = true
        },
        financeiroStoreOrUpdate: function(){

            if(this.financeiro.valorServico != "" && this.financeiro.gastosPet != "" && this.financeiro.gastosLocal != "" && this.financeiro.data != ""){
                if(typeof this.financeiro.$loki != "undefined"){
                    financeirodb.update(this.financeiro)
                }else{
                    financeirodb.insert(this.financeiro)
                }
                db.save()
            }else{
                this.errorModal = true
            }
            this.openModal = false;
        }
    }
})