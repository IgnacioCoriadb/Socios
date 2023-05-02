//?1)generar un boton de pago
//?2)generar un boton de suscripciones
//?3)actualizar bd con usuarios pagadores
//?     a)si es suscripcion actualizar la lastPayment con la fecha de pago 
//?     b) si paga por medio de boton fijarse cual es el ultimo mes pago y actualizar a el siguiente mes 

const axios = require('axios');
const mercadopago = require('mercadopago');
const {Socio} = require('../../database');


User1 = {
  id: '5c5a2d5c-6265-4a5d-ae4e-38c4c7d652da'
}

//?1)generar un boton de pago
const buttonPayment = (req, res) => {
    let preference = {
      metadata: {idUser:User1.id },
        items: [
            {
                title: 'Pago de Cuota',
                unit_price: 123,
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


//?Respuesta a el pago con boton:
    //?buscar en la bd la fecha del ultimo pago (lastPayment)
    //?cambiar la fecha a el siguiente mes, ejemplo: si pago abril cambiar a mayo 
    //?si el mes de last payment es el mes actual cambiar status a true, esto quiere decir que el socio esta al día 

const response =async (req,res)=>{

  const payment = await mercadopago.payment.findById(req.body.data.id);//id del pagador
  const merchanOrder = await mercadopago.merchant_orders.findById(payment.body.order.id); //pago 
  const idUser =payment.body.metadata.id_user; //id de user pagador
  const paymentLastDateHs = merchanOrder.response.last_updated; //fecha mas hora
  const paymentDate = paymentLastDateHs.slice(0,10); //fecha sin hora
  const paymentLastMonth = await Socio.findByPk(idUser,{ attributes: ['month', 'year']});

  merchanOrder.body.payments.forEach(async (payment) => {
    // console.log(payment)
    if(payment.status === 'approved' && payment.status_detail ==='accredited'){
      console.log('Pago exitoso');

      //update db lastpayment
      await Socio.update(
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
      await Socio.update(
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
      await Socio.update(
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
      const paymentLastMonthUpdated = await Socio.findByPk(idUser,{ attributes: ['month', 'year']});

      //si coinicide el socio está al día
      if(paymentLastMonthUpdated.month >=  currentMonth && paymentLastMonthUpdated.year >= currentYear){
        console.log('Cuota al día')
        await Socio.update(
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
        await Socio.update(
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
    }else{
        console.log('No se pudo realizar el pago ')
    }
  });

res.status(200).json("OK")
}


module.exports ={
    buttonPayment,
    response
}