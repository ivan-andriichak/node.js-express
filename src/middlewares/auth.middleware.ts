import { NextFunction, Request, Response } from "express";

import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-errors";
import { tokenRepository } from "../repositories/token.repository";
import { tokenService } from "../services/token.service";

class AuthMiddleware {
  /**
   * Middleware для перевірки доступного токена.
   * @param req Запит
   * @param res Відповідь
   * @param next Функція для передачі управління наступному middleware
   */
  public async checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // Отримання заголовка авторизації з запиту
      const header = req.headers.authorization;
      if (!header) {
        // Якщо заголовок відсутній, повертаємо помилку
        throw new ApiError("Token is not provided", 401);
      }

      // Витягання токена з заголовка
      const accessToken = header.split("Bearer ")[1];

      // Перевірка токена за допомогою сервісу токенів
      const payload = tokenService.checkToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      // Перевірка наявності токена у базі даних
      const pair = await tokenRepository.findByParams({ accessToken });
      if (!pair) {
        // Якщо токен не знайдено в базі даних, повертаємо помилку
        throw new ApiError("Token is not valid", 401);
      }

      // Зберігання декодованого корисного навантаження токена у локальних змінних відповіді
      req.res.locals.jwtPayload = payload;
      // Передача управління наступному middleware
      next();
    } catch (e) {
      // Обробка помилки і передача її до глобального обробника помилок
      next(e);
    }
  }

  /**
   * Middleware для перевірки токена оновлення.
   * @param req Запит
   * @param res Відповідь
   * @param next Функція для передачі управління наступному middleware
   */
  public async checkRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      // Отримання заголовка авторизації з запиту
      const header = req.headers.authorization;
      if (!header) {
        // Якщо заголовок відсутній, повертаємо помилку
        throw new ApiError("Token is not provided", 401);
      }

      // Витягання токена оновлення з заголовка
      const refreshToken = header.split("Bearer ")[1];

      // Перевірка токена оновлення за допомогою сервісу токенів
      const payload = tokenService.checkToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      // Перевірка наявності токена оновлення у базі даних
      const pair = await tokenRepository.findByParams({ refreshToken });
      if (!pair) {
        // Якщо токен не знайдено в базі даних, повертаємо помилку
        throw new ApiError("Token is not valid", 401);
      }

      // Зберігання декодованого корисного навантаження токена у локальних змінних відповіді
      req.res.locals.jwtPayload = payload;
      // Зберігання ідентифікатора старого токена для подальшого видалення
      req.res.locals.oldTokensId = pair._id;
      // Передача управління наступному middleware
      next();
    } catch (e) {
      // Обробка помилки і передача її до глобального обробника помилок
      next(e);
    }
  }
}

// Експортуємо екземпляр AuthMiddleware для використання в інших частинах програми
export const authMiddleware = new AuthMiddleware();
