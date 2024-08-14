import { NextFunction, Request, Response } from "express";
import { ObjectSchema } from "joi";
import { isObjectIdOrHexString } from "mongoose";

import { ApiError } from "../errors/api-errors";

// Клас для загальних проміжних обробників (middleware)
class CommonMiddleware {
  // Проміжний обробник для перевірки коректності ID
  public isIdValid(paramName: string) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Отримання ID з параметрів запиту
        const id = req.params[paramName];
        // Перевірка, чи є ID валідним ObjectId або HexString
        if (!isObjectIdOrHexString(id)) {
          // Якщо ID не валідний, генеруємо помилку
          throw new ApiError("Invalid id", 400);
        }
        // Якщо ID валідний, переходимо до наступного обробника
        next();
      } catch (e) {
        // Передача помилки до глобального обробника помилок
        next(e);
      }
    };
  }

  // Проміжний обробник для перевірки валідності тіла запиту
  public isBodyValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        // Виконання валідації тіла запиту за допомогою переданого валідатора
        req.body = await validator.validateAsync(req.body);
        // Якщо валідація успішна, переходимо до наступного обробника
        next();
      } catch (e) {
        // Якщо валідація не пройшла, генеруємо помилку з повідомленням про помилку валідації
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }

  public isQueryValid(validator: ObjectSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        req.query = await validator.validateAsync(req.query);
        next();
      } catch (e) {
        next(new ApiError(e.details[0].message, 400));
      }
    };
  }
}

export const commonMiddleware = new CommonMiddleware();
