import { Router } from "express";

import { userController } from "../controllers/user.controller";

const router = Router();

// Додаємо маршрут для отримання списку користувачів
router.get("/", userController.getList);

// Додаємо маршрут для створення нового користувача
router.post("/", userController.create);

export const userRouter = router;
