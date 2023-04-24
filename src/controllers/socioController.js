const {Socio} = require('../../database');

//?---------------------------------ALLSOCIO---------------------------------------------------
const getAllSocio=async (req, res)=>{
    try{
        const socios = await Socio.findAll();
        res.json(socios);
    }catch(error){
        const errorMessage = '"An error occurred while connecting to the database." ' + error.message;
        res.status(500).json({ error: errorMessage });
    }
}

//?--------------------------------getSocioId---------------------------------------------------------  
const getSocioId = async (req, res)=>{
    const {idSocio} = req.params;
    try{
        const socio = await Socio.findByPk(idSocio)
        res.json(socio)
    }catch(error){
        const errorMessage = "No exist member with id number " + idSocio;
        res.status(500).json({ error: errorMessage });
    }
}

//?-------------------------------CreateSocio----------------------------------------------------------- 
const postSocio =async (req, res)=>{
    const {name,lastName, birthdate,status, lastpayment,membershipNumber} = req.body;
    try{
        await Socio.create({
            name: name,
            lastName: lastName,
            birthdate: birthdate,
            status: status,
            lastpayment: lastpayment,
            membershipNumber: membershipNumber
        })

        res.json("User created successfully");
    }catch(error){
        const errorMessage = "An error occurred while connecting to the database." + error.message;
        res.status(500).json({error: errorMessage});
    }
}

//?---------------------------------UpdateSocio-----------------------------------------------------------
const updateSocio = async (req, res) => {
    const {name,lastName, birthdate,status, lastpayment,membershipNumber} = req.body;
    const {idSocio} = req.params;
    try{
        Socio.update(
            {
                name: name,
                lastName: lastName,
                birthdate: birthdate,
                status: status,
                lastpayment: lastpayment,
                membershipNumber: membershipNumber
            }, {
            where: {
                id: idSocio
            }
        })

        res.json("Socio updated successfully");
    }catch(error){
        const errorMessage = "An error occurred while updating" + error.message;
        res.status(500).json({error: errorMessage});
    }
  
}




module.exports ={getAllSocio,getSocioId,postSocio,updateSocio}