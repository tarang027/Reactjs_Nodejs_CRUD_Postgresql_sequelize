'use strict';
const { Model } = require('sequelize');
 
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  
  };
  User.init({
    _id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    UserName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    DateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    Hobbies: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    Role: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ProfilePic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'tblusers',
    timestamps: false,
  });
  return User;
};