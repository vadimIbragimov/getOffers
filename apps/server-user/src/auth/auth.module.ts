import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from 'src/schemas/users.schema';
import { RegisterController } from './register.controller';
import { UserService } from './user.service';
import { LoginController } from './login.controller';
import { ConfirmController } from './confirm.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  providers: [UserService],
  controllers: [RegisterController, LoginController, ConfirmController],
})
export class AuthModule {}
