import { IUser } from "../interfaces/user.inerface";
import { User } from "../models/user.model";

class UserRepository {
  // Метод для отримання користувача за параметрами
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    // Використовує метод findOne з моделі User для пошуку одного користувача за заданими параметрами
    // Параметри можуть бути частковими властивостями IUser
    return await User.findOne(params);
  }

  // Метод для отримання списку всіх користувачів
  public async getList(query: any): Promise<IUser[]> {
    // Використовує метод find з моделі User для отримання всіх користувачів
    return await User.find().limit(query.limit).skip(query.skip);
  }

  // Метод для створення нового користувача
  public async create(dto: IUser): Promise<IUser> {
    // Використовує метод create з моделі User для створення нового користувача
    // dto - об'єкт, що відповідає інтерфейсу IUser
    return await User.create(dto);
  }

  // Метод для отримання користувача за ID
  public async getById(userId: string): Promise<IUser> {
    // Використовує метод findById з моделі User для пошуку користувача за його ID
    return await User.findById(userId);
  }

  // Метод для оновлення користувача за ID
  public async updateById(userId: string, dto: IUser): Promise<IUser> {
    // Використовує метод findByIdAndUpdate з моделі User для оновлення користувача
    // Параметр returnDocument: "after" забезпечує повернення оновленого документа
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  // Метод для видалення користувача за ID
  public async deleteById(userId: string): Promise<void> {
    // Використовує метод deleteOne з моделі User для видалення користувача за його ID
    await User.deleteOne({ _id: userId });
  }
}

// Експортуємо екземпляр UserRepository для використання в інших частинах програми
export const userRepository = new UserRepository();
