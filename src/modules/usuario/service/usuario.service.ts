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
      console.error(error);
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
      const user = await this.usuarioRepository.findOne({ where: { id: id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Error retrieving user by ID');
    }
  }

  async findUserByUsername(username: string): Promise<Usuario | undefined> {
    try {
      const user = await this.usuarioRepository.findOne({
        where: { username: username },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Error retrieving user by username');
    }
  }

  async updateUser(
    id: number,
    updateUserDto: Partial<Usuario>,
  ): Promise<Usuario | undefined> {
    try {
      await this.usuarioRepository.update(id, updateUserDto);
      const updatedUser = await this.findUserById(id);
      if (!updatedUser) {
        throw new NotFoundException('User not found after update');
      }
      return updatedUser;
    } catch (error) {
      throw new BadRequestException('Error updating user');
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const result = await this.usuarioRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException('User not found for deletion');
      }
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
  }
}
