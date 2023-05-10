const Router = require('express');
const payments = Router();
const {buttonPayment, response,subscription} = require('../controllers/payments');


payments.post("/",buttonPayment);
payments.post("/response", response);
payments.post("/subscription", subscription);


module.exports = payments;