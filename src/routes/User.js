const Router = require('express');
const socio = Router();
const {getAllUser,getUserId,postUser,updateUser} = require("../controllers/userController");

socio.get("/", getAllUser);
socio.get('/:idUser', getUserId)
socio.post("/", postUser);
socio.put("/:idUser",updateUser)


module.exports = socio;