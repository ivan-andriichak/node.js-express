import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.inerface";
import { userService } from "../services/user.service";

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
      // Отримуємо дані нового користувача з запиту
      const dto = req.body as any;
      // Викликаємо метод create з сервісу користувачів
      const result = await userService.create(dto);
      // Відправляємо результат клієнту з кодом статусу 201 (створено)
      res.status(201).json(result);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }

  // Метод для отримання користувача за ID
  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримуємо ID користувача з параметрів запиту
      const userId = Number(req.params.userId);
      // Викликаємо метод getById з сервісу користувачів
      const result = await userService.getById(userId);
      // Відправляємо результат клієнту з кодом статусу 200 (успішно)
      res.status(200).json(result);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }

  // Метод для оновлення користувача за ID
  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримуємо ID користувача з параметрів запиту
      const userId = Number(req.params.userId);
      // Отримуємо дані для оновлення з запиту
      const dto = req.body as IUser;
      // Викликаємо метод updateById з сервісу користувачів
      const result = await userService.updateById(userId, dto);
      // Відправляємо результат клієнту з кодом статусу 201 (створено)
      res.status(201).json(result);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }

  // Метод для видалення користувача за ID
  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримуємо ID користувача з параметрів запиту
      const userId = Number(req.params.userId);
      // Викликаємо метод deleteById з сервісу користувачів
      await userService.deleteById(userId);
      // Відправляємо відповідь з кодом статусу 204 (немає вмісту)
      res.sendStatus(204);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }
}

export const userController = new UserController();
