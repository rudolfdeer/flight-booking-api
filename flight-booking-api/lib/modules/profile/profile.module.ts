import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TOKEN } from 'lib/constants/auth';
import { JwtStrategy } from 'lib/utils/jwt.strategy';
import { LocalStrategy } from 'lib/utils/local.strategy';
import { ProfileController } from './profile.controller';
import { Profile } from './profile.entity';
import { ProfilesService } from './profile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    PassportModule,
    JwtModule.register({
      secret: TOKEN.SECRET,
      signOptions: { expiresIn: TOKEN.LIFE },
    }),
  ],
  controllers: [ProfileController],
  providers: [ProfilesService, LocalStrategy, JwtStrategy],
})
export class ProfileModule {}
