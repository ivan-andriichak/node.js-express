import mongoose, { Schema } from "mongoose";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { IActionToken } from "../interfaces/action-token.inerface";
import { User } from "./user.model";

const actionTokenSchema = new mongoose.Schema(
  {
    actionToken: { type: String, required: true },
    type: { type: String, required: true, enum: ActionTokenTypeEnum },

    _userId: { type: Schema.Types.ObjectId, required: true, ref: User },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ActionToken = mongoose.model<IActionToken>(
  "action-tokens",
  actionTokenSchema,
);
