const mongoose = require("mongoose");

const profesorSchema = new mongoose.Schema(
    {
        nume: {type: String, required: true},
        materie: {type: String, required: true},
        pret: {type:Number, required: true},
        localitate: {type:String, required: true},
        zileDisponibile: {type: Array, required: true},
        email: {type: String, required: true},
        img: {type: String}
    },
    {timestamps: true}
)

module.exports = mongoose.model("Profesor", profesorSchema);