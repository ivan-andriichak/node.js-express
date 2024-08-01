import * as bcrypt from "bcrypt";

class PasswordService {
  // Метод для хешування пароля
  public async hashPassword(password: string): Promise<string> {
    // Хешує пароль за допомогою bcrypt з робочим фактором 10
    // Робочий фактор визначає, скільки разів потрібно хешувати пароль
    return await bcrypt.hash(password, 10);
  }

  // Метод для перевірки пароля
  public async comparePassword(
    password: string, // Пароль, введений користувачем
    hash: string, // Хеш пароля, збережений у базі даних
  ): Promise<boolean> {
    // Порівнює введений пароль з хешем
    // Повертає true, якщо паролі збігаються, інакше false
    return await bcrypt.compare(password, hash);
  }
}

export const passwordService = new PasswordService();
