import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import MaintenanceCrew from "./MaintenanceCrew.js";
import Trolleybus from "./Trolleybus.js";

const MaintenanceRecord = sequelize.define(
  "MaintenanceRecord",
  {
    m_record_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    planned: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    m_crew_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    trolleybus_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN(),
      allowNull: false,
    },
  },
  {
    tableName: "maintenance_record",
    schema: "public",
    timestamps: false,
  }
);

MaintenanceRecord.belongsTo(MaintenanceCrew, { foreignKey: "m_crew_id" });
MaintenanceRecord.belongsTo(Trolleybus, { foreignKey: "trolleybus_id" });

export default MaintenanceRecord;
