import { IsNotEmpty, IsString } from 'class-validator';

export class TaskDto {
  timeout: number;
  url: string;

  @IsString()
  @IsNotEmpty()
  serviceName: string;

  funcName: string;

  variables: unknown;

  id: number;

  error: string | string[];

  result: unknown;
}
