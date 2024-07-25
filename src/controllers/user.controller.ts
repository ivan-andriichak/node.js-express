import { NextFunction, Request, Response } from "express";

import { IUser } from "../interfaces/user.inerface";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userService.getList();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримуємо дані нового користувача з запиту
      const dto = req.body as IUser;
      // Викликаємо метод create з сервісу користувачів
      const result = await userService.create(dto);
      // Відправляємо результат клієнту з кодом статусу 201 (створено)
      res.status(201).json(result);
    } catch (e) {
      // Передаємо помилку в обробник помилок
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const result = await userService.getById(userId);
      res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async updateById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      const dto = req.body as IUser;
      const result = await userService.updateById(userId, dto);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.userId;
      await userService.deleteById(userId);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();
