import { ApiError } from "../errors/api-errors";
import { fsService } from "../fs.service";
import { IUser } from "../interfaces/user.inerface";

// Створюємо клас UserRepository для взаємодії з даними користувачів
class UserRepository {
  // Метод для отримання списку всіх користувачів
  public async getList(): Promise<IUser[]> {
    // Викликаємо метод read() з fsService для отримання даних з файлу
    return await fsService.read();
  }

  // Метод для створення нового користувача
  public async create(dto: IUser): Promise<IUser> {
    // Зчитуємо існуючих користувачів з файлу
    const users = await fsService.read();
    // Перевіряємо, чи вже існує користувач з таким email
    const index = users.findIndex((user) => user.email === dto.email);
    if (index !== -1) {
      // Генеруємо помилку, якщо користувач з таким email вже існує
      throw new ApiError("User with this email already exists", 409);
    }
    // Створюємо нового користувача з наступним ID
    const newUser = {
      id: users[users.length - 1].id + 1, // Збільшуємо ID на одиницю
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
    // Додаємо нового користувача до списку
    users.push(newUser);
    // Записуємо оновлений список користувачів у файл
    await fsService.write(users);
    // Повертаємо нового користувача
    return newUser;
  }

  // Метод для отримання користувача за ID
  public async getById(userId: number): Promise<IUser> {
    // Зчитуємо список користувачів з файлу
    const users = await fsService.read();
    // Знаходимо користувача за його ID
    const user = users.find((user) => user.id === userId);
    if (!user) {
      // Генеруємо помилку, якщо користувач не знайдений
      throw new ApiError("User not found", 422);
    }
    // Повертаємо знайденого користувача
    return user;
  }

  // Метод для оновлення даних користувача за ID
  public async updateById(userId: number, dto: IUser): Promise<IUser> {
    // Зчитуємо список користувачів з файлу
    const users = await fsService.read();
    // Знаходимо користувача за його ID
    const user = users.find((user) => user.id === userId);
    if (!user) {
      // Генеруємо помилку, якщо користувач не знайдений
      throw new ApiError("User not found", 422);
    }

    // Оновлюємо дані користувача, якщо відповідні властивості присутні в DTO
    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;
    if (dto.password) user.password = dto.password;

    // Записуємо оновлений список користувачів у файл
    await fsService.write(users);
    // Повертаємо оновленого користувача
    return user;
  }

  // Метод для видалення користувача за ID
  public async deleteById(userId: number): Promise<void> {
    // Зчитуємо список користувачів з файлу
    const users = await fsService.read();
    // Знаходимо індекс користувача за його ID
    const index = users.findIndex((user) => user.id === userId);
    if (index === -1) {
      // Генеруємо помилку, якщо користувач не знайдений
      throw new ApiError("User not found", 422);
    }
    // Видаляємо користувача зі списку
    users.splice(index, 1);
    // Записуємо оновлений список користувачів у файл
    await fsService.write(users);
  }
}

// Експортуємо екземпляр класу UserRepository
export const userRepository = new UserRepository();
