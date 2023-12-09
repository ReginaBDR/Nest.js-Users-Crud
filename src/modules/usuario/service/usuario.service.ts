import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    try {
      createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
      const user = this.usuarioRepository.create(createUserDto);
      return await this.usuarioRepository.save(user);
    } catch (error) {
      throw new BadRequestException('Error creating user');
    }
  }

  async createUsers(createUserDto: CreateUsuarioDto[]): Promise<Usuario[]> {
    try {
      const users = this.usuarioRepository.create(createUserDto);
      return await this.usuarioRepository.save(users);
    } catch (error) {
      throw new BadRequestException('Error creating users');
    }
  }

  async findAllUsers(limit: number = 10, page: number = 1): Promise<Usuario[]> {
    try {
      const skip = (page - 1) * limit;
      return await this.usuarioRepository.find({
        take: limit,
        skip,
      });
    } catch (error) {
      throw new BadRequestException('Error retrieving users');
    }
  }

  async findUserById(id: number): Promise<Usuario | undefined> {
    try {
      return await this.usuarioRepository.findOne({ where: { id: id } });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findUserByUsername(username: string): Promise<Usuario | undefined> {
    try {
      return await this.usuarioRepository.findOne({
        where: { username: username },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<Usuario>,
  ): Promise<Usuario | undefined> {
    try {
      await this.usuarioRepository.update(id, updateUserDto);
      return await this.findUserById(id);
    } catch (error) {
      throw new BadRequestException('Error updating user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.usuarioRepository.delete(id);
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
  }
}
