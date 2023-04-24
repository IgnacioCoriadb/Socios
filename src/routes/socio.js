const Router = require('express');
const socio = Router();
const {getAllSocio,getSocioId} = require("../controllers/socioController");

socio.get("/", getAllSocio);
socio.get('/:idSocio', getSocioId)


module.exports = socio;