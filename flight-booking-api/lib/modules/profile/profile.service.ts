import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { comparePasswords } from 'lib/utils/auth/comparePasswords.util';
import { encryptPassword } from 'lib/utils/auth/encryptPassword.util';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.profileRepository.findOne({ where: { email } });
    if (user && comparePasswords(password, user.password)) {
      return user;
    }

    return null;
  }

  async findById(id: string | number): Promise<Profile> {
    const user = await this.profileRepository.findOne(id);

    return user;
  }

  async signUp(body: Profile) {
    const { email, password, phone } = body;

    const profileInDb = await this.profileRepository.findOne({
      where: {
        email,
      },
    });

    if (profileInDb) {
      throw new Error('user with this email already exists');
    }

    const hashedPassword = encryptPassword(password);
    const date = new Date().toString();

    const newProfile = {
      email,
      password: hashedPassword,
      phone,
      createdAt: date,
      updatedAt: date,
    };

    const user = await this.profileRepository.save(newProfile);
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);

    const result = await this.findById(user.id);

    return {
      id: user.id,
      access_token: token,
      user: result,
    };
  }

  async signIn(user: Profile) {
    const payload = { email: user.email, sub: user.id, isAdmin: user.isAdmin };
    const token = this.jwtService.sign(payload);

    return {
      id: user.id,
      access_token: token,
      isAdmin: user.isAdmin,
    };
  }

  async deleteById(id: number): Promise<void> {
    await this.profileRepository.delete(id);
  }

  async update(body: Profile, userId: number) {
    await this.profileRepository.update(userId, body);
    const user = await this.findById(userId);

    return user;
  }
}

