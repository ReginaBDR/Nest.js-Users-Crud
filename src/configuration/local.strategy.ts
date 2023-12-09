import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Usuario } from '../modules/usuario/entities/usuario.entity';
import { AuthService } from '../modules/auth/service/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<Usuario> {
    return await this.authService
      .validateUser(username, password)
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException('Unauthorized user');
        }
        return user;
      });
  }
}
