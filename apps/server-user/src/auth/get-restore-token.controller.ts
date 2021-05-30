import { Body, Controller, Post } from '@nestjs/common';
import { GetRestoreTokenDto } from './dto/get-restore-token.controller.dto';
import { UserService } from './user.service';

@Controller('get-restore-token')
export class GetRestoreTokenController {
  constructor(private readonly userService: UserService) {}

  @Post()
  restore(@Body() { email }: GetRestoreTokenDto) {
    return this.userService.getRestoreToken(email);
  }
}
