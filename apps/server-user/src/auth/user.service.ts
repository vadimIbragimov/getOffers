import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { authTokenExpiration, mainURI } from 'src/constants';
import { LoginDto } from 'src/dto/lohin.dto';
import { GetRestoreTokenDto } from 'src/dto/get-restore-token.controller.dto';
import { RegisterDto } from '../dto/register.dto';
import { User, UserDocument } from '../schemas/users.schema';
import { RestoreDto } from 'src/dto/restore.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
  ) {}

  async signIn(userDto: LoginDto) {
    const user = await this.userModel.findOne(userDto).exec();
    if (user) {
      if (user.emailConfirmationToken) {
        throw new HttpException('Подтвердите email', HttpStatus.FORBIDDEN);
      } else if (
        user?.token?.expDate &&
        new Date(user.token.expDate).valueOf() > new Date().valueOf()
      ) {
        return user.token;
      } else {
        const newToken = {
          tokenValue: randomBytes(46).toString('hex'),
          expDate:
            new Date().valueOf() + 1000 * 60 * 60 * 24 * authTokenExpiration,
        };
        await this.userModel.findOneAndUpdate(
          { email: userDto.email },
          { token: newToken },
        );
        return newToken;
      }
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.FORBIDDEN);
    }
  }

  async signUp(userDto: RegisterDto): Promise<{ success: boolean }> {
    const existingUser = await this.userModel
      .find({ email: userDto.email })
      .exec();
    if (!existingUser.length) {
      const emailConfirmationToken = randomBytes(46).toString('hex');
      const newUser = new this.userModel({
        emailConfirmationToken,
        ...userDto,
      });
      await this.sendConfirmation(userDto.email, emailConfirmationToken);
      await newUser.save();
      return { success: true };
    } else {
      throw new Error(
        `Пользователь с адресом "${userDto.email}" уже существует`,
      );
    }
  }

  async sendConfirmation(
    email: RegisterDto['email'],
    token: string,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      from: process.env.EMAIL_ID,
      subject: 'Подтверждение регистрации',
      template: './confirmation',
      context: {
        url: `${mainURI}confirmation/${token}`,
      },
    });
  }

  async confirmEmail(token: string) {
    const user = await this.userModel
      .findOneAndUpdate(
        { emailConfirmationToken: token },
        { emailConfirmationToken: undefined },
      )
      .exec();
    if (user) {
      return { success: true };
    } else {
      throw new HttpException(
        'Ссылка подтверждения недействительна',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async getRestoreToken(email: GetRestoreTokenDto['email']) {
    const passwordRestoreToken = randomBytes(46).toString('hex');
    const user = await this.userModel
      .findOneAndUpdate(
        { email },
        { passwordRestoreToken: passwordRestoreToken },
      )
      .exec();
    if (user) {
      await this.mailerService.sendMail({
        to: email,
        from: process.env.EMAIL_ID,
        subject: 'Восстановление пароля',
        template: './restore',
        context: {
          url: `${mainURI}restore/${passwordRestoreToken}`,
        },
      });
      return { success: true };
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.FORBIDDEN);
    }
  }

  async restore({ passwordRestoreToken, newPassword }: RestoreDto) {
    const user = await this.userModel.findOneAndUpdate(
      { passwordRestoreToken },
      { password: newPassword, passwordRestoreToken: undefined },
    );
    if (user) {
      return { success: true };
    } else {
      throw new HttpException(
        'Ссылка восстановления недействительна',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  async changePassword({ email, oldPassword, newPassword }: ChangePasswordDto) {
    const user = await this.userModel.findOne({ email }).exec();
    if (user) {
      if (user.password === oldPassword) {
        await this.userModel
          .findOneAndUpdate({ email }, { password: newPassword })
          .exec();
        return { success: true };
      } else {
        throw new HttpException('Неверный пароль', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('Пользователь не найден', HttpStatus.FORBIDDEN);
    }
  }
}
