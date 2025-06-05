import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import Route from "./Route.js";
import Crew from "./Crew.js";

const Trolleybus = sequelize.define(
  "Trolleybus",
  {
    trolleybus_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(),
      allowNull: true,
    },
    route_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    crew_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    tableName: "trolleybus",
    schema: "public",
    timestamps: false,
  }
);

Trolleybus.belongsTo(Route, { foreignKey: "route_id" });
Trolleybus.belongsTo(Crew, { foreignKey: "crew_id" });
Crew.hasOne(Trolleybus, { foreignKey: "crew_id" });

export default Trolleybus;
