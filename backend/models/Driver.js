import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Crew from "./Crew.js";

const Driver = sequelize.define(
  "Driver",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    license_number: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    crew_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "driver",
    schema: "public",
    timestamps: false,
  }
);

Driver.belongsTo(User, { foreignKey: "user_id" });
Driver.belongsTo(Crew, { foreignKey: "crew_id" });
Crew.hasOne(Driver, { foreignKey: "crew_id" });

export default Driver;
