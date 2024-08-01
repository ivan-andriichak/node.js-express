import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.inerface";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      // Виклик сервісу для отримання списку користувачів
      const result = await userService.getList();
      // Відправлення результату у форматі JSON
      res.json(result);
    } catch (e) {
      // Передача помилки до глобального обробника помилок
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання ID користувача з параметрів запиту
      const userId = req.params.userId;
      // Виклик сервісу для отримання даних про користувача за ID
      const result = await userService.getById(userId);
      // Відправлення результату з HTTP статусом 200 (ОК) у форматі JSON
      res.status(200).json(result);
    } catch (e) {
      // Передача помилки до глобального обробника помилок
      next(e);
    }
  }

  // Метод для отримання інформації про поточного користувача
  public async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання ID поточного користувача з даних JWT, збережених у локальних змінних
      const userId = req.res.locals.jwtPayload.userId as string;
      // Виклик сервісу для отримання даних про поточного користувача
      const result = await userService.getMe(userId);
      // Відправлення результату з HTTP статусом 200 (ОК) у форматі JSON
      res.status(200).json(result);
    } catch (e) {
      // Передача помилки до глобального обробника помилок
      next(e);
    }
  }

  // Метод для оновлення даних поточного користувача
  public async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання ID поточного користувача з даних JWT, збережених у локальних змінних
      const userId = req.res.locals.jwtPayload.userId as string;
      // Отримання даних для оновлення з тіла запиту
      const dto = req.body as IUser;
      // Виклик сервісу для оновлення даних користувача
      const result = await userService.updateMe(userId, dto);
      // Відправлення результату у форматі JSON
      res.json(result);
    } catch (e) {
      // Передача помилки до глобального обробника помилок
      next(e);
    }
  }

  // Метод для видалення поточного користувача
  public async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання ID поточного користувача з даних JWT, збережених у локальних змінних
      const userId = req.res.locals.jwtPayload.userId as string;
      // Виклик сервісу для видалення користувача
      await userService.deleteMe(userId);
      // Відправлення статусу 204 (Немає контенту) як підтвердження успішного видалення
      res.sendStatus(204);
    } catch (e) {
      // Передача помилки до глобального обробника помилок
      next(e);
    }
  }
}

// Експортуємо екземпляр контролера
export const userController = new UserController();
