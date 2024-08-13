import { Router } from "express";

import { avatarConfig } from "../constants/image.constant";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { UserValidator } from "../validator/user.validator";

// Створюємо новий екземпляр роутера
const router = Router();

// Визначення маршруту для отримання списку користувачів
router.get("/", userController.getList);

// Визначення маршруту для отримання інформації про поточного користувача
router.get("/:me", authMiddleware.checkAccessToken, userController.getMe);

// Визначення маршруту для оновлення інформації про поточного користувача
router.put(
  "/:me",
  authMiddleware.checkAccessToken, // Перевірка наявності і дійсності токена доступу
  commonMiddleware.isBodyValid(UserValidator.updateUser), // Валідація тіла запиту на відповідність схемі updateUser
  userController.updateMe, // Виклик контролера для оновлення інформації
);

// Визначення маршруту для видалення поточного користувача
router.delete("/:me", authMiddleware.checkAccessToken, userController.deleteMe);

router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isFileValid("avatar", avatarConfig),
  userController.uploadAvatar,
);

router.delete(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  userController.deleteAvatar,
);

// Визначення маршруту для отримання інформації про користувача за ID
router.get(
  "/:userId",
  commonMiddleware.isIdValid("userId"), // Перевірка валідності ID користувача
  userController.getById, // Виклик контролера для отримання інформації про користувача
);

export const userRouter = router;
