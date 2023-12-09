import {
  Inject,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { UsuarioService } from '../../usuario/service/usuario.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsuarioService))
    private readonly usuarioService: UsuarioService,
    @Inject(forwardRef(() => JwtService))
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<Usuario> {
    try {
      const user = await this.usuarioService.findUserByUsername(username);
      if (!user) {
        throw new NotAcceptableException('User not found');
      }
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new NotAcceptableException('Invalid password');
      }
      return user;
    } catch (error) {
      throw new NotAcceptableException('Error validating user');
    }
  }

  async login(user: {
    id: number;
    username: string;
    password: string;
  }): Promise<any> {
    try {
      const payload = { sub: user.id, username: user.username };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      throw new UnauthorizedException('Error during login');
    }
  }
}
