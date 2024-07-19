// Імпортуємо необхідні модулі з пакету express
import express, { NextFunction, Request, Response } from "express";

// Імпортуємо наші власні модулі для роботи з помилками та файлами
import { ApiError } from "./errors/api-errors";
import { fsService } from "./fs.service";
import { userRouter } from "./routers/user.router";

// Створюємо додаток express
const app = express();

// Додаємо middleware для роботи з JSON і urlencoded даними
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Додаємо маршрути для роботи з користувачами
app.use("/users", userRouter);

// Створюємо маршрут для отримання користувача за ID
app.get("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId); // Отримуємо ID користувача з параметрів запиту

    const users = await fsService.read(); // Читаємо список користувачів з файлу
    const user = users.find((user) => user.id === userId); // Знаходимо користувача за ID
    if (!user) {
      return res.status(404).json("User not found"); // Якщо користувач не знайдений, відправляємо 404 статус
    }
    res.json(user); // Відправляємо користувача у відповіді
  } catch (e) {
    res.status(500).json(e.message); // У випадку помилки відправляємо 500 статус
  }
});

// Створюємо маршрут для оновлення даних користувача за ID
app.put("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId); // Отримуємо ID користувача з параметрів запиту
    const { name, email, password } = req.body; // Отримуємо дані з тіла запиту

    const users = await fsService.read(); // Читаємо список користувачів з файлу
    const user = users.find((user) => user.id === userId); // Знаходимо користувача за ID
    if (!user) {
      return res.status(404).json("User not found"); // Якщо користувач не знайдений, відправляємо 404 статус
    }

    // Оновлюємо дані користувача
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    await fsService.write(users); // Записуємо оновлений список користувачів у файл

    res.status(201).json(user); // Відправляємо оновленого користувача у відповіді
  } catch (e) {
    res.status(500).json(e.message); // У випадку помилки відправляємо 500 статус
  }
});

// Створюємо маршрут для видалення користувача за ID
app.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId); // Отримуємо ID користувача з параметрів запиту

    const users = await fsService.read(); // Читаємо список користувачів з файлу
    const index = users.findIndex((user) => user.id === userId); // Знаходимо індекс користувача за ID
    if (index === -1) {
      return res.status(404).json("User not found"); // Якщо користувач не знайдений, відправляємо 404 статус
    }
    users.splice(index, 1); // Видаляємо користувача з масиву
    await fsService.write(users); // Записуємо оновлений список користувачів у файл

    res.sendStatus(204); // Відправляємо статус 204 (No Content) у відповіді
  } catch (e) {
    res.status(500).json(e.message); // У випадку помилки відправляємо 500 статус
  }
});

// Middleware для обробки всіх інших помилок
app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json(err.message); // Відправляємо статус помилки та повідомлення
  },
);

// Обробка неконтрольованих винятків
process.on("uncaughtException", (e) => {
  console.error("uncaughtException", e.message, e.stack); // Логування помилки
  process.exit(1); // Завершення процесу з кодом 1
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
