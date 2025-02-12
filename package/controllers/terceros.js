import tercerosModel from "../models/terceros.js";
import bcrypt from 'bcryptjs';

// Función para crear un nuevo tercero
const postTerceros = async (req, res) => {
    try {
      // Desestructuramos los campos que vienen en el cuerpo de la solicitud
      const { nombre, identificacion, direccion, telefono, tipo, estado } = req.body;
  
      // Crear un nuevo tercero con los datos recibidos
      const tercero = new tercerosModel({
        nombre,
        identificacion,
        direccion,
        telefono,
        tipo,
        estado,
      });
  
      // Guardar el tercero en la base de datos
      await tercero.save();
      res.json({ tercero });
  
    } catch (error) {
      console.error("Error en postTerceros:", error.message || error);
      res.status(400).json({ 
        error: "Parece que hubo un error en el registro del tercero",
        details: error.message || error 
      });
    }
  };

// Función para actualizar un tercero
const putTerceros = async (req, res) => {
    try {
        // Desestructuramos los datos que vienen en el cuerpo de la solicitud
        const { nombre, contraseña, identificacion, direccion, telefono, tipo, estado } = req.body;
        const { id } = req.params;

        let contraseñaEncriptada = undefined;

        // Si se proporciona una nueva contraseña, encriptarla
        if (contraseña) {
            const salt = await bcrypt.genSalt(10);
            contraseñaEncriptada = await bcrypt.hash(contraseña, salt);
        }

        // Realizar la actualización del tercero
        const actualizadoTercero = await tercerosModel.findByIdAndUpdate(
            id,
            {
                nombre,
                contraseña: contraseñaEncriptada || undefined,  // Solo actualizamos la contraseña si se proporciona una nueva
                identificacion,
                direccion,
                telefono,
                tipo,
                estado,
            },
            { new: true }  // Esto garantiza que nos devuelva el documento actualizado
        );

        if (!actualizadoTercero) {
            return res.status(404).json({ error: "Tercero no encontrado" });
        }

        res.json({ tercero: actualizadoTercero });

    } catch (error) {
        res.status(400).json({ error: "Parece que hubo un error al actualizar el tercero" });
        console.log(error);
    }
};

// Función para obtener todos los terceros
const getTerceros = async (req, res) => {
    try {
        const terceros = await tercerosModel.find();
        res.json({ terceros });
    } catch (error) {
        res.status(400).json({ error: "Parece que hubo un error al traer todos los terceros" });
        console.log(error);
    }
};

// Función para obtener un solo tercero por ID
const getTercero = async (req, res) => {
    try {
        const { id } = req.params;
        const tercero = await tercerosModel.findById(id);
        
        if (!tercero) {
            return res.status(404).json({ error: "Tercero no encontrado" });
        }

        res.json({ tercero });
    } catch (error) {
        res.status(400).json({ error: "Parece que hubo un error al realizar la búsqueda" });
        console.log(error);
    }
};

// Función para obtener los terceros activos o inactivos
const getActivosinactivos = async (req, res) => {
    try {
        const { accion } = req.params;
        
        let terceros;
        if (accion === "activos") {
            terceros = await tercerosModel.find({ estado: 1 });
        } else if (accion === "inactivos") {
            terceros = await tercerosModel.find({ estado: 0 });
        }

        res.json({ terceros });
    } catch (error) {
        res.status(400).json({ error: "Parece que hubo un error al realizar la operación" });
    }
};

// Función para activar o inactivar un tercero
const putActivarInactivar = async (req, res) => {
    try {
        const { accion, id } = req.params;

        let estado;
        if (accion === "activar") {
            estado = 1;
        } else if (accion === "inactivar") {
            estado = 0;
        }

        const actualizadoTercero = await tercerosModel.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        );

        if (!actualizadoTercero) {
            return res.status(404).json({ error: "Tercero no encontrado" });
        }

        res.json({ tercero: actualizadoTercero });

    } catch (error) {
        res.status(400).json({ error: "Parece que hubo un error al realizar la operación" });
    }
};

// Función para obtener terceros por tipo (cliente o proveedor)
const getTercerosTipo = async (req, res) => {
    try {
        const { tipo } = req.params;
        
        let terceros;
        if (tipo === "cliente") {
            terceros = await tercerosModel.find({ tipo: 1 });
        } else if (tipo === "proveedor") {
            terceros = await tercerosModel.find({ tipo: 2 });
        }

        res.json({ terceros });
    } catch (error) {
        res.status(400).json({ error: "Parece que hubo un error al realizar la búsqueda" });
    }
};

export {
    postTerceros,
    putTerceros,
    getTerceros,
    getTercero,
    getActivosinactivos,
    putActivarInactivar,
    getTercerosTipo,
};
