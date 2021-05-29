import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  telegramUsername: string;

  @Prop()
  emailConfirmationToken: string;

  @Prop()
  passwordRestoreToken: string;

  @Prop(
    raw({
      tokenValue: { type: String },
      expDate: { type: Number },
    }),
  )
  token: Record<string, string | number>;
}

export const UsersSchema = SchemaFactory.createForClass(User);
