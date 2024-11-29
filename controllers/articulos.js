import ArticulosModel from "../models/articulos.js";
import validator from "validator";

// Crear un nuevo artículo
const postArticulos = async (req, res) => {
    try {
        const { nombre, precio, stock, imagen, categoria, estado } = req.body;

        // Validaciones
        if (!nombre || precio == null || stock == null || !imagen || !categoria) {
            return res.status(400).json({
                error: 'Los campos "nombre", "precio", "stock", "imagen" y "categoria" son obligatorios.',
            });
        }

        if (!validator.isURL(imagen)) {
            return res.status(400).json({ error: 'El campo "imagen" debe contener una URL válida.' });
        }

        const articulo = new ArticulosModel({
            nombre,
            precio,
            stock,
            imagen,
            categoria,
            estado,
        });

        await articulo.save();
        res.status(201).json({ articulo });
    } catch (error) {
        console.error("Error al registrar el artículo:", error);
        res.status(500).json({ error: "No se pudo registrar el artículo." });
    }
};

// Actualizar un artículo existente
const putArticulos = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, precio, stock, imagen, categoria, estado } = req.body;

        // Validaciones
        if (imagen && !validator.isURL(imagen)) {
            return res.status(400).json({ error: 'El campo "imagen" debe contener una URL válida.' });
        }

        const articulo = await ArticulosModel.findByIdAndUpdate(
            id,
            { nombre, precio, stock, imagen, categoria, estado },
            { new: true }
        );

        if (!articulo) {
            return res.status(404).json({ error: "Artículo no encontrado." });
        }

        res.json({ articulo });
    } catch (error) {
        console.error("Error al modificar el artículo:", error);
        res.status(500).json({ error: "No se pudo modificar el artículo." });
    }
};

// Obtener todos los artículos
const getArticulos = async (req, res) => {
    try {
        const articulos = await ArticulosModel.find();
        res.json({ articulos });
    } catch (error) {
        console.error("Error al obtener los artículos:", error);
        res.status(500).json({ error: "Hubo un fallo al traer los artículos." });
    }
};

// Obtener un artículo por ID
const getArticulo = async (req, res) => {
    try {
        const { id } = req.params;
        const articulo = await ArticulosModel.findById(id);

        if (!articulo) {
            return res.status(404).json({ error: "Artículo no encontrado." });
        }

        res.json({ articulo });
    } catch (error) {
        console.error("Error al obtener el artículo:", error);
        res.status(500).json({ error: "Error al traer el artículo." });
    }
};

// Obtener artículos activos
const getArticulosActivos = async (req, res) => {
    try {
        const articulos = await ArticulosModel.find({ estado: 1 });
        res.json({ articulos });
    } catch (error) {
        console.error("Error al listar artículos activos:", error);
        res.status(500).json({ error: "Error al listar los artículos activos." });
    }
};

// Obtener artículos inactivos
const getArticulosInactivos = async (req, res) => {
    try {
        const articulos = await ArticulosModel.find({ estado: 0 });
        res.json({ articulos });
    } catch (error) {
        console.error("Error al listar artículos inactivos:", error);
        res.status(500).json({ error: "Error al listar los artículos inactivos." });
    }
};

// Activar un artículo
const putActivar = async (req, res) => {
    try {
        const { id } = req.params;
        const articulo = await ArticulosModel.findByIdAndUpdate(id, { estado: 1 }, { new: true });

        if (!articulo) {
            return res.status(404).json({ error: "Artículo no encontrado." });
        }

        res.json({ articulo });
    } catch (error) {
        console.error("Error al activar el artículo:", error);
        res.status(500).json({ error: "Error al activar el artículo." });
    }
};

// Inactivar un artículo
const putInactivar = async (req, res) => {
    try {
        const { id } = req.params;
        const articulo = await ArticulosModel.findByIdAndUpdate(id, { estado: 0 }, { new: true });

        if (!articulo) {
            return res.status(404).json({ error: "Artículo no encontrado." });
        }

        res.json({ articulo });
    } catch (error) {
        console.error("Error al inactivar el artículo:", error);
        res.status(500).json({ error: "Error al inactivar el artículo." });
    }
};

// Obtener artículos por categoría
const getCategorias = async (req, res) => {
    try {
        const { categoria } = req.params;
        const articulos = await ArticulosModel.find({ categoria });

        if (articulos.length === 0) {
            return res.status(404).json({ error: "No se encontraron artículos en esta categoría." });
        }

        res.json({ articulos });
    } catch (error) {
        console.error("Error al listar artículos por categoría:", error);
        res.status(500).json({ error: "Error al completar la operación." });
    }
};

// Obtener artículos con stock menor a un valor
const getArticuloStock = async (req, res) => {
    try {
        const { cantidad } = req.params;
        const articulos = await ArticulosModel.find({ stock: { $lt: cantidad } });

        if (articulos.length === 0) {
            return res.status(404).json({ error: "No se encontraron artículos con stock menor al indicado." });
        }

        res.json({ articulos });
    } catch (error) {
        console.error("Error al listar artículos con bajo stock:", error);
        res.status(500).json({ error: "Error al realizar la operación." });
    }
};

export {
    postArticulos,
    putArticulos,
    getArticulos,
    getArticulo,
    getArticulosActivos,
    getArticulosInactivos,
    putActivar,
    putInactivar,
    getCategorias,
    getArticuloStock,
};