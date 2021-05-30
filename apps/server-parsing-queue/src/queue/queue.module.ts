import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { TaskController } from './task.controller';

@Module({
  imports: [],
  controllers: [TaskController],
  providers: [QueueService],
})
export class QueueModule {}
