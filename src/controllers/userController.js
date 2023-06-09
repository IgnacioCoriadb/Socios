const {User,StateUser} = require('../../database');

//?---------------------------------ALLUser---------------------------------------------------
const getAllUser=async (req, res)=>{
    try{
        const Users = await StateUser.findAll({
            include:[
                {
                  model: User,
                  attributes: ['name','lastName', 'birthdate','email']
                },
              ],
              attributes: ['membershipNumber','status','month','year','lastPayment'],

        });
        res.json(Users);
    }catch(error){
        const errorMessage = '"An error occurred while connecting to the database." ' + error.message;
        res.status(500).json({ error: errorMessage });
    }
}

//?--------------------------------getUserId---------------------------------------------------------  
const getUserId = async (req, res)=>{
    const {idUser} = req.params;
    try{
        const user = await User.findByPk(idUser)
        res.json(user)
    }catch(error){
        const errorMessage = "No exist member with id number " + idUser;
        res.status(500).json({ error: errorMessage });
    }
}

//?-------------------------------CreateSocio----------------------------------------------------------- 
const postUser =async (req, res)=>{
    const {name,lastName, birthdate,email,membershipNumber,status, month,year} = req.body;
    try{
         //CREAR UN USESTATE
         console.log(req.body)
       const stateUser=  await StateUser.create({
            membershipNumber: membershipNumber,
            status: status,
            month: month,
            year: year
        })

        await User.create({
            name: name,
            lastName: lastName,
            birthdate: birthdate,
            email: email,
            StateUserId: stateUser.id
        })

       



        res.json("User created successfully");
    }catch(error){
        const errorMessage = "An error occurred while connecting to the database." + error.message;
        res.status(500).json({error: errorMessage});
    }
}

//?---------------------------------UpdateSocio-----------------------------------------------------------
const updateUser = async (req, res) => {
    const {name,lastName, birthdate,status, lastpayment,membershipNumber} = req.body;
    const {idUser} = req.params;
    try{
        User.update(
            {
                name: name,
                lastName: lastName,
                birthdate: birthdate,
                status: status,
                lastpayment: lastpayment,
                membershipNumber: membershipNumber
            }, {
            where: {
                id: idUser
            }
        })

        res.json("Socio updated successfully");
    }catch(error){
        const errorMessage = "An error occurred while updating" + error.message;
        res.status(500).json({error: errorMessage});
    }
  
}



//?obtener socios con cuotas al dia (son los que estan en status true)
//?obtener socio por nombre, apellido o numero de socio (query)
//?obtener los pagos del mes actual o de un determinado mes 
//?buscar por edad, sexo, si hace o no disiplina en el club (campos a agregar en la bd )

module.exports ={getAllUser,getUserId,postUser,updateUser}