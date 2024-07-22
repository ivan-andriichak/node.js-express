// Імпортуємо необхідні модулі з бібліотеки express
import express, { NextFunction, Request, Response } from "express";

// Імпортуємо клас ApiError для обробки помилок
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
    // Відправляємо відповідь з кодом статусу помилки та повідомленням про помилку
    res.status(err.status || 500).json(err.message);
  },
);

// Обробка неперехоплених винятків
process.on("uncaughtException", (e) => {
  // Логування помилки
  console.error("uncaughtException", e.message, e.stack);
  // Завершення процесу з кодом 1 (помилка)
  process.exit(1);
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
