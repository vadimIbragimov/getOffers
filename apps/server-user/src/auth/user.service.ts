import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { randomBytes } from 'crypto';
import { Model } from 'mongoose';
import { authTokenExpiration, mainURI } from 'src/constants';
import { LoginDto } from 'src/dto/lohin.dto';
import { RegisterDto } from '../dto/register.dto';
import { User, UserDocument } from '../schemas/users.schema';

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
    await this.userModel.findOneAndUpdate(
      { emailConfirmationToken: token },
      { emailConfirmationToken: undefined },
    );
    return { success: true };
  }
}
