import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { configs } from "./configs/configs";
import { ApiError } from "./errors/api-errors";
import { userRouter } from "./routers/user.router";

// Створюємо додаток express
const app = express();

// Налаштовуємо парсер для обробки JSON-запитів
app.use(express.json());

// Налаштовуємо парсер для обробки URL-закодованих запитів
app.use(express.urlencoded({ extended: true }));

// Встановлюємо роутер для обробки запитів на '/users'
app.use("/users", userRouter);

// Обробник помилок для всіх маршрутів
app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json(err.message);
  },
);

// Обробка неперехоплених винятків
process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e.message, e.stack);
  process.exit(1);
});

app.listen(configs.APP_PORT, configs.APP_HOST, async () => {
  await mongoose.connect(configs.MONGO_URL, {});
  console.log(`Server is running on port ${configs.APP_PORT}`);
});
