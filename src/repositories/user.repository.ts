import { ApiError } from "../errors/api-errors";
import { fsService } from "../fs.service"; // Імпортуємо fsService для взаємодії з файловою системою
import { IUser } from "../interfaces/user.inerface";

// Створюємо клас UserRepository для роботи з даними користувачів
class UserRepository {
  // Метод для отримання списку користувачів
  public async getList(): Promise<IUser[]> {
    // Викликаємо метод read з fsService для читання списку користувачів з файлу
    return await fsService.read();
  }

  // Метод для створення нового користувача
  public async create(dto: IUser): Promise<IUser> {
    // Читаємо список користувачів з файлу
    const users = await fsService.read();
    // Перевіряємо, чи існує користувач з такою ж електронною поштою
    const index = users.findIndex((user) => user.email === dto.email);
    if (index !== -1) {
      // Кидаємо помилку, якщо користувач з такою електронною поштою вже існує
      throw new ApiError("User with this email already exists", 409);
    }
    // Створюємо нового користувача з унікальним ідентифікатором
    const newUser = {
      id: users[users.length - 1].id + 1,
      name: dto.name,
      email: dto.email,
      password: dto.password,
    };
    // Додаємо нового користувача до списку
    users.push(newUser);
    // Записуємо оновлений список користувачів до файлу
    await fsService.write(users);
    // Повертаємо створеного користувача
    return newUser;
  }
}

// Експортуємо новий екземпляр UserRepository для використання в інших частинах програми
export const userRepository = new UserRepository();
