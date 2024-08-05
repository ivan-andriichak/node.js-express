import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { UserValidator } from "../validator/user.validator";

// Створюємо новий маршрутизатор Express
const router = Router();

// Маршрут для реєстрації нового користувача
router.post(
  "/sign-up",
  // Перевірка валідності тіла запиту за допомогою схеми валідації UserValidator.createUser
  commonMiddleware.isBodyValid(UserValidator.createUser),
  // Виклик контролера для обробки реєстрації
  authController.signUp,
);

// Маршрут для входу користувача
router.post(
  "/sign-in",
  // Перевірка валідності тіла запиту за допомогою схеми валідації UserValidator.login
  commonMiddleware.isBodyValid(UserValidator.login),
  // Виклик контролера для обробки входу
  authController.signIn,
);

// Маршрут для оновлення токенів
router.post(
  "/refresh",
  // Перевірка валідності refresh токена
  authMiddleware.checkRefreshToken,
  // Виклик контролера для обробки оновлення токенів
  authController.refresh,
);

// Маршрут для виходу з системи (лог-аут)
router.post(
  "/logout",
  // Перевірка валідності access токена
  authMiddleware.checkAccessToken,
  // Виклик контролера для обробки лог-ауту
  authController.logout,
);

// Маршрут для виходу з усіх пристроїв (лог-аут з усіх сесій)
router.post(
  "/logout-all",
  // Перевірка валідності access токена
  authMiddleware.checkAccessToken,
  // Виклик контролера для обробки лог-ауту з усіх сесій
  authController.logoutAll,
);

// Експортуємо маршрутизатор для використання в інших частинах програми
export const authRouter = router;
