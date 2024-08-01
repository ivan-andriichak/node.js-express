import * as jsonwebtoken from "jsonwebtoken";

import { configs } from "../configs/configs";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-errors";
import { ITokenPair, ITokenPayload } from "../interfaces/token.inerface";

class TokenService {
  // Метод для генерації пари токенів (доступу і оновлення)
  public async generatePair(payload: ITokenPayload): Promise<ITokenPair> {
    // Створюємо токен доступу (access token)
    const accessToken = jsonwebtoken.sign(payload, configs.JWT_ACCESS_SECRET, {
      expiresIn: configs.JWT_ACCESS_EXPIRES_IN, // Визначаємо час життя токена доступу
    });

    // Створюємо токен оновлення (refresh token)
    const refreshToken = jsonwebtoken.sign(
      payload,
      configs.JWT_REFRESH_SECRET,
      {
        expiresIn: configs.JWT_REFRESH_EXPIRES_IN, // Визначаємо час життя токена оновлення
      },
    );

    // Повертаємо об'єкт з двома токенами
    return {
      accessToken,
      refreshToken,
    };
  }

  // Метод для перевірки токена (доступу або оновлення)
  public checkToken(token: string, type: TokenTypeEnum): ITokenPayload {
    try {
      let secret: string;

      // Вибираємо секретний ключ залежно від типу токена
      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = configs.JWT_ACCESS_SECRET; // Секретний ключ для токена доступу
          break;
        case TokenTypeEnum.REFRESH:
          secret = configs.JWT_REFRESH_SECRET; // Секретний ключ для токена оновлення
          break;
        default:
          throw new ApiError("Token type is not valid", 401); // Помилка, якщо тип токена не відповідає жодному з варіантів
      }

      // Перевіряємо токен за допомогою обраного секретного ключа
      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch (error) {
      // Якщо токен недійсний або сталася помилка, кидаємо помилку
      throw new ApiError("Token is not valid", 500);
    }
  }
}

// Експортуємо екземпляр TokenService для використання в інших частинах програми
export const tokenService = new TokenService();
