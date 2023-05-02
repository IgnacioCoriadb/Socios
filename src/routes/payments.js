const Router = require('express');
const payments = Router();
const {buttonPayment, response} = require('../controllers/payments');


payments.post("/",buttonPayment);
payments.post("/response", response);


module.exports = payments;