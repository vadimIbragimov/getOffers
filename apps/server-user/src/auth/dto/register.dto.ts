import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  EMAIL_ERROR,
  MAX_PASSWORD_LENGTH_ERROR,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH_ERROR,
  MIN_PASSWORD_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from 'src/constants';

export class RegisterDto {
  @IsString()
  @IsEmail({}, { message: EMAIL_ERROR })
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH, { message: MIN_PASSWORD_LENGTH_ERROR })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: MAX_PASSWORD_LENGTH_ERROR })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR })
  readonly password: string;

  readonly telegramUserName: string;
}
