const Router = require("express");
const user = require('./User');
const payments = require("./payments")
const router = Router();

router.use("/user", user);
router.use("/payments", payments);

module.exports = router;