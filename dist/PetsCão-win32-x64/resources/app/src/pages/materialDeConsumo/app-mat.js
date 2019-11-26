const loki = require("lokijs");
var path = require("path");
const db = new loki(path.join(__dirname, "..", "loginPage", "db.json"));
const read = require("read-file-utf8");
let data = {};

data = read(__dirname + "/../loginPage/db.json");
db.loadJSON(data);

setTimeout(function() {
  var element = document.getElementById("loading");
  element.classList += " hidden";
}, 300);

const Material = db.getCollection("materialDeConsumo");

new Vue({
  el: "#app",
  data: {
    errorModal: false,
    materiais: Material.data,
    mode: "",
    openModal: false,
    material: {
      nomeMaterial: "",
      valorUnit: "",
      qtd: "",
      validade: ""
    }
  },
  methods: {
    closeModal: function() {
      this.openModal = false;
      // if(this.mode === "update"){
      //     window.location.reload()
      // }
    },
    updateMaterial: function(material) {
      this.mode = "update";
      this.material = material;
      this.openModal = true;
    },
    destroyMaterial: function(material) {
      Material.remove({ $loki: material.$loki });
      db.save();
    },
    storeMaterial: function() {
      this.mode = "store";
      this.material = {
        nomeProduto: "",
        valorUnit: "",
        qtd: "",
        validade: ""
      };
      this.openModal = true;
    },
    materialStoreOrUpdate: function() {
      let data = new Date(this.material.validade);
      this.material.validade = data.toLocaleDateString("pt-BR", {
        timeZone: "UTC"
      });
      console.log(this.material)
      if (
        this.material.nomeMaterial != "" &&
        this.material.valorUnit != "" &&
        this.material.qtd != "" &&
        this.material.validade != ""
      ) {
        if (typeof this.material.$loki != "undefined") {
          Material.update(this.material);
        } else {
          Material.insert(this.material);
        }
        db.save();
      } else {
        this.errorModal = true;
      }

      this.openModal = false;
    }
  }
});
