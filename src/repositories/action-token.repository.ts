import { FilterQuery } from "mongoose";

import { IActionToken } from "../interfaces/action-token.inerface";
import { ActionToken } from "../models/ection-token.model";

class ActionTokenRepository {
  public async create(dto: IActionToken): Promise<IActionToken> {
    return await ActionToken.create(dto);
  }

  public async getByActionToken(actionToken: string): Promise<IActionToken> {
    return await ActionToken.findOne({ actionToken });
  }

  public async deleteByParams(
    params: FilterQuery<IActionToken>,
  ): Promise<void> {
    await ActionToken.deleteMany(params);
  }
}

export const actionTokenRepository = new ActionTokenRepository();