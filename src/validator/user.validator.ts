import joi from "joi";

import { regexConstant } from "../constants/regex.constant";
import { OrderEnum } from "../enums/order.enum";
import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";

export class UserValidator {
  private static name = joi.string().min(3).trim();
  private static age = joi.number().min(15).max(50);
  private static email = joi
    .string()
    .lowercase()
    .regex(regexConstant.EMAIL)
    .trim();
  private static password = joi.string().regex(regexConstant.PASSWORD).trim();
  private static phone = joi.string().regex(regexConstant.PHONE);

  public static createUser = joi.object({
    name: UserValidator.name.required(),
    age: UserValidator.age.required(),
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
    phone: UserValidator.phone.required(),
  });

  public static updateUser = joi.object({
    name: UserValidator.name,
    age: UserValidator.age,
    email: UserValidator.email,
    phone: UserValidator.phone,
  });

  public static login = joi.object({
    email: UserValidator.email.required(),
    password: UserValidator.password.required(),
  });

  public static forgotPassword = joi.object({
    email: UserValidator.email.required(),
  });

  public static forgotPasswordSet = joi.object({
    password: UserValidator.password.required(),
  });

  public static changePassword = joi.object({
    oldPassword: this.password.required(),
    newPassword: this.password.required(),
  });

  public static listQuery = joi.object({
    limit: joi.number().min(1).max(100).default(10),
    page: joi.number().min(1).default(1),
    search: joi.string().trim(),
    order: joi
      .string()
      .valid(...Object.values(OrderEnum))
      .default(OrderEnum.ASC),
    orderBy: joi
      .string()
      .valid(...Object.values(UserListOrderByEnum))
      .default(UserListOrderByEnum.NAME),
  });
}
