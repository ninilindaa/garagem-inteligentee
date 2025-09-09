const mongoose = require('mongoose');

const manutencaoSchema = new mongoose.Schema({
  descricaoServico: { type: String, required: true },
  data: { type: Date, required: true, default: Date.now },
  custo: { type: Number, required: true, min: 0 },
  quilometragem: { type: Number, min: 0 },
  veiculo: { type: mongoose.Schema.Types.ObjectId, ref: 'Veiculo', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Manutencao', manutencaoSchema);
