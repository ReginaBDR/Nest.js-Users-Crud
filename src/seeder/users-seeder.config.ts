import { Injectable, OnModuleInit } from '@nestjs/common';
import { UsuarioService } from 'src/modules/usuario/service/usuario.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from 'src/modules/usuario/dto/createUsuario.dto';

@Injectable()
export class UsersSeeder implements OnModuleInit {
  constructor(private readonly usuarioService: UsuarioService) {}

  async onModuleInit() {
    const mockUsersDto: CreateUsuarioDto[] = Array.from(
      { length: 20 },
      (_, index) => ({
        username: `user${index + 1}`,
        email: `user${index + 1}@example.com`,
        password: bcrypt.hash('password123', 10),
      }),
    );
    await this.usuarioService.createUsers(mockUsersDto);
  }
}
