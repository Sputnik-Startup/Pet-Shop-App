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


const estoquedb = db.getCollection("estoque");
const Venda = db.getCollection("vendas");
const Cliente = db.getCollection("clientes");



new Vue({
    el: "#app",
    data: {
      existsClient: false,
      infoClientModal: false,
      errorModal: false,
      produtos: estoquedb.data,
      vendas: Venda.data,
      clientes: Cliente.data,
      mode: "",
      openModal: false,
      client: {
        nome: "",
        email: "",
        cpf: "",
        telefone: "",
      },
      venda: {
          cliente: "",
          produto: [""],
          qtd: [""],
          valor: "",
      }
    },
    methods: {
      clienteInfo: function(venda){
        const clientInfo = Cliente.find({'$loki': venda.cliente})[0];
        
        if(typeof clientInfo != "undefined"){
            this.client = clientInfo
            this.existsClient = true
        }else{
            this.existsClient= false
        }
        this.searchModal = false;
        this.infoClientModal = true
    },
      addProduto: function(produto){
        this.venda.produto += `${produto} `
      },
      closeModal: function(){
          this.openModal = false;
          // if(this.mode === "update"){
          //     window.location.reload()
          // }
      },
      updateVenda: function(venda){
          this.mode = "update"
          this.venda = venda
          this.openModal = true
      },
      destroyVenda: function(venda){
          Venda.remove({'$loki': venda.$loki})
          db.save()
      },
      storeVenda: function(){
          this.mode = "store"
          this.venda = {
            cliente: "",
            produto: "",
            qtd: "",
            valor: "",
          }
          this.openModal = true
      },
      vendaStoreOrUpdate: function(){ 

        if(this.venda.cliente != "" && this.venda.produto != "" && this.venda.qtd != ""){
      
          var qtd = this.venda.qtd
            .split(",")
            .map(qtd => qtd.trim())
            .map(qtd => Number(qtd)) || this.venda.qtd

          console.log(this.venda.produto)
          if(this.venda.valor === "" || this.mode === "update"){
            let prices;
            this.venda.produto = this.venda.produto.trim()
            var product = this.venda.produto
              .replace(" ", ", ")      
              .split(",")
              .map(product => product.trim());
              
            prices = product.map((product, index) => Number((estoquedb.find({"nomeProduto": product})[0].valorUnit * qtd[index]).toFixed(2)))
     
            this.venda.valor = prices.reduce((current, next) => current + next)

          }  

          if(typeof this.venda.$loki != "undefined"){
            
              Venda.update(this.venda)
          }else{
              Venda.insert(this.venda)
          }
          db.save()
        }else{
            this.errorModal = true
        }

        this.openModal = false;
      }
    }
})