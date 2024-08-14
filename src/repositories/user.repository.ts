import { FilterQuery, SortOrder } from "mongoose";

import { UserListOrderByEnum } from "../enums/user-list-order-by.enum";
import { IUser, IUserListQuery } from "../interfaces/user.inerface";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";

class UserRepository {
  // Метод для отримання користувача за параметрами
  public async getByParams(params: Partial<IUser>): Promise<IUser> {
    // Використовує метод findOne з моделі User для пошуку одного користувача за заданими параметрами
    // Параметри можуть бути частковими властивостями IUser
    return await User.findOne(params);
  }

  public async getList(query: IUserListQuery): Promise<[IUser[], number]> {
    // Створюємо об'єкт для фільтрації користувачів, які підтвердили свою електронну пошту
    const filterObj: FilterQuery<IUser> = { isVerified: true };
    // Якщо є параметр пошуку в запиті, додаємо його до фільтрації
    if (query.search) {
      // Додаємо пошук за іменем або електронною поштою, використовуючи регулярний вираз з опцією нечутливості до регістру ("i")
      filterObj.$or = [
        { name: { $regex: query.search, $options: "i" } },
        { email: { $regex: query.search, $options: "i" } },
      ];
      // filterObj.name = { $regex: query.search, $options: "i" };
    }

    const sortObj: { [key: string]: SortOrder } = {};
    switch (query.orderBy) {
      case UserListOrderByEnum.NAME:
        sortObj.name = query.order;
        break;
      case UserListOrderByEnum.AGE:
        sortObj.age = query.order;
        break;
      default:
        throw new Error("Invalid orderBy");
    }

    // Визначаємо кількість пропущених записів для пагінації (зсув)
    const skip = (query.page - 1) * query.limit;

    // Виконуємо запит для отримання списку користувачів відповідно до фільтру і зсуву, а також рахуємо загальну кількість документів
    return await Promise.all([
      User.find(filterObj).sort(sortObj).limit(query.limit).skip(skip),
      User.countDocuments(filterObj), // Повертаємо загальну кількість користувачів, що відповідають фільтру
    ]);
  }

  // Метод для створення нового користувача
  public async create(dto: IUser): Promise<IUser> {
    // Використовує метод create з моделі User для створення нового користувача
    // dto - об'єкт, що відповідає інтерфейсу IUser
    return await User.create(dto);
  }

  // Метод для отримання користувача за ID
  public async getById(
    userId: string,
    populate: string[] = [],
  ): Promise<IUser> {
    // Використовує метод findById з моделі User для пошуку користувача за його ID
    return await User.findById(userId).populate(populate);
  }

  // Метод для оновлення користувача за ID
  public async updateById(userId: string, dto: Partial<IUser>): Promise<IUser> {
    // Використовує метод findByIdAndUpdate з моделі User для оновлення користувача
    // Параметр returnDocument: "after" забезпечує повернення оновленого документа
    return await User.findByIdAndUpdate(userId, dto, {
      returnDocument: "after",
    });
  }

  public async findWithOutActivityAfter(date: Date): Promise<IUser[]> {
    return await User.aggregate([
      {
        $lookup: {
          from: Token.collection.name,
          let: { userId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_userId", "$$userId"] } } },
            { $match: { createdAt: { $gt: date } } },
          ],
          as: "tokens",
        },
      },
      {
        $match: { tokens: { $size: 0 } },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     email: 1,
      //     name: 1,
      //   },
      // },
    ]);
  }

  // Метод для видалення користувача за ID
  public async deleteById(userId: string): Promise<void> {
    // Використовує метод deleteOne з моделі User для видалення користувача за його ID
    await User.deleteOne({ _id: userId });
  }
}

// Експортуємо екземпляр UserRepository для використання в інших частинах програми
export const userRepository = new UserRepository();
