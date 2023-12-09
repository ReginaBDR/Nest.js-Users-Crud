import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { jwtConstants } from './jwt-constants';
import { UsuarioService } from '../modules/usuario/service/usuario.service';
import { Usuario } from '../modules/usuario/entities/usuario.entity';

interface Payload {
  sub: number;
  username: string;
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usuarioService: UsuarioService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: Payload): Promise<Usuario> {
    return await this.usuarioService
      .findUserByUsername(payload.username)
      .then((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }
        return user;
      });
  }
}
