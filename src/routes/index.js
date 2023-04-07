const Router = require("express");
const socio = require('./socio');
const router = Router();

router.use("/socios", socio);

module.exports = router;