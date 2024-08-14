import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { IUser, IUserListQuery } from "../interfaces/user.inerface";
import { UserPresenter } from "../presenters/user.presenter";
import { userService } from "../services/user.service";

class UserController {
  public async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as IUserListQuery;
      // Виклик сервісу для отримання списку користувачів
      console.log(query);
      const result = await userService.getList(query);
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
      const user = await userService.getById(userId);
      const result = UserPresenter.toResponse(user);
      res.json(result);
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
      const user = await userService.getMe(userId);
      const result = UserPresenter.toResponse(user);
      res.json(result);
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

  public async uploadAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const avatar = req.files?.avatar as UploadedFile;
      const userId = req.res.locals.jwtPayload.userId as string;
      const user = await userService.uploadAvatar(userId, avatar);
      const result = UserPresenter.toResponse(user);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.res.locals.jwtPayload.userId as string;
      const user = await userService.deleteAvatar(userId);
      const result = UserPresenter.toResponse(user);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }
}

// Експортуємо екземпляр контролера
export const userController = new UserController();
