const express = require('express');
const router = require('./src/routes/index');
const server = express();
const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: process.env.KEY_MERCADOPAGO
})

server.use(express.json());
server.use("/",router);


module.exports =server;