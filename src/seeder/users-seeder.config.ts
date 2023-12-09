import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UsuarioService } from '../modules/usuario/service/usuario.service';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../modules/usuario/dto/createUsuario.dto';

@Injectable()
export class UsersSeeder implements OnModuleInit {
  constructor(private readonly usuarioService: UsuarioService) {}

  private readonly logger = new Logger(UsersSeeder.name);

  private async createMockUser(index: number): Promise<CreateUsuarioDto> {
    const hashedPassword = await bcrypt.hash('password123', 10);
    return {
      username: `user${index + 1}`,
      email: `user${index + 1}@example.com`,
      password: hashedPassword,
    };
  }

  async onModuleInit() {
    try {
      const existingUsers = await this.usuarioService.findAllUsers(1, 1);

      if (existingUsers.length === 0) {
        const mockUsersDto: CreateUsuarioDto[] = await Promise.all(
          Array.from({ length: 20 }, (_, index) => this.createMockUser(index)),
        );

        await this.usuarioService.createUsers(mockUsersDto);
        this.logger.log('Mock users created successfully.');
      } else {
        this.logger.log('Users already exist. Skipping mock user creation.');
      }
    } catch (error) {
      this.logger.error('Error during mock user creation');
    }
  }
}
