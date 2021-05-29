import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfirmDto } from 'src/dto/confirm.dto';
import { UserService } from './user.service';

@Controller('confirm')
export class ConfirmController {
  constructor(private readonly userService: UserService) {}
  @UsePipes(new ValidationPipe())
  @Post()
  async confirm(@Body() { emailConfirmationToken }: ConfirmDto) {
    return await this.userService.confirmEmail(emailConfirmationToken);
  }
}
