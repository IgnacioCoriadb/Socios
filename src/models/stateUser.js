const {DataTypes}  = require('sequelize');

module.exports = (sequelize) =>{
    sequelize.define('StateUser',{
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        membershipNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status:{
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        month:{
            type: DataTypes.INTEGER,
        },
        year:{
            type: DataTypes.INTEGER
        },
        lastPayment:{
            type: DataTypes.DATE
        }
    })
}


