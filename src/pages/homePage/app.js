const loki = require("lokijs");
var path = require('path');
const db = new loki(path.join(__dirname, '..', 'loginPage', 'db.json'));

const Pendente = require("../../models/Pendente");
const Cliente = require("../../models/Cliente");
const Animal = require("../../models/Animal");

const clienteLoki = db.getCollection("clientes");
const animalLoki = db.getCollection("animais");
const agendaLoki = db.getCollection("agendamentos");

setTimeout(function() {
    var element = document.getElementById('loading');
    element.classList += " hidden";
}, 300);

async function loadHome(){
    let pendentes = Pendente.find().populate("cliente", Cliente).populate("animal", Animal);
    
    new Vue({
        el: '#app',
        data: {
            access: localStorage.getItem('access'),
            pendentes: pendentes,
            errMsg: "",
        },
        methods: {
            acceptSchedule: async function(value){
                var cliente = clienteLoki.find({ cpf: value.cliente.cpf })[0];

                var newAnimal = {
                    dono: "",
                    nome: value.animal.nome,
                    raca: value.animal.raca,
                    tipo: value.animal.tipo,
                }
                var newCliente = {
                    nome: value.cliente.nome,
                    email: value.cliente.email,
                    cpf: value.cliente.cpf,
                    telefone: value.cliente.telefone
                }

                var newAgenda = {
                    cliente: "",
                    animal: "",
                    datetime: "",
                    tipoDeServico: value.servico,
                }
                if(!cliente){

                    clienteLoki.insert(newCliente);
                    await db.save()

                    var cliente_id = clienteLoki.find({ cpf: value.cliente.cpf })[0]

                    var animal = animalLoki.find({ dono: cliente_id.$loki })[0]
                    if(animal){
                        newAnimal.dono = cliente_id.$loki;
                        animalLoki.insert(newAnimal);
                    }
                }else{
                    var animal = animalLoki.find({ dono: cliente._id, nome: value.animal.nome, raca: value.animal.raca, tipo: value.animal.tipo })[0]
                    if(!animal){
                        newAnimal.dono = cliente.$loki;
                        animalLoki.insert(newAnimal);
                    }
                }

                await db.save()

                var dateFormat;
                dateFormat.push(value.data);
                dateFormat.push(value.hora);
                dateFormat = dateFormat.join("T");

                var agenda = agendaLoki.find({ datetime: dateFormat});
                if(!agenda){
                    var animal_id = animalLoki.find({ dono: cliente_id.$loki, nome: value.animal.nome, raca: value.animal.raca, tipo: value.animal.tipo});

                    if(animal_id){
                       newAgenda.animal = animal_id.$loki;
                       newAgenda.cliente = cliente_id.$loki;
                       newAgenda.datetime = dateFormat;

                       agendaLoki.insert(newAgenda);
                       db.save()
                       this.errMsg = "Todos os dados foram registrados com sucesso!"
                    }
                }

                await Pendente.deleteOne({ _id: value._id })

            },
            openModal: function(){
                let modal = document.querySelector("#modal");
                modal.classList.add("mostrar");
            },
            closeModal(){
                let modal = document.querySelector("#modal");
                modal.classList.remove("mostrar")
            }
        },
    })
}
loadHome()