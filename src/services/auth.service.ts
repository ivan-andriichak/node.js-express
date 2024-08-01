import { ApiError } from "../errors/api-errors";
import { ITokenPair, ITokenPayload } from "../interfaces/token.inerface";
import { IUser } from "../interfaces/user.inerface";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { tokenService } from "./token.service";

class AuthService {
  // Реєстрація нового користувача
  public async signUp(
    dto: IUser,
  ): Promise<{ user: IUser; tokens: ITokenPair }> {
    // Перевірка, чи вже існує користувач з таким email
    await this.isEmailExist(dto.email);

    // Хешування пароля користувача
    const password = await passwordService.hashPassword(dto.password);
    // Створення нового користувача з хешованим паролем
    const user = await userRepository.create({ ...dto, password });

    // Генерація токенів для нового користувача
    const tokens = await tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    // Збереження токенів у базі даних
    await tokenRepository.create({ ...tokens, _userId: user._id });
    // Повернення користувача та токенів
    return { user, tokens };
  }

  // Авторизація користувача
  public async signIn(dto: any): Promise<{ user: IUser; tokens: ITokenPair }> {
    // Отримання користувача за email
    const user = await userRepository.getByParams({ email: dto.email });
    // Перевірка наявності користувача
    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    // Перевірка правильності пароля
    const isPasswordCorrect = await passwordService.comparePassword(
      dto.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new ApiError("Invalid credentials", 401);
    }

    // Генерація токенів для авторизованого користувача
    const tokens = await tokenService.generatePair({
      userId: user._id,
      role: user.role,
    });
    // Збереження токенів у базі даних
    await tokenRepository.create({ ...tokens, _userId: user._id });
    // Повернення користувача та токенів
    return { user, tokens };
  }

  // Оновлення токенів (для рефреш токенів)
  public async refresh(
    payload: ITokenPayload,
    oldTokenId: string,
  ): Promise<ITokenPair> {
    // Генерація нових токенів
    const tokens = await tokenService.generatePair({
      userId: payload.userId,
      role: payload.role,
    });
    // Збереження нових токенів у базі даних
    await tokenRepository.create({ ...tokens, _userId: payload.userId });
    // Видалення старих токенів з бази даних
    await tokenRepository.deleteById(oldTokenId);
    // Повернення нових токенів
    return tokens;
  }

  // Перевірка, чи існує вже користувач з таким email
  private async isEmailExist(email: string): Promise<void> {
    const user = await userRepository.getByParams({ email });
    if (user) {
      throw new ApiError("Email already exist", 409);
    }
  }
}

// Експортуємо екземпляр AuthService
export const authService = new AuthService();
