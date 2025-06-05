import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Crew = sequelize.define(
  "Crew",
  {
    crew_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    tableName: "crew",
    schema: "public",
    timestamps: false,
  }
);

export default Crew;
