import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../schemas/user.schema';
import { EmailService } from '../email/email.service';
import { SeedService } from '../seed/seed.service';
import { GuestLoginDto, GoogleLoginDto, RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
    private seedService: SeedService,
  ) {}

  async guestLogin(dto: GuestLoginDto) {
    let guestEmail = 'guest@taskly.thewebvale.com';
    let guestName = dto.name || 'Dexter';

    if (dto.guestId) {
      guestEmail = `guest_${dto.guestId}@taskly.thewebvale.com`;
    }

    let user = await this.userModel.findOne({ email: guestEmail }).exec();

    if (!user) {
      user = await this.userModel.create({
        name: guestName,
        email: guestEmail,
        username: 'dexter_guest',
        title: 'Product Designer',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
        isGuest: true,
        theme: 'light',
        colorMode: 'blue',
      });
    }

    // Always ensure Figma tasks are cleared and re-seeded cleanly for guest sessions
    await this.seedService.seedUserData(user._id as Types.ObjectId, user.name, true);

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  async googleLogin(dto: GoogleLoginDto) {
    let email = dto.email;
    let name = dto.name;
    let avatar = dto.avatar;
    let googleId = dto.googleId;

    if (!email && dto.credential) {
      try {
        const parts = dto.credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          email = payload.email;
          name = name || payload.name;
          avatar = avatar || payload.picture;
          googleId = googleId || payload.sub;
        }
      } catch (e) {
        // fallback
      }
    }

    if (!email) {
      throw new BadRequestException('Google email is required');
    }

    let user = await this.userModel.findOne({ email: email.toLowerCase() }).exec();

    if (!user) {
      user = await this.userModel.create({
        name: name || 'Dexter',
        email: email.toLowerCase(),
        username: email.split('@')[0],
        avatar: avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=Dexter',
        googleId: googleId || '',
        isGuest: false,
        theme: 'light',
        colorMode: 'blue',
      });

      await this.emailService.sendWelcomeEmail(user.email, user.name);
    }

    // Always ensure Figma tasks are seeded for this user
    await this.seedService.seedUserData(user._id as Types.ObjectId, user.name);

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  async register(dto: RegisterDto) {
    const existing = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (existing) {
      throw new BadRequestException('Email is already registered. Please login.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email.toLowerCase(),
      username: dto.email.split('@')[0],
      passwordHash,
      isGuest: false,
      theme: 'light',
      colorMode: 'blue',
    });

    await this.seedService.seedUserData(user._id as Types.ObjectId, user.name);
    await this.emailService.sendWelcomeEmail(user.email, user.name);

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email.toLowerCase() }).exec();
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    await this.seedService.seedUserData(user._id as Types.ObjectId, user.name);

    const payload = { sub: user._id.toString(), email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: this.sanitizeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.sanitizeUser(user);
  }

  private sanitizeUser(user: UserDocument) {
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      username: user.username,
      title: user.title,
      avatar: user.avatar,
      isGuest: user.isGuest,
      theme: user.theme,
      colorMode: user.colorMode,
      createdAt: (user as any).createdAt,
    };
  }
}
