const axios = require('axios');
const mercadopago = require('mercadopago');
const {User,StateUser} = require('../../database');
const moment = require('moment-timezone');


const User1 = {
  id: 'bc543474-b237-4acb-a48a-b7b94af68148'
}

//?1)generar un boton de pago
const buttonPayment = (req, res) => {
    let preference = {
      metadata: {idUser:req.body.id},
        items: [
            {
                title: 'Pago de Cuota',
                unit_price: 100,
                quantity: 1,
            }
        ],

        // notification_url: "https://b96d-190-18-180-176.ngrok-free.app/response"
    }
    mercadopago.preferences
  .create(preference)
  .then(function (response) {
    //!AHORA ESTOY PASANDO LA URL, CUANDO TENGA EL FRONT PASAR ID
    res.status(response.status).json({
      status: response.body.status,
      status_detail: response.body.status_detail,
      id: response.body.id,
      link: response.body.init_point

    });
  })
  .catch(function (error) {
    res.status(response.status).send(error);
  });
}

const response =async (req,res)=>{
  const {type} = req.body;
  if(type === 'payment'){
    responsePayment(req, res);
  }
  if(type === 'subscription_preapproval'){
    responesSubscription(req, res);
  }
}


const subscription =async (req,res)=>{

//   const currentDate = moment().tz('America/Argentina/Buenos_Aires');
// const tomorrowDate = currentDate.clone().add(1, 'day');
// const startDate = currentDate.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
// console.log('Fecha de inicio formateada:', startDate);


  const subscriptionData = {
    reason: "Colaboración mensual",
    payer_email: 'test_user_1302851605@testuser.com',
    external_reference:User1.id,
    auto_recurring: {
      frequency: 1,
    frequency_type: 'days',
    transaction_amount: 1030,
    currency_id: "ARS",
    },
    back_url: 'https://www.tu-sitio.com/feedback',
    auto_return: "approved",

  };

    const result = await mercadopago.preapproval.create(subscriptionData);
    res.json({id:result.body.id, link: result.body.init_point})

}

const responsePayment = async(req, res)=>{
  const payment = await mercadopago.payment.findById(req.body.data.id);//id del pagador
  const merchanOrder = await mercadopago.merchant_orders.findById(payment.body.order.id); //pago
  const idUser =payment.body.metadata.id_user; //id de user pagador
  const paymentLastDateHs = merchanOrder.response.last_updated; //fecha mas hora
  const paymentDate = paymentLastDateHs.slice(0,10); //fecha sin hora

  merchanOrder.body.payments.forEach(async (payment) => {
    if(payment.status === 'approved' && payment.status_detail ==='accredited'){
      console.log('Pago exitoso');
      updateDbSocios(paymentDate,idUser)

    }else{
        console.log('No se pudo realizar el pago ')
    }
  });

  res.status(200).json("OK")
}

const responesSubscription = async (req, res) => {
  const payment= await  mercadopago.preapproval.findById(req.body.data.id, response=> response);
  const idUser = payment.body.external_reference;
 
    if(payment.response.status === 'authorized'){
      const paymentLastDateHs = payment.response.last_modified; //fecha y hora del pago
      const paymentDate = paymentLastDateHs.slice(0,10); //fecha sin hora
      updateDbSocios(paymentDate,idUser)
    }else{
      console.log(payment.response.status)
    }
    res.status(200).json("OK")
}

const updateDbSocios =async (paymentDate,idUser)=>{
  const paymentLastMonth = await StateUser.findByPk(idUser,{ attributes: ['month', 'year']});
  //update db lastpayment
  await StateUser.update(
    {
      lastPayment: paymentDate
    },
    {
      where: {
        id: idUser
      }
    }
  );
  //le sumo uno a el ultimo mes pago si son mas de doce meses vuelve a uno y cambia el año
  if(paymentLastMonth.month < 12){
    const newMonth  =paymentLastMonth.month +1;
    await StateUser.update(
      {
        month:newMonth
      },
      {
        where: {
          id: idUser
        }
      }
    )
  }else{
    const newYear = paymentLastMonth.year +1;
    await StateUser.update(
      {
        month: 1,
        year: newYear
      },
      {
        where: {
          id: idUser
        }
      }
    )
  }
  //si el ultimo mes pago es el mes actual cambiar status a true
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // suma uno porque toma de 0 a 11
  const currentYear = currentDate.getFullYear();
  //vuelvo a consultar día y fecha despues de actualizar
  const paymentLastMonthUpdated = await StateUser.findByPk(idUser,{ attributes: ['month', 'year']});
  //si coinicide el socio está al día
  if(paymentLastMonthUpdated.month >=  currentMonth && paymentLastMonthUpdated.year >= currentYear){
    console.log(`Cuota al día, tiene pago hasta el mes ${paymentLastMonthUpdated.month} del ${paymentLastMonthUpdated.year}`)
    await StateUser.update(
      {
        status: true
      },
      {
        where:{
          id: idUser
        }
      }
    )
  }else{
    await StateUser.update(
      {
        status: false
      },
      {
        where:{
          id: idUser
        }
      }
    )
    console.log(`El ultimo mes pago es ${paymentLastMonth.month}/${paymentLastMonth.year}`)

  }
}

module.exports ={
    buttonPayment,
    response,
    subscription
}