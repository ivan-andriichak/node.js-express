import { ApiError } from "../errors/api-errors";
import { IUser } from "../interfaces/user.inerface";
import { userRepository } from "../repositories/user.repository";

// Створюємо клас UserService для обробки бізнес-логіки, пов'язаної з користувачами
class UserService {
  // Метод для отримання списку користувачів
  public async getList(): Promise<IUser[]> {
    // Викликаємо метод getList з userRepository для отримання списку користувачів
    return await userRepository.getList();
  }

  // Метод для створення нового користувача
  public async create(dto: IUser): Promise<IUser> {
    const { name, email, password } = dto;

    // Валідація ім'я користувача
    if (!name || name.length < 3) {
      throw new ApiError(
        "Name is required and should be at least 3 characters", // Повідомлення про помилку
        400, // Статус код помилки
      );
    }
    // Валідація електронної пошти користувача
    if (!email || !email.includes("@")) {
      throw new ApiError(
        "Email is required and should be valid", // Повідомлення про помилку
        400, // Статус код помилки
      );
    }
    // Валідація пароля користувача
    if (!password || password.length < 6) {
      throw new ApiError(
        "Password is required and should be at least 6 characters", // Повідомлення про помилку
        400, // Статус код помилки
      );
    }
    // Викликаємо метод create з userRepository для створення нового користувача
    return await userRepository.create(dto);
  }
}

export const userService = new UserService();
