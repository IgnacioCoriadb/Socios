const Router = require("express");
const socio = require('./socio');
const payments = require("./payments")
const router = Router();

router.use("/socios", socio);
router.use("/payments", payments);

module.exports = router;