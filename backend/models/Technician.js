import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import MaintenanceCrew from "./MaintenanceCrew.js";

const Technician = sequelize.define(
  "Technician",
  {
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    m_crew_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "technician",
    schema: "public",
    timestamps: false,
  }
);

Technician.belongsTo(MaintenanceCrew, { foreignKey: "m_crew_id" });
MaintenanceCrew.hasMany(Technician, { foreignKey: "m_crew_id" });

export default Technician;
