import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Users = sequelize.define("Users", {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING(32),
    allowNull: false,
  },
  patronymic: {
    type: DataTypes.STRING(32),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  department_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  organization_id: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  encrypt_password: {
    type: DataTypes.STRING(64),
    allowNull: false,
  },
}, {
  tableName: 'users',
  timestamps: false,
}
);

export default Users;