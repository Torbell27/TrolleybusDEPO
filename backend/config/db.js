import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(
  process.env.POSTGRE_DATABASE,
  process.env.POSTGRE_USER,
  process.env.POSTGRE_PASSWORD,
  {
    host: process.env.POSTGRE_ADDRESS,
    port: process.env.POSTGRE_PORT,
    dialect: "postgres",
    logging: false,
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    //   }
    // }
  }
);

export default sequelize;
