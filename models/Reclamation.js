const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reclamationSchema = new Schema({
  titre: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // This references the User model
    required: true
  }
});

const Reclamation = mongoose.model("Reclamation", reclamationSchema);

module.exports = Reclamation;
