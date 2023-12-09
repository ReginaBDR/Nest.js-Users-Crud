import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/createUsuario.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn((password: string = 'hashedPassword') =>
    Promise.resolve(password),
  ),
}));

describe('UsuarioService', () => {
  let usuarioService: UsuarioService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsuarioService,
        {
          provide: getRepositoryToken(Usuario),
          useValue: mockRepository,
        },
      ],
    }).compile();

    usuarioService = module.get<UsuarioService>(UsuarioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUsuarioDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'example@example.com',
      };

      const createdUser: Usuario = {
        id: 1,
        username: createUserDto.username,
        password: 'hashedPassword',
        email: 'example@example.com',
        profileDescription: 'profileDescription',
        profilePicture: 'profilePicture',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.create.mockReturnValue(createdUser);
      mockRepository.save.mockResolvedValue(createdUser);

      const result = await usuarioService.createUser(createUserDto);

      expect(result).toEqual(createdUser);
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(createdUser);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const createUserDto: CreateUsuarioDto = {
        username: 'testuser',
        password: 'testpassword',
        email: 'example@example.com',
      };

      mockRepository.create.mockImplementation(() => {
        throw new Error();
      });

      await expect(usuarioService.createUser(createUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('createUsers', () => {
    it('should create multiple users', async () => {
      const createUserDtos: CreateUsuarioDto[] = [
        { username: 'user1', password: 'pass1', email: 'example1@example.com' },
        { username: 'user2', password: 'pass2', email: 'example2@example.com' },
      ];

      const createdUsers: Usuario[] = [
        {
          id: 1,
          username: 'user1',
          password: 'hashedPassword',
          email: 'example1@example.com',
          profileDescription: 'profileDescription',
          profilePicture: 'profilePicture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: 'user2',
          password: 'hashedPassword',
          email: 'example2@example.com',
          profileDescription: 'profileDescription',
          profilePicture: 'profilePicture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.create.mockReturnValue(createdUsers);
      mockRepository.save.mockResolvedValue(createdUsers);

      const result = await usuarioService.createUsers(createUserDtos);

      expect(result).toEqual(createdUsers);
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDtos);
      expect(mockRepository.save).toHaveBeenCalledWith(createdUsers);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const createUserDtos: CreateUsuarioDto[] = [
        { username: 'user1', password: 'pass1', email: 'example1@example.com' },
        { username: 'user2', password: 'pass2', email: 'example2@example.com' },
      ];

      mockRepository.create.mockImplementation(() => {
        throw new Error();
      });

      await expect(usuarioService.createUsers(createUserDtos)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAllUsers', () => {
    it('should find all users with default limit and page', async () => {
      const limit = 10;
      // const page = 1;

      const foundUsers: Usuario[] = [
        {
          id: 1,
          username: 'user1',
          password: 'hashedPassword',
          email: 'example1@example.com',
          profileDescription: 'profileDescription',
          profilePicture: 'profilePicture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          username: 'user2',
          password: 'hashedPassword',
          email: 'example2@example.com',
          profileDescription: 'profileDescription',
          profilePicture: 'profilePicture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(foundUsers);

      const result = await usuarioService.findAllUsers();

      expect(result).toEqual(foundUsers);
      expect(mockRepository.find).toHaveBeenCalledWith({
        take: limit,
        skip: 0,
      });
    });

    it('should find all users with specified limit and page', async () => {
      const limit = 20;
      const page = 3;

      const foundUsers: Usuario[] = [
        {
          id: 3,
          username: 'user3',
          password: 'hashedPassword',
          email: 'example3@example.com',
          profileDescription: 'profileDescription',
          profilePicture: 'profilePicture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          username: 'user4',
          password: 'hashedPassword',
          email: 'example4@example.com',
          profileDescription: 'profileDescription',
          profilePicture: 'profilePicture',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(foundUsers);

      const result = await usuarioService.findAllUsers(limit, page);

      expect(result).toEqual(foundUsers);
      expect(mockRepository.find).toHaveBeenCalledWith({
        take: limit,
        skip: (page - 1) * limit,
      });
    });

    it('should throw BadRequestException if an error occurs', async () => {
      mockRepository.find.mockImplementation(() => {
        throw new Error();
      });

      await expect(usuarioService.findAllUsers()).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findUserById', () => {
    it('should find a user by ID', async () => {
      const userId = 1;
      const foundUser: Usuario = {
        id: userId,
        username: 'testuser',
        password: 'hashedPassword',
        email: 'example2@example.com',
        profileDescription: 'profileDescription',
        profilePicture: 'profilePicture',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(foundUser);

      const result = await usuarioService.findUserById(userId);

      expect(result).toEqual(foundUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException if an error occurs', async () => {
      const userId = 1;

      mockRepository.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(usuarioService.findUserById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findUserByUsername', () => {
    it('should find a user by username', async () => {
      const username = 'testuser';
      const foundUser: Usuario = {
        id: 1,
        username: username,
        password: 'hashedPassword',
        email: 'example2@example.com',
        profileDescription: 'profileDescription',
        profilePicture: 'profilePicture',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(foundUser);

      const result = await usuarioService.findUserByUsername(username);

      expect(result).toEqual(foundUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { username: username },
      });
    });

    it('should throw NotFoundException if an error occurs', async () => {
      const username = 'testuser';

      mockRepository.findOne.mockImplementation(() => {
        throw new Error();
      });

      await expect(usuarioService.findUserByUsername(username)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user', async () => {
      const userId = 1;
      const updateUserDto: Partial<Usuario> = { username: 'newusername' };

      const updatedUser: Usuario = {
        id: userId,
        username: 'newusername',
        password: 'hashedPassword',
        email: 'example2@example.com',
        profileDescription: 'profileDescription',
        profilePicture: 'profilePicture',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.update.mockResolvedValue(undefined);
      mockRepository.findOne.mockResolvedValue(updatedUser);

      const result = await usuarioService.updateUser(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const userId = 1;
      const updateUserDto: Partial<Usuario> = { username: 'newusername' };

      mockRepository.update.mockImplementation(() => {
        throw new Error();
      });

      await expect(
        usuarioService.updateUser(userId, updateUserDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockRepository.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const userId = 1;

      mockRepository.delete.mockResolvedValue(undefined);

      await usuarioService.deleteUser(userId);

      expect(mockRepository.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw BadRequestException if an error occurs', async () => {
      const userId = 1;

      mockRepository.delete.mockImplementation(() => {
        throw new Error();
      });

      await expect(usuarioService.deleteUser(userId)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockRepository.delete).toHaveBeenCalledWith(userId);
    });
  });
});
