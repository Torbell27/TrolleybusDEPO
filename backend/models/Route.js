import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Route = sequelize.define(
  "Route",
  {
    route_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
  },
  {
    tableName: "route",
    schema: "public",
    timestamps: false,
  }
);

export default Route;
