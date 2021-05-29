import { Body, Controller, Post } from '@nestjs/common';
import { RestoreDto } from 'src/dto/restore.dto';
import { UserService } from './user.service';

@Controller('restore')
export class RestoreController {
  constructor(private readonly userService: UserService) {}

  @Post()
  restore(@Body() restoreDto: RestoreDto) {
    return this.userService.restore(restoreDto);
  }
}
