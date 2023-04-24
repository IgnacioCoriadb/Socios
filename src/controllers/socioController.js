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

//?------------------------getSocioId---------------------------------------------------------  
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


module.exports ={getAllSocio,getSocioId}