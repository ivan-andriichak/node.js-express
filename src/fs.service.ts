import fs from "node:fs/promises";
import path from "node:path";

import { IUser } from "./interfaces/user.inerface";

// Вказуємо шлях до файлу бази даних
const pathToDB = path.join(process.cwd(), "db.json");

// Створюємо клас FsService для роботи з файловою системою
class FsService {
  // Метод для читання даних з файлу
  public async read(): Promise<IUser[]> {
    // Зчитуємо вміст файлу з JSON-даними
    const json = await fs.readFile(pathToDB, "utf-8");
    // Якщо файл не пустий, парсимо JSON в масив користувачів
    // Якщо файл пустий, повертаємо порожній масив
    return json ? JSON.parse(json) : [];
  }

  // Метод для запису даних у файл
  public async write(users: IUser[]): Promise<void> {
    // Перетворюємо масив користувачів на JSON-рядок та записуємо його у файл
    await fs.writeFile(pathToDB, JSON.stringify(users));
  }
}

// Експортуємо екземпляр класу FsService
export const fsService = new FsService();
