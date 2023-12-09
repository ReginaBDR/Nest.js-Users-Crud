import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';
import { JwtAuthGuard } from '../../../configuration/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  private readonly logger = new Logger(UsuarioController.name);

  @Post()
  async createUser(@Body() createUserDto: CreateUsuarioDto) {
    this.logger.log('Create user');
    return this.usuarioService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    this.logger.log('Get all users');
    return this.usuarioService.findAllUsers(limit, page);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    this.logger.log('Get user by id:', id);
    return this.usuarioService.findUserById(+id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<Usuario>,
  ) {
    this.logger.log('Update user with id:', id);
    return this.usuarioService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    this.logger.log('Delete user with id:', id);
    return this.usuarioService.deleteUser(+id);
  }
}
