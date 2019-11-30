const loki = require("lokijs");
var path = require('path');
const db = new loki(path.join(__dirname, '..', 'loginPage', 'db.json'));
const read = require('read-file-utf8');
let data = {}
const nodemailer = require("nodemailer")
const api = require("../../services/api");

data = read(__dirname + "/../loginPage/db.json")
db.loadJSON(data);

const clienteLoki = db.getCollection("clientes");
const animalLoki = db.getCollection("animais");
const agendaLoki = db.getCollection("agendamentos");
const pendente = db.getCollection("pendentes");

setTimeout(function() {
    var element = document.getElementById('loading');
    element.classList += " hidden";
}, 300);

new Vue({
    el: '#app',
    data: {
        access: localStorage.getItem('access'),
        pendentes: pendente.data,
        errMsg: "",
    },
    methods: {
        acceptSchedule: async function(value){
            var cliente = clienteLoki.find({ cpf: value.cliente.cpf })[0];
            var cliente_id = clienteLoki.find({ cpf: value.cliente.cpf })[0]

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
                telefone: value.cliente.telefone,
                status: "Ativo"
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

                var animal = animalLoki.find({ dono: cliente_id.$loki })[0]
                if(animal){
                    newAnimal.dono = cliente_id.$loki;
                    animalLoki.insert(newAnimal);
                }
            }else{
                var animal = animalLoki.find({ dono: cliente_id.$loki, nome: value.animal.nome, raca: value.animal.raca, tipo: value.animal.tipo })[0]
                if(!animal){
                    newAnimal.dono = cliente.$loki;
                    animalLoki.insert(newAnimal);
                }
            }

            db.save()

            var dateFormat = [];
            dateFormat.push(value.data);
            dateFormat.push(value.hora);
            dateFormat = dateFormat.join("T");

            var agenda = agendaLoki.find({ datetime: dateFormat})[0];
            if(!agenda){
                var animal_id = animalLoki.find({ dono: cliente_id.$loki, nome: value.animal.nome, raca: value.animal.raca, tipo: value.animal.tipo})[0];

                if(animal_id){
                    newAgenda.cliente = cliente_id.$loki;
                    newAgenda.animal = animal_id.$loki;
                    newAgenda.datetime = dateFormat;

                    agendaLoki.insert(newAgenda);
                    db.save()
                    this.errMsg = "Todos os dados foram registrados com sucesso!"
                }
            }
            let pend = await pendente.find({'idMongo': value.idMongo})[0]

            document.getElementById(`${value.idMongo}`).classList.add("hidden");

            pend.pending = false;
            await pendente.update(pend);
            db.saveDatabase();
            const response = await api.put(`/edit-schedule/${value.agendamento}`, { dataEdit: value.data, horaEdit: value.hora, servicoEdit: value.servico, status: true });
            
            let testAccount = nodemailer.createTestAccount();


            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'petscaocompany@gmail.com',
                    pass: 'petscao2019'
                }
            });


            let info = transporter.sendMail({
                from: "'PetsCão' <petscaocompany@gmail.com>",
                to: value.cliente.email,
                subject: 'Status de agendamento - PetsCão',
                html: '<div style="display: flex; flex-direction: column; justify-content: center; width: 600px; align-items: center"><div style="display:flex;flex-direction: column; align-items: center;width: 550px;padding: 15px;  background-color: #3c8ad5; color: white;"><div style="background-color: #e69240; width: 500px; padding: 15px 10px; margin-top: 30px; border-radius: 10px;"><h1>Olá ' + value.cliente.nome + '!</h1><br><span style="font-size: 16px;">Temos uma boa notícia! <br><strong>O SEU AGENDAMENTO FOI ACEITO</strong><br><br>Segue abaixo as informações do agendamento: <br> <br> Pet: ' + value.animal.nome + ' <br>Data: ' + new Date(value.data).toLocaleDateString("pr-BR", {timeZone: "UTC"}) + ' às ' + value.hora + '<br>Serviço: '+ value.servico +'<br><br>Agradecemos pela preferência! S2</span><hr style="background-color: #3c8ad5; width: 100%; border: 0; height: 2px; margin: 40px 0 20px;"><p style="text-align:center">Atenciosamente,<br>Equipe PetsCão.</p></span></div></div></div>'
            });

        },

        rejectSchedule(value){
            value.pending = false,
            document.getElementById(`${value.idMongo}`).classList.add("hidden");
            pendente.update(value);
            db.saveDatabase();

            let testAccount = nodemailer.createTestAccount();


            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: 'petscaocompany@gmail.com',
                    pass: 'petscao2019'
                }
            });


            let info = transporter.sendMail({
                from: "'PetsCão' <petscaocompany@gmail.com>",
                to: value.cliente.email,
                subject: 'Status de agendamento - PetsCão',
                html: '<div style="display: flex; flex-direction: column; justify-content: center; width: 600px; align-items: center"><div style="display:flex;flex-direction: column; align-items: center;width: 550px;padding: 15px;  background-color: #3c8ad5; color: white;"><div style="background-color: #e69240; width: 500px; padding: 15px 10px; margin-top: 30px; border-radius: 10px;"><h1>Olá ' + value.cliente.nome + '!</h1><br><span style="font-size: 16px;">Temos uma má notícia! <br><strong>O SEU AGENDAMENTO FOI REJEITADO</strong><br><br>Segue abaixo as informações do agendamento: <br> <br> Pet: ' + value.animal.nome + ' <br>Data: ' + new Date(value.data).toLocaleDateString("pr-BR", {timeZone: "UTC"}) + ' às ' + value.hora + '<br>Serviço: '+ value.servico +'<br><br>Para informações sobre o motivo da rejeição, favor ligar no número abaixo: <br>(92) 2597-1288 <br>Agradecemos pela preferência! S2</span><hr style="background-color: #3c8ad5; width: 100%; border: 0; height: 2px; margin: 40px 0 20px;"><p style="text-align:center">Atenciosamente,<br>Equipe PetsCão.</p></span></div></div></div>'
            });
        },
        openModal: function(){
            let modal = document.querySelector("#modal-container");
            modal.classList.add("mostrar");
            let modalC = document.querySelector("#modal-container")
            modalC.addEventListener("click", (e)=>{
              if(e.target.id == "modal-container"){
                modal.classList.remove("mostrar");
              }
            })
        },
        closeModal(){
            let modal = document.querySelector("#modal-container");
            modal.classList.remove("mostrar");
        }

    },
})