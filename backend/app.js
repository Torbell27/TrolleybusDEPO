import express from "express";
import "jsonwebtoken";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";
import sequelize from "./config/db.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.SESSION_SECRET_KEY));
app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Внутренняя ошибка сервера", error: err.message });
});

app.use("/api", router);

sequelize
  .query("SELECT NOW()")
  .then(([res, _]) => {
    console.log("Connected to the database:", res);
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err);
  });

const address = process.env.SERVER_ADDRESS || "localhost";
const port = process.env.SERVER_PORT || 3000;

const server = app.listen(port, address, () => {
  console.log(
    `Server listening on ${server.address().address}:${server.address().port}`
  );
});

export default server;
