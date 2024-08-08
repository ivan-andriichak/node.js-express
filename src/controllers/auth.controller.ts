import { NextFunction, Request, Response } from "express";

import {
  IForgotResetPassword,
  IForgotSendEmail,
} from "../interfaces/action-token.inerface";
import { ITokenPayload } from "../interfaces/token.inerface";
import { ILogin, IUser } from "../interfaces/user.inerface";
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
      const dto = req.body as ILogin;

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

  // Метод для виходу з системи (лог-аут)
  public async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Отримання id токена з локальних змінних відповіді
      const tokenId = req.res.locals.tokenId as string;
      // Отримання jwtPayload з локальних змінних відповіді
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;

      // Виклик методу logout з authService для видалення токена
      await authService.logout(jwtPayload, tokenId);
      // Відправлення відповіді з кодом 204 (немає вмісту)
      res.sendStatus(204);
    } catch (e) {
      // Обробка помилки і передача її до глобального обробника помилок
      next(e);
    }
  }

  public async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;

      await authService.logoutAll(jwtPayload);
      res.sendStatus(204).json(jwtPayload);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body as IForgotSendEmail;
      await authService.forgotPassword(dto);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async forgotPasswordSet(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body as IForgotResetPassword;
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;

      await authService.forgotPasswordSet(dto, jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }

  public async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await authService.verify(jwtPayload);
      res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}

export const authController = new AuthController();
