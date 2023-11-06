const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({

	fullname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        unique: true,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true
    },

    role: {
        type: String,
        enum: ['employeur', 'responsable'],
        default: 'employeur'
    },

    password: {
       type : String,
      required : true
    },
    image: {
        type : String,
       required : true
     },
    phone: {
        type: Number,
        required: false
    },

    poste: {
        type: String,
        enum: ['Architecte Logiciel', 'Analyste Fonctionnel', 'Chef de Mission',
            'Chef de Projet', 'Développeur', 'Testeur', 'Maintenance Applicative et Spécialiste en Gestion de Projet'],
    },
    grade:{
        type: String,
        enum: ['Ingénieur Principal', 'Ingénieur Major', 'Technicien'],

    },
    reclamations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reclamation' // Ceci fait référence au modèle Reclamation
      }]

})



const User = mongoose.model("User", userSchema);

module.exports = User;