const mongoose = require("mongoose");


const pendentesSchema = new mongoose.Schema({
    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    animal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Animal"
    },
    agendamento: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Agenda"
    },
    data: String,
    hora: String,
    servico: String,
});

module.exports = mongoose.model("Pendente", pendentesSchema);