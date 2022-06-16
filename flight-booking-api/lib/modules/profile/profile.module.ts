import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'lib/utils/strategies/jwt.strategy';
import { LocalStrategy } from 'lib/utils/strategies/local.strategy';
import { ProfileController } from './profile.controller';
import { Profile } from './profile.entity';
import { ProfilesService } from './profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    PassportModule,
    JwtModule.register({
      secret: process.env.TOKEN_SECRET,
      signOptions: { expiresIn: process.env.TOKEN_LIFE },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfilesService, LocalStrategy, JwtStrategy],
})
export class ProfileModule {}
