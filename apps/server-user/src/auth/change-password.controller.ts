import { Body, Controller, Post } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UserService } from './user.service';

@Controller('change-password')
export class ChangePasswordController {
  constructor(private readonly userService: UserService) {}

  @Post()
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(changePasswordDto);
  }
}
