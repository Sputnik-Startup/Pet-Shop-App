const mongoose = require("mongoose");

const animalSchema = new mongoose.Schema({
    nome: String,
    tipo: String,
    raca: String,
    dono: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

module.exports = mongoose.model("Animal", animalSchema)