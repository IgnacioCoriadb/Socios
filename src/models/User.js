const {DataTypes}  = require('sequelize');

module.exports = (sequelize) =>{

    sequelize.define('User',{
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
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        email:{ //estado de la cuota, true al dia folse adeuda
            type: DataTypes.STRING,
        },
    })
}