import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Crew from "./Crew.js";

const Shift = sequelize.define(
  "Shift",
  {
    shift_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    first_shift: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    crew_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "shift",
    schema: "public",
    timestamps: false,
  }
);

Shift.belongsTo(Crew, { foreignKey: "crew_id" });

export default Shift;
