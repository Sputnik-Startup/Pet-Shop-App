const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    nome: String,
    email: String,
    cpf: String,
    telefone: String,
})

module.exports = mongoose.model("User", clienteSchema)