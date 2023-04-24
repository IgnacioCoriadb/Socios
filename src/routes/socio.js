const Router = require('express');
const socio = Router();
const {getAllSocio,getSocioId,postSocio,updateSocio} = require("../controllers/socioController");

socio.get("/", getAllSocio);
socio.get('/:idSocio', getSocioId)
socio.post("/", postSocio);
socio.put("/:idSocio",updateSocio)


module.exports = socio;