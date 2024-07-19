import { NextFunction, Request, Response } from "express";

import { userService } from "../services/user.service";

// Створюємо клас UserController для обробки запитів
class UserController {
  // Метод для отримання списку користувачів
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      // Викликаємо метод getList з сервісу користувачів
      const result = await userService.getList();
      // Відправляємо результат клієнту
      res.json(result);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }

  // Метод для створення нового користувача
  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримуємо дані з тіла запиту
      const dto = req.body as any;
      // Викликаємо метод create з сервісу користувачів з даними користувача
      const result = await userService.create(dto);
      // Встановлюємо статус код 201 (створено) і відправляємо результат клієнту
      res.status(201).json(result);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }
}

export const userController = new UserController();
