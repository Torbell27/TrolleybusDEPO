import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const MaintenanceCrew = sequelize.define(
  "MaintenanceCrew",
  {
    m_crew_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
  },
  {
    tableName: "maintenance_crew",
    schema: "public",
    timestamps: false,
  }
);

export default MaintenanceCrew;
