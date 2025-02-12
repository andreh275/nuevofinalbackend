import mongoose from 'mongoose';

const tercerosSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  identificacion: { type: Number, required: true, unique: true },
  direccion: { type: String, required: true },
  telefono: { type: Number, required: true },
  tipo: { type: Number, required: true, enum: [1, 2] }, // 1: cliente, 2: proveedor
  estado: { type: Number, required: true, default: 1, enum: [0, 1] }, // 0: inactivo, 1: activo
}, { timestamps: true });

const tercerosModel = mongoose.model("terceros", tercerosSchema);
export default tercerosModel;