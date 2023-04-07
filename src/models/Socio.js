const {DataTypes}  = require('sequelize');

module.exports = (sequelize) =>{

    sequelize.define('Socio',{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        name:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },    
        birthdate:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        status:{ //estado de la cuota, true al dia folse adeuda
            type: DataTypes.BOOLEAN,
        },
        lastPayment:{ //ultimo pago
            type: DataTypes.STRING,
        },
        membershipNumber:{ //numero de socio
            type: DataTypes.STRING,
            allowNull: false,
        }


       

 
    })
}