import {
  Body,
  Controller,
  Get,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskDto } from './dto/task.dto';
import { QueueService } from './queue.service';

@Controller('task')
export class TaskController {
  constructor(private readonly queueService: QueueService) {}

  @Put()
  @UsePipes(new ValidationPipe())
  addTask(@Body() addTaskDto: TaskDto) {
    return this.queueService.addTask(addTaskDto);
  }

  @Get()
  getTaskForParsing() {
    return this.queueService.getTaskForParsing();
  }
}
