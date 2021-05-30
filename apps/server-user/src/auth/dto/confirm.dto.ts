import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmDto {
  @IsString()
  @IsNotEmpty()
  readonly emailConfirmationToken: string;
}
