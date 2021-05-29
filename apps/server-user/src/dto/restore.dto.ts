import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  MAX_PASSWORD_LENGTH,
  MAX_PASSWORD_LENGTH_ERROR,
  MIN_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH_ERROR,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from 'src/constants';

export class RestoreDto {
  @IsString()
  @IsNotEmpty()
  readonly passwordRestoreToken: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH, { message: MIN_PASSWORD_LENGTH_ERROR })
  @MaxLength(MAX_PASSWORD_LENGTH, { message: MAX_PASSWORD_LENGTH_ERROR })
  @Matches(PASSWORD_REGEX, { message: PASSWORD_REGEX_ERROR })
  readonly newPassword: string;
}
