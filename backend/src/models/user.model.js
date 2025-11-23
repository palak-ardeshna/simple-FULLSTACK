// ====================================
// USER MODEL - Sequelize User Model (Only Fields)
// ====================================

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

// ====================================
// USER MODEL DEFINITION
// ====================================

const User = sequelize.define(
  "users",
  {
    // ID - Primary Key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    // NAME - User નું નામ
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    // EMAIL - User નું email (Unique)
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    // PASSWORD - User નો password
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // ROLE - User નો role (admin અથવા user)
    role: {
      type: DataTypes.ENUM("admin", "user"),
      defaultValue: "user",
      allowNull: false,
      comment: "User role - admin has full access, user has limited access",
    },

    // LAST LOGIN - છેલ્લે login કયારે કર્યું
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Timestamps - createdAt અને updatedAt automatic
    timestamps: true,

    // Table name plural ન બનાવે
    freezeTableName: true,
  },
);

export default User;
