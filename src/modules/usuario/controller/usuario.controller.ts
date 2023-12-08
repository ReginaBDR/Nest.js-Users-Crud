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
} from '@nestjs/common';
import { UsuarioService } from '../service/usuario.service';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';
import { JwtAuthGuard } from 'src/configuration/jwt-auth.guard';

@Controller('usuarios')
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUsuarioDto) {
    return this.usuarioService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers(
    @Query('limit') limit: number = 10,
    @Query('page') page: number = 1,
  ) {
    return this.usuarioService.findAllUsers(limit, page);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usuarioService.findUserById(+id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<Usuario>,
  ) {
    return this.usuarioService.updateUser(+id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usuarioService.deleteUser(+id);
  }
}
