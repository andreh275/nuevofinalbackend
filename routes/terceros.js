import Router from "router";
import { check } from "express-validator";
import helperTerceros from "../helpers/terceros.js";
import validarCampos from "../middlewares/validarCampos.js";
import { validarJWT } from "../middlewares/validarjwt.js";
import {
    postTerceros,
    putTerceros,
    getTerceros,
    getTercero,
    getActivosinactivos,
    putActivarInactivar,
    getTercerosTipo,
} from "../controllers/terceros.js";
const router = Router();

//registrar un tercero
router.post("/", [
    check("nombre", "El nombre es obligatorio").notEmpty(),
    check("identificacion", "La identificación es obligatoria y debe ser un número").isNumeric(),
    check("direccion", "La dirección es obligatoria").notEmpty(),
    check("telefono", "El teléfono es obligatorio y debe ser un número").isNumeric(),
    check("tipo", "El tipo es obligatorio y debe ser 1 (cliente) o 2 (proveedor)").isIn([1, 2]),
    check("estado", "El estado es obligatorio y debe ser 1 (activo) o 0 (inactivo)").isIn([0, 1]),
    validarCampos
  ], postTerceros);

//actualizar un tercero
router.put("/tercero/:id",[
    check("id","el id no es valido").isMongoId(),
    check("id","el id no existe en la base de datos").custom(helperTerceros.validarId),
    validarCampos
], putTerceros);

//traer todos los terceros
router.get("/terceros", getTerceros);

//traer tercero por id
router.get("/tercero/:id",[
    check("id","el id no es valido").isMongoId(),
    check("id","el id no existe en la base de datos").custom(helperTerceros.validarId),
    validarCampos
], getTercero);

//traer activos o inactivos
router.get("/terceros/:accion",[
    check("accion","debe digitar 'activos o inactivos'").isIn(["activos","inactivos"]),
    validarCampos
], getActivosinactivos);

//activar o inactivar un tercero
router.put("/:accion/:id",[
    check("accion","debe digitar activar o inactivar").isIn(["activar", "inactivar"]),
    check("id","el id no es valido").isMongoId(),
    check("id","el id no existe en la bd").custom(helperTerceros.validarId),
    validarCampos
], putActivarInactivar);



//de aqui para abajo son las peticiones especificas
router.get("/tipos/:tipo",[
    check("tipo","el tipo debe ser o cliente o proveedor").isIn(["cliente", "proveedor"]),
    validarCampos
], getTercerosTipo)


export default router;
