import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/dto/lohin.dto';
import { UserService } from './user.service';

@Controller('login')
export class LoginController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  async register(@Body() userDto: LoginDto) {
    return await this.userService.signIn(userDto);
  }
}
