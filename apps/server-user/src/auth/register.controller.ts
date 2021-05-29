import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from 'src/auth/user.service';
import { RegisterDto } from '../dto/register.dto';

@Controller('register')
export class RegisterController {
  constructor(private readonly userService: UserService) {}

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() userDto: RegisterDto) {
    try {
      return await this.userService.signUp(userDto);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.PRECONDITION_FAILED);
    }
  }
}
