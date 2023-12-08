import {
  Inject,
  Injectable,
  NotAcceptableException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuarioService } from 'src/modules/usuario/service/usuario.service';
import { Usuario } from 'src/modules/usuario/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Usuario> {
    return await this.usuarioService
      .findUserByUsername(username)
      .then((user) => {
        if (!user) return null;
        const passwordValid = bcrypt.compare(password, user.password);
        if (!user) {
          throw new NotAcceptableException('Could not find the user');
        }
        if (user && passwordValid) {
          return user;
        }
      });
  }

  async login(user: {
    id: number;
    username: string;
    password: string;
  }): Promise<any> {
    const payload = { sub: user.id, username: user.username };
    return { access_token: this.jwtService.sign(payload) };
  }
}
