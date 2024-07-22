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

    // Перевіряємо, чи ім'я користувача є і чи його довжина не менше 3 символів
    if (!name || name.length < 3) {
      throw new ApiError(
        "Name is required and should be at least 3 characters", // Повідомлення про помилку
        400, // Статус код помилки (погані дані користувача)
      );
    }
    // Перевіряємо, чи email є і чи він має символ '@'
    if (!email || !email.includes("@")) {
      throw new ApiError(
        "Email is required and should be valid", // Повідомлення про помилку
        400, // Статус код помилки (погані дані користувача)
      );
    }
    // Перевіряємо, чи пароль є і чи його довжина не менше 6 символів
    if (!password || password.length < 6) {
      throw new ApiError(
        "Password is required and should be at least 6 characters", // Повідомлення про помилку
        400, // Статус код помилки (погані дані користувача)
      );
    }
    // Викликаємо метод create з userRepository для створення нового користувача
    return await userRepository.create(dto);
  }

  // Метод для отримання користувача за ID
  public async getById(userId: number): Promise<IUser> {
    // Викликаємо метод getById з userRepository для отримання користувача за ID
    return await userRepository.getById(userId);
  }

  // Метод для оновлення даних користувача за ID
  public async updateById(userId: number, dto: IUser): Promise<IUser> {
    // Викликаємо метод updateById з userRepository для оновлення користувача за ID
    return await userRepository.updateById(userId, dto);
  }

  // Метод для видалення користувача за ID
  public async deleteById(userId: number): Promise<void> {
    // Викликаємо метод deleteById з userRepository для видалення користувача за ID
    await userRepository.deleteById(userId);
  }
}

// Створюємо та експортуємо екземпляр класу UserService для використання в інших частинах програми
export const userService = new UserService();
