import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Crew from "./Crew.js";

const Conductor = sequelize.define(
  "Conductor",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    crew_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "conductor",
    schema: "public",
    timestamps: false,
  }
);

Conductor.belongsTo(User, { foreignKey: "user_id" });
Conductor.belongsTo(Crew, { foreignKey: "crew_id" });
//User.hasMany(Conductor, { foreignKey: 'user_id' });

export default Conductor;
