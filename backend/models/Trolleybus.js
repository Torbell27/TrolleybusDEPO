import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Trolleybus = sequelize.define('Trolleybus', {
  trolleybus_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true
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
    allowNull: true
  },
  crew_id: {
    type: DataTypes.UUID,
    allowNull: true
  }
}, {
  tableName: 'trolleybus',
  schema: 'public',
  timestamps: false
});

export default Trolleybus;