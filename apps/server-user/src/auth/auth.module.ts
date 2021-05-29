import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from 'src/schemas/users.schema';
import { RegisterController } from './register.controller';
import { UserService } from './user.service';
import { LoginController } from './login.controller';
import { ConfirmController } from './confirm.controller';
import { ChangePasswordController } from './change-password.controller';
import { GetRestoreTokenController } from './get-restore-token.controller';
import { RestoreController } from './restore.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  providers: [UserService],
  controllers: [
    RegisterController,
    LoginController,
    ConfirmController,
    ChangePasswordController,
    GetRestoreTokenController,
    RestoreController,
  ],
})
export class AuthModule {}
