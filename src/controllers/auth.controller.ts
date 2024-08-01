import { NextFunction, Request, Response } from "express";

import { ITokenPayload } from "../interfaces/token.inerface";
import { IUser } from "../interfaces/user.inerface";
import { authService } from "../services/auth.service";

class AuthController {
  // Метод signUp для реєстрації нового користувача
  public async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання даних з тіла запиту і приведення їх до типу IUser
      const dto = req.body as IUser;

      // Виклик методу signUp з authService для реєстрації користувача
      const result = await authService.signUp(dto);
      // Відправлення відповіді з кодом 201 (створено) і результатом
      res.status(201).json(result);
    } catch (e) {
      // Обробка помилки і передача її до глобального обробника помилок
      next(e);
    }
  }

  // Метод signIn для входу користувача
  public async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання даних з тіла запиту
      const dto = req.body as any;

      const result = await authService.signIn(dto);
      res.status(201).json(result);
    } catch (e) {
      next(e);
    }
  }

  // Метод refresh для оновлення токенів автентифікації
  public async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання jwtPayload з локальних змінних відповіді
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      // Отримання oldTokensId з локальних змінних відповіді
      const oldTokensId = req.res.locals.oldTokensId as string;

      // Виклик методу refresh з authService для оновлення токенів
      const result = await authService.refresh(jwtPayload, oldTokensId);
      // Відправлення відповіді з кодом 201 (створено) і результатом
      res.status(201).json(result);
    } catch (e) {
      // Обробка помилки і передача її до глобального обробника помилок
      next(e);
    }
  }
}

export const authController = new AuthController();
