const Router = require('express');
const socio = Router();
const {getSocio} = require("../controllers/socioController");

socio.get("/", getSocio);


module.exports = socio;