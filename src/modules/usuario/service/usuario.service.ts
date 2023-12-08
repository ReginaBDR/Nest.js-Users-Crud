import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Repository } from 'typeorm';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async createUser(createUserDto: CreateUsuarioDto): Promise<Usuario> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usuarioRepository.create(createUserDto);
    return await this.usuarioRepository.save(user);
  }

  async createUsers(createUserDto: CreateUsuarioDto[]): Promise<Usuario[]> {
    const users = this.usuarioRepository.create(createUserDto);
    return await this.usuarioRepository.save(users);
  }

  async findAllUsers(limit: number = 10, page: number = 1): Promise<Usuario[]> {
    const skip = (page - 1) * limit;
    return await this.usuarioRepository.find({
      take: limit,
      skip,
    });
  }

  async findUserById(id: number): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({ where: { id: id } });
  }

  async findUserByUsername(username: string): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({
      where: { username: username },
    });
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<Usuario>,
  ): Promise<Usuario | undefined> {
    await this.usuarioRepository.update(id, updateUserDto);
    return this.findUserById(id);
  }

  async deleteUser(id: number): Promise<void> {
    await this.usuarioRepository.delete(id);
  }
}
