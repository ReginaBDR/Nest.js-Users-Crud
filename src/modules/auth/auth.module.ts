import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../configuration/jwt-constants';
import { LocalStrategy } from '../../configuration/local.strategy';
import { JwtStrategy } from '../../configuration/jwt.strategy';
import { AuthService } from './service/auth.service';
import { UsuarioModule } from '../../modules/usuario/usuario.module';

@Module({
  imports: [
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, AuthService],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
