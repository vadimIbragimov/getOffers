import { IsEmail, IsString } from 'class-validator';
import { EMAIL_ERROR } from 'src/constants';

export class GetRestoreTokenDto {
  @IsString()
  @IsEmail({}, { message: EMAIL_ERROR })
  readonly email: string;
}
